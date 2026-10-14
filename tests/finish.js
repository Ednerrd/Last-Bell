// finishing and the hurt brain: node tests/finish.js N (brain is the default). Audit-style matchups (ratings 60-90, gaps 0/3/6/10, styles and guards roll).
// Prints stoppages, KDs, knockdowns both ways, same-round stop after a first KD, late comebacks (stopped while ahead on the cards in the last 3 rounds),
// and the brain's own log: hunt spells, how they end (finisher caught = the hunter got hurt), hurt spells and his answers.
// TAG=x: append to /tmp/finish_x.txt; node tests/finish.js agg x pools every run with that TAG.
const fs = require('fs'), OUT = t => '/tmp/finish_' + t + '.txt';
let A = { fights: 0, stop: 0, kd: 0, both: 0, kdFights: 0, firstKd: 0, firstStop: 0, late: 0, lateBehind: 0, kdUpWin: 0, bodyKd: 0 };
let T = {};
if (process.argv[2] === 'agg') {
  for (const l of fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n')) { const o = JSON.parse(l); for (const k in o.A) A[k] = (A[k] || 0) + o.A[k]; for (const k in o.T) T[k] = (T[k] || 0) + o.T[k]; }
  report(); return;
}
const S = require('./sim.js');
const N = +process.argv[2] || 300, st = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
for (let i = 0; i < N; i++) {
  const base = 60 + Math.random() * 30 | 0, gap = [0, 3, 6, 10][i % 4];
  const mk = r => { const s = st[Math.random() * 5 | 0]; return S.sheet(r, s, S.rollGuard(s), Math.random() * 30 | 0); };
  const rounds = [8, 10, 12][i % 3];
  const f = new S.Fight(mk(base + gap / 2 | 0), mk(base - gap / 2 | 0), { rounds });
  let n = 0, first = null; const kds = [0, 0];
  while (f.phase !== 'over' && n < 600000) {
    f.step(); n++;
    for (const e of f.stepEv) if (e.type === 'stoppage') A['why:' + e.why] = (A['why:' + e.why] || 0) + 1;
    for (const e of f.stepEv) if (e.type === 'knockdown') { kds[e.d]++; if (e.zone === 'body') A.bodyKd++; if (!first) first = { round: f.round, d: e.d }; }
    if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1));
  }
  const r = f.result; A.fights++; A.kd += kds[0] + kds[1];
  if (kds[0] && kds[1]) A.both++;
  if (kds[0] + kds[1]) A.kdFights++;
  if (first) { A.firstKd++; if (!r.decision && r.round === first.round && r.winner !== first.d) A.firstStop++; if (r.winner === first.d) A.kdUpWin++; }
  if (!r.decision) {
    A.stop++; A['m:' + r.method] = (A['m:' + r.method] || 0) + 1;
    if (r.round > rounds - 3) { A.late++; const lead = f.lead * (r.winner === 0 ? 1 : -1); if (lead < 0) A.lateBehind++; }
  }
  for (const F of f.f) if (F.brain) { const t = F.brain.tel; for (const k in t) if (typeof t[k] === 'number') T[k] = (T[k] || 0) + t[k]; for (const k in t.hurtR || {}) T['hurt:' + k] = (T['hurt:' + k] || 0) + t.hurtR[k]; }
}
if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify({ A, T }) + '\n');
report();
function report() {
const p = (a, b) => (100 * a / Math.max(1, b)).toFixed(1) + '%';
console.log(`fights ${A.fights} | stoppages ${p(A.stop, A.fights)} | KDs/fight ${(A.kd / A.fights).toFixed(2)} (body ${p(A.bodyKd, A.kd)}) | fights with a KD ${p(A.kdFights, A.fights)}, KDs both ways ${p(A.both, A.fights)}`);
console.log(`after the first KD: stopped that round ${p(A.firstStop, A.firstKd)}, man dropped first wins ${p(A.kdUpWin, A.firstKd)} | late stops (last 3 rds) ${A.late}, by the man behind on the cards ${p(A.lateBehind, A.late)}`);
console.log('how: ' + Object.keys(A).filter(k => /^(m|why):/.test(k)).map(k => k + ' ' + A[k]).join(' '));
if (T.hunts != null) {
  const pf = A.fights * 2;
  console.log(`brain per man per fight: hunts ${(T.hunts / pf).toFixed(2)} (confirm ${p(T.confirm || 0, T.hunts)}, safe ${p(T.huntSafe || 0, T.hunts)}, reckless ${p(T.reckless || 0, T.hunts)}), finisher caught (hurt) ${p(T.caught || 0, T.hunts)}, stung (ate a clean counter) ${p(T.stung || 0, T.hunts)}, capped ${p(T.huntCap || 0, T.hunts)}`);
  console.log(`hurt spells ${(T.hurts / pf).toFixed(2)} | answers ` + Object.keys(T).filter(k => k.startsWith('hurt:')).map(k => k.slice(5) + ' ' + p(T[k], T.hurts)).join(' ') + ` | second picks ${p(T.second || 0, T.hurts)}, shell flips ${T.flip || 0}, desperate rounds ${T.desp || 0}`);
}
}
