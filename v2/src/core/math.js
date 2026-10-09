// Small shared math. Engine units are meters and seconds. y is up, y = 0 is the canvas.
export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const TAU = Math.PI * 2;

// The ring, in meters (FOUNDATION section 5). Shared by engine and render.
export const RING = {
  inside: 6.1,          // 20 ft inside the ropes
  half: 3.05,
  ropes: [0.46, 0.76, 1.07, 1.37], // rope heights off the canvas (18/30/42/54 in)
  ropeR: 0.025,
  post: 3.2,            // post center, each axis
  postH: 1.5,
  apron: 0.75,          // canvas past the ropes
  floorDrop: 1.0,       // canvas height above the arena floor
};
