// the right hand over the jab (balance pass 1b): ME vs OPP, identical stats + standard guard, sides swapped every other fight.
// Every shot OPP lands on ME, by when it landed against ME's jab: during it (his jab still out: p = phase of the jab), after it (under .8 s since the jab started), else.
// Plus ME's jab, win %, and the tight jab / long guard counts (rs.tj, rs.post) if the engine has them.
//   TAG=x node tests/jabsafe.js 200 [outboxer] [counter]     appends to /tmp/jabsafe_TAG.txt;  node tests/jabsafe.js agg x
const fs = require('fs');
const OUT = t => '/tmp/jabsafe_' + t + '.txt';
const blank = () => ({ n: 0, w: 0, l: 0, d: 0, rd: 0, dmg: 0, hit: {}, jabT: 0, jabL: 0, tj: 0, tjN: 0, post: 0, jam: 0, ojT: 0, ojL: 0, gap: {} });
function add(x, r) { for (const k in r) { if (typeof r[k] === 'number') x[k] = (x[k] || 0) + r[k]; else { x[k] = x[k] || {}; for (const j in r[k]) x[k][j] = (x[k][j] || 0) + r[k][j]; } } }
if (process.argv[2] === 'agg') {
  const by = {};
  for (const r of fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse)) { const k = r.a + ' vs ' + r.b; add(by[k] = by[k] || blank(), r.x); }
  for (const k in by) {
    const x = by[k], f = x.n;
    console.log(`\n${k}: ${(100 * x.w / (x.w + x.l)).toFixed(1)}% (n ${f}, draws ${x.d}), jab ${(x.jabT / x.rd).toFixed(1)}/rd ${(100 * x.jabL / x.jabT).toFixed(1)}%, tight-jab blocks ${(x.tj / f).toFixed(1)}/fight of ${(x.tjN / f).toFixed(1)} tries, posted ${(x.post / x.rd).toFixed(1)} s/rd, jams ${(x.jam / f).toFixed(1)}/fight; his jab ${(x.ojT / x.rd).toFixed(1)}/rd ${(100 * x.ojL / x.ojT).toFixed(1)}%`);
    console.log(`  his damage taken ${(x.dmg / f).toFixed(1)}/fight; by punch and timing vs his jab (landed/fight, % of damage):`);
    const rows = Object.keys(x.hit).filter(h => h.endsWith('#n')).map(h => h.slice(0, -2)).sort((a, b) => x.hit[b + '#d'] - x.hit[a + '#d']);
    for (const h of rows.slice(0, 12)) console.log('   ', h.padEnd(18), (x.hit[h + '#n'] / f).toFixed(1).padStart(5), (100 * x.hit[h + '#d'] / x.dmg).toFixed(1).padStart(5) + '%');
    console.log('  crosses landed after his jab, s since the jab started:', Object.keys(x.gap).sort().map(g => g + ':' + (x.gap[g] / f).toFixed(1)).join(' '));
  }
  return;
}
const S = require('./sim.js');
const N = +process.argv[2] || 200, ME = process.argv[3] || 'outboxer', OPP = process.argv[4] || 'counter', RT = 82;
const x = blank();
for (let i = 0; i < N; i++) {
  const base = S.sheet(RT, 'boxerpuncher', 'standard');
  const mk = s => Object.assign({}, base, { style: s, guard: 'standard', stats: Object.assign({}, base.stats) });
  const sw = i % 2, f = new S.Fight(mk(sw ? OPP : ME), mk(sw ? ME : OPP), { rounds: 10 }), me = sw ? 1 : 0, M = f.f[me];
  let n = 0, rds = 0, jT = -9, jId = 0; const tally = () => { x.jabT += M.rs.thrown - M.rs.thrownPow; x.jabL += M.rs.landedJab; x.tj += M.rs.tj || 0; x.tjN += M.rs.tjN || 0; x.post += M.rs.postT || 0; x.jam += M.rs.jam || 0; const O = f.f[1 - me]; x.ojT += O.rs.thrown - O.rs.thrownPow; x.ojL += O.rs.landedJab; for (const k of ['thrown', 'thrownPow', 'landedJab', 'tj', 'tjN', 'postT', 'jam']) M.rs[k] = O.rs[k] = 0; };
  while (f.phase !== 'over' && n < 600000) {
    f.step(); n++;
    if (M.state === 'punch' && M.act && M.act.type === 'jab' && !M.act.feint && M.act.id !== jId) { jId = M.act.id; jT = f.t - M.act.t; }
    for (const e of f.events) if (e.type === 'hit' && !e.blocked && e.d === me) {
      const D = M, during = D.state === 'punch' && D.act && D.act.type === 'jab' && !D.act.feint, g = f.t - jT;
      const when = during ? 'during' + (D.act.t / D.act.dur < .6 ? '<.6' : '>.6') : g < .8 ? 'after' : 'else', h = e.p + ' ' + when;
      x.hit[h + '#n'] = (x.hit[h + '#n'] || 0) + 1; x.hit[h + '#d'] = (x.hit[h + '#d'] || 0) + e.dmg; x.dmg += e.dmg;
      if (e.p === 'cross' && g < .8) { const b = (Math.floor(g * 10) / 10).toFixed(1); x.gap[b] = (x.gap[b] || 0) + 1; }
    }
    f.events = [];
    if (f.phase === 'corner') { tally(); rds++; f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); }
  }
  tally(); x.rd += rds + (f.result.decision ? 1 : Math.max(.05, f.clock / 180)); x.n++;
  const r = f.result.winner; if (r === me) x.w++; else if (r === 1 - me) x.l++; else x.d++;
}
fs.appendFileSync(OUT(process.env.TAG || 'x'), JSON.stringify({ a: ME, b: OPP, x }) + '\n');
console.log(ME, 'vs', OPP, (100 * x.w / Math.max(1, x.w + x.l)).toFixed(1) + '%', 'n' + N);
