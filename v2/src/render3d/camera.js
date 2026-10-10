// The TV camera: elevated, one side of the ring, a slow sway so it never sits dead still.
// Distance is fitted so the whole ring stays on screen in portrait or landscape.
import { RING, clamp } from '../core/math.js';

export function makeTvCamera(THREE) {
  const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  const target = new THREE.Vector3(0, 0.55, 0);
  const elev = 0.42;                    // ~24 degrees down
  const radius = RING.half + RING.apron + 0.3; // what must fit across

  // focus: optional {x, z} the camera leans toward (the action), damped.
  function update(t, aspect, focus) {
    cam.aspect = aspect;
    if (focus) { target.x += (focus.x * 0.4 - target.x) * 0.03; target.z += (focus.z * 0.3 - target.z) * 0.03; }
    const vf = (cam.fov * Math.PI) / 180;
    const hf = 2 * Math.atan(Math.tan(vf / 2) * aspect);
    const dist = Math.max(radius / Math.sin(Math.min(hf, vf) / 2) * 0.92, 7);
    const az = Math.sin(t * 0.09) * 0.1;
    cam.position.set(
      target.x + Math.sin(az) * Math.cos(elev) * dist,
      target.y + Math.sin(elev) * dist,
      target.z + Math.cos(az) * Math.cos(elev) * dist,
    );
    cam.lookAt(target);
    cam.updateProjectionMatrix();
    return dist;
  }
  return { cam, update };
}

