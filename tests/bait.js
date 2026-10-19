// The World-class bait (1f f2, docs/PLUGIN.md): side 0 World class, side 1 a random level (N/I/P/W), styles roll, @82, 10 rounds.
// Per baiter style: baits a fight, bites, bites on the punch he was waiting on, counters landed off a bite (within 1.5 s), KDs off them.
// Per watcher level: seen through (took nothing) and took it, of the baits he was shown. Wins: side 0's win % by the other man's level.
//   TAG=x node tests/bait.js 300     node tests/bait.js agg x
const fs = require('fs'), OUT = t => '/tmp/bait_' + t + '.txt';
const LV = { N: 34, I: 56, P: 74, W: 90 }, LK = Object.keys(LV);
const blank = () => ({ fights: 0, st: {}, lv: {} });
let A = blank();
if (process.argv[2] === 'agg') { for (const l of fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n')) add(A, JSON.parse(l)); report(); return; }
const S = require('./sim.js'), ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), pick = a => a[Math.floor(Math.random() * a.length)];
const N = +process.argv[2] || 100, row = (o, k, f) => o[k] || (o[k] = f());
for (let i = 0; i < N; i++) {
  const lv = ['W', pick(LK)], sts = [pick(ALL), pick(ALL)];
  const sh = [0, 1].map(j => { const s = S.sheet(82, sts[j], S.rollGuard(sts[j])); s.sk = S.skMake(LV[lv[j]], sts[j]); return s; });
  const f = new S.Fight(sh[0], sh[1], { rounds: 10 });
  const ctr = [0, 0], kd = [0, 0];
  const oe = f.emit.bind(f);
  f.emit = (t, e) => {
    if (t === 'hit' && !e.blocked && e.counter && f.f[e.a].brain && f.t - f.f[e.a].brain.wb.bitT < 1.5) ctr[e.a]++;
    return oe(t, e);
  };
  const ok = f.knockdown.bind(f);
  f.knockdown = (D, Ak, zone, l) => { const B = f.f[1 - D.side].brain; if (B && f.t - B.wb.bitT < 2) kd[1 - D.side]++; return ok(D, Ak, zone, l); };
  let n = 0;
  while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); }
  A.fights++;
  for (const j of [0, 1]) {
    const T = f.f[j].brain.tel, W = f.f[1 - j].brain.tel;
    if (lv[j] === 'W') { const r = row(A.st, sts[j], () => ({ n: 0, baits: 0, bit: 0, right: 0, ctrL: 0, kd: 0 })); r.n++; r.baits += T.wbN || 0; r.bit += T.wbBit || 0; r.right += T.wbRight || 0; r.ctrL += ctr[j]; r.kd += kd[j]; }
    const r = row(A.lv, lv[j], () => ({ shown: 0, thru: 0, took: 0, n: 0, win: 0, roll: 0, p: 0 })); r.shown += W.wbN || 0; r.thru += T.wbThru || 0; r.took += T.wbTook || 0; r.roll += T.wbRoll || 0; r.p += T.wbP || 0;
  }
  const o = row(A.lv, lv[1], () => ({ shown: 0, thru: 0, took: 0, n: 0, win: 0, roll: 0, p: 0 })); o.n++; if (f.result && f.result.winner === 0) o.win++;
}
if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(A) + '\n'); else report();
function add(T, o) { T.fights += o.fights; for (const g of ['st', 'lv']) for (const k in o[g]) { const t = T[g][k] || (T[g][k] = {}); for (const x in o[g][k]) t[x] = (t[x] || 0) + o[g][k][x]; } }
function report() {
  const pc = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '-', pf = (a, b) => b ? (a / b).toFixed(2) : '-';
  console.log(`fights ${A.fights} (side 0 World class)`);
  console.log('baiter style   fights  baits/f  bit     on his punch  ctr landed/bite  KDs');
  for (const k in A.st) { const r = A.st[k]; console.log(`${k.padEnd(14)} ${String(r.n).padStart(6)}  ${pf(r.baits, r.n).padStart(7)}  ${pc(r.bit, r.baits).padStart(6)}  ${pc(r.right, r.bit).padStart(12)}  ${pf(r.ctrL, r.bit).padStart(15)}  ${r.kd}`); }
  console.log('watcher  shown  rolled  saw through (expected)  took it   | side 0 (World) wins vs this level');
  for (const k of LK) { const r = A.lv[k]; if (!r) continue; console.log(`${k.padEnd(8)} ${String(r.shown).padStart(5)}  ${String(r.roll || 0).padStart(6)}  ${pc(r.thru, r.roll).padStart(11)} (${pc(r.p || 0, r.roll)})  ${pc(r.took, r.shown).padStart(7)}   | ${pc(r.win, r.n)} of ${r.n}`); }
}
