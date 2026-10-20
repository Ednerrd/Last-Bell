// Style identity: does each style fight like itself? node brain/tests/styles.js [fights per pair] [tier]
// Same tier, same body. Prints a fingerprint per style and a round robin (each style vs the other four).
const { BB, N, fight, line, pct, f1 } = require('./lib.js');
const n = N(2, 100), tier = process.argv[3] || 'pro', S = Object.keys(BB.STYLES);
const fp = {}; for (const s of S) fp[s] = { th: 0, la: 0, mins: 0, jab: 0, pow: 0, body: 0, ctr: 0, dist: 0, dn: 0, cl: 0, feints: 0, modes: {}, w: 0, l: 0, g: 0 };
const add = (s, F, r) => { const L = line(F, r), A = fp[s]; A.th += L.th; A.la += L.la; A.mins += L.mins; A.jab += L.jab; A.pow += L.pow; A.body += L.body; A.ctr += L.ctr; A.dist += L.dist; A.dn++; A.cl += L.clinch; A.feints += L.feints; for (const m in L.tel.modeT) A.modes[m] = (A.modes[m] || 0) + L.tel.modeT[m]; };
const rr = {};
for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) {
  let wi = 0;
  for (let k = 0; k < n; k++) {
    const a = BB.makeProfile({ style: S[i], tier, seed: 300000 + k * 17 + i }), b = BB.makeProfile({ style: S[j], tier, seed: 600000 + k * 17 + j });
    const sw = k % 2, { res, r } = sw ? fight(b, a, 11000 + k) : fight(a, b, 11000 + k), ai = sw ? 1 : 0;
    add(S[i], r.f[ai], r); add(S[j], r.f[1 - ai], r);
    if (res.winner === ai) { fp[S[i]].w++; fp[S[j]].l++; wi++; } else if (res.winner === 1 - ai) { fp[S[j]].w++; fp[S[i]].l++; }
    fp[S[i]].g++; fp[S[j]].g++;
  }
  rr[S[i] + ' v ' + S[j]] = wi / n;
}
console.log(`style fingerprints, tier ${tier}, ${n} fights per pair`);
console.log('style          win%   thrown/rd landed/rd conn   jab%  power% body%  ctr/rd dist  clinch/rd feint/rd  top modes');
for (const s of S) { const A = fp[s], r = A.mins / 3, mt = Object.values(A.modes).reduce((x, y) => x + y, 0);
  const top = Object.entries(A.modes).sort((x, y) => y[1] - x[1]).slice(0, 3).map(([m, v]) => m + ' ' + Math.round(v / mt * 100)).join(', ');
  console.log(`${s.padEnd(13)} ${pct(A.w / A.g).padStart(6)} ${f1(A.th / r).padStart(9)} ${f1(A.la / r).padStart(9)} ${pct(A.la / A.th).padStart(6)} ${pct(A.jab / A.th).padStart(6)} ${pct(A.pow / A.th).padStart(6)} ${pct(A.body / A.th).padStart(6)} ${f1(A.ctr / r).padStart(6)} ${f1(A.dist / A.dn).padStart(5)} ${f1(A.cl / r).padStart(9)} ${f1(A.feints / r).padStart(8)}  ${top}`); }
console.log('\npairs (first style win %):'); for (const k in rr) console.log('  ' + k.padEnd(28) + pct(rr[k]));