// The fight cam: a Fight Night broadcast camera. It takes one side of the ring and keeps it: low
// (lens ~1.3 m), close (~3.2 m), sliding along its side to follow the pair and panning to keep
// them centered. It never orbits. It cuts to the other side rarely and for a reason: after a big
// shot (with a long cooldown), or when the fight comes right onto the lens. A fighter can leave
// frame for a moment when he's driven far; that's what the real camera does too. A little
// handheld drift (noise, not a sine) and a thump on heavy shots. Render time only, never the sim's.
import { noise } from './moves.js';
import { makeRng } from '../core/rng.js';
export function makeFightCamera(THREE) {
  const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 60);
  const target = new THREE.Vector3(0, 1.1, 0);
  const HEIGHT = 1.3, DIST = 3.2, ROOM = RING.half + 0.9; // out to the apron edge
  // The side: its axis ('x' or 'z': the lens's fixed coordinate runs along it) and sign.
  let side = null, cool = 0, t = 0, lined = 0;
  let perp = 0, lat = 0, perpV = 0, latV = 0;
  const kick = { p: [0, 0, 0], v: [0, 0, 0] }, rng = makeRng('fightcam');
  const tgt = { x: 0, z: 0, vx: 0, vz: 0 };
  const sp = (s, key, vkey, goal, w, h) => { s[vkey] += (w * w * (goal - s[key]) - 2 * w * s[vkey]) * h; s[key] += s[vkey] * h; };

  // The best side: sees the pair side-on, with room between the lens and the nearer man.
  function pick(a, b, avoid) {
    const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2, gx = b.x - a.x, gz = b.z - a.z, gl = Math.hypot(gx, gz) || 1;
    let best = null, bestS = -1e9;
    for (const axis of ['z', 'x']) for (const sign of [1, -1]) {
      const m = axis === 'z' ? mz : mx, p = Math.max(-ROOM, Math.min(ROOM, m + sign * DIST));
      const px = axis === 'z' ? mx : p, pz = axis === 'z' ? p : mz;
      const near = Math.min(Math.hypot(a.x - px, a.z - pz), Math.hypot(b.x - px, b.z - pz));
      const vx = mx - px, vz = mz - pz, vl = Math.hypot(vx, vz) || 1;
      const sideOn = 1 - Math.abs((vx * gx + vz * gz) / (vl * gl));
      const sc = sideOn * 2 + Math.min(near, 3) - (avoid && avoid.axis === axis && avoid.sign === sign ? 10 : 0);
      if (sc > bestS) { bestS = sc; best = { axis, sign }; }
    }
    return best;
  }
  function snapTo(a, b, s) {
    side = s;
    const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2, m = s.axis === 'z' ? mz : mx;
    perp = Math.max(-ROOM, Math.min(ROOM, m + s.sign * DIST)); perpV = 0;
    lat = s.axis === 'z' ? mx : mz; latV = 0;
    tgt.x = mx; tgt.z = mz; tgt.vx = tgt.vz = 0;
  }

  // A shot landed: q 'glancing' | 'solid' | 'flush'. Big ones thump the lens and may earn a cut.
  let wantCut = false;
  function hit(q) {
    const k = q === 'flush' ? 1 : q === 'solid' ? 0.45 : 0;
    if (!k) return;
    kick.v[1] -= 0.35 * k; kick.v[0] += 0.25 * k * (rng.next() - 0.5);
    if (q === 'flush' && cool <= 0 && rng.chance(0.3)) wantCut = true;
  }
  function newRound() { side = null; }

  function update(dt, aspect, men) {
    const [a, b] = men;
    t += dt; cool -= dt;
    const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;
    if (!side) snapTo(a, b, pick(a, b)), cool = 15;
    const m = side.axis === 'z' ? mz : mx, l = side.axis === 'z' ? mx : mz;
    // Fight right on top of the lens, or a big shot after a long while: cut across.
    // Cut when: a man is right on the lens; one man hides the other (the pair lines up with the
    // lens) for a while; or a big shot after a long while.
    const px0 = side.axis === 'z' ? lat : perp, pz0 = side.axis === 'z' ? perp : lat;
    const near = Math.min(Math.hypot(a.x - px0, a.z - pz0), Math.hypot(b.x - px0, b.z - pz0)) < 1.5;
    const vx = mx - px0, vz = mz - pz0, gx = b.x - a.x, gz = b.z - a.z;
    const inLine = Math.abs(vx * gx + vz * gz) / ((Math.hypot(vx, vz) * Math.hypot(gx, gz)) || 1) > 0.85;
    lined = inLine ? lined + dt : 0;
    if (near || (lined > 1.2 && cool <= 12) || (wantCut && cool <= 0)) { snapTo(a, b, pick(a, b, side)); cool = 18; lined = 0; }
    wantCut = false;
    const n = Math.ceil(dt / (1 / 120)), h = dt / n;
    const S = { perp, perpV, lat, latV };
    const goalPerp = Math.max(-ROOM, Math.min(ROOM, m + side.sign * DIST));
    for (let i = 0; i < n; i++) {
      sp(S, 'lat', 'latV', l, 2.2, h);                       // slides along its side
      sp(S, 'perp', 'perpV', goalPerp, 0.7, h);              // drifts in or out only slowly
      sp(tgt, 'x', 'vx', mx, 5, h); sp(tgt, 'z', 'vz', mz, 5, h);
      for (let j = 0; j < 3; j++) { kick.v[j] += (-170 * kick.p[j] - 26 * kick.v[j]) * h; kick.p[j] += kick.v[j] * h; }
    }
    ({ perp, perpV, lat, latV } = S);
    // Handheld: tiny drift on position and aim.
    const hx = noise(t * 0.7, 11) * 0.015, hy = noise(t * 0.6, 12) * 0.012, hz = noise(t * 0.7, 13) * 0.015;
    const px = side.axis === 'z' ? lat : perp, pz = side.axis === 'z' ? perp : lat;
    cam.position.set(px + hx + kick.p[0], HEIGHT + hy + kick.p[1], pz + hz + kick.p[2]);
    target.set(tgt.x + noise(t * 0.5, 14) * 0.012, aspect < 1 ? 1.05 : 1.12, tgt.z + noise(t * 0.5, 15) * 0.012);
    cam.lookAt(target);
    cam.fov = aspect < 1 ? 64 : 40; cam.aspect = aspect;
    cam.updateProjectionMatrix();
    return Math.hypot(px - mx, pz - mz);
  }
  // Where the lens is, for the ring to drop that side's ropes while it's outside them.
  const where = () => (side && Math.abs(perp) > RING.half - 0.1 ? side : null);
  return { cam, update, hit, newRound, where };
}
