// How each man moves (render only): bounce, weave, lean, stance shape, feet, feints.
// Built from research/move_elite.md section 3 and move_fundamentals.md. All numbers are (est.):
// nobody has measured how fast boxers bounce, so they're tuned by eye.
// Layers: style -> a family inside the style (two fighters of one style still move differently)
// -> guard -> a small personal jitter seeded from the man, so no two men are clones.
import { makeRng } from '../core/rng.js';

// hz/bob: bounce rate and height (m). hop: 0 soft knee bounce .. 1 up on the toes, feet leave the floor.
// hold: seconds between rhythm breaks (0 = never). weave: side-to-side head (m), weaveHz.
// lean: forward tilt (rad, < 0 leans back). drop: head lower by (m). wid/len: stance shape vs the base.
// swing: foot lift on a step (m). heel: rear heel off the canvas (m). sway: glove pumping.
// feint: lead-hand feints per second. busy: how much life stays on while he punches or defends.
// turn: how hard he turns the torso into a punch. uw: U-shaped bob and weave (peekaboo), its depth (m).
const STYLE = {
  outboxer: { hz: 2.1, bob: 0.018, hop: 0.7, hold: 3.5, weave: 0.014, weaveHz: 0.45, lean: -0.02, drop: 0, wid: 1, len: 1.08, swing: 0.035, heel: 0.035, sway: 1.2, feint: 0.45, busy: 0.55, turn: 0.9, uw: 0 },
  boxer:    { hz: 1.4, bob: 0.009, hop: 0.2, hold: 0, weave: 0.018, weaveHz: 0.4, lean: 0.03, drop: 0.025, wid: 1.08, len: 1, swing: 0.025, heel: 0.025, sway: 1, feint: 0.3, busy: 0.6, turn: 1, uw: 0 },
  pressure: { hz: 0.85, bob: 0.005, hop: 0, hold: 0, weave: 0.012, weaveHz: 0.35, lean: 0.09, drop: 0.05, wid: 0.92, len: 0.9, swing: 0.018, heel: 0.015, sway: 0.7, feint: 0.18, busy: 0.65, turn: 1.15, uw: 0 },
};

// Families: same style, different movers. Picked per man, so a card of boxers isn't a mirror match.
const FAMILY = {
  outboxer: {
    dancer: { hop: 1, bob: 0.024, hz: 2.3, weave: 0.01, lean: -0.05, hold: 3 },           // Ali, Naseem: up on the toes, rhythm breaks
    glider: { hop: 0.35, bob: 0.012, hz: 1.8, weave: 0.022, feint: 0.8, sway: 1.5, hold: 5 }, // Loma, Usyk: half steps, the lead hand never stops
  },
  boxer: {
    composed: { bob: 0.007, weave: 0.012, feint: 0.25 },                                     // Bivol: still, sharp, little wasted motion
    rhythm:   { hz: 1.6, bob: 0.011, weave: 0.022, feint: 0.45 },                            // Crawford, Inoue: loose, on a beat
  },
  pressure: {
    stalker: { weave: 0.008, lean: 0.08, hz: 0.75 },                                         // GGG, Beterbiev: tight, walks you down
    roller:  { weave: 0.024, lean: 0.06, hz: 0.95, uw: 0.02 },                               // Canelo: flat-footed, rolls and slips
  },
};

// Guards on top: they shape the head and the stance.
const GUARD = {
  standard: {},
  high:     { weave: 0.5, lean: 0.03 },
  peekaboo: { weave: 1.6, uw: 0.06, weaveHz: 0.65, wid: 1.3, len: 0.82, drop: 0.03, busy: 0.85, swing: 0.8 }, // Tyson: near square, U-weave, never still
  philly:   { lean: -0.06, bob: 0.7, weave: 0.6, wid: 1.1, len: 1.08 },                       // Floyd: bladed, sits back
  cross:    { weave: 0.6 },
  handslow: { weave: 1.4, lean: -0.04, sway: 1.4 },                                            // Ali, Jones, Naseem: head is the defense
};
// Guard multipliers apply to these; the rest are absolute overrides.
const MULT = new Set(['weave', 'bob', 'sway', 'wid', 'len', 'swing']);
const ADD = new Set(['lean', 'drop']);

export function moveDNA(f, corner) {
  const seed = [f.name, f.style, f.guard, f.stance, f.height.toFixed(3), f.reach.toFixed(3), corner].join('|');
  const rng = makeRng(seed);
  const fams = FAMILY[f.style] || FAMILY.boxer;
  const keys = Object.keys(fams), fam = keys[Math.floor(rng.next() * keys.length)];
  const D = { ...(STYLE[f.style] || STYLE.boxer), ...fams[fam], fam };
  for (const [k, v] of Object.entries(GUARD[f.guard] || {})) {
    if (MULT.has(k)) D[k] *= v; else if (ADD.has(k)) D[k] += v; else D[k] = Math.max(D[k], v);
  }
  // Personal jitter, +-15%: everybody's a little different.
  for (const k of ['hz', 'bob', 'weave', 'weaveHz', 'swing', 'heel', 'sway', 'feint', 'turn', 'uw']) D[k] *= 1 + (rng.next() * 2 - 1) * 0.15;
  D.lean += (rng.next() * 2 - 1) * 0.02;
  D.wid *= 1 + (rng.next() * 2 - 1) * 0.06;
  D.len *= 1 + (rng.next() * 2 - 1) * 0.06;
  D.seed = Math.floor(rng.next() * 1e6);
  D.rng = makeRng(seed + '|live'); // feints, rhythm breaks
  return D;
}

// Smooth 1D value noise, -1..1, seeded. Two octaves never visibly repeat, unlike a sine.
function hash(i, s) {
  let h = Math.imul(i ^ Math.imul(s, 374761393), 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295 * 2 - 1;
}
export function noise(t, s) {
  const n = (x, ss) => { const i = Math.floor(x), k = x - i, u = k * k * (3 - 2 * k); return hash(i, ss) + (hash(i + 1, ss) - hash(i, ss)) * u; };
  return n(t, s) * 0.68 + n(t * 2.13 + 17.3, s + 7) * 0.32;
}
