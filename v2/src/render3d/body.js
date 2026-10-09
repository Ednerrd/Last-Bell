// Fighter bodies (render only). One smooth skinned body per man, built in code: no model files,
// nothing to download. Torso and limbs are lofted cross-sections with the muscles sculpted in
// (pecs, lats, delts, biceps, quads, calves), the head is a shaped sphere (jaw, brow, nose, ears).
// It all rides a 15-bone skeleton that men.js poses from the joints it already works out.
// Bind pose: a man 1.78 m tall facing +x, y up, z to his right, arms hanging a little out.
// men.js gives it world frames per bone; nothing here reads the engine.

export const BONES = ['pelvis', 'spine', 'chest', 'neck', 'head', 'uaN', 'faN', 'uaP', 'faP', 'thN', 'shN', 'ftN', 'thP', 'shP', 'ftP'];
const I = Object.fromEntries(BONES.map((b, i) => [b, i]));

// Bind joints (s = 1). N = the man's -z side, P = +z. Legs: thigh + shin = LEG.
export const BIND = { pelvis: 0.96, spine: 1.1, chest: 1.25, neckBase: 1.46, head: [0.02, 1.64, 0], headBase: 1.56, sh: 0.177, shY: 1.42, hipY: 0.9, hipZ: 0.095, thigh: 0.44, shin: 0.42, armOut: 0.21 };
export const ANKLE = [-0.06, 0.045, 0];   // ankle from the foot's center (foot frame)
export const GLOVE_BACK = 0.075;          // glove center to wrist

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (k) => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };
const gs = (x, c, w) => Math.exp(-(((x - c) / w) ** 2));
const pe = (v, n) => Math.sign(v) * Math.abs(v) ** (2 / n);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
// Smooth table lookup: rows [x, ...values], Catmull-Rom between rows.
function table(rows) {
  return (x) => {
    let i = 0;
    while (i < rows.length - 2 && x > rows[i + 1][0]) i++;
    const a = rows[Math.max(i - 1, 0)], b = rows[i], c = rows[i + 1], d = rows[Math.min(i + 2, rows.length - 1)];
    const k = clamp((x - b[0]) / (c[0] - b[0]), 0, 1), k2 = k * k, k3 = k2 * k;
    return b.map((_, j) => (j === 0 ? x : 0.5 * (2 * b[j] + (-a[j] + c[j]) * k + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * k2 + (-a[j] + 3 * b[j] - 3 * c[j] + d[j]) * k3)));
  };
}

// Torso: y, half width, front depth, back depth, center x.
const TORSO = table([
  [0.83, 0.115, 0.075, 0.08, 0],
  [0.87, 0.148, 0.098, 0.112, -0.004],
  [0.93, 0.163, 0.105, 0.12, -0.008],
  [1.0, 0.152, 0.1, 0.1, 0],
  [1.06, 0.138, 0.098, 0.088, 0.006],
  [1.13, 0.142, 0.104, 0.09, 0.008],
  [1.2, 0.155, 0.112, 0.098, 0.006],
  [1.27, 0.17, 0.118, 0.106, 0.002],
  [1.33, 0.178, 0.12, 0.108, 0],
  [1.39, 0.176, 0.108, 0.104, -0.004],
  [1.44, 0.15, 0.084, 0.094, -0.01],
  [1.48, 0.1, 0.066, 0.072, -0.012],
  [1.51, 0.066, 0.056, 0.06, -0.012],
]);

// ---- Geometry builder: positions, colors, skin indices/weights, triangles per material group.
function Geo() { return { p: [], c: [], si: [], sw: [], ix: {} }; }
function vert(G, p, w, col) {
  const q = w.filter((e) => e[1] > 1e-4).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const t = q.reduce((a, e) => a + e[1], 0) || 1;
  G.p.push(p[0], p[1], p[2]); G.c.push(...(col || [1, 1, 1]));
  for (let k = 0; k < 4; k++) { G.si.push(q[k] ? q[k][0] : 0); G.sw.push(q[k] ? q[k][1] / t : 0); }
  return G.p.length / 3 - 1;
}
function tri(G, g, a, b, c) { (G.ix[g] || (G.ix[g] = [])).push(a, b, c); }

