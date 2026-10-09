// A fighter as the engine sees him. M1: frame, stance, guard, style only.
// Body stats and skills arrive in M4 (FOUNDATION section 4).

export const GUARDS = ['standard', 'high', 'peekaboo', 'philly', 'cross', 'handslow'];
export const STYLES = ['outboxer', 'boxer', 'pressure'];

export function makeFighter(spec = {}) {
  const f = {
    name: 'Fighter',
    stance: 'orthodox',  // or 'southpaw'
    guard: 'standard',
    style: 'boxer',
    height: 1.78,        // m
    reach: 1.83,         // m, fingertip to fingertip
    ...spec,
  };
  // Arm length from reach minus shoulder width; shoulders scale with height.
  f.shoulder = 0.23 * f.height;
  f.arm = (f.reach - f.shoulder) / 2;
  return f;
}

// Center-to-center distance where his lead hand lands at ~95% straight on the other man's head.
// Lead shoulder sits ~0.18 m ahead of center when bladed; a head sits ~0.12 m ahead of center.
export function jabRange(f) {
  return 0.18 + f.arm * 0.95 + 0.12;
}
