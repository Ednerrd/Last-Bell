// Punches (FOUNDATION section 5). Every punch runs load -> snap -> contact -> retract.
// The engine decides land / block / miss, how clean (glancing / solid / flush) and where
// (head or body, and which side of HIS body). The renderer picks the exact glove spot.
import { clamp } from '../core/math.js';
import { dist, wrap } from './space.js';

// Trainer numbers: 1 jab, 2 cross, 3 lead hook, 4 rear hook, 5 lead upper, 6 rear upper; b = to the body.
// hand: which arm. fam: straight / hook / upper. load, snap, ret: seconds (body speed scales them).
// off: how far ahead of his center the punching shoulder sits at contact (the cross turns the hips in).
// reach: share of the arm the punch uses at lockout (a hook lands bent). sweet: best extension.
// step: the most he steps in behind it. pow: rough relative power (damage comes in M3).
export const PUNCH = {
  jab:    { n: '1',  hand: 'lead', fam: 'straight', tgt: 'head', load: 0.04, snap: 0.11, ret: 0.14, off: 0.18, reach: 1,    sweet: 0.95, step: 0.2,  pow: 0.45 },
  cross:  { n: '2',  hand: 'rear', fam: 'straight', tgt: 'head', load: 0.08, snap: 0.13, ret: 0.17, off: 0.22, reach: 1,    sweet: 0.95, step: 0.12, pow: 1 },
  lhook:  { n: '3',  hand: 'lead', fam: 'hook',     tgt: 'head', load: 0.09, snap: 0.13, ret: 0.17, off: 0.12, reach: 0.74, sweet: 0.8,  step: 0.05, pow: 1 },
  rhook:  { n: '4',  hand: 'rear', fam: 'hook',     tgt: 'head', load: 0.11, snap: 0.14, ret: 0.19, off: 0.12, reach: 0.74, sweet: 0.8,  step: 0.05, pow: 1.05 },
  lupper: { n: '5',  hand: 'lead', fam: 'upper',    tgt: 'head', load: 0.09, snap: 0.13, ret: 0.18, off: 0.1,  reach: 0.62, sweet: 0.75, step: 0.04, pow: 0.9 },
  rupper: { n: '6',  hand: 'rear', fam: 'upper',    tgt: 'head', load: 0.11, snap: 0.14, ret: 0.2,  off: 0.1,  reach: 0.62, sweet: 0.75, step: 0.04, pow: 1 },
  bjab:   { n: '1b', hand: 'lead', fam: 'straight', tgt: 'body', load: 0.06, snap: 0.12, ret: 0.15, off: 0.16, reach: 1,    sweet: 0.95, step: 0.22, pow: 0.45 },
  bcross: { n: '2b', hand: 'rear', fam: 'straight', tgt: 'body', load: 0.1,  snap: 0.14, ret: 0.18, off: 0.2,  reach: 1,    sweet: 0.95, step: 0.14, pow: 0.95 },
  bhook:  { n: '3b', hand: 'lead', fam: 'hook',     tgt: 'body', load: 0.1,  snap: 0.14, ret: 0.18, off: 0.12, reach: 0.74, sweet: 0.8,  step: 0.06, pow: 1 },
  brhook: { n: '4b', hand: 'rear', fam: 'hook',     tgt: 'body', load: 0.12, snap: 0.15, ret: 0.2,  off: 0.12, reach: 0.74, sweet: 0.8,  step: 0.06, pow: 1 },
};
export const BY_NUM = Object.fromEntries(Object.entries(PUNCH).map(([k, p]) => [p.n, k]));
for (const k in PUNCH) PUNCH[k].kind = k;

// How far in front of his center the spot we aim at sits.
const TGT = { head: 0.12, body: 0.1 };
const MAX_EXT = 1.03;       // past this he's short
const JAM = { straight: 0.55, hook: 0.25, upper: 0.15 }; // under this he's smothered / jammed
const WIDE = 0.42;          // rad: a straight this far off line goes past him

// Extension the punch would land at from center distance d (1 = the arm locked out).
export function extAt(f, P, d) {
  return (d - P.off - TGT[P.tgt]) / (f.arm * P.reach);
}
// Center distance where it lands at extension e.
export function distFor(f, P, e) {
  return P.off + TGT[P.tgt] + f.arm * P.reach * e;
}
// Can this punch reach from here, counting the step he can take behind it?
export function reaches(f, P, d) {
  return extAt(f, P, d - P.step) <= MAX_EXT - 0.04 && extAt(f, P, d) >= JAM[P.fam];
}

export function timing(f, P) {
  const k = 1 / (f.handSpeed || 1);
  return { load: P.load * k, snap: P.snap * k, ret: P.ret * k };
}

