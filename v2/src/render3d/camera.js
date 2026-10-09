// The TV camera: elevated, one side of the ring, a slow sway so it never sits dead still.
// Distance is fitted so the whole ring stays on screen in portrait or landscape.
import { RING } from '../core/math.js';

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