// A tube along `axis` from `o`. shape(t, a) -> [u, v]: offset along `front` and `side` at station t,
// angle a (0 = front, pi/2 = side). Ends close to a rounded point unless `open`.
function loft(G, o, { axis, len, front, side, t0, t1, n, m, shape, wt, grp, col, open, round = 0.45 }) {
  const rings = [], at = (t, uv) => [0, 1, 2].map((k) => o[k] + axis[k] * t * len + front[k] * uv[0] + side[k] * uv[1]);
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n, r = [];
    for (let j = 0; j < m; j++) {
      const a = (j / m) * Math.PI * 2, p = at(t, shape(t, a));
      r.push(vert(G, p, wt(p, t, a), col && col(p, t, a)));
    }
    rings.push(r);
  }
  const flip = dot(cross(front, side), axis) < 0;
  const T = (g, a, b, c) => (flip ? tri(G, g, a, c, b) : tri(G, g, a, b, c));
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const a = rings[i][j], b = rings[i][(j + 1) % m], c = rings[i + 1][j], d = rings[i + 1][(j + 1) % m];
    const g = grp ? grp(t0 + ((t1 - t0) * (i + 0.5)) / n, ((j + 0.5) / m) * Math.PI * 2) : 'skin';
    T(g, a, b, c); T(g, b, d, c);
  }
  if (open) return;
  for (const [ri, t, dir] of [[0, t0, -1], [n, t1, 1]]) {
    const r = rings[ri], ctr = at(t, [0, 0]);
    let rr = 0; for (let j = 0; j < m; j++) { const k = r[j] * 3; rr += Math.hypot(G.p[k] - ctr[0], G.p[k + 1] - ctr[1], G.p[k + 2] - ctr[2]); }
    rr /= m;
    // The pole sits at the middle of the end ring, nudged out a bit so the end is rounded.
    const c0 = shape(t, 0), c1 = shape(t, Math.PI), mid = [(c0[0] + c1[0]) / 2, (c0[1] + c1[1]) / 2];
    const pp = at(t + (dir * rr * round) / len, mid);
    const pole = vert(G, pp, wt(pp, t, 0), col && col(pp, t, 0));
    const g = grp ? grp(t, 0) : 'skin';
    for (let j = 0; j < m; j++) {
      const a = r[j], b = r[(j + 1) % m];
      if (dir > 0) T(g, a, b, pole); else T(g, a, pole, b);
    }
  }
}

// Weights helper: [[bone, w], ...] from a list where the last bone takes what's left.
const W = (...pairs) => pairs;

