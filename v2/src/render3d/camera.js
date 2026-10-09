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

// The fight cam (Fight Night style, Ed's portrait pick): low, side-on to the pair, a steadicam
// inside the ropes so no rope or post ever crosses the men. It sits a little off square to the
// line between them, takes whichever side it's already nearer (it orbits with them), and backs off
// just enough to keep both in frame. Boxed in by the ropes, it widens the lens; really boxed in,
// it cuts to the other side, like a TV director would.
export function makeFightCamera(THREE) {
  const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  const target = new THREE.Vector3(0, 1.1, 0);
  let az = Math.PI / 2, dist = 5, fov = 40, lift = 0, ready = false, cutT = 0; // az: from the pair's middle to the lens
  const HEIGHT = 1.6;                    // lens height off the canvas
  const PAD = 0.5;                       // room past each man's center (shoulder, glove)
  const SKEW = 0.42;                     // ~25 degrees off square: a touch of depth, a narrower pair
  const ROOM = RING.half - 0.12;         // the lens stays inside the ropes
  const MAXFOV = 78;

  // How far the lens can go from (mx, mz) along angle a before it hits the ropes.
  function room(mx, mz, a) {
    const c = Math.cos(a), s = Math.sin(a);
    let t = 99;
    if (c > 1e-4) t = Math.min(t, (ROOM - mx) / c); else if (c < -1e-4) t = Math.min(t, (-ROOM - mx) / c);
    if (s > 1e-4) t = Math.min(t, (ROOM - mz) / s); else if (s < -1e-4) t = Math.min(t, (-ROOM - mz) / s);
    return Math.max(t, 0.5);
  }
  const angDiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));

  // men: [{x, z}, {x, z}]. dt in seconds (render time, never the sim's).
  function update(dt, aspect, men) {
    const [a, b] = men;
    const mx = (a.x + b.x) / 2, mz = (a.z + b.z) / 2;
    const ax = b.x - a.x, az2 = b.z - a.z, gap = Math.hypot(ax, az2) || 1e-3;
    const half = gap / 2 * Math.cos(SKEW) + PAD;            // half the pair's width, as the lens sees it
    const baseFov = aspect < 1 ? 56 : 32;
    const hfOf = (f) => Math.atan(Math.tan((f * Math.PI) / 360) * aspect);
    const needD = Math.max(half / Math.tan(hfOf(baseFov)), 2.6);
    // Both side-on directions; stay on the nearer one unless the ropes box it in.
    const p1 = Math.atan2(ax, -az2) + SKEW, p2 = p1 + Math.PI;
    let want = Math.abs(angDiff(p1, az)) <= Math.abs(angDiff(p2, az)) ? p1 : p2;
    const other = want === p1 ? p2 : p1;
    cutT -= dt;
    let cut = !ready;
    if (ready && cutT <= 0 && room(mx, mz, want) < needD * 0.45 && room(mx, mz, other) > needD * 0.8) { want = other; cut = true; }
    // Short of room: open the lens until the pair fits. If even the widest lens can't hold them
    // (far apart, like corner to corner at the bell), back out past the ropes and rise over them.
    const inside = room(mx, mz, want);
    const fitMax = half / Math.tan(hfOf(MAXFOV));
    const d = inside >= Math.min(needD, fitMax) * 0.92 ? Math.min(needD, inside) : Math.min(needD, fitMax);
    let wantFov = baseFov;
    if (d < needD) {
      const hf = Math.atan(half / d);
      wantFov = Math.min(MAXFOV, (2 * Math.atan(Math.tan(hf) / aspect) * 180) / Math.PI);
    }
    const wantLift = d > inside ? clamp((d - inside) / 1.2, 0.3, 1) * 1.3 : 0;
    if (cut) { az = want; dist = d; fov = wantFov; lift = wantLift; target.set(mx, 1.1, mz); ready = true; cutT = 4; }
    az += angDiff(want, az) * (1 - Math.exp(-dt * 2.2));
    dist += (d - dist) * (1 - Math.exp(-dt * 3));
    if (wantLift === 0) dist = Math.min(dist, room(mx, mz, az)); // inside: never through the ropes, even mid-swing
    lift += (wantLift - lift) * (1 - Math.exp(-dt * 3));
    fov += (wantFov - fov) * (1 - Math.exp(-dt * 3));
    const k = 1 - Math.exp(-dt * 5);
    target.x += (mx - target.x) * k; target.z += (mz - target.z) * k;
    target.y = aspect < 1 ? 1.0 : 1.15;
    cam.fov = fov; cam.aspect = aspect;
    cam.position.set(target.x + Math.cos(az) * dist, HEIGHT + lift, target.z + Math.sin(az) * dist);
    cam.lookAt(target);
    cam.updateProjectionMatrix();
    return dist;
  }
  return { cam, update };
}
