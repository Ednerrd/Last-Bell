/* ===== LAST BELL : render3d, the boxer =====
   One man in 3D, built in code (proto/PLAN.md "Code first, plug-and-play later"). Three layers:
   1. Body: one code-built mesh, skinned to a standard humanoid skeleton (Mixamo bone names, facing +Z, his left +X).
      The motion writes every bone's WORLD rotation as a delta from its bind pose, so any rigged model on that
      skeleton drops in: qModel = delta * qModelBind. One mesh + one outline = 2 draw calls a man.
   2. Motion: goals built in layers every frame: the guard (by guard, loose..tight on a tension dial) + rhythm (bounce,
      weight shift, by style) + life (head, shoulders, hands, breath) + the action on top (punch curves, defense,
      reactions on springs, clinch, knockdowns, the corner).
   3. Solve: spine FK, two-bone IK for arms and legs, planted feet.
   Render only: it reads the engine's snapshot and events, never writes to the fight. */

const B3 = {
  map: { k: .9, min: 25, clinch: 19 },   // engine distance -> 3D: d3 = d x k (a jab at its sweet spot, 72, lands ~95% straight)
  outline: .55,                           // cel outline width (world units)
  ten: { up: 14, down: 1.7 },             // tension dial: how fast he tightens up, how slow he lets go
  lunge: { jab: 13, other: 9 },           // a punch can carry him in this far when the man is out of reach
  pf: { out: .1, hit: .54, hold: .63, home: .88, whip: 1.5 }, // punch flow (share of the engine's punch): the hand leaves, lands, holds, is home; whip > 1 = fastest at the end
  step: { thr: 12, one: 7, anc: 4, look: .25, lead: 14, lag: .4, gap: .06, lift: 1.6, dur: [.13, .005, .11, .24] }, // feet: step-drag when the stance trails by thr (lone foot: one), aim ahead spd x look (max lead), the drag foot goes at lag of the first step, low skims
  stance: { L: 15, close: 3.5, low: 2 }  // half the stride front-back (pros stand long: proto/STANCE.md 7b), shorter by close when he's on top of his man, hips down by low
};

// ---------- small math ----------
const _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _m3 = new THREE.Matrix4(), _bx = new THREE.Vector3(), _by = new THREE.Vector3(), _bz = new THREE.Vector3();
// the rotation taking local +Y to `dir` and local +Z to `hint` (orthogonalized)
function basisQ(dir, hint, out) {
  _by.copy(dir).normalize(); _bz.copy(hint).addScaledVector(_by, -hint.dot(_by));
  if (_bz.lengthSq() < 1e-8) { _bz.set(0, 0, 1).addScaledVector(_by, -_by.z); if (_bz.lengthSq() < 1e-8) _bz.set(1, 0, 0); }
  _bz.normalize(); _bx.crossVectors(_by, _bz); _m3.makeBasis(_bx, _by, _bz); return (out || new THREE.Quaternion()).setFromRotationMatrix(_m3);
}
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const wrapA = a => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
// smooth noise: a few sines at odd rates (cheap, never repeats in a fight)
const nz = (t, s) => Math.sin(t * 1.03 + s) * .55 + Math.sin(t * 2.37 + s * 1.7) * .3 + Math.sin(t * 4.71 + s * 2.9) * .15;
const D2R = Math.PI / 180;
// a spring (vec3 or scalar): reactions ride on these, so a hit snaps in and wobbles out
class Spr {
  constructor(n) { this.x = new Float32Array(n); this.v = new Float32Array(n); }
  kick(i, dv) { this.v[i] += dv; }
  step(dt, k, z) { const c = 2 * Math.sqrt(k) * z; for (let i = 0; i < this.x.length; i++) { const a = -k * this.x[i] - c * this.v[i]; this.v[i] += a * dt; this.x[i] += this.v[i] * dt; } }
}

// ---------- the skeleton ----------
const BN = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head',
  'LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand', 'RightShoulder', 'RightArm', 'RightForeArm', 'RightHand',
  'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase', 'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase'];
const BI = {}; BN.forEach((n, i) => { BI[n] = i; });
const BPAR = { Spine: 'Hips', Spine1: 'Spine', Spine2: 'Spine1', Neck: 'Spine2', Head: 'Neck' };
for (const s of ['Left', 'Right']) Object.assign(BPAR, { [s + 'Shoulder']: 'Spine2', [s + 'Arm']: s + 'Shoulder', [s + 'ForeArm']: s + 'Arm', [s + 'Hand']: s + 'ForeArm', [s + 'UpLeg']: 'Hips', [s + 'Leg']: s + 'UpLeg', [s + 'Foot']: s + 'Leg', [s + 'ToeBase']: s + 'Foot' });
// sides: arm/leg bone sets, 0 = his left, 1 = his right
const ARM = [['LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand'], ['RightShoulder', 'RightArm', 'RightForeArm', 'RightHand']].map(a => a.map(n => BI[n]));
const LEG = [['LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase'], ['RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase']].map(a => a.map(n => BI[n]));

// the man's measurements: height 100 x hs, widths x G (build), arms x as (his reach). Bind pose: T-pose, feet on y = 0
function rigDims(hs, G, as) {
  const d = { hs, G, as };
  d.hipY = 52 * hs; d.sp = [6 * hs, 8 * hs, 8 * hs]; d.neckL = 10.5 * hs; d.headL = 4.5 * hs;
  d.clav = [2.2 * G, 7 * hs]; d.sh = [12.4 * G, 7.2 * hs];   // clavicle root and shoulder joint, off Spine2 (out, up)
  d.UA = 18 * hs * as; d.FA = 15 * hs * as; d.gl = 5.4; d.glR = 6.1; // wrist -> glove center, glove half length
  d.hipX = 6.8 * G; d.legTop = -2.5 * hs; d.TH = 23 * hs; d.SH = 22.5 * hs;
  d.ball = new THREE.Vector3(0, -2.9 * hs, 10.4 * hs); // ankle -> ball of the foot
  d.headC = new THREE.Vector3(0, 4.6 * hs, .9 * hs); d.headR = 7.6 * (.5 + .5 * hs);
  const y2 = d.hipY + d.sp[0] + d.sp[1] + d.sp[2];
  const P = {}, v = (x, y, z) => new THREE.Vector3(x, y, z);
  P.Hips = v(0, d.hipY, 0); P.Spine = v(0, d.hipY + d.sp[0], 0); P.Spine1 = v(0, d.hipY + d.sp[0] + d.sp[1], 0); P.Spine2 = v(0, y2, 0);
  P.Neck = v(0, y2 + d.neckL, 0); P.Head = v(0, y2 + d.neckL + d.headL, 0);
  for (const [s, x] of [['Left', 1], ['Right', -1]]) {
    P[s + 'Shoulder'] = v(x * d.clav[0], y2 + d.clav[1], 0); P[s + 'Arm'] = v(x * d.sh[0], y2 + d.sh[1], 0);
    P[s + 'ForeArm'] = v(x * (d.sh[0] + d.UA), y2 + d.sh[1], 0); P[s + 'Hand'] = v(x * (d.sh[0] + d.UA + d.FA), y2 + d.sh[1], 0);
    P[s + 'UpLeg'] = v(x * d.hipX, d.hipY + d.legTop, 0); P[s + 'Leg'] = v(x * d.hipX, d.hipY + d.legTop - d.TH, 0);
    P[s + 'Foot'] = v(x * d.hipX, d.hipY + d.legTop - d.TH - d.SH, 0); P[s + 'ToeBase'] = P[s + 'Foot'].clone().add(d.ball);
  }
  d.P = BN.map(n => P[n]);
  d.off = BN.map(n => BPAR[n] ? P[n].clone().sub(P[BPAR[n]]) : P[n].clone()); // local offsets (bind rotations are all identity)
  // each bone's axes in bind: +Y along the bone, +Z its front (knee, elbow bend, thumb, toe)
  const Z = v(0, 0, 1), Yp = v(0, 1, 0);
  d.bDir = BN.map(n => /Shoulder/.test(n) ? P[n.replace('Shoulder', 'Arm')].clone().sub(P[n]).normalize()
    : /Arm|Hand/.test(n) ? v(n[0] === 'L' ? 1 : -1, 0, 0) : /UpLeg|Leg$/.test(n) ? v(0, -1, 0) : /Foot/.test(n) ? d.ball.clone().normalize() : /Toe/.test(n) ? Z.clone() : Yp.clone());
  d.bHint = BN.map(n => /Foot|Toe/.test(n) ? Yp.clone() : Z.clone());
  d.invBind = BN.map((n, i) => basisQ(d.bDir[i], d.bHint[i]).invert());
  return d;
}

