// Defense (FOUNDATION section 5): block, slip, roll, pull back. Step-out lives in footwork, the clinch in M3.
// A defense is a short move with a window. It only counts if it's up when the punch arrives,
// and the right one for the punch: slip a hook and you slip into it, roll an uppercut and you eat it.

// dur: how long the move lasts (s). Active from `on` (s into the move) to the end.
export const DEF = {
  block: { dur: 0.34, on: 0.03 },
  slip:  { dur: 0.3,  on: 0.04 },
  roll:  { dur: 0.36, on: 0.05 },
  pull:  { dur: 0.32, on: 0.04, back: 0.22 }, // steps the head and hips back this far
};

// What each move does against each punch, if it's up in time:
// [chance it works, what happens when it works, what happens when it doesn't].
// 'land' means the move didn't matter; 'flush' means it made things worse.
const VS = {
  block: {
    straight: { head: [0.92, 'block', 'land'], body: [0.35, 'block', 'flush'] },
    hook:     { head: [0.86, 'block', 'land'], body: [0.3, 'block', 'flush'] },
    upper:    { head: [0.55, 'block', 'land'], body: [0.3, 'block', 'land'] },
  },
  slip: {
    straight: { head: [0.82, 'slipped', 'land'], body: [0, '', 'land'] },
    hook:     { head: [0.3, 'slipped', 'flush'], body: [0, '', 'land'] },
    upper:    { head: [0.2, 'slipped', 'flush'], body: [0, '', 'land'] },
  },
  roll: {
    straight: { head: [0.55, 'ducked', 'land'], body: [0, '', 'flush'] },
    hook:     { head: [0.84, 'rolled', 'land'], body: [0.25, 'rolled', 'land'] },
    upper:    { head: [0, '', 'flush'], body: [0, '', 'land'] },
  },
  // Pull back works mostly through real distance (the move steps him back); this is what's left
  // when the punch still gets there.
  pull: {
    straight: { head: [0.35, 'pulled', 'glancing'], body: [0.3, 'pulled', 'glancing'] },
    hook:     { head: [0.45, 'pulled', 'glancing'], body: [0.3, 'pulled', 'glancing'] },
    upper:    { head: [0.55, 'pulled', 'glancing'], body: [0.3, 'pulled', 'glancing'] },
  },
};

export function startDefense(o, kind, side) {
  o.def = { kind, t: 0, dur: DEF[kind].dur, side, moved: 0 };
  return o.def;
}

export function isUp(def) {
  return !!def && def.t >= DEF[def.kind].on && def.t <= def.dur;
}

// At contact. Returns null (no effect) or a partial result for punch.resolve.
export function defVs(def, P, rng) {
  if (!def) return null;
  if (!isUp(def)) return { how: def.t < 0 ? 'late' : null };
  const [p, ok, bad] = VS[def.kind][P.fam][P.tgt];
  if (p > 0 && rng.chance(p)) {
    if (ok === 'block') return { result: 'block', how: def.kind };
    return { result: 'miss', how: ok };
  }
  if (bad === 'flush') return { result: 'land', q: rng.chance(0.55) ? 'flush' : 'solid', how: 'into it' };
  if (bad === 'glancing') return { result: 'land', q: 'glancing', how: 'caught' };
  return null;
}