// ---- The body. look: { arm (shoulder to glove center, s = 1), bulk 0..1, hair, skin, kit, trim }.
function buildBody(look) {
  const G = Geo(), T = Geo();
  const mus = 0.75 + 0.55 * look.bulk;           // muscle size
  const wid = 0.95 + 0.1 * look.bulk;            // frame width
  const U = look.arm * 0.48, F = look.arm * 0.52 - GLOVE_BACK + 0.03;

  // Torso weights by height, plus the shoulder tops riding with the upper arms.
  const torsoW = (p) => {
    const y = p[1], wp = 1 - smooth((y - 0.98) / 0.13), wc = smooth((y - 1.15) / 0.14), ws = Math.max(1 - wp - wc, 0);
    const out = smooth((Math.abs(p[2]) - 0.11 * wid) / 0.07) * smooth((y - 1.32) / 0.08) * 0.45;
    const wn = smooth((y - 1.47) / 0.04) * 0.5;
    const arm = p[2] < 0 ? I.uaN : I.uaP;
    return W([I.pelvis, wp], [I.spine, ws], [I.chest, wc * (1 - out) * (1 - wn)], [arm, wc * out], [I.neck, wc * wn]);
  };
  const torsoShape = (inflate, sculpt) => (t, a) => {
    const y = 0.83 + t * (1.51 - 0.83), k = TORSO(clamp(y, 0.83, 1.51)), ca = Math.cos(a), sa = Math.sin(a);
    let u = (ca >= 0 ? k[2] : k[3]) * pe(ca, 2.5), v = k[1] * wid * pe(sa, 2.5);
    let b = inflate;
    if (sculpt) {
      const fr = smooth(ca * 2.5), bk = smooth(-ca * 2.5), av = Math.abs(v);
      b += 0.02 * mus * gs(y, 1.32, y < 1.32 ? 0.035 : 0.06) * gs(av, 0.085, 0.06) * fr;              // pecs
      b -= 0.004 * gs(v, 0, 0.012) * fr * smooth((y - 1.02) / 0.04) * (1 - smooth((y - 1.26) / 0.04)); // centre line
      for (const yy of [1.1, 1.17]) b -= 0.003 * gs(y, yy, 0.009) * gs(v, 0, 0.06) * fr;                // abs
      b += 0.006 * mus * gs(y, 1.135, 0.06) * gs(av, 0.03, 0.03) * fr;                                    // six-pack bulge
      b += 0.024 * gs(y, 0.92, 0.05) * gs(av, 0.07, 0.06) * bk;                                          // glutes
      b -= 0.006 * gs(v, 0, 0.016) * bk * smooth((y - 1.0) / 0.05);                                       // spine
      b += 0.012 * mus * gs(y, 1.36, 0.06) * gs(av, 0.09, 0.05) * bk;                                     // shoulder blades
      b += 0.012 * mus * gs(y, 1.43, 0.035) * gs(av, 0.1, 0.05);                                          // traps
    }
    const l = Math.hypot(u, v) || 1;
    return [k[4] + u + (u / l) * b, v + (v / l) * b];
  };
  const skinCol = (p) => {
    // Nipples, a touch darker.
    const d = Math.hypot(p[1] - 1.305, Math.abs(p[2]) - 0.088);
    return p[0] > 0.05 && d < 0.012 ? [0.72, 0.6, 0.58] : null;
  };
  loft(G, [0, 0.83, 0], { axis: [0, 1, 0], len: 0.68, front: [1, 0, 0], side: [0, 0, 1], t0: 0, t1: 1, n: 34, m: 28, shape: torsoShape(0, true), wt: torsoW, col: skinCol });

  // Neck.
  loft(G, [-0.005, 1.4, 0], { axis: [0.08, 0.997, 0], len: 0.24, front: [0.997, -0.08, 0], side: [0, 0, 1], t0: 0, t1: 1, n: 8, m: 16,
    shape: (t, a) => { const r = (0.06 + 0.01 * mus) * (1 - 0.12 * t); return [r * 0.95 * Math.cos(a), r * Math.sin(a)]; },
    wt: (p) => { const y = p[1], wc = 1 - smooth((y - 1.42) / 0.07), wh = smooth((y - 1.55) / 0.05); return W([I.chest, wc], [I.head, wh], [I.neck, Math.max(1 - wc - wh, 0)]); } });

  for (const sg of [-1, 1]) {
    const P = sg > 0, ua = P ? I.uaP : I.uaN, fa = P ? I.faP : I.faN, th = P ? I.thP : I.thN, sh = P ? I.shP : I.shN, ft = P ? I.ftP : I.ftN;
    const arm = [0, -Math.cos(BIND.armOut), sg * Math.sin(BIND.armOut)];
    const out = [0, Math.sin(BIND.armOut), sg * Math.cos(BIND.armOut)];          // outward, square to the arm
    const S0 = [0, BIND.shY, sg * BIND.sh];
    // Arm, one tube shoulder to wrist (no seam at the elbow): the deltoid caps the shoulder, biceps
    // in front, triceps behind, a thick forearm thinning to the wrist (the glove cuff covers that).
    // d: meters from the shoulder joint along the arm.
    const cap = (d, d0, da) => (d < da ? Math.sqrt(Math.max(1 - ((da - d) / (da - d0)) ** 2, 0.05)) : 1);
    const upR = (t, a) => {
      const ca = Math.cos(a);
      let r = 0.05 - 0.01 * smooth((t - 0.5) / 0.5);
      r += 0.026 * mus * gs(t, 0.06, 0.17) * (0.55 + 0.45 * Math.max(0, Math.cos(a - 1.0)));
      r += 0.015 * mus * gs(t, 0.55, 0.2) * Math.max(0, ca) ** 1.5;
      r += 0.012 * mus * gs(t, 0.4, 0.22) * Math.max(0, -ca) ** 1.5;
      return r;
    };
    const foreR = (t, a) => 0.04 + 0.007 * mus * gs(t, 0.22, 0.25) - 0.01 * smooth((t - 0.3) / 0.7) + 0.006 * mus * gs(t, 0.2, 0.2) * Math.max(0, Math.cos(a - 0.8));
    const d0 = -0.16 * U;
    loft(G, S0, { axis: arm, len: 1, front: [1, 0, 0], side: out, t0: d0, t1: U + F, n: 30, m: 18,
      shape: (d, a) => {
        const k = smooth((d - U + 0.03) / 0.06);
        const r = (upR(Math.min(d / U, 1.1), a) * (1 - k) + foreR(Math.max((d - U) / F, -0.1), a) * k) * cap(d, d0, 0.02 * U);
        return [r * Math.cos(a), r * Math.sin(a) * (1 + 0.04 * (1 - k))];
      },
      wt: (p, d) => {
        const wc = 1 - smooth((d / U + 0.04) / 0.24), k = smooth((d - U + 0.035) / 0.07);
        return W([I.chest, wc * (1 - k)], [ua, (1 - wc) * (1 - k)], [fa, k]);
      } });

    // Leg, one tube hip to ankle: top buried in the hips and trunks, quads in front, the teardrop
    // above the knee inside, the calf behind; the boot from just above the ankle down.
    const H0 = [0, BIND.hipY, sg * BIND.hipZ];
    const leg = [0, -1, 0], legOut = [0, 0, sg], TH = BIND.thigh, SH = BIND.shin, BOOT = 0.7;
    const thighR = (t, a) => {
      let r = 0.086 - 0.036 * smooth((t - 0.2) / 0.8) ** 1.2;
      r += 0.014 * mus * gs(t, 0.5, 0.25) * Math.max(0, Math.cos(a)) ** 1.3;
      r += 0.01 * mus * gs(t, 0.82, 0.1) * Math.max(0, Math.cos(a + 0.8)) ** 2;
      r += 0.007 * gs(t, 0.45, 0.3) * Math.max(0, -Math.cos(a));
      return r;
    };
    const shinR = (t, a) => {
      const ca = Math.cos(a), sa = Math.sin(a);
      let r = 0.05 - 0.016 * smooth((t - 0.2) / 0.65);
      r += 0.022 * mus * gs(t, 0.28, 0.17) * Math.max(0, -ca) ** 1.2 * (1 + 0.25 * Math.max(0, -sa));
      if (t > BOOT - 0.02) r = Math.max(r, 0.04) + 0.006 + 0.006 * smooth((t - BOOT) / 0.3);
      return r;
    };
    const l0 = -0.18 * TH;
    loft(G, H0, { axis: leg, len: 1, front: [1, 0, 0], side: legOut, t0: l0, t1: TH + SH, n: 32, m: 18,
      shape: (d, a) => {
        const k = smooth((d - TH + 0.03) / 0.06);
        const r = (thighR(Math.min(d / TH, 1.1), a) * (1 - k) + shinR(Math.max((d - TH) / SH, -0.1), a) * k) * cap(d, l0, -0.04 * TH);
        return [r * Math.cos(a), r * Math.sin(a)];
      },
      wt: (p, d) => {
        const tt = d / TH, ts = (d - TH) / SH;
        const wp = 1 - smooth((tt + 0.12) / 0.34), k = smooth((d - TH + 0.04) / 0.08), wf = 0.4 * smooth((ts - 0.86) / 0.14);
        return W([I.pelvis, wp * (1 - k)], [th, (1 - wp) * (1 - k)], [sh, k * (1 - wf)], [ft, k * wf]);
      },
      grp: (d) => ((d - TH) / SH > BOOT ? 'shoe' : 'skin') });
    // Foot (boot): heel to toe along +x, flat sole.
    const A0 = [0, BIND.hipY - TH - SH, sg * BIND.hipZ];
    const FOOT = table([[-0.08, 0.04, 0.034], [-0.02, 0.05, 0.042], [0.05, 0.04, 0.047], [0.12, 0.029, 0.05], [0.19, 0.02, 0.036]]);
    loft(G, A0, { axis: [1, 0, 0], len: 1, front: [0, 1, 0], side: [0, 0, sg], t0: -0.08, t1: 0.19, n: 12, m: 14,
      shape: (t, a) => { const k = FOOT(t), hh = k[1], hw = k[2]; return [-0.085 + hh + hh * pe(Math.cos(a), 3), hw * pe(Math.sin(a), 2.6)]; },
      wt: (p, t) => { const ws = 0.35 * (1 - smooth(t / 0.05)) * smooth((p[1] - A0[1] + 0.03) / 0.03); return W([sh, ws], [ft, 1 - ws]); },
      grp: () => 'shoe' });

    // Trunks: a sleeve over each thigh, flaring to the hem.
    loft(T, H0, { axis: leg, len: BIND.thigh, front: [1, 0, 0], side: legOut, t0: -0.12, t1: 0.6, n: 10, m: 18, open: true,
      shape: (t, a) => { const r = thighR(Math.max(t, -0.04), a) + 0.022 + 0.034 * smooth((t + 0.05) / 0.65); return [r * Math.cos(a), r * Math.sin(a) * 1.05]; },
      wt: (p, t) => { const wp = 0.75 - 0.45 * smooth((t + 0.12) / 0.5); return W([I.pelvis, wp], [th, 1 - wp]); }, grp: () => 'trunks' });
  }
  // Trunks waist: the torso, a bit fuller, from the waistband down past the crotch.
  const tl = 1.51 - 0.83;
  loft(T, [0, 0.83, 0], { axis: [0, 1, 0], len: tl, front: [1, 0, 0], side: [0, 0, 1], t0: (0.82 - 0.83) / tl, t1: (1.1 - 0.83) / tl, n: 12, m: 28, round: 0.12,
    shape: (t, a) => { const y = 0.83 + t * tl, s0 = torsoShape(0.014 + 0.016 * (1 - smooth((y - 0.88) / 0.14)), false)(t, a); return s0; },
    wt: torsoW, grp: (t) => (0.83 + t * tl > 1.035 ? 'band' : 'trunks') });

  head(G, look);
  return { G, T };
}