// ---------- the body: parts merged into one skinned mesh (vertex colors) + a cel outline ----------
const TOON = (() => { const c = new Uint8Array([90, 90, 90, 255, 168, 168, 168, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(c, 3, 1); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
function toonMat(extra) { return new THREE.MeshToonMaterial(Object.assign({ color: 0xffffff, gradientMap: TOON }, extra || {})); }
const OUTLINE_MAT = (() => {
  const m = new THREE.MeshBasicMaterial({ color: 0x140d09, side: THREE.BackSide });
  m.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n transformed += normal * ' + B3.outline.toFixed(3) + ';'); };
  return m;
})();
// a limb shape from y = 0 (top joint) down to y = -L: rounded caps, taper r0 -> r1, a muscle belly at `at`
function limbGeo(L, r0, r1, belly, at, wid) {
  const pts = [], cap = 5, N = 12;
  for (let i = 0; i <= cap; i++) { const a = -Math.PI / 2 + i / cap * Math.PI / 2; pts.push([Math.cos(a) * r0, Math.sin(a) * r0]); }
  for (let i = 1; i < N; i++) { const t = i / N; pts.push([r0 + (r1 - r0) * t + belly * Math.exp(-Math.pow((t - at) / (wid || .3), 2)), t * L]); }
  for (let i = 0; i <= cap; i++) { const a = i / cap * Math.PI / 2; pts.push([Math.cos(a) * r1, L + Math.sin(a) * r1]); }
  pts[0][0] = pts[pts.length - 1][0] = .01;
  return new THREE.LatheGeometry(pts.reverse().map(([r, y]) => new THREE.Vector2(r, -y)), 16); // bottom to top: normals out
}
// a tube of superellipse rings (torso, trunks): levels [y, halfWidth, frontDepth, backDepth]
function ringsGeo(levels, N, n) {
  const pos = [], idx = [], e = 2 / (n || 2.4), sg = (v, p) => Math.sign(v) * Math.pow(Math.abs(v), p);
  for (const [y, w, df, db] of levels) for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); pos.push(sg(c, e) * w, y, sg(s, e) * (s > 0 ? df : db)); }
  const L = levels.length;
  for (let j = 0; j < L - 1; j++) for (let i = 0; i < N; i++) { const a = j * N + i, b = j * N + (i + 1) % N, c = a + N, d = b + N; idx.push(a, c, b, b, c, d); }
  const bot = pos.length / 3; pos.push(0, levels[0][0] - 1.5, 0); const top = bot + 1; pos.push(0, levels[L - 1][0] + 1, 0);
  for (let i = 0; i < N; i++) { idx.push(bot, i, (i + 1) % N); idx.push(top, (L - 1) * N + (i + 1) % N, (L - 1) * N + i); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
const _lm = new THREE.Matrix4(), _lq = new THREE.Quaternion();
// matrix placing a limbGeo with its top at a, bottom at b, front toward `face`
function limbM(a, b, face) { basisQ(a.clone().sub(b), face, _lq); return new THREE.Matrix4().compose(a, _lq, new THREE.Vector3(1, 1, 1)); }
const TRS = (x, y, z, sx, sy, sz, rx, ry, rz) => new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx || 0, ry || 0, rz || 0)), new THREE.Vector3(sx, sy == null ? sx : sy, sz == null ? sx : sz));
// skin weights by height between bones (torso: hips -> spine -> chest)
function chainW(chain) { return p => { const y = p.y; if (y <= chain[0][1]) return [[chain[0][0], 1]]; for (let i = 0; i < chain.length - 1; i++) { const [b0, y0] = chain[i], [b1, y1] = chain[i + 1]; if (y <= y1) { const t = (y - y0) / (y1 - y0); return [[b0, 1 - t], [b1, t]]; } } return [[chain[chain.length - 1][0], 1]]; }; }
// a limb: its own bone, half the parent at the top joint, half the child at the bottom (soft elbows and knees)
function limbW(b, par, ch, L, ends) { const e = ends || .22; return p => { const t = -p.y / L, wp = par == null ? 0 : .5 * (1 - smooth(0, e, t)), wc = ch == null ? 0 : .5 * smooth(1 - e, 1.02, t); return [[b, 1 - wp - wc], [par, wp], [ch, wc]]; }; }

class BodyBuilder {
  constructor() { this.parts = []; }
  add(geo, m, col, wf, outline) { if (m) geo.applyMatrix4(m); this.parts.push({ geo, col: new THREE.Color(col), wf, outline: outline !== false, inv: m ? m.clone().invert() : null }); return this; }
  merge(onlyOutline) {
    const P = [], N = [], C = [], SI = [], SW = [], I = []; let base = 0; const lp = new THREE.Vector3();
    for (const pt of this.parts) {
      if (onlyOutline && !pt.outline) continue;
      const g = pt.geo.index ? pt.geo : pt.geo.toNonIndexed(); if (!g.attributes.normal) g.computeVertexNormals();
      const pa = g.attributes.position, na = g.attributes.normal, n = pa.count;
      for (let i = 0; i < n; i++) {
        P.push(pa.getX(i), pa.getY(i), pa.getZ(i)); N.push(na.getX(i), na.getY(i), na.getZ(i)); C.push(pt.col.r, pt.col.g, pt.col.b);
        lp.set(pa.getX(i), pa.getY(i), pa.getZ(i)); if (pt.inv) lp.applyMatrix4(pt.inv);
        const w = pt.wf(lp).filter(x => x[0] != null && x[1] > 1e-4).sort((a, b) => b[1] - a[1]).slice(0, 4); let s = 0; for (const x of w) s += x[1];
        for (let k = 0; k < 4; k++) { SI.push(w[k] ? w[k][0] : 0); SW.push(w[k] ? w[k][1] / s : 0); }
      }
      if (g.index) for (let i = 0; i < g.index.count; i++) I.push(g.index.getX(i) + base); else for (let i = 0; i < n; i++) I.push(i + base);
      base += n;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(SI, 4)); g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(SW, 4));
    g.setIndex(I); return g;
  }
}

