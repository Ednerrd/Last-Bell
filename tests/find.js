// 2a b2, the eyes find the flaw: a watcher of each level (sk N/I/P/W, body 82) vs a man of each level who carries a flaw (his style's or rolled, FLW).
// Per pair: found % (sure before the last bell), the median round he got sure, and found % by flaw. Both men watch: each side counts.
//   TAG=x node tests/find.js 40     (x4)     node tests/find.js agg x
const SOLO = +process.env.SOLO, fs = require('fs'), OUT = t => '/tmp/find_' + t + '.txt', LV = { N: 34, I: 56, P: 74, W: 90 }, FL = ['jab', 'fold', 'straight', 'same', 'drop'];
if (process.argv[2] === 'agg') { report(fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse)); return; }
process.env.PATCH = (process.env.PATCH || '') + ';globalThis.__BB=BoxerBrain;';
const S = require('./sim.js'), ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), pick = a => a[Math.floor(Math.random() * a.length)];
const N = +process.argv[2] || 40, rows = [];
// SOLO=1: same level both sides, only side 1 carries a flaw (side 0 none): what finding and working it is worth (A/B with PATCH="BoxerBrain.BR.work.on=0")

for (const a in LV) for (const b in LV) for (let i = 0; i < N; i++) { if (SOLO && (a !== b || a === 'N')) continue;
  const sa = pick(ALL), sb = pick(ALL), A = S.sheet(82, sa, S.rollGuard(sa)), B = S.sheet(82, sb, S.rollGuard(sb)); A.sk = S.skMake(LV[a], sa); B.sk = S.skMake(LV[b], sb); if (SOLO) A.flaw = null;
  const f = new S.Fight(A, B, { rounds: 10 });
  let n = 0; while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); f.events = []; }
  for (const s of [0, 1]) { const me = f.f[s].brain, him = f.f[1 - s].brain; if (!him.fl) continue;
    const W = f.result.winner, o = { w: s ? b : a, v: s ? a : b, f: him.fl, rd: me.fnd ? me.fnd.rd : 0, rds: f.round, both: !!him.fnd, win: W == null ? .5 : W === f.f[s].side ? 1 : 0, wk: me.tel.work || 0 }; rows.push(o); if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(o) + '\n'); }
}
if (!process.env.TAG) report(rows);
function report(L) {
  const med = a => { if (!a.length) return '-'; const b = a.slice().sort((x, y) => x - y); return b[b.length >> 1]; };
  console.log('watcher \\ his flaw-man:  found % (median round)  n'); console.log('       ' + Object.keys(LV).map(v => v.padEnd(16)).join(''));
  for (const w in LV) console.log(w.padEnd(7) + Object.keys(LV).map(v => { const r = L.filter(o => o.w === w && o.v === v), y = r.filter(o => o.rd); return (r.length ? (100 * y.length / r.length).toFixed(0) + '% (r' + med(y.map(o => o.rd)) + ') n' + r.length : '-').padEnd(16); }).join(''));
  console.log('\nby flaw (all watchers):  found %   | vs an Intermediate, by watcher N I P W');
  if (SOLO) { for (const v of ['I', 'P', 'W']) { const r = L.filter(o => o.w === v), y = r.filter(o => o.rd), avg = q => q.length ? (100 * q.reduce((x, o) => x + o.win, 0) / q.length).toFixed(1) : '-'; console.log('SOLO ' + v + ' vs ' + v + ' with a flaw: win ' + avg(r) + ' n' + r.length + ' | found ' + (100 * y.length / Math.max(1, r.length)).toFixed(0) + '%, win when found ' + avg(y) + ', not ' + avg(r.filter(o => !o.rd))); } }
  { const only = L.filter(o => o.rd && !o.both), none = L.filter(o => !o.rd), avg = (r, k) => r.length ? (100 * r.reduce((x, o) => x + o[k], 0) / r.length).toFixed(1) : '-';
    console.log('\nwin % of the man who found it (the other didn\'t): ' + avg(only, 'win') + ' n' + only.length + ', tricks a fight ' + (only.reduce((x, o) => x + o.wk, 0) / Math.max(1, only.length)).toFixed(1) + '; found neither way: ' + avg(none, 'win') + ' n' + none.length);
    for (const fl of FL) { const r = only.filter(o => o.f === fl); process.stdout.write(fl + ' ' + avg(r, 'win') + ' n' + r.length + '   '); } console.log(); }
  for (const fl of FL) { const r = L.filter(o => o.f === fl), y = r.filter(o => o.rd); console.log(fl.padEnd(9) + (r.length ? (100 * y.length / r.length).toFixed(0) + '% n' + r.length : '-').padEnd(12) + '| ' + Object.keys(LV).map(w => { const q = r.filter(o => o.v === 'I' && o.w === w); return q.length ? (100 * q.filter(o => o.rd).length / q.length).toFixed(0) + '%' : '-'; }).join(' ')); }
}
