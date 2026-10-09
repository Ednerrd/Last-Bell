// The men, drawn where the engine says they are. Render only: reads the state it's handed and the
// bus, never changes a result.
// Movement pass (research/move_plan.md): feet plant and step (lift, swing, land, pivot on the ball),
// the hips ride between them with the weight shifting foot to foot, the torso turns into punches
// (hips lead, shoulders follow, a little follow-through), hits land as impulses (chest first, the
// head whips after), and every man has his own way of moving (moves.js).
// Bodies (body.js): one skinned body per man; this file works out the joints and frames its bones.
// Local frame: [forward, up, right] for a man 1.78 m tall, mirrored for southpaws (lead = -right).
import { moveDNA, noise } from './moves.js';
import { makeBody, lookOf, BIND, ANKLE } from './body.js';
import { makeRng } from '../core/rng.js';

// Glove spots in guard: [x forward, y up, z right]. Lead = left = -z.
const GUARD = {
  standard: { lead: [0.32, 1.42, -0.12], rear: [0.2, 1.45, 0.12], crouch: 0 },
  high:     { lead: [0.26, 1.55, -0.1], rear: [0.2, 1.56, 0.1], crouch: 0 },
  peekaboo: { lead: [0.24, 1.43, -0.08], rear: [0.22, 1.44, 0.08], crouch: 0.07 },
  philly:   { lead: [0.16, 1.02, -0.06], rear: [0.18, 1.5, 0.13], crouch: 0 },
  cross:    { lead: [0.27, 1.43, 0.06], rear: [0.29, 1.5, -0.05], crouch: 0.03 },
  handslow: { lead: [0.3, 1.08, -0.16], rear: [0.2, 1.22, 0.16], crouch: 0 },
};
const SHOULDER = { lead: [0.06, 1.42, -0.17], rear: [-0.04, 1.42, 0.17] };
const HEAD = [0.02, 1.64, 0];
const BLOCK = { lead: [0.2, 1.6, -0.075], rear: [0.19, 1.61, 0.075] };
const HIT_AMP = { glancing: 0.035, solid: 0.075, flush: 0.13 };
// Stance (local, before his own width/length): the engine plants the same shape.
const FOOT = { lead: [0.22, -0.1], rear: [-0.2, 0.12] };
const TOE = { lead: 0.3, rear: 0.9 };      // toes turned out from his facing (rad)
const BALL = 0.07;                         // foot center to the ball of the foot
// Torso turn behind each punch (rad, + turns the rear shoulder through). Elite trunk turn is
// ~43 deg on the jab and ~73 on the rear straight (move_fundamentals.md); these are the visible peaks.
const TURN = { jab: 0.35, bjab: 0.3, cross: 0.87, bcross: 0.8, lhook: -0.7, bhook: -0.6, rhook: 0.8, brhook: 0.75, lupper: -0.3, rupper: 0.55 };
// Weight: 0 all on the rear foot .. 1 all on the lead.
const WEIGHT = { jab: 0.55, bjab: 0.6, cross: 0.68, bcross: 0.7, lhook: 0.38, bhook: 0.4, rhook: 0.66, brhook: 0.66, lupper: 0.45, rupper: 0.6 };

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (k) => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => mul(a, 1 / (len(a) || 1e-9));
const perp = (v, d) => sub(v, mul(d, dot(v, d)));   // v with its part along unit d taken out
const rotY = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c]; };
const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// Springs (render seconds, substepped so a long frame can't blow up). w: stiffness, z: damping
// (1 = no overshoot, < 1 wobbles back). Scalars live in { p, v }, vectors in { p: [], v: [] }.
function spring(s, goal, w, z, dt) {
  const n = Math.max(1, Math.ceil(dt * 120)), h = dt / n;
  for (let i = 0; i < n; i++) { s.v += (w * w * (goal - s.p) - 2 * z * w * s.v) * h; s.p += s.v * h; }
  return s.p;
}
function spring3(s, goal, w, z, dt) {
  const n = Math.max(1, Math.ceil(dt * 120)), h = dt / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < 3; j++) { s.v[j] += (w * w * (goal[j] - s.p[j]) - 2 * z * w * s.v[j]) * h; s.p[j] += s.v[j] * h; }
  return s.p;
}
const S1 = (p = 0) => ({ p, v: 0 });
const S3 = () => ({ p: [0, 0, 0], v: [0, 0, 0] });