// Start a punch. The step-in is planned now: enough to land near the sweet spot, never more than his step.
export function startPunch(m, o, kind) {
  const P = PUNCH[kind], T = timing(m.f, P), d = dist(m, o);
  const need = Math.max(0, d - distFor(m.f, P, P.sweet));
  m.punch = { kind, P, t: 0, ...T, dur: T.load + T.snap + T.ret, phase: 'load', step: Math.min(P.step, need), stepped: 0, res: null };
  return m.punch;
}

// Which side of HIS body it arrives on: a left hand hooks into his right side, and so on.
function sideOf(m, P) {
  if (P.fam === 'straight') return 'center';
  const left = (P.hand === 'lead') === (m.f.stance !== 'southpaw');
  return left ? 'right' : 'left';
}

// Contact. The defender's state comes in as `def` (null when he isn't defending).
// Returns { result: land|block|miss, how, q, region, side, ext }.
export function resolve(m, o, rng, def) {
  const P = m.punch.P, d = dist(m, o), e = extAt(m.f, P, d);
  const out = { kind: P.kind, result: 'miss', how: null, q: null, region: P.tgt, side: sideOf(m, P), ext: e, d };
  const toHim = Math.atan2(o.z - m.z, o.x - m.x);
  const off = Math.abs(wrap(toHim - m.th));
  if (e > MAX_EXT) { out.how = 'short'; return out; }
  if (P.fam === 'straight' && off > WIDE) { out.how = 'wide'; return out; }

  if (def) {
    const r = def.vs(P, e);
    if (r) { Object.assign(out, r); if (out.result !== 'land') return out; }
  }
  // Passive cover: the gloves and elbows sit in the way even when he isn't reacting.
  if (out.result !== 'land' && rng.chance(coverChance(o, P))) { out.result = 'block'; out.how = 'guard'; return out; }

  out.result = 'land';
  // How clean: near the sweet spot and on line is solid or better; jammed or reaching is glancing.
  const jam = e < JAM[P.fam] + 0.15, reach = e > 0.99;
  const sweetness = clamp(1 - Math.abs(e - P.sweet) / 0.35, 0, 1) * clamp(1 - off / WIDE, 0.3, 1);
  let flush = 0.1 + 0.18 * sweetness + (o.punch && o.punch.phase !== 'retract' ? 0.18 : 0);
  let glance = 0.12 + (jam ? 0.35 : 0) + (reach ? 0.3 : 0) + (out.q === 'glancing' ? 1 : 0);
  if (out.q === 'flush') flush += 0.4;
  const r = rng.next();
  out.q = r < glance ? 'glancing' : r < glance + flush ? 'flush' : 'solid';
  if (jam && !out.how) out.how = 'jammed';
  return out;
}

// Gloves and elbows in the way, by guard, for a man who isn't actively defending.
// [straight, hook, upper] to the head, then the body.
const COVER = {
  standard: { head: [0.2, 0.16, 0.08], body: [0.18, 0.2, 0.1] },
  high:     { head: [0.28, 0.24, 0.05], body: [0.12, 0.16, 0.12] },
  peekaboo: { head: [0.25, 0.2, 0.08], body: [0.18, 0.18, 0.1] },
  philly:   { head: [0.18, 0.2, 0.06], body: [0.24, 0.16, 0.08] },
  cross:    { head: [0.26, 0.12, 0.1], body: [0.2, 0.16, 0.1] },
  handslow: { head: [0.08, 0.08, 0.06], body: [0.1, 0.1, 0.08] },
};
const FAM_I = { straight: 0, hook: 1, upper: 2 };
export function coverChance(o, P) {
  const c = COVER[o.f.guard] || COVER.standard;
  // A man mid-punch has a hand away from his face.
  const k = o.punch && o.punch.phase !== 'load' ? 0.5 : 1;
  return c[P.tgt][FAM_I[P.fam]] * k;
}

// Advance a punch one tick. Returns 'contact' on the tick it reaches the target, 'done' when it's home.
export function stepPunch(p, dt) {
  const before = p.t;
  p.t += dt;
  const hit = p.load + p.snap;
  p.phase = p.t < p.load ? 'load' : p.t < hit ? 'snap' : 'retract';
  if (before < hit && p.t >= hit) return 'contact';
  if (p.t >= p.dur) return 'done';
  return null;
}

// Where the punch is, 0 (guard) .. 1 (contact), for the renderer.
export function punchExt(p) {
  if (p.t < p.load) return -0.15 * (p.t / p.load);               // a small load back
  if (p.t < p.load + p.snap) { const k = (p.t - p.load) / p.snap; return 1 - (1 - k) * (1 - k) * (1 - k); }
  const k = Math.min((p.t - p.load - p.snap) / p.ret, 1);
  return 1 - k * k * (3 - 2 * k);
}
