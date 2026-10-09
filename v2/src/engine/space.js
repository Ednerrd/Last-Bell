// Real space. Meters, x across the ring, z toward the TV camera, y up. Facing is an angle in the x-z plane.
import { RING, clamp } from '../core/math.js';

export const BODY_R = 0.27;          // a man's footprint radius, gloves in guard included
export const MIN_D = BODY_R * 2;     // centers never closer than this: no overlap, ever
export const EDGE = RING.half - 0.2; // farthest a center goes from the ring middle (ropes give a little)

export const dist = (a, b) => Math.hypot(b.x - a.x, b.z - a.z);
export const fwd = (th) => ({ x: Math.cos(th), z: Math.sin(th) });
// Right-hand side for a man facing th (y up): f x up = (-fz, fx).
export const rightOf = (th) => ({ x: -Math.sin(th), z: Math.cos(th) });
export const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// How close a point is to the ropes (0 = on the edge limit).
export const ropeGap = (p) => EDGE - Math.max(Math.abs(p.x), Math.abs(p.z));
export const inCorner = (p) => Math.abs(p.x) > EDGE - 0.7 && Math.abs(p.z) > EDGE - 0.7;

export function clampRing(p) {
  p.x = clamp(p.x, -EDGE, EDGE);
  p.z = clamp(p.z, -EDGE, EDGE);
}

// Push two men apart and keep both inside the ropes. Returns false if they still overlap
// (both pinned), and then the caller keeps last tick's positions, which were legal.
export function separate(a, b) {
  for (let i = 0; i < 4; i++) {
    let dx = b.x - a.x, dz = b.z - a.z, d = Math.hypot(dx, dz);
    if (d >= MIN_D) return true;
    if (d < 1e-6) { dx = 1; dz = 0; } else { dx /= d; dz /= d; }
    const need = MIN_D - d + 1e-6;
    // A man on the ropes can't give ground, so the other one takes it all.
    const aStuck = ropeGap(a) < 0.02, bStuck = ropeGap(b) < 0.02;
    const sa = aStuck && !bStuck ? 0 : bStuck && !aStuck ? 1 : 0.5;
    a.x -= dx * need * sa; a.z -= dz * need * sa;
    b.x += dx * need * (1 - sa); b.z += dz * need * (1 - sa);
    clampRing(a); clampRing(b);
  }
  return dist(a, b) >= MIN_D;
}

// Planted feet for a man at p facing th. Lead foot forward, rear foot back and out.
export function feetAt(p, th, stance) {
  const f = fwd(th), r = rightOf(th), side = stance === 'southpaw' ? 1 : -1;
  return {
    lead: { x: p.x + f.x * 0.22 + r.x * 0.1 * side, z: p.z + f.z * 0.22 + r.z * 0.1 * side },
    rear: { x: p.x - f.x * 0.2 - r.x * 0.12 * side, z: p.z - f.z * 0.2 - r.z * 0.12 * side },
  };
}