// Head: a sphere sculpted into a skull, jaw, brow, nose, ears. Hair, brows, eyes and lips are
// soft vertex-color masks over the skin (one draw, no hard edges).
function head(G, look) {
  const c = [BIND.head[0], BIND.head[1] - 0.012, 0], rx = 0.1, ry = 0.112, rz = 0.08, nl = 34, nm = 40;
  const skin = lin(look.skin), hairT = lin(look.hairColor).map((v, k) => clamp(v / skin[k], 0, 1));
  const tint = (col, t, k) => col.map((v, j) => v + (t[j] - v) * k);
  const shape = (d) => {
    // A slightly boxy skull, not an egg.
    let x = pe(d[0], 2.25) * rx, y = pe(d[1], 2.15) * ry, z = pe(d[2], 2.3) * rz;
    if (y < 0) z *= 1 - 0.2 * smooth(-y / 0.1);                                    // jaw narrows
    if (x < 0 && y < 0) x *= 1 - 0.3 * smooth(-y / 0.08) * smooth(-x / 0.05);      // back of the neck
    if (x < 0 && y > -0.02) x *= 1.04;                                             // skull behind
    if (x > 0.07) x = 0.07 + (x - 0.07) * 0.55;                                    // the face is flatter than the skull
    const fr = smooth((x - 0.05) / 0.03), az = Math.abs(z);
    x += 0.024 * gs(y, -0.008, 0.026) * gs(z, 0, 0.013) * fr * (0.55 + 0.45 * smooth((0.02 - y) / 0.04)); // nose
    x += 0.008 * gs(y, 0.03, 0.011) * gs(z, 0, 0.055) * fr;                        // brow
    x -= 0.009 * gs(y, 0.013, 0.012) * gs(az, 0.033, 0.015) * fr;                  // eye sockets
    x += 0.004 * gs(y, -0.056, 0.007) * gs(z, 0, 0.022) * fr;                      // lips
    x += 0.01 * gs(y, -0.098, 0.02) * gs(z, 0, 0.025) * smooth((x - 0.03) / 0.03); // chin
    z += Math.sign(z) * 0.006 * gs(y, -0.012, 0.02) * gs(x, 0.055, 0.02);          // cheekbones
    z += Math.sign(z) * 0.015 * gs(y, -0.005, 0.024) * gs(x, -0.012, 0.016) * smooth((az - 0.05) / 0.02); // ears
    let col = [1, 1, 1];
    if (look.hair !== 'bald') {
      const top = smooth((y - 0.03) / 0.014) * (1 - smooth((x - 0.07) / 0.012));
      const back = smooth((0.015 - x) / 0.02) * smooth((y + 0.045) / 0.015);
      const ear = smooth((az - 0.052) / 0.01) * (1 - smooth((y - 0.03) / 0.012)) * smooth((x + 0.04) / 0.012);
      const m = Math.max(top, back) * (1 - ear);
      if (look.hair === 'short') { const l = Math.hypot(x, y, z), k = 0.007 * m * smooth((y + 0.02) / 0.06); x += (x / l) * k; y += (y / l) * k; z += (z / l) * k; }
      col = tint(col, hairT, m * (look.hair === 'buzz' ? 0.82 : 0.97));
    }
    col = tint(col, [0.3, 0.26, 0.24], gs(y, 0.031, 0.005) * smooth((az - 0.01) / 0.006) * (1 - smooth((az - 0.052) / 0.008)) * fr); // brows
    col = tint(col, [0.12, 0.1, 0.1], gs(y, 0.012, 0.0045) * gs(az, 0.032, 0.009) * fr);   // eyes
    col = tint(col, [0.8, 0.6, 0.58], gs(y, -0.057, 0.005) * gs(z, 0, 0.018) * fr);       // lips
    return { p: [c[0] + x, c[1] + y, c[2] + z], col };
  };
  const wt = (p) => { const wn = 1 - smooth((p[1] - 1.52) / 0.05); return W([I.neck, wn], [I.head, 1 - wn]); };
  const rows = [];
  const top = shape([0, 1, 0]), bot = shape([0, -1, 0]);
  const vt = vert(G, top.p, wt(top.p), top.col), vb = vert(G, bot.p, wt(bot.p), bot.col);
  for (let i = 1; i < nl; i++) {
    const th = (i / nl) * Math.PI, r = [];
    for (let j = 0; j < nm; j++) {
      const ph = (j / nm) * Math.PI * 2, s = shape([Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)]);
      r.push(vert(G, s.p, wt(s.p), s.col));
    }
    rows.push(r);
  }
  // phi runs from +x toward +z, theta from the top down; these windings face out.
  for (let j = 0; j < nm; j++) {
    const j1 = (j + 1) % nm;
    tri(G, 'skin', vt, rows[0][j1], rows[0][j]);
    tri(G, 'skin', vb, rows[nl - 2][j], rows[nl - 2][j1]);
  }
  for (let i = 0; i < nl - 2; i++) for (let j = 0; j < nm; j++) {
    const j1 = (j + 1) % nm, a = rows[i][j], b = rows[i][j1], c2 = rows[i + 1][j], d = rows[i + 1][j1];
    tri(G, 'skin', a, b, c2); tri(G, 'skin', b, d, c2);
  }
}

