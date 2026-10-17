// L4c rematch check (docs/LEARN.md 4): two Pros fight, then fight again three ways from the same starting sheets:
//   none = no memory (the base: how often the better man wins twice), mem = both remember (sheet.opp -> the brain's prior), full = memory + growth (learn applied)
//   TAG=x node tests/rematch.js 150     (x4; one line per run to /tmp/rematch_x.txt)   node tests/rematch.js agg x
// Target: the first fight's loser gains a few points with memory (+3-6 vs none), the first winner still takes most rematches that weren't close.
const fs = require('fs'), OUT = t => '/tmp/rematch_' + t + '.txt', ARMS = (process.env.ARMS || 'none,mem,full').split(',');
if (process.argv[2] === 'agg') { const L = fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse), A = {};
  for (const o of L) for (const k in o) { const a = A[k] = A[k] || {}; for (const q in o[k]) a[q] = (a[q] || 0) + o[k][q]; }
  report(A); return; }
const S = require('./sim.js'), ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), pick = a => a[Math.floor(Math.random() * a.length)], clone = o => JSON.parse(JSON.stringify(o));
const N = +process.argv[2] || 150, A = {};
const add = (arm, cls, won) => { for (const k of [arm, arm + ':' + cls]) { const a = A[k] = A[k] || { n: 0, w: 0, d: 0 }; a.n++; if (won === 1) a.w++; else if (won === .5) a.d++; } };
for (let i = 0; i < N; i++) {
  const sh = ['a', 'b'].map(id => { const st = pick(ALL), s = S.sheet(78, st, S.rollGuard(st)); s.sk = S.skMake(74 + Math.random() * 10 - 5, st); s.id = id; s.name = id; s.age = 27; return s; });
  const s0 = sh.map(clone), f1 = S.run(sh[0], sh[1], { rounds: 10 }), w = f1.result.winner;
  if (w !== 0 && w !== 1) continue;
  const cards = f1.cardTotals().map(t => t[w] - t[1 - w]), close = f1.result.decision && cards.reduce((x, y) => x + y, 0) / 3 <= 2 ? 'close' : 'clear';
  for (const arm of ARMS) {
    const x = s0.map(clone);
    if (arm !== 'none') for (let s = 0; s < 2; s++) { const d = S.learn(arm === 'full' ? x[s] : clone(s0[s]), f1, s); if (arm === 'full') S.applyLearn(x[s], d); else x[s].opp = d.opp; }
    const f2 = S.run(x[0], x[1], { rounds: 10 }), r = f2.result.winner;
    add(arm, close, r === w ? 1 : r === 1 - w ? 0 : .5);
  }
}
if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(A) + '\n');
report(A);
function report(A) {
  const p = a => { const dec = a.n - a.d, q = a.w / Math.max(1, dec); return (100 * q).toFixed(1) + '% ±' + (100 * Math.sqrt(q * (1 - q) / Math.max(1, dec))).toFixed(1) + ' (n' + a.n + ')'; };
  console.log('the first winner wins the rematch (of decided rematches):');
  for (const k of Object.keys(A).sort()) console.log('  ' + k.padEnd(12) + p(A[k]));
}
