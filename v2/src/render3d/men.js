// Placeholder men (M1): simple shapes, drawn exactly where the engine says they are.
// Local frame: facing +x, y up, +z is his right. Guards set the glove spots (FOUNDATION section 7 brings real rigs).

// Glove spots for an orthodox man 1.78 m tall: [x forward, y up, z right]. Lead = left = -z.
const GUARD = {
  standard: { lead: [0.32, 1.42, -0.12], rear: [0.2, 1.45, 0.12], crouch: 0 },
  high:     { lead: [0.26, 1.55, -0.1], rear: [0.2, 1.56, 0.1], crouch: 0 },
  peekaboo: { lead: [0.24, 1.43, -0.08], rear: [0.22, 1.44, 0.08], crouch: 0.07 },
  philly:   { lead: [0.16, 1.02, -0.06], rear: [0.18, 1.5, 0.13], crouch: 0 },
  cross:    { lead: [0.27, 1.43, 0.06], rear: [0.29, 1.5, -0.05], crouch: 0.03 },
  handslow: { lead: [0.3, 1.08, -0.16], rear: [0.2, 1.22, 0.16], crouch: 0 },
};

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
    tmp.subVectors(b, a); const len = tmp.length();
    m.position.copy(a).addScaledVector(tmp, 0.5);
    m.quaternion.setFromUnitVectors(up, tmp.divideScalar(len || 1));
    m.scale.set(m.userData.r, len, m.userData.r);
  }

  const men = [0, 1].map((i) => {
    const body = new THREE.Group();
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.3, 4, 10), skin);
    torso.scale.set(0.85, 1, 1.15); torso.position.y = 1.24;
    const trunks = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.15, 0.24, 12), kit[i]);
    trunks.scale.set(0.9, 1, 1.2); trunks.position.y = 0.97;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 12), skin);
    head.scale.set(1.05, 1.15, 0.95);
    head.position.set(0.02, 1.64, 0);
    for (const m of [torso, trunks, head]) { m.castShadow = true; body.add(m); }
    scene.add(body);
    const glove = () => { const g = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 10), kit[i]); g.scale.set(1.25, 1, 1); g.castShadow = true; scene.add(g); return g; };
    const foot = () => { const f = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.08, 0.1), shoe); f.castShadow = true; scene.add(f); return f; };
    return {
      body, torso, head, gloves: [glove(), glove()], feet: [foot(), foot()],
      arms: [seg(skin, 0.045), seg(skin, 0.04), seg(skin, 0.045), seg(skin, 0.04)],
      legs: [seg(skin, 0.065), seg(skin, 0.05), seg(skin, 0.065), seg(skin, 0.05)],
    };
  });

  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  // Local [fwd, up, right] -> world, for a man at (x, z) facing th.
  function world(m, l, s) {
    const c = Math.cos(m.th), sn = Math.sin(m.th);
    const f = l[0] * s, r = l[2] * s;
    return V(m.x + c * f - sn * r, l[1] * s, m.z + sn * f + c * r);
  }

  // Draw one frame from engine state: [{x, z, th, feet, f:{guard, stance, height}}, ...]
  function update(state) {
    state.forEach((m, i) => {
      const R = men[i], g = GUARD[m.f.guard] || GUARD.standard;
      const s = m.f.height / 1.78, side = m.f.stance === 'southpaw' ? -1 : 1;
      const mir = (p) => [p[0], p[1] - g.crouch, p[2] * side];
      R.body.position.set(m.x, -g.crouch * s, m.z);
      R.body.rotation.y = -m.th;
      R.body.scale.setScalar(s);
      R.torso.rotation.y = -0.5 * side; // bladed: lead shoulder forward
      // Gloves and two-piece arms (shoulder -> elbow -> glove).
      const lead = world(m, mir(g.lead), s), rear = world(m, mir(g.rear), s);
      R.gloves[0].position.copy(lead); R.gloves[1].position.copy(rear);
      R.gloves[0].rotation.y = R.gloves[1].rotation.y = -m.th;
      const shL = world(m, mir([0.06, 1.42, -0.17]), s), shR = world(m, mir([-0.04, 1.42, 0.17]), s);
      const elL = world(m, mir([0.12, 1.2, -0.22]), s), elR = world(m, mir([0.04, 1.2, 0.22]), s);
      place(R.arms[0], shL, elL); place(R.arms[1], elL, lead);
      place(R.arms[2], shR, elR); place(R.arms[3], elR, rear);
      // Feet where the engine planted them; legs hip -> knee -> foot.
      const fl = V(m.feet.lead.x, 0.04, m.feet.lead.z), fr = V(m.feet.rear.x, 0.04, m.feet.rear.z);
      R.feet[0].position.copy(fl); R.feet[1].position.copy(fr);
      R.feet[0].rotation.y = -m.th + 0.3 * side; R.feet[1].rotation.y = -m.th + 0.9 * side;
      const hipL = world(m, mir([0.02, 0.9, -0.09]), s), hipR = world(m, mir([-0.02, 0.9, 0.09]), s);
      for (const [hip, ft, k] of [[hipL, fl, 0], [hipR, fr, 2]]) {
        const knee = tmp2.addVectors(hip, ft).multiplyScalar(0.5).clone();
        knee.x += Math.cos(m.th) * 0.07; knee.z += Math.sin(m.th) * 0.07; knee.y += 0.02 - g.crouch * 0.5;
        place(R.legs[k], hip, knee); place(R.legs[k + 1], knee, ft);
      }
    });
  }
  return { update };
}
