// L4e scar check (docs/LEARN.md 6): two Pros, A carries a scar from a KO loss (or not), same pair every arm. A's win %, punches thrown per round, knockdowns he takes, how often he gets stopped.
//   TAG=x node tests/scar.js 75 (x4, more runs to pool) then node tests/scar.js agg x. ARMS=none,caution,gunShy,caution2 (2 = a double scar, .3)
const fs = require('fs'), OUT = t => '/tmp/scar_' + t + '.txt', ARMS = (process.env.ARMS || 'none,caution,gunShy,caution2').split(',');
if (process.argv[2] === 'agg') { const L = fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse), A = {};
  for (const o of L) for (const k in o) { const a = A[k] = A[k] || {}; for (const q in o[k]) a[q] = (a[q] || 0) + o[k][q]; } report(A); return; }
const S = require('./sim.js'), ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), pick = a => a[Math.floor(Math.random() * a.length)], clone = o => JSON.parse(JSON.stringify(o));
const N = +process.argv[2] || 75, A = {};
for (let i = 0; i < N; i++) {
  const sh = ['a', 'b'].map(id => { const st = pick(ALL), s = S.sheet(78, st, S.rollGuard(st)); s.sk = S.skMake(74 + Math.random() * 10 - 5, st); s.id = id; return s; }), side = i & 1;
  for (const arm of ARMS) {
    const [a, b] = sh.map(clone); if (arm !== 'none') a.scar = { kind: arm.replace('2', ''), v: arm.endsWith('2') ? .3 : .15, n: 0 };
    const f = S.run(side ? b : a, side ? a : b, { rounds: 10 }), r = f.result.winner, F = f.f[side], o = A[arm] = A[arm] || { n: 0, w: 0, d: 0, thr: 0, rd: 0, kd: 0, stop: 0, kdBy: 0 };
    o.n++; if (r === side) o.w++; else if (r !== 1 - side) o.d++;
    o.thr += F.tot.thrown.jab + F.tot.thrown.power + F.tot.thrown.body; o.rd += f.roundLog.length + (f.result.decision ? 0 : 1); o.kd += F.kd; o.kdBy += F.op.kd; if (r === 1 - side && !f.result.decision) o.stop++;
  }
}
if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(A) + '\n');
report(A);
function report(A) { console.log("arm      A wins (decided)   thrown/rd   KDs taken/f  KDs scored/f  A stopped");
  for (const k of Object.keys(A)) { const a = A[k], d = a.n - a.d, q = a.w / Math.max(1, d);
    console.log(k.padEnd(9) + ((100 * q).toFixed(1) + '% ±' + (100 * Math.sqrt(q * (1 - q) / Math.max(1, d))).toFixed(1)).padEnd(19) + (a.thr / a.rd).toFixed(1).padEnd(12) + (a.kd / a.n).toFixed(2).padEnd(13) + (a.kdBy / a.n).toFixed(2).padEnd(14) + (100 * a.stop / a.n).toFixed(1) + '%'); } }
