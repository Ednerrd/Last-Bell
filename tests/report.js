// L4a fight report check (docs/LEARN.md 1): per skill, use per fight and success rate, by skill level. Same body (rating 78), levels from sheet.sk.
//   node tests/report.js 200        (each tier fights a random tier; prints use / rate per tier, what beat the losers)
const S = require('./sim.js'), ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), TI = S.BoxerBrain.TIERS, KEYS = S.BoxerBrain.SKILL_KEYS;
const N = +process.argv[2] || 200, pick = a => a[Math.floor(Math.random() * a.length)], A = {};
for (let i = 0; i < N; i++) {
  const tv = [Math.random() * 4 | 0, Math.random() * 4 | 0], sh = tv.map(t => { const st = pick(ALL), s = S.sheet(78, st, S.rollGuard(st)); s.sk = S.skMake(TI[t].center, st); return s; });
  const f = S.run(sh[0], sh[1], { rounds: 10 });
  for (let s = 0; s < 2; s++) { const R = S.fightReport(f, s), a = A[tv[s]] = A[tv[s]] || { n: 0, w: 0, u: {}, r: {}, rn: {}, ko: 0, out: 0, trap: 0 };
    a.n++; if (R.won > 0) a.w++; if (R.ko) a.ko++; if (R.won < 0 && R.beat.outworked) a.out++; if (R.beat.trapped) a.trap++;
    for (const k of KEYS) { const [u, r] = R.sk[k]; a.u[k] = (a.u[k] || 0) + u; if (u > 0) { a.r[k] = (a.r[k] || 0) + r; a.rn[k] = (a.rn[k] || 0) + 1; } } }
}
const T = Object.keys(A).sort();
console.log('skill'.padEnd(10) + T.map(t => (TI[t].label.slice(0, 6) + ' use/rate').padStart(18)).join(''));
for (const k of KEYS) console.log(k.padEnd(10) + T.map(t => { const a = A[t]; return ((a.u[k] / a.n).toFixed(1) + ' / ' + (a.rn[k] ? a.r[k] / a.rn[k] : 0).toFixed(2)).padStart(18); }).join(''));
console.log('fights'.padEnd(10) + T.map(t => (A[t].n + ' w' + (100 * A[t].w / A[t].n | 0) + '% ko-lost ' + A[t].ko).padStart(18)).join(''));