// A boxing glove in its own frame: +x toward the knuckles, +y the back of the hand, thumb on +z
// (thumb = 1) or -z (-1), so the meshes stay right-handed on both hands.
// Center at the fist; the cuff runs back past the wrist.
function gloveGeo(THREE, kit, trim, thumb) {
  const p = [], c = [], ix = [], n = 18, m = 18;
  const R = table([[-0.13, 0.046], [-0.09, 0.05], [-0.05, 0.054], [-0.01, 0.062], [0.035, 0.066], [0.07, 0.058], [0.095, 0.036], [0.104, 0.004]]);
  const x0 = -0.13, x1 = 0.104;
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    for (let j = 0; j < m; j++) {
      const a = (j / m) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      let r = R(x)[1];
      r += 0.02 * gs(x, -0.005, 0.03) * Math.max(0, Math.cos(a - thumb * 1.25)) ** 3; // thumb along the side
      p.push(x, r * ca * 1.06, r * sa * 0.88);
      c.push(...(x < -0.085 ? trim : kit));
    }
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const a = i * m + j, b = i * m + ((j + 1) % m), cc = (i + 1) * m + j, d = (i + 1) * m + ((j + 1) % m);
    ix.push(a, b, cc, b, d, cc);
  }
  const back = p.length / 3; p.push(x0 + 0.004, 0, 0); c.push(...trim);
  for (let j = 0; j < m; j++) ix.push(back, (j + 1) % m, j);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
  g.setIndex(ix); g.computeVertexNormals();
  return g;
}

