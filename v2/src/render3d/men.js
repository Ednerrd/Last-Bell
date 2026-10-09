// Placeholder men: simple shapes, drawn exactly where the engine says they are.
// M2 keyed poses, plus life between steps (bounce, weave, step dip): punches (straight / hook / upper paths to the live target), defense moves
// (block, slip, roll, pull), hit snaps, torso turn, two-bone arms. Render only: reads the state
// it's handed and the bus, never changes a result.
// Local frame: [forward, up, right] for a man 1.78 m tall, mirrored for southpaws (lead = -right).

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
// Life between the steps, so he's never frozen: bounce (Hz, amplitude) and a weave side to side, by style.
const LIFE = {
  outboxer: { hz: 2.3, bob: 0.016, weave: 0.012 },
  boxer:    { hz: 1.8, bob: 0.011, weave: 0.016 },
  pressure: { hz: 1.4, bob: 0.008, weave: 0.035 },
};

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (k) => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const rotY = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c]; };

// Punch progress 0 (guard) .. 1 (contact), with a small load back. Same curve the engine times.
function extOf(p) {
  if (p.t <= 0) return 0;
  if (p.t < p.load) return -0.12 * (p.t / p.load);
  if (p.t < p.load + p.snap) { const k = (p.t - p.load) / p.snap; return 1 - (1 - k) ** 3; }
  return 1 - smooth((p.t - p.load - p.snap) / p.ret);
}
// Defense envelope: in fast, hold, out.
function defEnv(d) {
  if (!d || d.t < 0) return 0;
  const k = d.t / d.dur;
  return k < 0.25 ? smooth(k / 0.25) : k > 0.7 ? 1 - smooth((k - 0.7) / 0.3) : 1;
}

