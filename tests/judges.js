// The judges (step e): split rounds, 10-10s, decision types, draws, card margins, late lead changes. Audit field (gaps 0/3/6/10, 8/10/12 rounds).
//   TAG=x node tests/judges.js 500   (x4, appends to /tmp/judges_x.txt)   then   node tests/judges.js agg x
// Real (research/numbers.md 5, Sloan CSV): split rounds 26.9%, 10-10 ~1-2%, UD 72 / SD 16 / MD 11.5 (split+majority 27.9), draws 5.2% of decisions,
// mean margin UD 6.7 / SD 1.2 / MD 2.1, a lead change in the last 3 rounds 11.5% of decisions (10 rd 8.4, 12 rd 12.9).
const fs = require('fs'); const OUT = t => '/tmp/judges_' + t + '.txt';
const K = ['rds', 'split', 'even', 'dec', 'UD', 'SD', 'MD', 'draw', 'mUD', 'mSD', 'mMD', 'late', 'dec10', 'late10', 'dec12', 'late12', 'fights'];
if (process.argv[2] === 'agg') {
  const A = Object.fromEntries(K.map(k => [k, 0]));
  for (const l of fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n')) { const o = JSON.parse(l); for (const k of K) A[k] += o[k] || 0; }
  const p = (a, b) => (100 * a / Math.max(1, b)).toFixed(1);
  console.log(`fights ${A.fights} | rounds ${A.rds}: split ${p(A.split, A.rds)}% (real 26.9), with a 10-10 ${p(A.even, A.rds)}%`);
  console.log(`decisions ${A.dec}: UD ${p(A.UD, A.dec)} SD ${p(A.SD, A.dec)} MD ${p(A.MD, A.dec)} (split+majority ${p(A.SD + A.MD, A.dec)}, real 27.9) draws ${p(A.draw, A.dec)} (real 5.2)`);
  console.log(`mean margin UD ${(A.mUD / Math.max(1, A.UD)).toFixed(1)} SD ${(A.mSD / Math.max(1, A.SD)).toFixed(1)} MD ${(A.mMD / Math.max(1, A.MD)).toFixed(1)} (real 6.7 / 1.2 / 2.1)`);
  console.log(`lead change in the last 3 rds: ${p(A.late, A.dec)}% of decisions (real 11.5) | 10 rd ${p(A.late10, A.dec10)} (8.4) 12 rd ${p(A.late12, A.dec12)} (12.9)`);
  process.exit();
}
const S = require('./sim.js'); const N = +process.argv[2] || 400; const st = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const A = Object.fromEntries(K.map(k => [k, 0]));
for (let i = 0; i < N; i++) {
  const base = 60 + Math.random() * 30 | 0, gap = [0, 3, 6, 10][i % 4];
  const mk = r => { const s = st[Math.random() * 5 | 0]; return S.sheet(r, s, S.rollGuard(s), Math.random() * 30 | 0); };
  const rounds = [8, 10, 12][i % 3]; const f = S.run(mk(base + gap / 2 | 0), mk(base - gap / 2 | 0), { rounds }); A.fights++;
  for (const l of f.roundLog) {
    A.rds++; const w = l.cards.map(c => Math.sign(c[0] - c[1]));
    if (w.some(x => x !== w[0])) A.split++; if (l.cards.some(c => c[0] === c[1])) A.even++;
  }
  const r = f.result; if (!r.decision) continue;
  A.dec++; const m = r.method; const mg = Math.abs(f.cardTotals().reduce((s, t) => s + t[0] - t[1], 0) / 3);
  if (m === 'UD' || m === 'SD' || m === 'MD') { A[m]++; A['m' + m] += mg; } else A.draw++;
  let lead = 0, sgn = 0, late = 0;
  f.roundLog.forEach((l, j) => { lead += l.cards.reduce((s, c) => s + c[0] - c[1], 0) / 3; const s = Math.sign(Math.round(lead * 3)); if (s && sgn && s !== sgn && j >= rounds - 3) late = 1; if (s) sgn = s; });
  A.late += late; if (rounds >= 10) { A['dec' + rounds]++; A['late' + rounds] += late; }
}
const T = process.env.TAG; if (T) fs.appendFileSync(OUT(T), JSON.stringify(A) + '\n'); else console.log(JSON.stringify(A));
