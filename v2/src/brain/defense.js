// Defense choice (M2): when HE throws, does this man see it, and what does he do about it?
// Skill comes in properly with M4 (f.def is a 0..1 placeholder), anticipation and memory in M5.
import { DEF } from '../engine/defense.js';
import { ropeGap } from '../engine/space.js';

// Style habits: what he reaches for when he doesn't really read the punch.
const HABIT = {
  outboxer: { pull: 0.35, slip: 0.35, block: 0.25, roll: 0.05 },
  boxer:    { block: 0.4, slip: 0.3, roll: 0.15, pull: 0.15 },
  pressure: { block: 0.45, roll: 0.35, slip: 0.15, pull: 0.05 },
};
const GUARD_K = {
  standard: {},
  high:     { block: 1.5 },
  peekaboo: { roll: 1.6, slip: 1.3 },
  philly:   { block: 1.2, pull: 1.3 },
  cross:    { block: 1.4 },
  handslow: { slip: 1.5, pull: 1.5, block: 0.5 },
};
// The right answer per punch family (head / body): how good each move is against it.
const GOOD = {
  straight: { head: { block: 1, slip: 1, pull: 0.8, roll: 0.5 }, body: { block: 0.6, pull: 0.9 } },
  hook:     { head: { block: 1, roll: 1, pull: 0.6 }, body: { block: 0.6, pull: 0.7, roll: 0.3 } },
  upper:    { head: { block: 0.8, pull: 1 }, body: { block: 0.6, pull: 0.7 } },
};

// He (`me`) sees `P` coming from `opp`. Returns { kind, delay } or null.
export function chooseDefense(me, opp, P, rng) {
  if (me.def && me.def.t < me.def.dur * 0.6) return null;             // already moving
  if (me.punch && me.punch.phase !== 'retract') return null;           // his hands are busy: counters land here
  const skill = (me.f.def ?? 0.5) * (me.stag > 0 ? 0.5 : 1); // hurt: slow to see it
  if (!rng.chance(0.66 + 0.6 * skill)) return null;
  // Reaction time: he reads the shoulder and the setup, not the fist. Power shots mostly come
  // behind something (the jab, a feint), so he's a beat later on them.
  const late = P.fam === 'straight' && P.hand === 'lead' ? 1 : 1.4;
  const delay = rng.range(0.015, 0.075) * (1.3 - 0.6 * skill) * late;
  const room = ropeGap(me) > 0.25;
  const habit = HABIT[me.f.style], gk = GUARD_K[me.f.guard] || {};
  const read = rng.chance(0.45 + 0.5 * skill);                          // did he read which punch?
  const w = {};
  for (const k in DEF) {
    if (k === 'pull' && !room) continue;
    const fit = read ? (GOOD[P.fam][P.tgt][k] || 0) : 1;
    w[k] = (habit[k] || 0.02) * (gk[k] || 1) * fit;
  }
  let sum = 0;
  for (const k in w) sum += w[k];
  if (sum <= 0) return null;
  let r = rng.next() * sum;
  for (const k in w) { r -= w[k]; if (r <= 0) return { kind: k, delay }; }
  return null;
}