export function makeMen(THREE, scene) {
  const skin = new THREE.MeshStandardMaterial({ color: 0xb98a6a, roughness: 0.7 });
  const shoe = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
  const kit = [0xb3201c, 0x1d4fb3].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55 }));
  const unitCyl = new THREE.CylinderGeometry(1, 1, 1, 10);
  const up = new THREE.Vector3(0, 1, 0), tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();

  function seg(mat, r) {
    const m = new THREE.Mesh(unitCyl, mat);
    m.userData.r = r; m.castShadow = true; scene.add(m);
    return m;
  }
  // Stretch a unit cylinder between two world points.
  function place(m, a, b) {
    tmp.subVectors(b, a); const l = tmp.length();
    m.position.copy(a).addScaledVector(tmp, 0.5);
    m.quaternion.setFromUnitVectors(up, tmp.divideScalar(l || 1));
    m.scale.set(m.userData.r, l, m.userData.r);
  }

  const men = [0, 1].map((i) => {
    const body = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.3, 4, 10), skin);
    torso.scale.set(0.85, 1, 1.15); torso.position.y = 1.24;
    const trunks = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.15, 0.24, 12), kit[i]);
    trunks.scale.set(0.9, 1, 1.2); trunks.position.y = 0.97;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 12), skin);
    head.scale.set(1.05, 1.15, 0.95);
    for (const m of [torso, trunks, head]) { m.castShadow = true; body.add(m); }
    scene.add(body);
    const glove = () => { const g = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), kit[i]); g.scale.set(1.25, 1, 1); g.castShadow = true; scene.add(g); return g; };
    const foot = () => { const f = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.08, 0.1), shoe); f.castShadow = true; scene.add(f); return f; };
    return {
      body, torso, head, gloves: [glove(), glove()], feet: [foot(), foot()],
      arms: [seg(skin, 0.045), seg(skin, 0.04), seg(skin, 0.045), seg(skin, 0.04)],
      legs: [seg(skin, 0.065), seg(skin, 0.05), seg(skin, 0.065), seg(skin, 0.05)],
      // Pose state (local, mirrored): smoothed gloves, the punch we last saw, hit snap.
      g: { lead: null, rear: null }, punch: null, from: null, hit: null, yaw: 0, dip: 0,
      ph: i * 2.1, busy: 1, sp: null,
    };
  });

  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  // Local [fwd, up, right] (mirrored by side) -> world, for a man at (x, z) facing th, scale s.
  function world(m, l, s, side) {
    const c = Math.cos(m.th), sn = Math.sin(m.th);
    const f = l[0] * s, r = l[2] * side * s;
    return V(m.x + c * f - sn * r, l[1] * s, m.z + sn * f + c * r);
  }
  // World (x, y, z) -> his local mirrored frame.
  function local(m, x, y, z, s, side) {
    const c = Math.cos(m.th), sn = Math.sin(m.th), dx = x - m.x, dz = z - m.z;
    return [(dx * c + dz * sn) / s, y / s, ((-dx * sn + dz * c) / s) * side];
  }

  // Two-bone arm: elbow from shoulder S and glove G, bent toward `pole`.
  function elbow(S, G, armL, pole) {
    const d = sub(G, S), dl = len(d) || 1e-6, half = armL / 2;
    const mid = mix(S, G, 0.5);
    const bend = Math.sqrt(Math.max(half * half - (dl / 2) * (dl / 2), 0));
    // Pole minus its part along the arm, normalized.
    const u = mul(d, 1 / dl), pd = pole[0] * u[0] + pole[1] * u[1] + pole[2] * u[2];
    let pv = sub(pole, mul(u, pd)); const pl = len(pv) || 1; pv = mul(pv, 1 / pl);
    return add(mid, mul(pv, bend));
  }

  // A landed shot snaps him: head (or torso, to the body) goes with the punch, then springs back.
  function onContact(e) {
    if (e.result !== 'land') return;
    const R = men[1 - e.corner];
    // Direction in HIS local frame: straights push back, hooks push across, uppers lift.
    // push: toward his left (-1) or right (+1), real sides; update() mirrors it for southpaws.
    const push = e.side === 'right' ? -1 : e.side === 'left' ? 1 : 0;
    const dir = e.kind.includes('upper') ? [-0.4, 0.8, 0] : push ? [-0.3, 0, push] : [-1, 0.1, 0];
    R.hit = { t: 0, dir, amp: HIT_AMP[e.q] || 0.05, body: e.region === 'body' };
  }

  // Draw one frame from engine state. dt: render seconds since last frame.
  // m.ta (<= 0): how far behind the last tick this frame sits, when main interpolates between ticks;
  // punch and defense clocks are read at that same moment so everything lines up.
  // The hips glide on a critically damped spring toward where the engine has him, so a quick
  // engine step reads as a weight shift, not a hop. Feet stay exactly where the engine plants them.
  const GLIDE = 26;
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

  function update(raw, dt = 1 / 60) {
    const state = raw.map((m, i) => { const S = glide(men[i], m, dt); return { ...m, x: S.x, z: S.z }; });
    state.forEach((m, i) => {
      const R = men[i], o = state[1 - i], g = GUARD[m.f.guard] || GUARD.standard;
      const s = m.f.height / 1.78, side = m.f.stance === 'southpaw' ? -1 : 1;
      const armL = m.f.arm / s;                                    // shoulder to glove, local units
      const ta = m.ta || 0;
      const p = m.punch, P = p && p.P;
      const pt = p && { ...p, t: p.t + ta };                       // the punch as of this frame
      const d = m.def && { ...m.def, t: m.def.t + ta }, env = defEnv(d);

      // --- Life: bounce on the toes, a weave, a dip mid-step. Calms down while he punches or defends.
      const L = LIFE[m.f.style] || LIFE.boxer;
      R.busy += ((p || env > 0 ? 0.25 : 1) - R.busy) * (1 - Math.exp(-dt * 8));
      R.ph += dt * Math.PI * 2 * L.hz;
      let bob = L.bob * Math.sin(R.ph) * R.busy;
      const weave = L.weave * Math.sin(R.ph * 0.37) * R.busy;
      if (m.step) {
        const k = clamp((m.step.t + ta) / m.step.dur, 0, 1);
        bob -= 0.022 * Math.sin(Math.PI * k);                     // sink into the step, rise out of it
      }
      const crouch = g.crouch - bob;

      // --- Punch: which hand, how far along, torso turn behind it.
      let e = 0, hand = null;
      if (p) {
        if (p !== R.punch) { R.punch = p; R.from = R.g[P.hand] ? R.g[P.hand].slice() : null; }
        e = extOf(pt); hand = P.hand;
      } else R.punch = null;
      const turn = p ? (P.hand === 'rear' ? 0.55 : P.fam === 'hook' ? -0.3 : 0.12) * Math.max(e, 0) : 0;
      R.yaw += (turn - R.yaw) * (1 - Math.exp(-dt * 30));
      const bodyDip = p && P.tgt === 'body' ? 0.1 * Math.max(e, 0) : 0;

      // --- Defense: head/torso offset (local, mirrored) and where the gloves go.
      let off = [0, 0, weave];
      if (d && env > 0) {
        const lat = d.side === 'lead' ? 1 : -1;                    // away from the hand that's coming
        if (d.kind === 'slip') off = [0.03, -0.07, 0.15 * lat];
        else if (d.kind === 'roll') off = [0.06, -0.22, 0.1 * lat * Math.sin(Math.PI * clamp(d.t / d.dur, 0, 1))];
        else if (d.kind === 'pull') off = [-0.13, 0.01, 0];
        else if (d.kind === 'block') off = [-0.02, -0.03, 0];
        off = add(mul(off, env), [0, 0, weave]);
      }
      // --- Hit snap (render time), springs back over ~.3 s.
      let snap = [0, 0, 0], bodySnap = 0;
      if (R.hit) {
        R.hit.t += dt;
        const k = R.hit.t, a = k < 0.06 ? k / 0.06 : Math.exp(-(k - 0.06) * 9);
        if (R.hit.body) bodySnap = R.hit.amp * a; else { snap = mul(R.hit.dir, R.hit.amp * a); snap[2] *= side; }
        if (k > 0.6) R.hit = null;
      }
      R.dip += (bodyDip + bodySnap * 0.6 - R.dip) * (1 - Math.exp(-dt * 25));

      // Body group: position, facing, crouch; torso turns and leans with the defense.
      R.body.position.set(m.x, -(crouch + R.dip * 0.5) * s, m.z);
      R.body.rotation.y = -m.th;
      R.body.scale.setScalar(s);
      R.torso.rotation.y = (-0.5 + R.yaw) * side;
      R.torso.position.set(off[0] * 0.5, 1.24 + off[1] * 0.6, off[2] * side * 0.5);
      R.torso.rotation.z = -R.dip * 1.2 - off[0] * 0.8;              // lean back on a pull, fold on a body shot
      const headL = add(add(HEAD, off), snap);
      R.head.position.set(headL[0] + R.dip * 0.6, headL[1] - crouch * 0 - R.dip * 0.4, headL[2] * side);

      // Shoulders turn with the torso.
      const dy = -(crouch + R.dip * 0.5);
      const sh = {
        lead: add(rotY(SHOULDER.lead, -R.yaw), [off[0] * 0.6, dy + off[1] * 0.6, off[2] * 0.6]),
        rear: add(rotY(SHOULDER.rear, -R.yaw), [off[0] * 0.6, dy + off[1] * 0.6, off[2] * 0.6]),
      };

      // Target: his head or body, live, in my local frame.
      let tgt = null;
      if (p) {
        const os = o.f.height / 1.78, head = P.tgt === 'head';
        const tw = head
          ? { x: o.x + Math.cos(o.th) * 0.04 * os, y: 1.64 * os, z: o.z + Math.sin(o.th) * 0.04 * os }
          : { x: o.x + Math.cos(o.th) * 0.02 * os, y: 1.2 * os, z: o.z + Math.sin(o.th) * 0.02 * os };
        tgt = local(m, tw.x, tw.y, tw.z, s, side);
      }

      for (const h of ['lead', 'rear']) {
        const base = mix(g[h], BLOCK[h], d && d.kind === 'block' ? env : d && d.kind === 'roll' ? env * 0.6 : 0);
        const sway = h === 'lead' ? [0.008 * Math.cos(R.ph * 0.5), 0.01 * Math.sin(R.ph * 0.5), 0] : [0.006 * Math.sin(R.ph * 0.45), 0.008 * Math.cos(R.ph * 0.45), 0];
        let want = add(base, [off[0] * 0.8 + sway[0] * R.busy, off[1] * 0.8 - crouch + sway[1] * R.busy, off[2] * 0.8]);
        want[1] -= R.dip * 0.4;
        if (hand === h && tgt) {
          const S = sh[h];
          // The glove stops on the surface (head or ribs); a block stops it on his gloves; out of reach
          // it goes to full length and no further.
          const toT = sub(tgt, S), dT = len(toT) || 1e-6;
          const stop = o.def && o.def.kind === 'block' && o.def.t >= 0 ? 0.24 : P.tgt === 'head' ? 0.15 : 0.19;
          const reach = Math.min(armL, dT - stop);
          const end = add(S, mul(toT, reach / dT));
          const from = R.from && pt.t < p.load + p.snap ? R.from : want;
          const k = clamp(e, 0, 1);
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
          R.g[h] = want; // the punching glove isn't smoothed: the snap is the snap
        } else {
          const cur = R.g[h] || want;
          R.g[h] = mix(cur, want, 1 - Math.exp(-dt * 22));
        }
      }

      // Gloves, arms (two-bone), legs.
      const gl = R.g.lead, gr = R.g.rear;
      R.gloves[0].position.copy(world(m, gl, s, side)); R.gloves[1].position.copy(world(m, gr, s, side));
      R.gloves[0].rotation.y = R.gloves[1].rotation.y = -m.th;
      for (const [h, gi, ai] of [['lead', gl, 0], ['rear', gr, 2]]) {
        const out = h === 'lead' ? -1 : 1, hookUp = hand === h && P.fam === 'hook' ? 0.9 : 0;
        const E = elbow(sh[h], gi, armL * 0.98, [-0.2, -1 + hookUp * 1.6, out * (0.8 + hookUp)]);
        place(R.arms[ai], world(m, sh[h], s, side), world(m, E, s, side));
        place(R.arms[ai + 1], world(m, E, s, side), world(m, gi, s, side));
      }
      const fl = V(m.feet.lead.x, 0.04, m.feet.lead.z), fr = V(m.feet.rear.x, 0.04, m.feet.rear.z);
      R.feet[0].position.copy(fl); R.feet[1].position.copy(fr);
      R.feet[0].rotation.y = -m.th + 0.3 * side; R.feet[1].rotation.y = -m.th + (0.9 - R.yaw * 0.6) * side;
      const hy = 0.9 - crouch - R.dip * 0.5;
      const hipL = world(m, [0.02, hy, -0.09], s, side), hipR = world(m, [-0.02, hy, 0.09], s, side);
      for (const [hip, ft, k] of [[hipL, fl, 0], [hipR, fr, 2]]) {
        const knee = tmp2.addVectors(hip, ft).multiplyScalar(0.5).clone();
        knee.x += Math.cos(m.th) * 0.07; knee.z += Math.sin(m.th) * 0.07; knee.y += 0.02 - (crouch + R.dip) * 0.5;
        place(R.legs[k], hip, knee); place(R.legs[k + 1], knee, ft);
      }
    });
    return state; // the glided positions, for the camera
  }
  return { update, onContact };
}