// Punch progress 0 (guard) .. 1 (contact), with a small load back. The fist is still moving when it
// arrives (it drives through, it doesn't die on the target). After contact it depends what happened:
// a landed shot sits a beat, a miss sails a little past and comes back slower.
function extOf(p, res) {
  if (p.t <= 0) return 0;
  if (p.t < p.load) return -0.12 * (p.t / p.load);
  if (p.t < p.load + p.snap) { const k = (p.t - p.load) / p.snap; return 1.25 * k - 0.25 * k * k; }
  const k = (p.t - p.load - p.snap) / p.ret;
  if (res === 'miss') return 1 + 0.08 * Math.sin(Math.PI * clamp(k / 0.3, 0, 1)) - smooth((k - 0.15) / 0.85);
  return 1 - smooth((k - (res === 'land' ? 0.12 : 0.06)) / (res === 'land' ? 0.88 : 0.94));
}
// Defense envelope: in fast, hold, out.
function defEnv(d) {
  if (!d || d.t < 0) return 0;
  const k = d.t / d.dur;
  return k < 0.25 ? smooth(k / 0.25) : k > 0.7 ? 1 - smooth((k - 0.7) / 0.3) : 1;
}

export function makeMen(THREE, scene) {
  const men = [0, 1].map((i) => ({
    B: null, // the body (body.js), built when we first see who he is
    // Pose state (local, mirrored): smoothed gloves, the punch we last saw and how it ended.
    g: { lead: null, rear: null }, punch: null, from: null, res: null,
    f: null, D: null, t: i * 31.7, ph: i * 2.1, busy: 1, act: 1, hold: 0, nextHold: 3, feint: null,
    sp: null, ft: null, step: null,
    yaw: S1(), hip: S1(), w: S1(0.45), fold: S1(), off: S3(), chest: S3(), headK: S3(), pend: [],
    probe: null, // drawn hip / head / feet, for the headless checks
  }));

  // Bone frames. Every bone gets a world frame (origin, right-handed axes, scale); bones in body.js
  // were bound the same way, so the skin follows.
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _qC = new THREE.Quaternion(), _qP = new THREE.Quaternion();
  const _e = new THREE.Euler(), _v = new THREE.Vector3();
  const ax = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  function quat(q, x, y, z) {
    _m.makeBasis(ax[0].set(x[0], x[1], x[2]), ax[1].set(y[0], y[1], y[2]), ax[2].set(z[0], z[1], z[2]));
    return q.setFromRotationMatrix(_m);
  }
  function setBone(b, o, q, s, sy = s) { b.position.set(o[0], o[1], o[2]); b.quaternion.copy(q); b.scale.set(s, sy, s); }
  // A limb bone: from o along unit d, front f (square to d). Bound as x = front, y = back up the limb.
  function limb(b, o, d, f, s, sy = s) { setBone(b, o, quat(_q, f, mul(d, -1), cross(d, f)), s, sy); }
  // Two-bone reach: the joint between root S and end G (lengths L1, L2), bent toward `pole`.
  function ik(S, G, L1, L2, pole) {
    const d = sub(G, S), dl = Math.max(len(d), 1e-6), u = mul(d, 1 / dl);
    const D = clamp(dl, Math.abs(L1 - L2) + 1e-4, L1 + L2 - 1e-5);
    const a = (L1 * L1 - L2 * L2 + D * D) / (2 * D), h = Math.sqrt(Math.max(L1 * L1 - a * a, 0));
    return add(add(S, mul(u, a)), mul(norm(perp(pole, u)), h));
  }

  // Local [fwd, up, right] (mirrored by side) -> world, for a man at (x, z) facing th, scale s.
  function world(m, l, s, side) {
    const c = Math.cos(m.th), sn = Math.sin(m.th);
    const f = l[0] * s, r = l[2] * side * s;
    return [m.x + c * f - sn * r, l[1] * s, m.z + sn * f + c * r];
  }
  // The same for a direction (no move, no scale).
  function wdir(th, l, side) {
    const c = Math.cos(th), sn = Math.sin(th), r = l[2] * side;
    return [c * l[0] - sn * r, l[1], sn * l[0] + c * r];
  }
  // World (x, y, z) -> his local mirrored frame.
  function local(m, x, y, z, s, side) {
    const c = Math.cos(m.th), sn = Math.sin(m.th), dx = x - m.x, dz = z - m.z;
    return [(dx * c + dz * sn) / s, y / s, ((-dx * sn + dz * c) / s) * side];
  }

  // A landed shot is an impulse: the chest takes it now, the head whips after it 35 ms later and
  // wobbles back once. The puncher feels a bit of it back through his arm. Body shots fold him.
  function onContact(e) {
    const P = men[e.corner];
    if (P.punch && P.punch.kind === e.kind) P.res = e.result;
    if (e.result !== 'land') return;
    const R = men[1 - e.corner], amp = HIT_AMP[e.q] || 0.05;
    // Direction in HIS local frame (real sides; update() mirrors z for southpaws).
    const push = e.side === 'right' ? -1 : e.side === 'left' ? 1 : 0;
    const dir = e.kind.includes('upper') ? [-0.4, 0.8, 0] : push ? [-0.3, 0, push] : [-1, 0.1, 0];
    if (e.region === 'body') { R.fold.v += amp * 14 / 0.47 * 1.4; R.chest.v[0] -= amp * 6; }
    else {
      for (let j = 0; j < 3; j++) R.chest.v[j] += dir[j] * amp * 16 * 0.45;
      R.pend.push({ t: 0.035, v: mul(dir, amp * 18 / 0.52) });
    }
    P.chest.v[0] -= amp * 3.5; // the puncher's recoil
    if (e.q === 'flush') R.shove = { dir, amp };
  }

  // The hips flow on a critically damped spring toward where the engine has him. The engine moves
  // in short steps with pauses between; this is slow enough that he carries through the pauses like
  // a real boxer instead of stop-go, and quick enough that a slip or a step-in still reads.
  const GLIDE = 10;
  function glide(R, m, dt) {
    const S = R.sp;
    if (!S || Math.hypot(m.x - S.x, m.z - S.z) > 1) { R.sp = { x: m.x, z: m.z, vx: 0, vz: 0 }; return R.sp; }
    const n = Math.ceil(dt / (1 / 120)), h = dt / n;
    for (let k = 0; k < n; k++) {
      S.vx += (GLIDE * GLIDE * (m.x - S.x) - 2 * GLIDE * S.vx) * h; S.x += S.vx * h;
      S.vz += (GLIDE * GLIDE * (m.z - S.z) - 2 * GLIDE * S.vz) * h; S.z += S.vz * h;
    }
    return S;
  }

  // ---- Feet: a gait, not a copy of the engine's steps (that read as baby steps). Each foot stays
  // planted until it's too far from where it belongs, then strides there; where it belongs leads
  // the way he's moving, so the stride lands ahead of him and he walks through it. One foot at a
  // time (the next can go once the first is mostly down), and a foot in the air keeps aiming at
  // where he's going. The step in behind a punch and the catch step after a big shot ride on top.
  function stanceSpot(c, th, h, D, s, side) {
    const l = FOOT[h];
    const p = world({ x: c.x, z: c.z, th }, [l[0] * D.len, 0, l[1] * D.wid], s, side);
    return { x: p[0], z: p[2], yaw: th - (h === 'lead' ? TOE.lead : TOE.rear * (D.uw > 0.04 ? 0.7 : 1)) * side };
  }
  function lift(F, to, dur, h) {
    F.sw = { fx: F.x, fz: F.z, fyaw: F.yaw, to, t: 0, dur, h, aim: null };
  }
  function feet(R, m, dt, s, side) {
    const D = R.D, c = { x: m.x, z: m.z };
    const spd = Math.hypot(m.vx, m.vz), lead = spd > 0.12 ? clamp(spd * 0.26, 0, 0.22 * s) / spd : 0;
    const want = {};
    for (const h of ['lead', 'rear']) {
      const w = stanceSpot(c, m.th, h, D, s, side);
      want[h] = { ...w, x: w.x + m.vx * lead, z: w.z + m.vz * lead };
    }
    if (!R.ft || Math.hypot(R.ft.lead.x - want.lead.x, R.ft.lead.z - want.lead.z) > 1) {
      R.ft = { lead: { ...want.lead, sw: null, y: 0 }, rear: { ...want.rear, sw: null, y: 0 } };
      R.lift = 0;
      return;
    }
    const F = R.ft;
    // A foot that's somehow way out of place (sim jumped ahead) just goes home.
    for (const h of ['lead', 'rear']) if (Math.hypot(F[h].x - want[h].x, F[h].z - want[h].z) > 0.6 * s) Object.assign(F[h], want[h], { sw: null, y: 0 });
    // The step in behind a punch: the lead foot goes now and lands with the punch.
    const p = m.punch;
    if (p && p !== R.stepPunch) {
      R.stepPunch = p;
      const left = p.step - p.stepped;
      if (left > 0.03) {
        const to = { x: m.x + Math.cos(m.th) * left, z: m.z + Math.sin(m.th) * left };
        lift(F.lead, () => stanceSpot(to, m.th, 'lead', D, s, side), Math.max(p.load + p.snap - (p.t + (m.ta || 0)), 0.08), D.swing * 0.7);
      }
    }
    // A big shot moves his feet: the rear foot catches him.
    if (R.shove) {
      const { dir, amp } = R.shove, b = mul(dir, amp * 1.2);
      const w = world({ x: 0, z: 0, th: m.th }, [b[0], 0, b[2] * side], s, side);
      const base = want.rear;
      if (!F.rear.sw) lift(F.rear, () => ({ ...base, x: base.x + w[0], z: base.z + w[2] }), 0.14, 0.02);
      R.shove = null;
    }
    // Swings in flight. A free stride keeps re-aiming at where he's going.
    R.lift = 0;
    for (const h of ['lead', 'rear']) {
      const f = F[h];
      if (!f.sw) continue;
      const S = f.sw;
      let to;
      if (typeof S.to === 'function') to = S.to();
      else {
        if (!S.aim) S.aim = { ...want[h] };
        const k = 1 - Math.exp(-10 * dt);
        S.aim.x += (want[h].x - S.aim.x) * k; S.aim.z += (want[h].z - S.aim.z) * k; S.aim.yaw += wrapA(want[h].yaw - S.aim.yaw) * k;
        to = S.aim;
      }
      S.t += dt;
      const u = clamp(S.t / S.dur, 0, 1), e = smooth(u);
      f.x = S.fx + (to.x - S.fx) * e; f.z = S.fz + (to.z - S.fz) * e;
      f.yaw = S.fyaw + wrapA(to.yaw - S.fyaw) * e;
      f.y = S.h * Math.sin(Math.PI * u);
      R.lift = Math.max(R.lift, f.y);
      if (u >= 1) { f.sw = null; f.y = 0; }
    }
    // Strides: the foot furthest from where it belongs goes, once the other is (nearly) down.
    const err = (h) => Math.hypot(want[h].x - F[h].x, want[h].z - F[h].z);
    const yerr = (h) => Math.abs(wrapA(want[h].yaw - F[h].yaw));
    const down = (h) => !F[h].sw || F[h].sw.t >= F[h].sw.dur * 0.55;
    const thr = 0.13 * s;
    const cand = ['lead', 'rear'].filter((h) => !F[h].sw && (err(h) > thr || yerr(h) > 0.44)).sort((a, b) => err(b) - err(a));
    if (cand.length) {
      const h = cand[0], o = h === 'lead' ? 'rear' : 'lead', d = err(h);
      if (down(o) || d > 0.35 * s) {
        // A real move gets a real lift; turning in place is a pivot, the foot barely leaves the canvas.
        if (d > 0.025 * s) lift(F[h], null, clamp(0.22 - spd * 0.06, 0.12, 0.22) * (d > 0.35 * s ? 0.75 : 1), D.swing * clamp(d / (0.15 * s), 0.4, 1.2));
        else lift(F[h], null, 0.12, 0.004);
      }
    }
  }

  function update(raw, dt = 1 / 60) {
    const state = raw.map((m, i) => { const S = glide(men[i], m, dt); return { ...m, x: S.x, z: S.z, vx: S.vx, vz: S.vz }; });
    state.forEach((m, i) => {
      const R = men[i], o = state[1 - i], g = GUARD[m.f.guard] || GUARD.standard;
      if (R.f !== m.f) {
        R.f = m.f; R.D = moveDNA(m.f, i); R.ft = null;
        if (R.B) R.B.dispose();
        R.B = makeBody(THREE, scene, lookOf(m.f, i, makeRng([m.f.name, m.f.height.toFixed(3), m.f.reach.toFixed(3), i, 'look'].join('|'))));
      }
      const D = R.D;
      const s = m.f.height / 1.78, side = m.f.stance === 'southpaw' ? -1 : 1;
      const armL = m.f.arm / s;                                    // shoulder to glove, local units
      const ta = m.ta || 0;
      const p = m.punch, P = p && p.P;
      const pt = p && { ...p, t: p.t + ta };                       // the punch as of this frame
      const d = m.def && { ...m.def, t: m.def.t + ta }, env = defEnv(d);
      R.t += dt;

      feet(R, m, dt, s, side);

      // --- Life: his own bounce, weave and rhythm. Some stays on while he punches or defends.
      R.busy += ((p || env > 0 ? D.busy : 1) - R.busy) * (1 - Math.exp(-dt * 8));
      if (D.hold) {
        // Rhythm breaks: every few seconds he goes still for a beat, then picks it back up.
        if (R.hold > 0) R.hold -= dt;
        else if ((R.nextHold -= dt) <= 0) { R.hold = D.rng.range(0.3, 0.8); R.nextHold = D.hold * D.rng.range(0.6, 1.4); }
      }
      R.act += ((R.hold > 0 ? 0.15 : 1) - R.act) * (1 - Math.exp(-dt * 6));
      const life = R.busy * R.act;
      R.ph += dt * Math.PI * 2 * D.hz * (1 + 0.12 * noise(R.t * 0.4, D.seed));
      const u = (R.ph / (Math.PI * 2)) % 1;
      // Soft bounce is a sine on the knees; a hop is push off, float, land (feet leave the floor).
      const shape = (1 - D.hop) * (0.5 + 0.5 * Math.sin(Math.PI * 2 * u)) + D.hop * Math.sin(Math.PI * u) ** 1.5;
      let bob = D.bob * (shape - 0.5) * 2 * life;
      // Weave: noise, not a sine, plus the head going with his feet when he moves sideways.
      const latV = (-Math.sin(m.th) * m.vx + Math.cos(m.th) * m.vz) * side;
      let weave = D.weave * noise(R.t * D.weaveHz, D.seed + 3) * 1.6 * life + clamp(latV, -1.5, 1.5) * 0.025;
      // Peekaboo / rollers: the U. Side to side, dipping through the middle; it comes and goes.
      let uDip = 0;
      if (D.uw > 0) {
        const gate = clamp(noise(R.t * 0.25, D.seed + 9) * 1.5 + 0.4, 0, 1) * life;
        const a = R.t * Math.PI * 2 * 0.6;
        weave += D.uw * 0.9 * Math.sin(a) * gate;
        uDip = D.uw * Math.cos(a) ** 2 * gate;
      }
      bob -= (R.lift || 0) * 0.3;                                  // he sinks a touch as he strides

      // --- Punch: which hand, how far along, the torso and weight behind it.
      let e = 0, hand = null;
      if (p) {
        if (p !== R.punch) { R.punch = p; R.res = null; R.from = R.g[P.hand] ? R.g[P.hand].slice() : null; }
        e = extOf(pt, R.res); hand = P.hand;
      } else R.punch = null;
      const T = p ? (TURN[P.kind] || 0) * D.turn : 0;
      // Load coils the other way, the snap throws it through, the return brings it home.
      const turnGoal = p ? (e < 0 ? T * e * 2 : T * Math.min(e, 1)) : 0;
      let wGoal = p && e > 0 ? 0.45 + (WEIGHT[P.kind] - 0.45) * Math.min(e, 1) : 0.45 + D.lean * 0.6;
      const bodyDip = p && P.tgt === 'body' ? 0.1 * Math.max(e, 0) : 0;

      // --- Defense: head/torso offset (local, mirrored) and where the gloves go.
      const peek = D.uw > 0.04;
      let off = [0, -uDip, weave], hipExtra = 0, roll = 0;
      if (d && env > 0) {
        const lat = d.side === 'lead' ? 1 : -1;                    // away from the hand that's coming
        const k = clamp(d.t / d.dur, 0, 1);
        let o3 = [0, 0, 0];
        if (d.kind === 'slip') o3 = [0.03, peek ? -0.15 : -0.08, 0.15 * lat];
        else if (d.kind === 'roll') { o3 = [0.06, -0.22, 0.12 * lat * Math.sin(Math.PI * k)]; hipExtra = 0.3 * lat * Math.sin(Math.PI * k); }
        else if (d.kind === 'pull') { o3 = [m.f.guard === 'handslow' ? -0.18 : -0.13, 0.01, 0]; wGoal = 0.15; }
        else if (d.kind === 'block') {
          if (m.f.guard === 'philly') { o3 = [-0.04, -0.03, 0.03]; roll = -0.4; wGoal = 0.3; } // shoulder roll: turn away, shoulder up, sit back
          else o3 = [-0.02, -0.03, 0];
        }
        off = add(mul(o3, env), mul(off, 1 - env * 0.5));
      }
      // Offsets ride a spring, so a defense move flows instead of popping.
      const offS = spring3(R.off, off, 30, 0.9, dt);

      // Torso: hips lead, shoulders follow and overshoot a touch (follow-through), then settle.
      const yaw = spring(R.yaw, turnGoal + roll, 26, 0.62, dt);
      const hipYaw = spring(R.hip, turnGoal * 0.5 + hipExtra + roll * 0.4, 34, 0.85, dt);
      const w = spring(R.w, wGoal, 18, 0.9, dt);
      const fold = spring(R.fold, bodyDip, 14, 0.7, dt);

      // Hits: chest and (delayed) head impulses on springs that wobble back once.
      for (let k = R.pend.length - 1; k >= 0; k--) {
        const q = R.pend[k]; q.t -= dt;
        if (q.t <= 0) { for (let j = 0; j < 3; j++) R.headK.v[j] += q.v[j]; R.pend.splice(k, 1); }
      }
      const chest = spring3(R.chest, [0, 0, 0], 14, 0.75, dt);
      const hk = spring3(R.headK, [0, 0, 0], 18, 0.55, dt);
      // ch/hd: the same pushes in his mirrored local frame (chest/headK hold real sides).
      const ch = [chest[0], chest[1], chest[2] * side], hd = [hk[0], hk[1], hk[2] * side];

      // Knees carry the drops (slip, roll, U): the body goes down, not just the neck.
      const knee = Math.max(-offS[1], 0) * 0.65;
      const crouch = g.crouch + D.drop * 0.5 - bob + knee + fold * 0.3;
      const offT = [offS[0], offS[1] + knee, offS[2]];             // what's left for the torso and head

      // Pelvis rides over the loaded foot (fore-aft), the hips glide between the planted feet.
      const shift = (w - 0.45) * 0.2 * D.len;
      const lean = D.lean;
      const bx = m.x + Math.cos(m.th) * shift * s, bz = m.z + Math.sin(m.th) * shift * s;
      const headL = add(add(add(HEAD, offT), [lean * 0.22 + ch[0], -D.drop * 0.5, ch[2]]), hd);
      const bodyM = { x: bx, z: bz, th: m.th };

      // Shoulders turn with the torso (and a shoulder roll lifts the lead one).
      const dy = -crouch;
      const sh = {};
      for (const h of ['lead', 'rear']) {
        sh[h] = add(rotY(SHOULDER[h], -yaw), [offT[0] * 0.6 + lean * 0.12 + ch[0] * 0.6, dy + offT[1] * 0.6 + (h === 'lead' && roll ? 0.04 * env : 0), offT[2] * 0.6]);
      }

      // Target: his head or body, live, in my local frame.
      let tgt = null;
      if (p) {
        const os = o.f.height / 1.78, head = P.tgt === 'head';
        const tw = head
          ? { x: o.x + Math.cos(o.th) * 0.04 * os, y: 1.64 * os, z: o.z + Math.sin(o.th) * 0.04 * os }
          : { x: o.x + Math.cos(o.th) * 0.02 * os, y: 1.2 * os, z: o.z + Math.sin(o.th) * 0.02 * os };
        tgt = local(bodyM, tw.x, tw.y, tw.z, s, side);
      }

      // Feints: the lead hand pokes out and back now and then (more for the busy hands).
      if (!R.feint && !p && env === 0 && D.rng.chance(D.feint * dt * R.act)) R.feint = { t: 0, dur: D.rng.range(0.14, 0.24), a: D.rng.range(0.05, 0.1) };
      let feintX = 0;
      if (R.feint) { R.feint.t += dt; const k = R.feint.t / R.feint.dur; feintX = R.feint.a * Math.sin(Math.PI * clamp(k, 0, 1)); if (k >= 1 || p) R.feint = null; }

      for (const h of ['lead', 'rear']) {
        const blk = d && d.kind === 'block' && !(m.f.guard === 'philly' && h === 'lead');
        const base = mix(g[h], BLOCK[h], blk ? env : d && d.kind === 'roll' ? env * 0.6 : 0);
        const ns = D.sway * life, sd = D.seed + (h === 'lead' ? 11 : 23);
        const sway = [0.012 * ns * noise(R.t * 0.7, sd), 0.012 * ns * noise(R.t * 0.6, sd + 1), 0.006 * ns * noise(R.t * 0.5, sd + 2)];
        let want = add(base, [offT[0] * 0.8 + sway[0] + (h === 'lead' ? feintX : 0) + lean * 0.1 + ch[0] * 0.6, offT[1] * 0.8 - crouch + sway[1], offT[2] * 0.8 + sway[2]]);
        want[1] -= fold * 0.4;
        if (hand === h && tgt) {
          const S = sh[h];
          // The glove stops on the surface (head or ribs); a block stops it on his gloves; out of reach
          // it goes to full length and no further.
          const toT = sub(tgt, S), dT = len(toT) || 1e-6;
          const stop = o.def && o.def.kind === 'block' && o.def.t >= 0 ? 0.24 : P.tgt === 'head' ? 0.15 : 0.19;
          const reach = Math.min(armL, dT - stop);
          const end = add(S, mul(toT, reach / dT));
          const from = R.from && pt.t < p.load + p.snap ? R.from : want;
          const k = Math.max(e, 0);
          if (P.fam === 'straight') {
            want = e < 0 ? add(from, [e * 0.4, 0, 0]) : mix(from, end, k);
          } else if (P.fam === 'hook') {
            // Out wide, then around into the side of him; elbow up.
            const out = h === 'lead' ? -1 : 1;
            const swing = Math.sin(Math.PI * Math.min(k, 1) * 0.85) * 0.26;
            const endH = add(end, [-0.06, 0, out * 0.07]);
            want = e < 0 ? add(from, [0, 0, -e * out * 0.5]) : add(mix(from, endH, k), [-swing * 0.4, 0.02, out * swing]);
          } else {
            // Upper: drop, then drive up from underneath.
            const drop = Math.sin(Math.PI * Math.min(k, 1) * 0.8) * 0.2;
            const endU = add(end, [-0.04, -0.06, 0]);
            want = e < 0 ? add(from, [0, e * 0.8, 0]) : add(mix(from, endU, k), [-drop * 0.3, -drop, 0]);
          }
          // Never longer than his arm.
          const fromS = sub(want, S), lw = len(fromS);
          if (lw > armL) want = add(S, mul(fromS, armL / lw));
          R.g[h] = want; // the punching glove isn't smoothed: the snap is the snap
        } else {
          const cur = R.g[h] || want;
          R.g[h] = mix(cur, want, 1 - Math.exp(-dt * 22));
        }
      }

      // ---- The body. Joints in world space, then a frame for every bone.
      const Pw = (l) => world(bodyM, l, s, side), Dw = (l) => wdir(m.th, l, side);
      const Bn = R.B.bones, I = R.B.I, UP = [0, 1, 0];
      // His +z side (the mesh's P side) is his real right: the rear for an orthodox, the lead for a southpaw.
      const sP = side > 0 ? 'rear' : 'lead', sN = side > 0 ? 'lead' : 'rear';

      // Chest: across the shoulders, tilted by lean, pull, fold and side bend.
      const tz = -fold * 1.2 - offT[0] * 0.8 - lean - ch[0] * 2, tx = offT[2] * 1.1 + ch[2] * 2;
      const SPw = Pw(sh[sP]), SNw = Pw(sh[sN]);
      const zC = norm(sub(SPw, SNw)), yC = norm(perp(Dw([-Math.sin(tz), Math.cos(tz), Math.sin(tx)]), zC)), xC = cross(yC, zC);
      const Cc = sub(mix(SPw, SNw, 0.5), mul(yC, (BIND.shY - BIND.chest) * s));
      const qC = quat(_qC, xC, yC, zC);
      setBone(Bn[I.chest], Cc, qC, s);

      // Pelvis: bladed a bit less than the shoulders, turning with the hips; leans a little with him.
      const ha = -0.3 + hipYaw;
      const zP = mul(Dw([Math.sin(ha), 0, Math.cos(ha)]), side);
      const yP = norm(perp(mix(UP, yC, 0.3), zP)), xP = cross(yP, zP);
      const Pp = Pw([offT[0] * 0.15 + ch[0] * 0.2, BIND.pelvis - crouch, offT[2] * 0.2]);
      const qP = quat(_qP, xP, yP, zP);
      setBone(Bn[I.pelvis], Pp, qP, s);
      // Spine: halfway, stretched to fit.
      const kS = (BIND.spine - BIND.pelvis) / (BIND.chest - BIND.pelvis);
      setBone(Bn[I.spine], mix(Pp, Cc, kS), _q2.copy(qP).slerp(qC, 0.5), s, s * clamp(len(sub(Cc, Pp)) / ((BIND.chest - BIND.pelvis) * s), 0.7, 1.4));

      // Head: faces his man, tips with the hits and with the neck.
      const H = Pw([headL[0] + fold * 0.6, headL[1] - fold * 0.4 - crouch, headL[2]]);
      const NB = add(Cc, mul(yC, (BIND.neckBase - BIND.chest) * s));
      const fH = norm(mix(Dw([1, 0, 0]), xC, 0.35));
      const yH = norm(add(add(mul(UP, 0.6), mul(norm(sub(H, NB)), 0.4)), Dw([hd[0] * 3, 0, hd[2] * 3])));
      const xH = norm(perp(fH, yH));
      setBone(Bn[I.head], H, quat(_q, xH, yH, cross(xH, yH)), s);
      const HB = sub(H, mul(yH, (BIND.head[1] - BIND.headBase) * s)), yN = norm(sub(HB, NB)), xN = norm(perp(fH, yN));
      setBone(Bn[I.neck], NB, quat(_q, xN, yN, cross(xN, yN)), s, s * clamp(len(sub(HB, NB)) / ((BIND.headBase - BIND.neckBase) * s), 0.6, 1.8));

      // Arms: shoulder -> elbow -> glove. The forearm and glove are one stiff piece.
      const L1 = armL * 0.48 * s, L2 = armL * 0.52 * s;
      for (const h of ['lead', 'rear']) {
        const isP = h === sP, gi = R.g[h], S = isP ? SPw : SNw, G = Pw(gi);
        const out = h === 'lead' ? -1 : 1, hookUp = hand === h && P.fam === 'hook' ? 0.9 : 0;
        const pole = Dw([-0.2, -1 + hookUp * 1.6, out * (0.8 + hookUp)]);
        const E = ik(S, G, L1, L2, pole);
        const d1 = norm(sub(E, S)), d2 = norm(sub(G, E));
        const f1 = norm(add(perp(d2, d1), mul(perp(mul(pole, -1), d1), 0.1)));
        const b = cross(d1, f1), f2 = cross(b, d2);
        limb(Bn[isP ? I.uaP : I.uaN], S, d1, f1, s);
        limb(Bn[isP ? I.faP : I.faN], E, d2, f2, s, s * Math.max(len(sub(G, E)) / L2, 1));
        // Glove along the forearm; the palm turns in and down, so the thumb sits where it should.
        const inward = isP ? mul(zC, -1) : zC;
        const palm = norm(perp(add(inward, [0, -0.8, 0]), d2)), gy = mul(palm, -1);
        const gm = R.B.gloves[isP ? 1 : 0];
        gm.position.set(G[0], G[1], G[2]); gm.quaternion.copy(quat(_q, d2, gy, cross(d2, gy))); gm.scale.setScalar(s);
      }

      // Feet: planted spots from feet(); the rear heel turns out on a rear-hand punch and the lead
      // foot turns in on a lead hook, both pivoting on the ball. Heels up by style, more as he hops.
      const F = R.ft;
      const piv = { lead: P && P.hand === 'lead' && P.fam === 'hook' ? -0.4 * Math.max(e, 0) : 0, rear: P && P.hand === 'rear' ? 0.7 * Math.max(e, 0) : 0 };
      const hop = D.hop * Math.max(shape - 0.5, 0) * 2 * life * D.bob * 1.5;
      const fw = [Math.cos(m.th), 0, Math.sin(m.th)], feetW = [];
      for (const h of ['lead', 'rear']) {
        const f = F[h], a = piv[h] * side, isP = h === sP;
        const ballX = f.x + Math.cos(f.yaw) * BALL * s, ballZ = f.z + Math.sin(f.yaw) * BALL * s;
        const yw = f.yaw + a;
        const heel = (h === 'rear' ? D.heel : D.heel * 0.4) + Math.abs(piv[h]) * 0.03 + hop * 0.5;
        const pitch = Math.asin(clamp(heel / (0.2 * s), 0, 0.6));
        const fx = ballX - Math.cos(yw) * BALL * s, fz = ballZ - Math.sin(yw) * BALL * s;
        const fc = [fx, 0.04 * s + f.y + hop + Math.sin(pitch) * BALL * s, fz];
        f.draw = [fx, 0.04 * s + f.y + hop, fz]; feetW.push(fc);
        _e.set(0, -yw, -pitch); _q.setFromEuler(_e);
        const ak = _v.set(ANKLE[0] * s, ANKLE[1] * s, ANKLE[2] * s).applyQuaternion(_q);
        const A = [fc[0] + ak.x, fc[1] + ak.y, fc[2] + ak.z];
        setBone(Bn[isP ? I.ftP : I.ftN], A, _q, s);
        // Leg: hip -> knee -> ankle, knee forward and a little out.
        const Hp = add(add(Pp, mul(zP, (isP ? 1 : -1) * BIND.hipZ * s)), mul(yP, (BIND.hipY - BIND.pelvis) * s));
        const outW = h === 'lead' ? -0.3 * side : 0.3 * side;
        const pole = [fw[0] - Math.sin(m.th) * outW, 0.1, fw[2] + Math.cos(m.th) * outW];
        const T1 = BIND.thigh * s, T2 = BIND.shin * s, K = ik(Hp, A, T1, T2, pole);
        const d1 = norm(sub(K, Hp)), d2 = norm(sub(A, K));
        const f1 = norm(add(mul(perp(d2, d1), -1), mul(perp(pole, d1), 0.1)));
        const b = cross(d1, f1), f2 = cross(b, d2);
        limb(Bn[isP ? I.thP : I.thN], Hp, d1, f1, s);
        limb(Bn[isP ? I.shP : I.shN], K, d2, f2, s, s * Math.max(len(sub(A, K)) / T2, 1));
      }
      R.probe = { hip: [bx, -crouch * s, bz], head: H, feet: feetW };
    });
    return state; // the glided positions, for the camera
  }
  return { update, onContact, rig: men };
}
