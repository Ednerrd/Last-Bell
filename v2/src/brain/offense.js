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
  outboxer: { rate: 0.4 },
  boxer:    { rate: 0.42 },
  pressure: { rate: 0.5 },
};
const MODE_K = { feel: 0.35, circle: 0.8, hold: 1, press: 1.25, cut: 1.1, back: 0.45, escape: 0.15 };

export function makeOffense() {
  return { queue: [], beat: 0, combo: null, last: null };
}

// Called every tick he isn't punching. Returns a punch kind to start now, or null.
export function wantPunch(m, o, rng, dt) {
  const A = m.off, d = dist(m, o);
  if (A.queue.length) {
    if (A.beat > 0) { A.beat -= dt; return null; }
    const k = A.queue.shift();
    if (k === '~') { A.beat = rng.range(0.1, 0.22); return null; }
    if (reaches(m.f, PUNCH[k], d)) return k;
    A.queue.length = 0; // out of range now: the rest of the combo is gone
    return null;
  }
  const rate = OFF[m.f.style].rate * (MODE_K[m.mode] || 1);
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
