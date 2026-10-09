// Footwork intent (M1). He's always in one mode that lasts seconds; every step is picked inside it.
// Modes here are the footwork half of FOUNDATION section 6: feel-out, circle, hold center,
// press, cut off, back up, escape the ropes. Punch modes join them in M2/M5.
import { jabRange } from '../fighter/make.js';
import { MIN_D, dist, rightOf, ropeGap, inCorner, clampRing } from '../engine/space.js';
import { clamp } from '../core/math.js';

// Style DNA for footwork: mode weights, step speed (m/s), pause between steps (s), escape instinct.
export const FOOT = {
  outboxer: { w: { circle: 0.5, back: 0.15, hold: 0.22, feel: 0.13 }, speed: 1.7, pause: [0.04, 0.2], escape: 0.85 },
  boxer:    { w: { circle: 0.33, hold: 0.32, press: 0.25, feel: 0.1 },   speed: 1.5, pause: [0.08, 0.3], escape: 0.6 },
  pressure: { w: { cut: 0.6, press: 0.35, feel: 0.05 },                speed: 1.35, pause: [0.12, 0.38], escape: 0.3 },
};
const LEN = {
  feel: [0.14, 0.22], circle: [0.16, 0.26], hold: [0.12, 0.2], press: [0.28, 0.36],
  cut: [0.26, 0.36], back: [0.26, 0.36], escape: [0.36, 0.46],
};
const MODE_T = { back: [0.6, 1.4], escape: [0.8, 1.6] };

const unit = (x, z) => { const m = Math.hypot(x, z) || 1; return { x: x / m, z: z / m }; };

// The distance he wants, center to center.
export function wantRange(me, opp, mode) {
  const mine = jabRange(me.f), his = jabRange(opp.f);
  let w = me.f.style === 'outboxer' ? his + 0.12 : me.f.style === 'pressure' ? Math.max(mine * 0.82, MIN_D + 0.3) : mine + 0.02;
  if (mode === 'feel') w += 0.35;
  return w;
}

// The lateral direction (+1/-1 around him) that heads toward his lead hand, away from his power hand.
function awayFromPower(me, opp, u) {
  const r = rightOf(opp.th), lead = opp.f.stance === 'southpaw' ? r : { x: -r.x, z: -r.z };
  return (-u.z * lead.x + u.x * lead.z) > 0 ? 1 : -1;
}

// Which way along the ropes has more room: away from the corner and away from him.
function roomySide(me, opp, u) {
  let best = 1, bestScore = -1e9;
  for (const s of [1, -1]) {
    const p = { x: me.x - u.z * s * 0.8, z: me.z + u.x * s * 0.8 };
    clampRing(p);
    const score = ropeGap(p) * 2 + dist(p, opp) - (inCorner(p) ? 1.5 : 0);
    if (score > bestScore) { bestScore = score; best = s; }
  }
  return best;
}

export function pickMode(me, opp, rng, clock) {
  const dna = FOOT[me.f.style], d = dist(me, opp), want = wantRange(me, opp);
  const u = unit(opp.x - me.x, opp.z - me.z);
  let mode;
  if (clock < me.feelSec) mode = 'feel';
  else if (ropeGap(me) < 0.45 && d < want + 0.5 && rng.chance(dna.escape)) mode = 'escape';
  else if (d < want - 0.25 && me.f.style !== 'pressure' && rng.chance(0.6)) mode = 'back';
  else {
    let sum = 0;
    for (const k in dna.w) sum += dna.w[k];
    let r = rng.next() * sum;
    for (const k in dna.w) { r -= dna.w[k]; if (r <= 0) { mode = k; break; } }
    mode = mode || Object.keys(dna.w)[0];
  }
  const span = MODE_T[mode] || [1.5, 4.5];
  me.modeT = rng.range(span[0], span[1]);
  me.circle = mode === 'escape' ? roomySide(me, opp, u) : rng.chance(0.7) ? awayFromPower(me, opp, u) : rng.pick([1, -1]);
  return mode;
}

// Plan one step: a target point and a duration, or null to stay planted.
export function planStep(me, opp, rng) {
  const d = dist(me, opp), want = wantRange(me, opp, me.mode), dna = FOOT[me.f.style];
  const u = unit(opp.x - me.x, opp.z - me.z);
  const L = { x: -u.z * me.circle, z: u.x * me.circle };
  const radial = clamp((d - want) / 0.4, -1, 1);
  const toC = unit(-me.x, -me.z);
  let dx = 0, dz = 0;
  const add = (v, k) => { dx += v.x * k; dz += v.z * k; };

  switch (me.mode) {
    case 'feel': add(u, radial * 0.8); add(L, 0.5); break;
    case 'circle': add(L, 1); add(u, radial * 0.7); break;
    case 'hold': add(u, radial * 0.6); if (Math.hypot(me.x, me.z) > 0.8) add(toC, 0.4); else add(L, 0.3); break;
    case 'press': add(u, Math.max(radial, 0.3)); break;
    case 'cut': {
      // Stand between him and the open ring, and lead his lateral move, so he backs into the ropes.
      const oc = unit(-opp.x, -opp.z), far = Math.hypot(opp.x, opp.z) > 0.6;
      const tx = opp.x + (far ? oc.x : -u.x) * want + opp.vx * 0.5;
      const tz = opp.z + (far ? oc.z : -u.z) * want + opp.vz * 0.5;
      add(unit(tx - me.x, tz - me.z), 1);
      break;
    }
    case 'back': add(u, -1); add(L, 0.4); break;
    case 'escape': add(L, 1); add(toC, 0.5); add(u, -0.2); break;
  }
  const gap = ropeGap(me);
  if (me.mode !== 'escape' && gap < 0.5) add(toC, 0.6 * (1 - gap / 0.5));
  if (Math.hypot(dx, dz) < 0.05) return null;

  const dir = unit(dx, dz), span = LEN[me.mode];
  const len = rng.range(span[0], span[1]);
  const to = { x: me.x + dir.x * len, z: me.z + dir.z * len };
  clampRing(to);
  const real = Math.hypot(to.x - me.x, to.z - me.z);
  if (real < 0.04) return null;
  // Which foot moves first: the one on the side he's stepping toward.
  const f = { x: Math.cos(me.th), z: Math.sin(me.th) };
  const along = dir.x * f.x + dir.z * f.z;
  const first = along >= 0 ? 'lead' : 'rear';
  return { to, dur: clamp(real / dna.speed, 0.14, 0.32), first };
}

export function pauseFor(me, rng) {
  const p = FOOT[me.f.style].pause;
  if (me.mode === 'feel' || me.mode === 'hold') return rng.range(p[0] + 0.15, p[1] + 0.35);
  if (me.mode === 'escape') return rng.range(0.02, 0.08);
  if (me.mode === 'circle') return rng.range(p[0] + 0.12, p[1] + 0.2);
  return rng.range(p[0], p[1]);
}

// Situations that end a mode early.
export function interrupt(me, opp, rng) {
  if (me.mode === 'escape' || me.mode === 'feel') return false;
  const d = dist(me, opp), want = wantRange(me, opp);
  if (me.f.style === 'pressure') return false;
  if (ropeGap(me) < 0.35 && d < want + 0.4) return rng.chance(0.08);
  if (d < want * 0.75 && me.mode !== 'back') return rng.chance(0.06); // crowded: get out
  return false;
}