// build the body for a kit: { skin, hair, hairCol, beard, trunks:{c,trim}, gloves:{c,trim}, boots:{c}, ref }
function buildBody(d, kit) {
  const B = new BodyBuilder(), { hs, G } = d, P = n => d.P[BI[n]], Z = new THREE.Vector3(0, 0, 1);
  const ref = !!kit.ref, skin = kit.skin, shirt = kit.shirt || '#e9e6df', pants = kit.pants || '#18181c';
  const top = ref ? shirt : skin, legC = ref ? pants : skin, trunk = ref ? pants : kit.trunks.c, trim = ref ? '#2a2420' : kit.trunks.trim || '#ddd';
  // torso: hips -> chest -> traps, twists along the spine
  const tw = chainW([[BI.Hips, P('Hips').y], [BI.Spine, P('Spine').y], [BI.Spine1, P('Spine1').y], [BI.Spine2, P('Spine2').y + 2], [BI.Neck, P('Neck').y + 4]]);
  const L = (y, w, df, db) => [y * hs, w * G, df * G, db * G];
  B.add(ringsGeo([L(44, 9.6, 6.4, 6.8), L(50, 11.2, 7.2, 7.6), L(56, 10.4, 6.6, 6.8), L(62, 10.7, 6.8, 6.6), L(68, 11.9, 7.5, 7), L(73, 13.2, 8.4, 7.3), L(77.5, 13.6, 8.4, 7.1), L(80.5, 12.2, 6.9, 6.5), L(82.6, 8.4, 4.9, 5.4), L(85, 4.9, 4.2, 4.3)], 22, 2.5), null, top, tw);
  if (!ref) for (const s of [-1, 1]) B.add(new THREE.SphereGeometry(1, 14, 10), TRS(s * 4.9 * G, 76.6 * hs, 6.5 * G, 5.3 * G, 3.5 * hs, 2.6 * G), skin, () => [[BI.Spine2, 1]]); // pecs
  if (ref) B.add(new THREE.SphereGeometry(1, 8, 6), TRS(0, 84 * hs, 4.6 * G, 2, 1.1, 1), '#0b0b0d', () => [[BI.Spine2, .6], [BI.Neck, .4]], false); // bow tie
  // trunks (the ref's belt line), waistband, leg sleeves
  const tk = (y, w, df, db) => [y * hs, w * G + 1, df * G + 1, db * G + 1.4];
  const hw = chainW([[BI.Hips, 54 * hs], [BI.Spine, 60 * hs]]);
  B.add(ringsGeo([tk(43, 10, 6.8, 7.2), tk(48, 11.4, 7.3, 8), tk(53, 11.2, 7.1, 7.6), tk(56.5, 10.6, 6.7, 7)], 24, 2.6), null, trunk, hw);
  B.add(ringsGeo([tk(56.3, 10.7, 6.8, 7.1), tk(58, 10.6, 6.8, 7), tk(59.6, 10.5, 6.7, 6.9)], 24, 2.6), null, trim, hw);
  for (const s of ['Left', 'Right']) {
    const x = s === 'Left' ? 1 : -1, a = P(s + 'UpLeg'), k = P(s + 'Leg'), an = P(s + 'Foot'), up = BI[s + 'UpLeg'], lg = BI[s + 'Leg'], ft = BI[s + 'Foot'], to = BI[s + 'ToeBase'];
    // legs: thigh, shin; trunks sleeve over the thigh (the ref: long pants)
    B.add(limbGeo(d.TH, 6.6 * G, 4.6 * G, 1 * G, .3, .35), limbM(a, k, Z), legC, limbW(up, BI.Hips, lg, d.TH));
    B.add(limbGeo(d.SH, 4.5 * G, 2.9 * G, 1.3 * G, .25, .25), limbM(k, an, Z), legC, limbW(lg, up, ft, d.SH));
    if (!ref) { const sl = a.clone().add(new THREE.Vector3(0, 3 * hs, 0)); B.add(limbGeo(12 * hs, 7.9 * G + .5, 7.1 * G + .6, 0, .5, .4), limbM(sl, sl.clone().add(new THREE.Vector3(.4 * x, -12 * hs, 0)), Z), trunk, limbW(up, BI.Hips, null, 12 * hs, .4)); }
    // boots: shaft, foot, sole (the ref: dress shoes)
    const bc = ref ? '#0a0a0a' : kit.boots.c;
    if (!ref) { const s0 = an.clone().add(new THREE.Vector3(0, 9 * hs, 0)); B.add(limbGeo(11 * hs, 4.4 * G, 4 * G, .2, .5, .4), limbM(s0, an.clone().add(new THREE.Vector3(0, -2 * hs, 0)), Z), bc, limbW(lg, null, ft, 11 * hs, .3)); }
    const fw = p => { const t = smooth(an.z + d.ball.z * .55, an.z + d.ball.z * 1.05, p.z); return [[ft, 1 - t], [to, t]]; };
    B.add(new THREE.SphereGeometry(1, 16, 10), TRS(an.x, 2.9 * hs, an.z + 3.4 * hs, 4 * G, 3.3 * hs, 8.4 * hs), bc, fw);
    B.add(new THREE.SphereGeometry(1, 14, 6), TRS(an.x, .9, an.z + 3.4 * hs, 4.2 * G, .95, 8.7 * hs), ref ? '#0a0a0a' : '#e8e2d6', fw);
  }
  // arms: delt, upper arm, forearm, glove (the ref: short sleeves, bare hands)
  for (const s of ['Left', 'Right']) {
    const x = s === 'Left' ? 1 : -1, sh = P(s + 'Arm'), el = P(s + 'ForeArm'), wr = P(s + 'Hand'), cl = BI[s + 'Shoulder'], ua = BI[s + 'Arm'], fa = BI[s + 'ForeArm'], hd = BI[s + 'Hand'];
    B.add(new THREE.SphereGeometry(1, 16, 12), TRS(sh.x - x * .9, sh.y + .4, 0, 4.7 * G, 4.1 * G, 5 * G), top, () => [[ua, .55], [cl, .45]]);
    B.add(limbGeo(d.UA, 4.2 * G, 3.5 * G, 1.1 * G, .45, .28), limbM(sh, el, Z), top, limbW(ua, cl, fa, d.UA));
    B.add(limbGeo(d.FA, 3.5 * G, 2.75 * G, 1 * G, .25, .3), limbM(el, wr, Z), skin, limbW(fa, ua, hd, d.FA));
    if (ref) { B.add(new THREE.SphereGeometry(1, 12, 8), TRS(wr.x + x * 2.6, wr.y, wr.z, 2.9, 2.2, 2.4), skin, () => [[hd, 1]]); continue; }
    const gc = kit.gloves.c, gt = kit.gloves.trim || '#eeeae2', gx = wr.x + x * d.gl;
    B.add(new THREE.SphereGeometry(1, 18, 14), TRS(gx, wr.y, 0, d.glR, 4.9, 5.4), gc, () => [[hd, 1]]); // the fist
    B.add(new THREE.CapsuleGeometry(1.75, 3.6, 4, 8), TRS(gx - x * 1, wr.y - 1.3, 4.4, 1, 1, 1, 0, 0, Math.PI / 2 * x - x * .35), gc, () => [[hd, 1]]); // thumb, on the front (+Z) like a T-pose
    B.add(new THREE.CylinderGeometry(4.1, 4.1, 5.5, 14), TRS(wr.x - x * .4, wr.y, 0, 1, 1, 1, 0, 0, Math.PI / 2), gc, () => [[hd, .8], [fa, .2]]); // cuff
    B.add(new THREE.CylinderGeometry(4.25, 4.25, 1.6, 14), TRS(wr.x - x * 2.6, wr.y, 0, 1, 1, 1, 0, 0, Math.PI / 2), gt, () => [[hd, .6], [fa, .4]], false);
  }
  // neck and head
  const nk = P('Neck'), hj = P('Head'), hc = hj.clone().add(d.headC), R = d.headR / 7.6;
  B.add(limbGeo(d.headL + 4 * hs, 4.6 * G, 4.3 * G, 0, .5, .3), limbM(hj.clone().add(new THREE.Vector3(0, 3 * hs, 0)), nk, Z), skin, p => { const t = -p.y / (d.headL + 4 * hs); return [[BI.Neck, .5 + .5 * Math.min(t, 1 - t) * 2], [BI.Head, .5 * (1 - smooth(.3, .7, t))], [BI.Spine2, .5 * smooth(.6, 1, t)]]; });
  const H = () => [[BI.Head, 1]], hd = (geo, x, y, z, sx, sy, sz, col, ol, rx, ry, rz) => B.add(geo, TRS(hc.x + x * R, hc.y + y * R, hc.z + z * R, sx * R, sy * R, sz * R, rx, ry, rz), col, H, ol);
  const sph = (n) => new THREE.SphereGeometry(1, n || 16, Math.max(6, (n || 16) * .7 | 0));
  hd(sph(26), 0, 0, 0, 6.5, 7.9, 7.4, skin);                       // skull
  hd(sph(18), 0, -4.3, 2.2, 5.9, 4.5, 6.2, skin);                  // jaw
  hd(sph(10), 0, -6.4, 4.8, 2.6, 1.9, 2, skin);                    // chin
  hd(sph(14), 0, 2.4, 5.9, 5.5, 1.5, 2, skin);                     // brow ridge
  hd(new THREE.CapsuleGeometry(1, 2.8, 4, 8), 0, .3, 7, 1, 1, 1, skin, true, -.3, 0, 0); // nose bridge
  hd(sph(10), 0, -1.5, 7.6, 1.6, 1.3, 1.4, skin);                  // nose
  for (const s of [-1, 1]) {
    hd(sph(10), s * 3.8, -1.6, 4.9, 2.2, 1.8, 1.6, skin);         // cheekbone
    hd(sph(10), s * 6.7, 0, -.3, .9, 1.9, 1.5, skin);             // ear
    hd(sph(8), s * 2.6, .8, 6.35, .62, .5, .4, '#1a100a', false);    // eye
    hd(new THREE.CapsuleGeometry(.5, 2.6, 3, 6), s * 2.8, 2.55, 6.85, 1, 1, 1, kit.hairCol, false, 0, 0, Math.PI / 2 + s * .14); // brow
  }
  hd(new THREE.CapsuleGeometry(.5, 2.6, 3, 6), 0, -4.4, 6.5, 1, 1, 1, '#5a2a22', false, 0, 0, Math.PI / 2); // mouth
  const hair = kit.hair, hcl = kit.hairCol;
  if (hair && hair !== 'bald') {
    const capG = (th) => new THREE.SphereGeometry(1, 22, 12, 0, Math.PI * 2, 0, th);
    if (hair === 'mohawk') { hd(capG(Math.PI * .36), 0, .4, -.2, 6.7, 8.1, 7.6, hcl, true, -.25); hd(sph(12), 0, 6.6, -.5, 1.6, 3, 7.4, hcl); }
    else if (hair === 'flat') { hd(capG(Math.PI * .45), 0, .3, -.3, 6.75, 8.2, 7.65, hcl, true, -.3); hd(new THREE.CylinderGeometry(5.8, 6.3, 3.4, 18), 0, 7.6, -.6, 1, 1, 1, hcl); }
    else if (hair === 'braids') { hd(capG(Math.PI * .5), 0, .2, -.3, 6.8, 8.15, 7.7, hcl, true, -.3); for (const x of [-3.6, -1.2, 1.2, 3.6]) hd(new THREE.CapsuleGeometry(.75, 11, 3, 6), x, 5.8 - Math.abs(x) * .45, -1.4, 1, 1, 1, hcl, false, Math.PI / 2 - .25); }
    else hd(capG(Math.PI * (hair === 'crop' ? .5 : .42)), 0, .25, -.3, 6.75, 8.15, 7.65, hcl, true, -.3); // buzz, crop
  } else if (ref) hd(new THREE.SphereGeometry(1, 22, 12, 0, Math.PI * 2, 0, Math.PI * .45), 0, .3, -.6, 6.7, 8.1, 7.6, '#8a8580', true, -.35);
  if (kit.beard) hd(new THREE.SphereGeometry(1, 18, 10, 0, Math.PI * 2, Math.PI * .45, Math.PI * .5), 0, -3.7, 2.5, 6.3, 5.4, 6.7, hcl);
  return B;
}

// ---------- per-guard spots: gloves off the head center, in his frame (f fwd, u up, l toward his lead side) ----------
const GUARD3D = {
  //            tight lead     tight rear       loose lead      loose rear      crouch blade lean tuck
  standard: { tL: [15, -5, 5], tR: [8, -8, -5], lL: [21, -15, 7.5], lR: [11, -17, -8], c: 4, bl: 34, lean: 7, tuck: .45 },
  high:     { tL: [9, -1, 6.5], tR: [8, -1, -6.5], lL: [14, -10, 7.5], lR: [11, -11, -8], c: 5, bl: 26, lean: 8, tuck: .9 },
  peekaboo: { tL: [9, -4.5, 4.6], tR: [9, -4.5, -4.6], lL: [13, -11, 6.5], lR: [12, -11, -6.5], c: 9, bl: 18, lean: 12, tuck: .95 },
  philly:   { tL: [9, -31, -1], tR: [8, -6, -6.5], lL: [12, -34, 3], lR: [10, -12, -7.5], c: 3, bl: 52, lean: 5, tuck: .5 },
  cross:    { tL: [10, -24, -8], tR: [8, -11, 8], lL: [12, -28, -5], lR: [10, -15, 5], c: 6, bl: 24, lean: 9, tuck: .85 },
  handslow: { tL: [17, -31, 8], tR: [8, -8, -6], lL: [19, -36, 9], lR: [10, -14, -8], c: 2, bl: 38, lean: 3, tuck: .2 }
};
// rhythm by style: bounce (amp, Hz), on his toes, weight shift (amp, Hz), bob-and-weave, head always moving
const RHY = {
  outboxer:     { b: 1.5, bf: 2.3, toe: .55, sw: 1.6, sf: 1.1, bob: 0, head: .5 },
  boxerpuncher: { b: 1, bf: 2.05, toe: .3, sw: 2, sf: .9, bob: .15, head: .6 },
  counter:      { b: .35, bf: 1.6, toe: .1, sw: 2.6, sf: .55, bob: .1, head: 1 },
  slugger:      { b: .3, bf: 1.5, toe: 0, sw: 1.6, sf: .7, bob: 0, head: .3 },
  swarmer:      { b: .7, bf: 2, toe: .2, sw: 1.4, sf: .9, bob: 1, head: .9 },
  awkward:      { b: 1.2, bf: 1.7, toe: .35, sw: 2.8, sf: .75, bob: .4, head: 1.2, odd: 1 }
};
const RHY_OF = { volume: 'swarmer', angle: 'outboxer', awkward: 'awkward', switch: 'boxerpuncher', body: 'swarmer', pboxer: 'slugger', spoiler: 'counter', jabgrab: 'outboxer', feinter: 'boxerpuncher' };

