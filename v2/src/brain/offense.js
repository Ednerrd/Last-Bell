// Offense (M2): when he throws and what. Combos by trainer numbers, picked for the range he's at.
// The full brain (intent, memory, setups, counters) is M5; this is the honest minimum that lets
// the punch model and the audit run.
import { PUNCH, BY_NUM, reaches, extAt } from '../engine/punch.js';
import { dist } from '../engine/space.js';

// Combos in trainer numbers, with weights per style. '|' is a beat between punches.
export const COMBOS = {
  outboxer: { '1': 9, '1-1': 5, '1-2': 6, '1|2': 2, '1-1-2': 3, '1-2-3': 2, '2': 2, '1b': 1.5, '1b-2': 1, '1-2b': 1, '3': 0.8, '2-3': 1 },
  boxer:    { '1': 6, '1-1': 3, '1-2': 6, '1-2-3': 3, '1-2-3-2': 1, '2': 2.5, '2-3': 2, '3': 1.5, '1b-2': 1, '1-2b': 1, '3b-3': 1, '1-6-3': 1, '5-2': 1 },
  pressure: { '1': 3, '1-2': 3, '1-2-3': 2, '2-3': 2.5, '3': 2, '3-2': 2, '3b-3': 2, '2b-3': 1.5, '4b-3': 1, '5-2': 1.5, '6-3': 1.5, '3-4': 1, '1-2-3b': 1.5, '2-3-2': 1.5, '3b': 1.5 },
};
const PARSED = {};
for (const s in COMBOS) PARSED[s] = Object.entries(COMBOS[s]).map(([str, w]) => {
  const q = [];
  for (const part of str.split('-')) for (const [i, n] of part.split('|').entries()) { if (i) q.push('~'); q.push(BY_NUM[n]); }
  return { str, w, q };
});

// Per style: how often he looks to throw (per second while he has range), and mode leanings.
const OFF = {
  outboxer: { rate: 1.2 },
  boxer:    { rate: 0.76 },
  pressure: { rate: 0.43 },
};
const MODE_K = { feel: 0.35, circle: 0.8, hold: 1, press: 1.25, cut: 1.1, back: 0.45, escape: 0.15, exit: 0.2 };

// Reacting, the first slice of the brain (M5 does the rest): a man who makes a punch miss or
// eats it on the gloves fires back in the gap it leaves; a man who gets tagged answers; a mover
// gets out after his combo. Chances per style; skill shades them from M4 on.
const REACT = {
  outboxer: { counter: 0.5, fire: 0.15, exit: 0.45 },
  boxer:    { counter: 0.65, fire: 0.28, exit: 0.35 },
  pressure: { counter: 0.5, fire: 0.5, exit: 0.05 },
};
// The counter that fits the gap (trainer numbers).
const COUNTER = {
  slipped: ['2', '2-3', '3', '3-2', '2b-3'],   // slip outside or in, come back with the other hand
  rolled:  ['3', '3-2', '6-3', '3b-3'],        // come up out of the roll with a hook
  ducked:  ['6-3', '3', '5-2'],
  pulled:  ['2', '2-3', '1-2'],                // the pull counter: lean back, fire the right hand
  block:   ['1-2', '2', '3-2', '2-3'],         // return fire off the block
  guard:   ['1-2', '2', '3-2'],
};
const FIRE = ['1-2', '3-2', '2-3', '1-2-3', '3'];
const toQ = (str) => str.split('-').map((n) => BY_NUM[n]);

// The punch he threw at `m` just resolved as `res`: does `m` counter or fire back?
export function react(m, res, rng) {
  if (m.stag > 0 || (m.punch && m.punch.phase !== 'retract')) return;
  const R = REACT[m.f.style], A = m.off;
  let str = null;
  if (res.result !== 'land' && COUNTER[res.how] && rng.chance(R.counter)) str = rng.pick(COUNTER[res.how]);
  else if (res.result === 'land' && rng.chance(R.fire)) str = rng.pick(FIRE);
  if (!str) return;
  A.queue = toQ(str); A.combo = 'counter ' + str;
  A.beat = rng.range(0.04, 0.12);
}

// His combo is done: does he get out?
export function exitAfter(m, rng) {
  return !m.off.queue.length && rng.chance(REACT[m.f.style].exit);
}

export function makeOffense() {
  return { queue: [], beat: 0, combo: null, last: null };
}

// Called every tick he isn't punching. Returns a punch kind to start now, or null.
export function wantPunch(m, o, rng, dt) {
  const A = m.off, d = dist(m, o);
  if (m.stag > 0) { A.queue.length = 0; return null; }   // hurt: hands up, nothing coming back
  if (A.beat > 0) { A.beat -= dt; return null; }
  if (A.queue.length) {
    const k = A.queue.shift();
    if (k === '~') { A.beat = rng.range(0.1, 0.22); return null; }
    if (reaches(m.f, PUNCH[k], d)) return k;
    A.queue.length = 0; // out of range now: the rest of the combo is gone
    return null;
  }
  const rate = OFF[m.f.style].rate * (MODE_K[m.mode] || 1) * (o.stag > 0 ? 1.8 : 1); // he's hurt: go get him
  if (!rng.chance(rate * dt)) return null;
  const opts = PARSED[m.f.style].filter((c) => reaches(m.f, PUNCH[c.q[0]], d));
  if (!opts.length) return null;
  let sum = 0;
  for (const c of opts) sum += c.w * fit(m, c, d);
  let r = rng.next() * sum, pick = opts[0];
  for (const c of opts) { r -= c.w * fit(m, c, d); if (r <= 0) { pick = c; break; } }
  A.combo = pick.str;
  A.queue = pick.q.slice(1);
  return pick.q[0];
}

// Gap after a punch before the next one in the combo (they overlap: the next loads as this one comes home).
export function chainReady(p) {
  return p.phase === 'retract' && (p.t - p.load - p.snap) / p.ret > 0.45;
}

// The right punch for the range: lean toward combos whose lead punch lands near its sweet spot.
function fit(m, c, d) {
  const P = PUNCH[c.q[0]], e = extAt(m.f, P, d);
  return Math.max(0.15, 1 - Math.abs(Math.min(e, P.sweet + 0.1) - P.sweet) * 1.4);
}
