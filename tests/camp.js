// L4d camp check (docs/LEARN.md 5): two Pros (sk ~74, rating 78); A gets a camp pick before the fight, B nothing. Same pair, every arm. A's win % of decided fights.
//   none = no camp; tape = 3 of B's fights watched (a prior); stale = tape, then B changes his style before the fight; blind = A never saw B's style or stance (know .1); spar = blind + a lookalike in camp
//   changed = B changes style with no tape (the control for stale: a man in the wrong style for his body is weaker). drill = A drills his jab. TAG=x node tests/camp.js 300 (x4) then node tests/camp.js agg x. ARMS= to pick
const fs = require('fs'), OUT = t => '/tmp/camp_' + t + '.txt', ARMS = (process.env.ARMS || 'none,tape,stale,blind,spar,drill').split(',');
if (process.argv[2] === 'agg') { const L = fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse), A = {};
  for (const o of L) for (const k in o) { const a = A[k] = A[k] || {}; for (const q in o[k]) a[q] = (a[q] || 0) + o[k][q]; } report(A); return; }
const S = require('./sim.js'), ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), pick = a => a[Math.floor(Math.random() * a.length)], clone = o => JSON.parse(JSON.stringify(o));
const N = +process.argv[2] || 150, A = {};
for (let i = 0; i < N; i++) {
  const sh = ['a', 'b'].map(id => { const st = pick(ALL), s = S.sheet(78, st, S.rollGuard(st)); s.sk = S.skMake(74 + Math.random() * 10 - 5, st); s.id = id; s.name = id; s.age = 27; return s; });
  S.learnInit(sh[0]); const side = i & 1;
  for (const arm of ARMS) {
    const [a, b] = sh.map(clone);
    if (arm === 'blind' || arm === 'spar') { a.know.style[b.style] = .1; a.know.stance[b.stance] = .1; }
    if (arm === 'spar') S.camp(a, { kind: 'spar' }, b);
    if (arm === 'drill') S.camp(a, { kind: 'drill', skill: 'jab' }, b);
    if (arm === 'tape' || arm === 'stale') S.camp(a, { kind: 'tape' }, b);
    if (arm === 'stale' || arm === 'changed') { b.style = pick(ALL.filter(x => x !== b.style)); b.guard = S.rollGuard(b.style); } // he changed since the film (new trainer)
    const f = S.run(side ? b : a, side ? a : b, { rounds: 10 }), r = f.result.winner, o = A[arm] = A[arm] || { n: 0, w: 0, d: 0 };
    o.n++; if (r === side) o.w++; else if (r !== 1 - side) o.d++;
  }
}
if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(A) + '\n');
report(A);
function report(A) { console.log("A's win % (decided fights):"); for (const k of Object.keys(A)) { const a = A[k], d = a.n - a.d, q = a.w / Math.max(1, d); console.log('  ' + k.padEnd(7) + (100 * q).toFixed(1) + '% ±' + (100 * Math.sqrt(q * (1 - q) / Math.max(1, d))).toFixed(1) + ' (n' + a.n + ')'); } }