// ---------- the man ----------
class Boxer3 {
  // kit: see buildBody; size: { h: height scale, arm: reach scale, build }
  constructor(scene, kit, size, opts) {
    const o = opts || {};
    this.hs = (size.h || 1) * 1.02; this.G = Math.pow(size.build || 1, 1.5) * .95 + .05; this.as = size.arm || 1;
    const d = this.d = rigDims(this.hs, this.G, this.as);
    this.g = new THREE.Group(); scene.add(this.g);
    this.bones = BN.map(n => { const b = new THREE.Bone(); b.name = 'mixamorig' + n; return b; });
    BN.forEach((n, i) => { const b = this.bones[i]; b.position.copy(d.off[i]); if (BPAR[n]) this.bones[BI[BPAR[n]]].add(b); });
    this.g.add(this.bones[0]); this.g.updateMatrixWorld(true);
    this.skel = new THREE.Skeleton(this.bones);
    const B = buildBody(d, kit);
    this.mesh = new THREE.SkinnedMesh(B.merge(false), toonMat({ vertexColors: true }));
    this.mesh.castShadow = true; this.mesh.receiveShadow = true; this.mesh.frustumCulled = false;
    this.mesh.bind(this.skel); this.g.add(this.mesh);
    this.line = new THREE.SkinnedMesh(B.merge(true), OUTLINE_MAT); this.line.frustumCulled = false; this.line.bind(this.skel); this.g.add(this.line);
    this.gray = null; this.kit = kit;
    // pose state
    this.W = BN.map(() => new THREE.Quaternion()); this.J = BN.map(() => new THREE.Vector3()); // world rotation deltas, joint positions
    this.t = Math.random() * 20; this.seed = Math.random() * 100; this.heading = o.heading || 0;
    this.ten = .3; this.ph = { b: Math.random() * 6, s: Math.random() * 6, w: Math.random() * 6, pump: 0 };
    this.sp = { head: new Spr(3), hrot: new Spr(3), torso: new Spr(3), hip: new Spr(3), hand: [new Spr(3), new Spr(3)] }; // reactions
    this.ft = null; this.anc = null; this.pend = null; this.prev = null; this.sm = null; this.react = null; this.kd = null;
    this.col = null; // what the other man aims at and bumps into
  }
  setGray(on) { // the plain gray men (first look): flat gray, keep the outline
    if (on && !this.gray) { this.gray = this.mesh.material; this.mesh.material = toonMat({ color: 0x9a9690 }); }
    else if (!on && this.gray) { this.mesh.material.dispose(); this.mesh.material = this.gray; this.gray = null; }
  }
  dispose() { this.g.parent && this.g.parent.remove(this.g); this.mesh.geometry.dispose(); this.line.geometry.dispose(); this.mesh.material.dispose(); }

  // ---- events from the fight (render only) ----
  // took a shot: dir = attacker -> me (unit, flat), e = engine hit event
  impact(dir, e, P_) {
    const q = e.q || (e.blocked ? 'blocked' : 'clean'), qk = q === 'flush' ? 1.3 : q === 'clean' ? 1 : q === 'glancing' ? .45 : q === 'smothered' ? .35 : .22;
    const pow = clamp(.45 + (e.dmg || 0) / 6 + (e.crit ? .3 : 0), .4, 1.5) * qk, S = this.sp, side = this.side3(dir);
    this.react = { t: 0, kind: e.kind, zone: e.zone, pow, blocked: !!e.blocked, side, q };
    const ux = dir.x, uz = dir.z;
    if (e.blocked) { // the guard takes it: arms give, a little of it through to the head
      for (const h of S.hand) { h.kick(0, ux * 70 * pow); h.kick(2, uz * 70 * pow); }
      S.head.kick(0, ux * 22 * pow); S.head.kick(2, uz * 22 * pow); S.hip.kick(0, ux * 12 * pow); S.hip.kick(2, uz * 12 * pow);
      return;
    }
    if (e.zone === 'body') { S.torso.kick(0, 3.2 * pow); S.torso.kick(1, side * 1.4 * pow); S.hip.kick(1, -40 * pow); S.hip.kick(0, ux * 25 * pow); S.hip.kick(2, uz * 25 * pow); return; }
    if (e.kind === 'hook') { S.hrot.kick(0, side * 9 * pow); S.hrot.kick(2, side * 4 * pow); S.head.kick(0, ux * 50 * pow); S.head.kick(2, uz * 50 * pow); }
    else if (e.kind === 'upper') { S.hrot.kick(1, -8 * pow); S.head.kick(1, 45 * pow); S.head.kick(0, ux * 25 * pow); S.head.kick(2, uz * 25 * pow); }
    else { S.hrot.kick(1, -7 * pow); S.head.kick(0, ux * 75 * pow); S.head.kick(2, uz * 75 * pow); S.hrot.kick(0, side * 2 * pow); }
    S.torso.kick(0, -1.1 * pow); S.hip.kick(0, ux * 22 * pow); S.hip.kick(2, uz * 22 * pow);
    for (const h of S.hand) { h.kick(0, ux * 40 * pow); h.kick(2, uz * 40 * pow); h.kick(1, -20 * pow); } // a clean one knocks the guard loose
  }
  // my shot ended: landed (recoil through the shoulder) or missed (a power shot that finds air carries him)
  shotDone(landed, e, P_) {
    const S = this.sp, f = this.fwd || new THREE.Vector3(0, 0, 1);
    this.out = { t: this.aimT, res: e.blocked ? 'block' : landed ? 'land' : 'miss' };
    if (landed) { S.torso.kick(2, (P_ && P_.arm === 'rear' ? 1 : -1) * .8 * (this.south ? -1 : 1)); return; }
    if (!P_ || P_.cat === 'jab' || e.mt === 'short') return;
    S.hip.kick(0, f.x * 45); S.hip.kick(2, f.z * 45); S.torso.kick(0, 1.6);
  }
  side3(dir) { if (!this.fwd) return 1; const l = this.fwd.z * dir.x - this.fwd.x * dir.z; return l > 0 ? 1 : -1; } // pushed toward his left (+1) or right (-1): the way the head turns