const hex = (h) => [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255];
// sRGB hex to the linear values vertex colors want.
const lin = (h) => hex(h).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));

// One man: builds the meshes, hands back the bones to pose. Call dispose() before a rebuild.
export function makeBody(THREE, scene, look) {
  const root = new THREE.Group();
  scene.add(root);
  const bones = BONES.map((name) => { const b = new THREE.Bone(); b.name = name; root.add(b); return b; });
  // Bind frames: torso bones upright at their joints, limb bones along the bind limb.
  const setFrame = (b, o, x, y, z) => {
    b.matrix.makeBasis(new THREE.Vector3(...x), new THREE.Vector3(...y), new THREE.Vector3(...z)).setPosition(...o);
    b.matrix.decompose(b.position, b.quaternion, b.scale);
  };
  const id = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const U = look.arm * 0.48;
  setFrame(bones[I.pelvis], [0, BIND.pelvis, 0], ...id);
  setFrame(bones[I.spine], [0, BIND.spine, 0], ...id);
  setFrame(bones[I.chest], [0, BIND.chest, 0], ...id);
  setFrame(bones[I.neck], [0, BIND.neckBase, 0], ...id);
  setFrame(bones[I.head], BIND.head, ...id);
  for (const sg of [-1, 1]) {
    const P = sg > 0, d = [0, -Math.cos(BIND.armOut), sg * Math.sin(BIND.armOut)], f = [1, 0, 0];
    const S0 = [0, BIND.shY, sg * BIND.sh], E0 = S0.map((v, k) => v + d[k] * U);
    const limb = (b, o, d, f) => setFrame(b, o, f, d.map((v) => -v), cross(d, f));
    limb(bones[P ? I.uaP : I.uaN], S0, d, f);
    limb(bones[P ? I.faP : I.faN], E0, d, f);
    const hz = sg * BIND.hipZ, kz = hz;
    limb(bones[P ? I.thP : I.thN], [0, BIND.hipY, hz], [0, -1, 0], f);
    limb(bones[P ? I.shP : I.shN], [0, BIND.hipY - BIND.thigh, kz], [0, -1, 0], f);
    setFrame(bones[P ? I.ftP : I.ftN], [0, BIND.hipY - BIND.thigh - BIND.shin, kz], ...id);
  }
  root.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(bones);

  const { G, T } = buildBody(look);
  const mats = {
    skin: new THREE.MeshStandardMaterial({ color: look.skin, roughness: 0.44, metalness: 0, vertexColors: true }),
    shoe: new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.5 }),
    trunks: new THREE.MeshStandardMaterial({ color: look.kit, roughness: 0.5 }),
    band: new THREE.MeshStandardMaterial({ color: look.trim, roughness: 0.4 }),
    glove: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.32, vertexColors: true }),
  };
  const mesh = (Gm, order) => {
    const g = new THREE.BufferGeometry(), idx = [], used = [];
    for (const k of order) {
      const a = Gm.ix[k]; if (!a || !a.length) continue;
      g.addGroup(idx.length, a.length, used.length); used.push(mats[k]);
      for (const v of a) idx.push(v);
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(Gm.p, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(Gm.c, 3));
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(Gm.si, 4));
    g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(Gm.sw, 4));
    g.setIndex(idx); g.computeVertexNormals();
    const sm = new THREE.SkinnedMesh(g, used);
    sm.bind(skeleton, new THREE.Matrix4());
    sm.frustumCulled = false; sm.castShadow = true; sm.receiveShadow = true;
    scene.add(sm);
    return sm;
  };
  const body = mesh(G, ['skin', 'shoe']), trunks = mesh(T, ['trunks', 'band']);
  const gloves = [-1, 1].map((sg) => {
    // men.js frames each glove x = forearm, y = back of the hand, z = x cross y; the thumb then
    // falls on -z for the man's +z hand and +z for his -z hand.
    const m = new THREE.Mesh(gloveGeo(THREE, lin(look.kit), lin(look.trim), -sg), mats.glove);
    m.castShadow = true; scene.add(m);
    return m;
  });
  return {
    bones, gloves, I, mats,
    dispose() {
      for (const o of [body, trunks, ...gloves]) { scene.remove(o); o.geometry.dispose(); }
      for (const m of Object.values(mats)) m.dispose();
      scene.remove(root);
    },
  };
}

// How a man looks, from who he is (seeded, so he looks the same every fight).
const SKIN = [0xf0c8a8, 0xe2b08a, 0xcf9a72, 0xb88058, 0x9c6844, 0x7d5034, 0x603b26, 0x4a2c1d];
const HAIR = [0x16110e, 0x221812, 0x2e1f15, 0x0d0b0a, 0x4a3524];
export function lookOf(f, corner, rng) {
  const s = f.height / 1.78;
  return {
    arm: f.arm / s,
    bulk: clamp((f.height - 1.62) / 0.36 + rng.range(-0.15, 0.15), 0, 1),
    skin: SKIN[Math.floor(rng.next() * SKIN.length)],
    hair: ['bald', 'buzz', 'buzz', 'short'][Math.floor(rng.next() * 4)],
    hairColor: HAIR[Math.floor(rng.next() * HAIR.length)],
    kit: corner ? 0x1f4fb8 : 0xb3201c,
    trim: rng.chance(0.5) ? 0xf2f2f2 : 0xd8b04a,
  };
}