  // ---- the frame: s = his engine snapshot (blended), X = { pos, op (Boxer3), os (his snap), phase, corner, style, winner, post } ----
  pose(s, X, dt) {
    const d = this.d, hs = this.hs, G = this.G; this.t += dt; const t = this.t;
    const gd = GUARD3D[s.guard] || GUARD3D.standard, rh = RHY[RHY_OF[X.style] || X.style] || RHY.boxerpuncher;
    const south = this.south = s.stance === 'southpaw', sg = south ? -1 : 1; // lead side sign: + = his left
    const live = s.state !== 'down' && s.state !== 'slump';
    const pos = X.pos.clone(); pos.y = 0;
    if (!this.prev) this.prev = pos.clone();
    const vel = pos.clone().sub(this.prev).multiplyScalar(1 / Math.max(dt, 1e-3)); this.prev.copy(pos);
    const spd = Math.hypot(vel.x, vel.z);
    // ---- facing: at his man, where he walks, or frozen on the floor
    const op = X.op, os = X.os || {}, opP = X.opPos || pos;
    let want = this.heading;
    if (s.sit) want = Math.atan2(-pos.x, -pos.z);
    else if (s.walk && spd > 12) want = Math.atan2(vel.x, vel.z);
    else if (live) want = Math.atan2(opP.x - pos.x, opP.z - pos.z);
    if (live || s.sit) this.heading += wrapA(want - this.heading) * (1 - Math.exp(-(s.walk ? 6 : 12) * dt));
    const H = this.heading, fwd = this.fwd = new THREE.Vector3(Math.sin(H), 0, Math.cos(H)), left = new THREE.Vector3(fwd.z, 0, -fwd.x), up = new THREE.Vector3(0, 1, 0);
    const lead = left.clone().multiplyScalar(sg);
    const BF = (f, u, l, base) => (base || pos).clone().addScaledVector(fwd, f).addScaledVector(up, u).addScaledVector(lead, l); // his frame
    const dOp = Math.hypot(opP.x - pos.x, opP.z - pos.z);
    // ---- the punch (if any)
    const P_ = s.aT && PUNCH[s.aT] ? PUNCH[s.aT] : null, p = s.aP || 0, feint = !!s.feint;
    // the kinetic chain: the hips fire first, the shoulders follow, the hand whips out last (fastest at the end: the snap),
    // lands at the engine's 60%, then the hand comes home fast and the body unwinds behind it
    let k = 0, kB = 0, kS = 0;
    if (P_) {
      const u = (p - B3.pf.out) / (B3.pf.hit - B3.pf.out), r = (p - B3.pf.hold) / (B3.pf.home - B3.pf.hold);
      k = p < B3.pf.out ? -.1 * Math.sin(Math.PI * p / B3.pf.out) : p < B3.pf.hit ? Math.pow(u, B3.pf.whip) : p < B3.pf.hold ? 1 : p < B3.pf.home ? Math.pow(1 - r, 2) : 0;
      const body = (a, b) => p < a ? 0 : p < b ? 1 - Math.pow(1 - (p - a) / (b - a), 2) : p < .62 ? 1 : 1 - ease((p - .62) / .38);
      kB = body(.02, .4); kS = body(.07, .5);
    }
    if (feint) { k *= .3; kB *= .3; kS *= .3; }
    const kp = Math.max(0, k), leadArm = P_ ? P_.arm === 'lead' : true, kind = P_ ? P_.kind : null;
    const hi = leadArm === !south ? 0 : 1; // which hand throws: 0 = his left
    const leadHand = south ? 1 : 0;
    // ---- tension dial: loose at range, tight when one's coming, he's close, hurt or just got hit
    let tw = .12 + .6 * smooth(78, 40, dOp);
    if (os.aT) tw = Math.max(tw, os.feint ? .75 : .55 + .45 * smooth(0, .45, os.aP || 0));
    if (s.def) tw = 1;
    if (s.hurt && !s.bluff) tw = Math.max(tw, .85);
    if ((s.hitT || 0) > .15) tw = Math.max(tw, .9);
    if (s.clamp) tw = Math.max(tw, .5 + .5 * s.clamp);
    if (s.bait) tw = Math.min(tw, .05);
    if (s.walk || s.sit) tw = 0;
    this.ten += (tw - this.ten) * (1 - Math.exp(-(tw > this.ten ? B3.ten.up : B3.ten.down) * dt));
    const ten = this.ten, tired = s.tired || 0, hurt = s.hurt && live ? (s.bluff ? .25 : 1) : 0;
    // ---- rhythm: bounce, weight shift, bob and weave (dies when he's gassed, breaks when he's hurt)
    const moving = clamp(spd / 40, 0, 1), life = 1 - .55 * tired;
    const bf = rh.bf * (1 - .35 * tired) * (rh.odd ? 1 + .25 * Math.sin(t * .7 + this.seed) : 1);
    this.ph.b += dt * Math.PI * 2 * bf; this.ph.s += dt * Math.PI * 2 * rh.sf * (1 - .3 * tired); this.ph.w += dt * Math.PI * 2 * .42;
    const bAmp = rh.b * (1 - .85 * tired) * (1 - hurt) * (1 - .35 * ten) * (P_ ? .3 : 1) * hs;
    const bounce = bAmp * (.5 + .5 * Math.sin(this.ph.b)), toe = rh.toe * (1 - tired) * (1 - hurt) * (.6 + .4 * Math.sin(this.ph.b));
    const swA = rh.sw * (1 - .4 * moving) * (P_ ? .3 : 1), shift = swA * Math.sin(this.ph.s), shiftL = swA * .45 * Math.sin(this.ph.s * .5 + 1);
    const bobA = (rh.bob + (s.guard === 'peekaboo' ? .6 : 0)) * (1 - tired * .7) * (P_ ? .2 : 1) * (s.def ? 0 : 1), weave = Math.sin(this.ph.w);
    // ---- the body's numbers: crouch, blade, lean, side bend, hips (all in his frame), each layer adds on
    let crouch = gd.c * .3 + 1.2 + B3.stance.low + 1.5 * ten + bobA * 2.2 * (.5 - .5 * Math.cos(this.ph.w * 2)) - bounce + tired * 1.5; // knees soft, not a squat
    let blade = gd.bl, hipBlade = gd.bl * .55, pitch = gd.lean * .55 + 2 * ten + tired * 3, roll = -sg * bobA * 7 * weave, hipF = shift * .8, hipL = shiftL + bobA * 3 * weave; // roll: + bends him to his right
    let headYaw = rh.head * 7 * nz(t * .6, this.seed) * life, headDown = 7 + 4 * ten + rh.head * 2.5 * nz(t * .5, this.seed + 3), headRoll = rh.head * 5 * nz(t * .45, this.seed + 7) * life;
    blade += 6 * nz(t * .55, this.seed + 11) * life + shift * 2.2; hipBlade += shift * 3; pitch += 2 * nz(t * .4, this.seed + 13);
    let clavLift = [0, 0], clavFwd = [0, 0];
    const breath = Math.sin(t * (1.6 + 1.6 * tired) * Math.PI) * (.3 + 1.1 * tired);
    clavLift[0] += breath * .5; clavLift[1] += breath * .5;
    let heel = [toe * .25, .1 + toe * .5], toeYaw = [.15, .8]; // heel lift (0..1) and toe turn (rad, + = out to his rear side) by foot: 0 lead, 1 rear
    let lunge = 0;
    if (hurt) { crouch += (2.5 + 2.5 * nz(t * 2.2, this.seed + 5)) * hurt; hipL += 3 * nz(t * 1.3, this.seed + 9) * hurt; headRoll += 6 * nz(t * 1.1, this.seed + 2) * hurt; headDown += 5 * hurt; }
    // the punch on the body: hips and shoulders turn into it, the back heel turns over, uppercuts drive up off a dip
    if (P_ && live) {
      const ld = p < .12 ? Math.sin(Math.PI * p / .12) * .5 : 0; // the load
      if (kind === 'straight' && leadArm) { blade += 8 * kS; pitch += 4 * kS; clavLift[hi] += 2.2 * kp; clavFwd[hi] += 2.5 * kp; heel[1] += .3 * kB; }
      else if (kind === 'straight') { blade -= 64 * kS; hipBlade -= 42 * kB; pitch += 6 * kS; hipF += 4 * kB; hipL += 2 * kB; heel[1] += 1.1 * kB; toeYaw[1] -= .8 * kB; clavFwd[hi] += 3 * kp; clavLift[hi] += 1.2 * kp; }
      else if (kind === 'hook' && leadArm) { blade += -12 * ld + 36 * kS; hipBlade += 24 * kB; heel[0] += .7 * kB; toeYaw[0] += .9 * kB; clavLift[hi] += 2.4 * kp; pitch += 2 * kS; }
      else if (kind === 'hook') { blade -= 74 * kS; hipBlade -= 46 * kB; heel[1] += 1.1 * kB; toeYaw[1] -= .9 * kB; clavLift[hi] += 1.8 * kp; pitch += 4 * kS; }
      else if (kind === 'upper') { crouch += 6 * ld * 2 - 3 * kp; pitch += 5 * ld - 4 * kp; if (leadArm) { blade += 14 * kS; roll -= sg * 8 * ld; } else { blade -= 44 * kS; hipBlade -= 30 * kB; heel[1] += .9 * kB; toeYaw[1] -= .6 * kB; } }
      if (P_.zone === 'body') { crouch += 6 * kp; pitch += 8 * kS; roll -= (leadArm ? 1 : -1) * sg * 7 * kp; }
      if (feint) { clavLift[hi] += 1.5; }
    }
    // defense: slips, rolls, ducks, pulls, blocks
    const defE = s.def ? clamp(s.defP || 0, 0, 1) * (1 - smooth(.75, 1, s.defU || 0)) : 0, du = clamp(s.defU || 0, 0, 1);
    if (s.def !== this.defWas) { this.defWas = s.def; this.defSide = this.slipSide(X) || (Math.random() < .5 ? 1 : -1); }
    const ds = this.defSide || 1; // + = toward his lead side
    if (s.def === 'slip') { roll -= ds * sg * 17 * defE; hipL += ds * 3.5 * defE; crouch += 3.5 * defE; pitch += 5 * defE; }
    else if (s.def === 'roll') { const u = Math.sin(Math.PI * du); crouch += (3 + 8 * u) * defE; roll -= ds * sg * Math.cos(Math.PI * du) * 14 * defE; hipL += ds * Math.cos(Math.PI * du) * 4 * defE; pitch += 8 * u * defE; if (s.guard === 'philly') { blade += 22 * defE; clavLift[leadHand] += 3 * defE; } }
    else if (s.def === 'duck') { crouch += 9 * defE; pitch += 18 * defE; }
    else if (s.def === 'pull') { hipF -= 5 * defE; pitch -= 18 * defE; heel[0] += .3 * defE; }
    else if (s.def === 'block' && s.defZ === 'body') { crouch += 4 * defE; pitch += 6 * defE; }
    // reactions (springs): a straight snaps the head back, a hook turns it, an uppercut lifts the chin, the body folds
    const S = this.sp; S.head.step(dt, 230, .42); S.hrot.step(dt, 190, .38); S.torso.step(dt, 120, .55); S.hip.step(dt, 90, .7); S.hand.forEach(h => h.step(dt, 260, .5));
    pitch += S.torso.x[0] * 45; roll -= S.torso.x[1] * 30; blade += S.torso.x[2] * 30; crouch -= S.hip.x[1];
    if (P_ && live) { hipF += (this.lgN || 0) * .6; pitch += (this.lgN || 0) * .5; }
    if (this.react) { this.react.t += dt; if (this.react.t > 1.6) this.react = null; }
    // ---- special states: clinch, knockdown, stool, walk
    const clinch = s.state === 'clinch' && live;
    if (clinch) { pitch += 18; crouch += 3; blade = 10; hipBlade = 6; }
    // knockdowns: buckle to a knee (body), sit, lie back; the get-up runs it backwards
    const dp = s.state === 'down' ? clamp(s.downP, 0, 1) : s.state === 'slump' ? clamp(s.downP, 0, .35) : 0;
    let wK = 0, wSit = 0, wLie = 0;
    if (dp > 0) {
      const kd = this.kd || {};
      if (kd.body && !s.rise) wK = outC(clamp(dp / .35, 0, 1));
      else if (!s.rise) { const a = clamp(dp / .35, 0, 1), b = clamp((dp - .35) / .65, 0, 1); wSit = outC(a) * (1 - b); wLie = b; }
      else if (kd.body) wK = ease(clamp(dp / .35, 0, 1));
      else if (dp > .6) { const u = (dp - .6) / .4; wLie = u; wSit = 1 - u; }
      else if (dp > .3) { const u = (dp - .3) / .3; wSit = u; wK = 1 - u; }
      else wK = ease(dp / .3);
    }
    const wSt = Math.max(0, 1 - wK - wSit - wLie), sit = this.sitW = damp(this.sitW || 0, s.sit ? 1 : 0, s.sit ? 3 : 7, dt);
    // ---- feet: planted until they're too far from where they belong, then a step
    const stanceW = 7.6 * G * (.85 + .15 * hs), stanceL = (B3.stance.L - B3.stance.close * smooth(45, 25, dOp)) * hs;
    if (P_ && live && this.lgN != null) lunge = this.lgN;
    let want0 = BF(stanceL + lunge * .9 + hipF * .2, 0, stanceW * .8), want1 = BF(-stanceL + lunge * .25, 0, -stanceW);
    if (s.walk) { want0 = BF(1, 0, 6.5); want1 = BF(-1, 0, -6.5); }
    if (X.ref) { want0 = BF(1.5, 0, 7.5); want1 = BF(-1.5, 0, -7.5); heel = [0, 0]; toeYaw = [-.25, .25]; } // the ref stands square
    if (clinch) { want0 = BF(8, 0, stanceW); want1 = BF(-12, 0, -stanceW); }
    if (P_ && P_.cat === 'jab' && kp > 0 && lunge < 2) want0.addScaledVector(fwd, 3 * kp);
    const ft = this.ft = this.ft || [want0, want1].map(f => ({ at: f.clone(), from: f.clone(), to: f.clone(), t: 1, dur: .15, yaw: 0 }));
    this.resetT = (this.resetT || 0) - dt;
    if (this.resetT <= 0 && !P_ && live && !s.walk && spd < 8) { this.resetT = 2 + Math.random() * 3 * (1 + rh.toe); this.nudge = [new THREE.Vector3((Math.random() - .5) * 4, 0, (Math.random() - .5) * 4), new THREE.Vector3((Math.random() - .5) * 4, 0, (Math.random() - .5) * 4)]; } // small resets: never planted long
    // step-drag (the boxer's step, never the pitter-patter): when his stance falls behind his body, the foot on the side he's
    // going steps first and the other follows the same distance, so the stance holds its width and the feet never cross.
    // Aimed where he'll be (the step leads the move), so steps come fewer and longer the faster he goes. A lone foot only
    // steps for a pivot (he turns), the jab's lead step, or a small reset.
    const st = B3.step, free = wSt > .9 && sit < .3, look = clamp(spd * st.look, 0, st.lead);
    const vl = spd > 4 ? vel.clone().multiplyScalar(1 / spd) : fwd; let lift = 0;
    const anc = this.anc = this.anc ? this.anc.lerp(pos, 1 - Math.exp(-st.anc * dt)) : pos.clone(), ancOff = anc.clone().sub(pos); // the feet follow his body smoothed: the jitter rides in the hips
    const aims = [want0, want1].map((w, i) => { const a = w.clone().add(ancOff); if (this.nudge && !s.walk) a.add(this.nudge[i]); if (spd > 4) a.addScaledVector(vl, look); a.y = 0; return a; });
    const go = (i, a, why) => { const f = ft[i], far = f.at.distanceTo(a); f.from.copy(f.at); f.to.copy(a); f.t = 0; f.dur = clamp(st.dur[0] + far * st.dur[1] - spd * .0008, st.dur[2], st.dur[3]); if (window.__feet) __feet.push({ i, far, spd, why }); };
    this.stepCd = (this.stepCd || 0) - dt;
    const planted = ft[0].t >= 1 && ft[1].t >= 1;
    if (this.pend && (!free || ft[1 - this.pend.i].t >= st.lag || ft[1 - this.pend.i].t >= 1)) { if (free && ft[this.pend.i].at.distanceTo(aims[this.pend.i]) > 1.5) go(this.pend.i, aims[this.pend.i], 'drag'); this.pend = null; }
    if (free && s.walk) { // walking: one foot after the other
      const i = ft[0].at.distanceTo(aims[0]) > ft[1].at.distanceTo(aims[1]) ? 0 : 1, o = ft[1 - i];
      if (ft[i].t >= 1 && o.t >= .6 && ft[i].at.distanceTo(aims[i]) > 8) go(i, aims[i], 'walk');
    } else if (free && planted && !this.pend && this.stepCd <= 0) {
      const eT = aims[0].clone().add(aims[1]).sub(ft[0].at).sub(ft[1].at).multiplyScalar(.5).setY(0);
      const thrT = P_ ? st.thr * .6 : st.thr;
      if (eT.length() > thrT) {
        const ef = eT.dot(fwd), el = eT.dot(lead), first = Math.abs(ef) >= Math.abs(el) ? (ef > 0 ? 0 : 1) : (el > 0 ? 0 : 1);
        go(first, aims[first], 'push'); this.pend = { i: 1 - first }; this.stepCd = st.gap;
      } else {
        const er = [0, 1].map(i => ft[i].at.clone().add(eT).distanceTo(aims[i])); // his stance's shape, not where it is: a pivot
        const thr1 = i => (P_ && i === 0 && (P_.cat === 'jab' || lunge > 2)) ? 2.5 : st.one;
        const i = er[0] - thr1(0) > er[1] - thr1(1) ? 0 : 1;
        if (er[i] > thr1(i)) { go(i, aims[i], P_ ? 'punch' : 'one'); this.stepCd = st.gap; }
      }
    }
    ft.forEach((f, i) => {
      if (f.t < 1) {
        f.to.lerp(aims[i], 1 - Math.exp(-6 * dt));
        f.t = Math.min(1, f.t + dt / f.dur); const e = ease(f.t); f.at.lerpVectors(f.from, f.to, e);
        f.at.y = Math.sin(Math.PI * f.t) * (s.walk ? 4 : st.lift) * clamp(f.from.distanceTo(f.to) / 10, .3, 1); lift = Math.max(lift, f.at.y);
      } else f.at.y = 0;
    });
    // ---- hips: between the feet, down by the crouch; the knockdown and the stool take over
    const mid = ft[0].at.clone().add(ft[1].at).multiplyScalar(.5); mid.y = 0;
    const base = pos.clone().lerp(mid, .4);
    let hip = BF(hipF - 1.5, d.hipY - crouch, hipL - .5, base); hip.y -= lift * .2;
    hip.x += S.hip.x[0]; hip.z += S.hip.x[2];
    if (clinch) hip.addScaledVector(fwd, -3);
    // angles (radians): hips and chest, his frame
    let hipYaw = -sg * hipBlade * D2R, hipPitch = (pitch * .25 - 4) * D2R, hipRoll = roll * .25 * D2R;
    let chYaw = -sg * blade * D2R, chPitch = pitch * D2R, chRoll = roll * D2R;
    let feet = [ft[0].at.clone(), ft[1].at.clone()], footYaw = [toeYaw[0], toeYaw[1]], kneeUp = [0, 0];
    let handsOver = null; // [left, right] world targets that replace the guard (down, stool, walk, clinch)
    if (dp > 0) {
      const lie = wSit + wLie > 0 ? wLie / (wSit + wLie) : 0, sl = wSit + wLie;
      const hipK = BF(-3, 30 * hs, 0), hipS = BF(-6 - 8 * lie, (10 - 3 * lie) * hs, 0);
      hip = hip.multiplyScalar(wSt).addScaledVector(hipK, wK).addScaledVector(hipS, sl);
      hipPitch = hipPitch * wSt + .1 * wK + (-.5 - 1.05 * lie) * sl; chPitch = chPitch * wSt + .5 * wK + (-.2 - 1.32 * lie) * sl;
      hipYaw *= wSt + wK; chYaw *= wSt + wK * .7; hipRoll *= wSt; chRoll *= wSt;
      const fK = [BF(13, 0, stanceW * .9), BF(-20, 4, -stanceW)], fS = [BF(26 + 2 * lie, 0, stanceW + 3), BF(24 + 2 * lie, 0, -stanceW - 3)];
      feet = [0, 1].map(i => feet[i].clone().multiplyScalar(wSt).addScaledVector(fK[i], wK).addScaledVector(fS[i], sl));
      heel = [heel[0] * wSt, heel[1] * wSt + 1.6 * wK]; kneeUp = [sl, sl];
      const gK = [BF(9, 31 * hs, stanceW + 2), BF(8, 40 * hs, -6)], gS = [BF(-14 - 8 * lie, 3, 13 + 12 * lie), BF(-14 - 8 * lie, 3, -13 - 12 * lie)];
      const kw = clamp(wK + sl, 0, 1);
      handsOver = { w: kw, p: [0, 1].map(i => { const j = i === leadHand ? 0 : 1; return gK[j].clone().multiplyScalar(wK / Math.max(kw, 1e-3)).addScaledVector(gS[j], sl / Math.max(kw, 1e-3)); }) };
      if (s.state === 'slump') headDown += 25 * dp;
    }
    if (sit > .01 && X.corner) {
      const seat = new THREE.Vector3(X.corner.x, 30 * hs, X.corner.z).addScaledVector(fwd, -2);
      hip.lerp(seat, sit); hipPitch = lerp(hipPitch, -.15, sit); chPitch = lerp(chPitch, -.12, sit); chYaw *= 1 - sit; hipYaw *= 1 - sit; chRoll *= 1 - sit;
      const fs = [seat.clone().addScaledVector(fwd, 22).addScaledVector(lead, 10), seat.clone().addScaledVector(fwd, 22).addScaledVector(lead, -10)];
      feet = feet.map((f, i) => f.lerp(fs[i].setY(0), sit)); heel = heel.map(h => h * (1 - sit)); footYaw = footYaw.map(y => y * (1 - sit)); kneeUp = kneeUp.map(k => Math.max(k, sit));
      if (sit > .5) { ft[0].at.copy(feet[0]).setY(0); ft[1].at.copy(feet[1]).setY(0); ft[0].t = ft[1].t = 1; }
      // arms out along the top ropes
      const cx = Math.sign(X.corner.x), cz = Math.sign(X.corner.z), post = new THREE.Vector3(cx * (RING + 18), 57, cz * (ZR + 18));
      const rA = post.clone().add(new THREE.Vector3(-cx * 27, 0, 0)), rB = post.clone().add(new THREE.Vector3(0, 0, -cz * 27));
      const lr = rA.clone().sub(seat).dot(left) > 0 ? [rA, rB] : [rB, rA];
      handsOver = { w: sit, p: lr };
      headDown = lerp(headDown, 2, sit);
    }
    if (X.hands) handsOver = { w: 1, p: X.hands };
    if (s.walk && sit < .3) { handsOver = { w: 1, p: null, hang: true }; chYaw *= .3; hipYaw *= .3; chPitch = 3 * D2R; hipPitch = -2 * D2R; heel = [0, 0]; footYaw = [0, 0]; }
    // ---- spine FK
    const qYaw = new THREE.Quaternion().setFromAxisAngle(up, H);
    const eul = (y, x, z) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z, 'YXZ'));
    const qHip = qYaw.clone().multiply(eul(hipYaw, hipPitch, hipRoll)), qCh = qYaw.clone().multiply(eul(chYaw, chPitch, chRoll));
    const W = this.W, J = this.J, off = d.off;
    W[BI.Hips].copy(qHip); J[BI.Hips].copy(hip);
    W[BI.Spine].copy(qHip).slerp(qCh, .3); W[BI.Spine1].copy(qHip).slerp(qCh, .65); W[BI.Spine2].copy(qCh);
    const fk = i => { const p = BI[BPAR[BN[i]]]; J[i].copy(off[i]).applyQuaternion(W[p]).add(J[p]); };
    fk(BI.Spine); fk(BI.Spine1); fk(BI.Spine2); fk(BI.Neck);
    // head: looks at his man (eyes up, chin down), plus life and the reaction springs
    const lookAt = X.look || (op && op.col ? op.col.head : BF(80, 90, 0));
    const toL = lookAt.clone().sub(J[BI.Neck]); const lYaw = Math.atan2(toL.x, toL.z) - H;
    const hYaw = (sit > .5 || dp > 0 || s.walk ? 0 : clamp(wrapA(lYaw), -.6, .6)) + (headYaw + S.hrot.x[0] * 60) * D2R, hPitch = (headDown + S.hrot.x[1] * 60) * D2R + (dp > 0 ? chPitch * .3 : 0), hRoll = (headRoll + S.hrot.x[2] * 60) * D2R + chRoll * .3;
    const qHead = qYaw.clone().multiply(eul(hYaw + (clinch ? sg * .5 : 0), hPitch + chPitch * .55, hRoll));
    W[BI.Neck].copy(qCh).slerp(qHead, .45); fk(BI.Head); W[BI.Head].copy(qHead);
    // the head itself rides the springs (snap back, then wobble home): the neck bends to carry it
    const hOff = new THREE.Vector3(S.head.x[0], S.head.x[1], S.head.x[2]);
    if (hOff.lengthSq() > 1e-4) { const a = J[BI.Head].clone().sub(J[BI.Neck]), b = a.clone().add(hOff); _q2.setFromUnitVectors(a.normalize(), b.normalize()); W[BI.Neck].premultiply(_q2); fk(BI.Head); }
    const headC = d.headC.clone().applyQuaternion(qHead).add(J[BI.Head]);
    // ---- shoulders (clavicles): shrug, reach
    for (let i = 0; i < 2; i++) {
      const [cl, ua] = ARM[i]; fk(cl);
      const want = d.off[ua].clone(); want.y += clavLift[i]; want.z += clavFwd[i];
      basisQ(want.clone().applyQuaternion(qCh), new THREE.Vector3(0, 0, 1).applyQuaternion(qCh), _q1); W[cl].copy(_q1).multiply(d.invBind[cl]);
      fk(ua);
    }
    // ---- gloves: the guard (off the head, loose..tight), life on top, then the punch, the defense, the overrides
    const gFrame = (a, base) => base.clone().addScaledVector(fwd, a[0]).addScaledVector(up, a[1]).addScaledVector(lead, a[2]);
    const hcN = headC.clone().sub(hOff); // the head without the hit: the guard doesn't chase the snap
    const sag = tired * 7 + (s.gi != null && s.gi < .5 ? (.5 - s.gi) * 16 : 0) + (s.bait ? 10 : 0);
    const spot = (tA, lA) => [0, 1, 2].map(j => lerp(lA[j], tA[j], ten));
    let gl = [null, null];
    for (const lr of [0, 1]) { // lr 0 = lead hand, 1 = rear hand
      const a = spot(lr ? gd.tR : gd.tL, lr ? gd.lR : gd.lL); a[1] -= sag * (1 - ten * .5) * (lr ? .8 : 1);
      if (!lr && s.post) { a[0] += 14 * s.post; a[1] += 4 * s.post; }   // the long guard: lead hand posted out
      const fl = (1 - ten * .7) * life, sd = this.seed + lr * 17;
      a[0] += 2.6 * nz(t * .9, sd) * fl; a[1] += 2.2 * nz(t * .8, sd + 4) * fl; a[2] += 1.8 * nz(t * .7, sd + 8) * fl;
      if (!lr && !P_ && ten < .6) { this.ph.pump += dt * (2.2 + nz(t * .3, sd)); a[0] += Math.max(0, Math.sin(this.ph.pump)) * 3.2 * (1 - ten / .6) * life; } // pawing the lead hand
      a[1] -= bounce * .35;
      const hand = lr ? 1 - leadHand : leadHand; gl[hand] = gFrame(a, hcN);
    }
    // blocks: gloves to the zone (head: up by the temples; body: elbows down on the ribs); the parry pats the jab aside
    if (s.def === 'block' && defE > 0) {
      const bz = s.defZ === 'body';
      const L0 = gFrame(bz ? [9, -25, 6] : [8, 1, 6.2], hcN), R0 = gFrame(bz ? [9, -24, -6] : [8, 1, -6.2], hcN);
      gl[leadHand].lerp(L0, defE); gl[1 - leadHand].lerp(R0, defE);
    }
    if (s.par) { gl[1 - leadHand].addScaledVector(lead, 7 * s.par).addScaledVector(fwd, 6 * s.par); }
    if (s.clamp && !(s.def === 'block')) { for (const h of [0, 1]) gl[h].addScaledVector(up, -8 * s.clamp); }
    // the punch: the glove travels from the guard to the spot on him, by kind
    if (P_ && live && !clinch) {
      if (this.aimT !== s.aT || p < (this.aimP || 0) - .05 || !this.aim) { this.aimT = s.aT; this.aim = this.spotOn(X, P_, hi); this.pv = Math.random(); this.lgN = 0; }
      this.aimP = p;
      const tgt = this.aim.clone().lerp(this.spotOn(X, P_, hi), .35);
      const from = gl[hi], sh = J[ARM[hi][1]], out = hi === 0 ? left.clone() : left.clone().negate();
      const dir = tgt.clone().sub(sh).normalize(), dirH = dir.clone().setY(0).normalize();
      const body = P_.zone === 'body', reach = (d.UA + d.FA) * .985 + d.gl;
      // out of reach: the punch carries him in (a step on the jab, a lean on the rest)
      const need = clamp(sh.clone().addScaledVector(fwd, -(this.lgN || 0) * .75).distanceTo(tgt) - reach - (kind === 'straight' ? 0 : -6), 0, P_.cat === 'jab' ? B3.lunge.jab : B3.lunge.other);
      if (p < .45) this.lgN = damp(this.lgN || 0, need, 12, dt);
      let gT;
      const arc = Math.sin(Math.PI * clamp(kp, 0, 1));
      if (kind === 'straight') { const over = !leadArm && !body && this.pv < .25; gT = from.clone().lerp(tgt, kp); if (over) gT.addScaledVector(up, arc * 7).addScaledVector(out, arc * 4); }
      else if (kind === 'hook') { gT = from.clone().lerp(tgt, kp); gT.addScaledVector(out, arc * (8 + this.pv * 9)).addScaledVector(dirH, -arc * 4); }
      else { gT = from.clone().lerp(tgt, kp); gT.addScaledVector(up, -arc * (8 + this.pv * 6)).addScaledVector(dirH, -arc * 3); }
      if (k < 0) gT = from.clone().addScaledVector(dirH, k * 20); // the load: a hair back first
      gl[hi] = gT;
    } else this.lgN = damp(this.lgN || 0, 0, 8, dt);
    // clinch: arms wrapped, head on his shoulder
    if (clinch && op && op.col) {
      const oc = op.col, to = oc.chest.clone().sub(J[BI.Spine2]).setY(0).normalize(), sd = new THREE.Vector3(to.z, 0, -to.x);
      gl[0] = oc.chest.clone().addScaledVector(to, 9).addScaledVector(sd, 11).addScaledVector(up, 2);
      gl[1] = oc.chest.clone().addScaledVector(to, 5).addScaledVector(sd, -12).addScaledVector(up, -12);
    }
    // reactions on the hands (a block knocks them back, a clean one knocks them loose)
    for (let i = 0; i < 2; i++) { const h = S.hand[i]; gl[i].x += h.x[0]; gl[i].y += h.x[1]; gl[i].z += h.x[2]; }
    if (handsOver) {
      for (let i = 0; i < 2; i++) {
        let w;
        if (handsOver.hang) { const sw = Math.sin(ft[i].t < 1 ? Math.PI * ft[i].t : 0) * 6 * (i === 0 ? 1 : -1); w = J[ARM[i][1]].clone().addScaledVector(up, -31 * hs).addScaledVector(left, i ? -3.5 : 3.5).addScaledVector(fwd, 4 + sw * clamp(spd / 40, 0, 1)); }
        else w = handsOver.p[i];
        gl[i].lerp(w, handsOver.w);
      }
    }
    // winner: hands up
    if (X.winner) { const w = clamp(X.winner, 0, 1); gl[0].lerp(J[ARM[0][1]].clone().addScaledVector(up, 34 * hs).addScaledVector(left, 8), w); gl[1].lerp(J[ARM[1][1]].clone().addScaledVector(up, 34 * hs).addScaledVector(left, -8), w); }
    // smooth the guard, not the punch
    const sm = this.sm = this.sm || { gl: gl.map(g => g.clone()) };
    for (let i = 0; i < 2; i++) { const r = P_ && i === hi ? 140 : handsOver && handsOver.w > .5 ? 10 : 8 + 14 * ten; sm.gl[i].lerp(gl[i], 1 - Math.exp(-r * dt)); }
    this.glT = sm.gl.map(g => g.clone());
    this.armPose = { P_, hi, kp, kind, leadArm, out: [left.clone(), left.clone().negate()], tuck: gd.tuck, walk: !!(handsOver && handsOver.hang), down: dp > 0 || sit > .3, clinch, fwd, up, left, qCh };
    this.solveArms(this.glT);
    // ---- legs: IK from the hips to the feet, knees over the toes
    for (let i = 0; i < 2; i++) {
      const [ul, lg, fo, to] = LEG[i], li = i === leadHand ? 0 : 1; // li: 0 lead foot, 1 rear foot
      fk(ul);
      const f = feet[li], hl = clamp(heel[li], 0, 1.4) * .62, outS = i === 0 ? left : left.clone().negate();
      const tdir = fwd.clone().applyAxisAngle(up, -sg * footYaw[li]); // toe direction, turned toward his rear side
      const v = tdir.clone().multiplyScalar(-d.ball.z * Math.cos(hl) - d.ball.y * Math.sin(hl)).addScaledVector(up, d.ball.z * Math.sin(hl) - d.ball.y * Math.cos(hl)); // ball -> ankle, heel up by hl
      const ballP = f.clone().addScaledVector(tdir, d.ball.z * .5).setY(f.y + 1.1 * hs), ank = ballP.clone().add(v);
      const pole = fwd.clone().multiplyScalar(1 - kneeUp[li]).addScaledVector(up, kneeUp[li] * 1.3).addScaledVector(outS, .12);
      const [kn, an] = ik2(J[ul], ank, d.TH, d.SH, pole);
      this.setLimb(ul, kn.clone().sub(J[ul]), kneeF(J[ul], kn, an, pole));
      fk(lg); this.setLimb(lg, an.clone().sub(kn), kneeF(J[ul], kn, an, pole));
      fk(fo); const fu = up.clone().multiplyScalar(Math.cos(hl)).addScaledVector(tdir, Math.sin(hl));
      basisQ(ballP.clone().sub(an), fu, _q1); W[fo].copy(_q1).multiply(d.invBind[fo]);
      fk(to); basisQ(tdir, up, _q1); W[to].copy(_q1).multiply(d.invBind[to]);
    }
    this.apply();
    // what the other man aims at and bumps into
    const chestC = J[BI.Spine2].clone().addScaledVector(new THREE.Vector3(0, 0, 1).applyQuaternion(qCh), 2.5 * G);
    const bellyC = J[BI.Spine].clone().addScaledVector(new THREE.Vector3(0, 0, 1).applyQuaternion(W[BI.Spine]), 2 * G);
    const glC = [0, 1].map(i => J[ARM[i][3]].clone().addScaledVector(this.handDir[i], d.gl));
    this.col = { head: headC, hr: d.headR, chest: chestC, belly: bellyC, hip: J[BI.Hips].clone(), tr: 10.5 * G, gl: glC, chin: headC.clone().addScaledVector(up, -4.5).addScaledVector(fwd, 4), fwd, left, lead, sg, qHead };
  }
  // the spot his glove goes for: chin/nose on straights, the jaw or temple on hooks, under the chin on uppercuts, ribs/liver/belly downstairs
  spotOn(X, P_, hi) {
    const oc = X.op && X.op.col; if (!oc) return X.opPos.clone().setY(85);
    const me = this.J[BI.Spine2], dir = oc.head.clone().sub(me).setY(0).normalize();
    const sideV = new THREE.Vector3(dir.z, 0, -dir.x); // to my left, looking at him
    const outS = hi === 0 ? sideV : sideV.clone().negate(); // the punching hand's side
    const up = new THREE.Vector3(0, 1, 0), R = oc.hr, GR = this.d.glR;
    if (P_.zone === 'body') {
      if (P_.kind === 'hook') return oc.belly.clone().addScaledVector(outS, oc.tr * .75).addScaledVector(dir, -oc.tr * .55).addScaledVector(up, 1).addScaledVector(dir, -GR * .6);
      return oc.belly.clone().addScaledVector(dir, -oc.tr * .7 - GR).addScaledVector(up, 3);
    }
    if (P_.kind === 'hook') return oc.head.clone().addScaledVector(outS, R * .85).addScaledVector(dir, -R * .3).addScaledVector(up, -1.5).addScaledVector(outS, GR * .6);
    if (P_.kind === 'upper') return oc.head.clone().addScaledVector(up, -R * .95 - GR * .7).addScaledVector(dir, -R * .45);
    return oc.head.clone().addScaledVector(dir, -R * .9 - GR).addScaledVector(up, -1.2);
  }
  // which side to slip: away from where his glove is coming in
  slipSide(X) {
    const op = X.op; if (!op || !op.glT || !X.os || !X.os.aT || !this.col) return 0;
    const P0 = PUNCH[X.os.aT]; if (!P0) return 0;
    const ohi = (P0.arm === 'lead') === (X.os.stance !== 'southpaw') ? 0 : 1, g = op.glT[ohi], lead = this.col.lead;
    return g.clone().sub(this.col.head).dot(lead) > 0 ? -1 : 1;
  }
  setLimb(i, dir, hint) { basisQ(dir, hint, _q1); this.W[i].copy(_q1).multiply(this.d.invBind[i]); }
  // arms: two-bone IK from the shoulders to the gloves, elbows where a boxer keeps them
  solveArms(gl) {
    const d = this.d, J = this.J, W = this.W, A = this.armPose, up = A.up, fwd = A.fwd;
    this.handDir = this.handDir || [new THREE.Vector3(), new THREE.Vector3()];
    for (let i = 0; i < 2; i++) {
      const [cl, ua, fa, hd] = ARM[i], S = J[ua], outS = A.out[i], punching = A.P_ && i === A.hi && A.kp > 0;
      let pole;
      if (punching && A.kind === 'hook') pole = outS.clone().addScaledVector(up, .7 * A.kp).addScaledVector(fwd, -.3);
      else if (punching && A.kind === 'upper') pole = up.clone().negate().addScaledVector(fwd, -.5);
      else if (A.walk || A.down) pole = fwd.clone().negate().addScaledVector(outS, .4).addScaledVector(up, -.3);
      else if (A.clinch) pole = outS.clone().addScaledVector(up, -.5);
      else pole = up.clone().negate().addScaledVector(outS, .15 + .4 * (1 - A.tuck)).addScaledVector(fwd, -.2);
      const gc = gl[i], toG = gc.clone().sub(S), Lg = toG.length() || 1, inw = outS.clone().negate();
      // which way the fist points: knuckles forward-up in the guard (a boxer's fist, not a cobra hood), down the line of the punch
      // as it goes (hooks come across, uppercuts up); hanging or on the floor it follows the arm
      let gdir = fwd.clone().multiplyScalar(.8).addScaledVector(up, .5).addScaledVector(inw, .2).normalize();
      if (punching) { const pd = A.kind === 'hook' ? toG.clone().normalize().addScaledVector(inw, .9) : A.kind === 'upper' ? up.clone().addScaledVector(fwd, .4) : toG.clone(); gdir.lerp(pd.normalize(), A.kp).normalize(); }
      if (A.walk || A.down || A.clinch) gdir = toG.clone().normalize();
      const wr0 = gc.clone().addScaledVector(gdir, -d.gl);
      const [el, wr] = ik2(S, wr0, d.UA, d.FA, pole);
      const bend = kneeF(S, el, wr, pole);
      this.setLimb(ua, el.clone().sub(S), bend.negate()); // the inside of the elbow is the arm's front
      J[fa].copy(el);
      // glove twist: thumb up in the guard and on hooks, turned over (palm down) on straights at the end, palm in on uppercuts
      const fdir = wr.clone().sub(el).normalize(), inward = outS.clone().negate();
      let thumb = up.clone().addScaledVector(inward, .3);
      if (punching && A.kind === 'straight') thumb.lerp(inward, A.kp);
      else if (punching && A.kind === 'upper') thumb = outS.clone().addScaledVector(fwd, -.3);
      if (A.walk || A.down) thumb = fwd.clone();
      this.setLimb(fa, fdir, thumb);
      J[hd].copy(wr);
      this.handDir[i].copy(gdir);
      this.setLimb(hd, gdir.clone().lerp(fdir, .15), thumb);
    }
  }
  // write the world deltas into the bones (local = parent^-1 x world)
  apply() {
    const W = this.W, b = this.bones;
    b[0].position.copy(this.J[0]); b[0].quaternion.copy(W[0]);
    for (let i = 1; i < BN.length; i++) { const p = BI[BPAR[BN[i]]]; b[i].quaternion.copy(W[p]).invert().multiply(W[i]); }
  }
  // after both men are posed: push gloves off where the other man is NOW, then redo the arms (anti-clip, glove in head ~0)
  settle(oc) {
    if (!oc || !this.armPose || this.armPose.down || this.armPose.clinch || !this.glT) return 0;
    const GR = this.d.glR * .8; let moved = 0;
    const push = (g, c, r) => { const v = g.clone().sub(c), L = v.length(); if (L < r) { g.addScaledVector(L > 1e-3 ? v.multiplyScalar(1 / L) : this.fwd.clone().negate(), r - L); return r - L; } return 0; };
    const pushCap = (g, a, b, r) => { const ab = b.clone().sub(a), t = clamp(g.clone().sub(a).dot(ab) / Math.max(1e-3, ab.lengthSq()), 0, 1); return push(g, a.clone().addScaledVector(ab, t), r); };
    for (let i = 0; i < 2; i++) {
      const g = this.glT[i];
      moved += pushCap(g, oc.hip, oc.chest, oc.tr + GR);
      moved += push(g, oc.head, oc.hr + GR);
      // the punching glove goes through his guard until the engine says it was blocked (what you see matches what it decided)
      const A = this.armPose, thrown = A.P_ && i === A.hi && A.kp > 0, res = this.out && this.out.t === this.aimT ? this.out.res : null;
      if (!thrown || res === 'block') for (const og of oc.gl) moved += push(g, og, GR * 2);
      if (thrown && res === 'miss') continue; // a miss: he's not there (slipped, pulled, ducked), let it fly
      moved += push(g, this.col.head, this.d.headR + GR * .85); // and off his own face
    }
    if (moved > 0) { this.solveArms(this.glT); this.apply(); this.col.gl = [0, 1].map(i => this.J[ARM[i][3]].clone().addScaledVector(this.handDir[i], this.d.gl)); }
    return moved;
  }
}
// two-bone IK: root S, target T, lengths a/b, pole hint -> [joint, end]
function ik2(S, T, a, b, pole) {
  const dv = T.clone().sub(S); let L = dv.length(); const dn = dv.multiplyScalar(1 / (L || 1));
  L = clamp(L, Math.abs(a - b) + .5, a + b - .02);
  const T2 = S.clone().addScaledVector(dn, L), x = (a * a + L * L - b * b) / (2 * L), h = Math.sqrt(Math.max(0, a * a - x * x));
  const pp = pole.clone().addScaledVector(dn, -pole.dot(dn)); if (pp.lengthSq() < 1e-6) pp.set(0, -1, 0); pp.normalize();
  return [S.clone().addScaledVector(dn, x).addScaledVector(pp, h), T2];
}
// which way a joint bends (the knee/elbow's front): off the line root->end toward the joint, or the pole when straight
function kneeF(S, K, A, pole) {
  const dn = A.clone().sub(S).normalize(), v = K.clone().sub(S); v.addScaledVector(dn, -v.dot(dn));
  if (v.lengthSq() > .04) return v.normalize();
  return pole.clone().addScaledVector(dn, -pole.dot(dn)).normalize();
}
