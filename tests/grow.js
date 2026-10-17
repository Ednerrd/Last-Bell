// L4b growth check (docs/LEARN.md 2): prospects learn through a career vs a field near their level (the field doesn't learn).
//   TAG=x node tests/grow.js 10 40      (10 prospects x 40 fights; appends one line per prospect to /tmp/grow_x.txt; run x4)
//   node tests/grow.js agg x            fights to Intermediate / Pro / World by talent (rating), win % by stretch, the snowball check
// Pace targets (Ed: realistic): Novice -> Intermediate ~8-15 fights, Intermediate -> Pro ~15-30 more, World class only with the talent.
const fs = require('fs'), OUT = t => '/tmp/grow_' + t + '.txt';
if (process.argv[2] === 'agg') { agg(fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse)); return; }
const S = require('./sim.js'), ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), K = S.BoxerBrain.SKILL_KEYS, pick = a => a[Math.floor(Math.random() * a.length)];
const P = +process.argv[2] || 10, NF = +process.argv[3] || 40, avg = sk => K.reduce((t, k) => t + sk[k], 0) / K.length;
const rds = i => i < 4 ? 4 : i < 10 ? 6 : i < 20 ? 8 : 10;
for (let p = 0; p < P; p++) {
  const st = pick(ALL), rating = 70 + Math.random() * 20 | 0, me = S.sheet(rating, st, S.rollGuard(st), 0);
  me.stance = Math.random() < .2 ? 'southpaw' : 'orthodox'; me.age = 20 + Math.random() * 4 | 0; S.skillSheet(me, 'beginner'); S.learnInit(me);
  const o = { rating, style: st, age0: me.age, cap: Math.round(avg(me.cap)), traj: [Math.round(avg(me.sk) * 10) / 10], w: [], ko: 0, cross: {} };
  for (let i = 0; i < NF; i++) {
    const ost = pick(ALL), opp = S.sheet(Math.round(rating + Math.random() * 8 - 4), ost, S.rollGuard(ost), 0); opp.stance = Math.random() < .2 ? 'southpaw' : 'orthodox';
    opp.sk = S.skMake(avg(me.sk) + Math.random() * 12 - 6, ost); // matched near his level
    const side = i & 1, f = S.run(side ? opp : me, side ? me : opp, { rounds: rds(i) });
    const d = S.learn(me, f, side); S.applyLearn(me, d);
    o.w.push(f.result.winner === side ? 1 : f.result.winner === 1 - side ? 0 : .5); if (f.result.winner === 1 - side && !f.result.decision) o.ko++;
    if ((i + 1) % (i < 40 ? 8 : 3) === 0) me.age++; // the early (amateur) fights come fast, then ~3 a year
    o.traj.push(Math.round(avg(me.sk) * 10) / 10);
  }
  o.sk = Object.fromEntries(K.map(k => [k, Math.round(me.sk[k])])); o.age = me.age;
  o.know = { base: +(ALL.reduce((t, k) => t + me.know.style[k], 0) / ALL.length).toFixed(2), south: me.know.stance.southpaw };
  if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(o) + '\n');
  console.log('rating', rating, st.padEnd(12), 'cap', o.cap, 'avg', o.traj.filter((_, j) => j % 10 === 0).join(' > '), '> ' + o.traj[o.traj.length - 1], 'w', (100 * o.w.reduce((a, b) => a + b, 0) / NF | 0) + '%');
}
function agg(L) {
  const T = [46, 66, 84], band = r => r < 76 ? '70-75' : r < 84 ? '76-83' : '84-89', B = {};
  for (const o of L) { const b = B[band(o.rating)] = B[band(o.rating)] || { n: 0, at: [[], [], []], end: 0, cap: 0, w: [0, 0, 0, 0] };
    b.n++; b.end += o.traj[o.traj.length - 1]; b.cap += o.cap; T.forEach((t, j) => { const i = o.traj.findIndex(v => v >= t); b.at[j].push(i < 0 ? null : i); });
    for (let q = 0; q < 4; q++) { const s = o.w.slice(q * o.w.length / 4, (q + 1) * o.w.length / 4); b.w[q] += s.reduce((a, c) => a + c, 0) / Math.max(1, s.length); } }
  const med = a => { const v = a.filter(x => x != null).sort((x, y) => x - y); return v.length ? v[v.length >> 1] + ' (' + v.length + '/' + a.length + ')' : '-'; };
  console.log('fights:', L[0].traj.length - 1, '| fights to reach (median, how many got there): Intermediate 46 / Pro 66 / World 84');
  for (const b of Object.keys(B).sort()) { const x = B[b]; console.log(('rating ' + b).padEnd(14), ('n' + x.n).padEnd(5), 'I', med(x.at[0]).padEnd(10), 'P', med(x.at[1]).padEnd(10), 'W', med(x.at[2]).padEnd(10), 'avg skill end', (x.end / x.n).toFixed(1), 'cap', (x.cap / x.n).toFixed(0), '| win % by quarter', x.w.map(v => (100 * v / x.n).toFixed(0)).join(' / ')); }
  // snowball: same talent band, the early winners (first 10 fights) vs the early losers: skill at the end, over where they started
  const sn = []; for (const b of Object.keys(B)) { const g = L.filter(o => band(o.rating) === b).map(o => ({ e: o.w.slice(0, 10).reduce((a, c) => a + c, 0), s: o.traj[o.traj.length - 1] - o.cap })); if (g.length < 4) continue;
    g.sort((x, y) => x.e - y.e); const h = g.length >> 1, lo = g.slice(0, h), hi = g.slice(g.length - h), m = a => a.reduce((t, x) => t + x.s, 0) / a.length; sn.push(b + ': winners ' + m(hi).toFixed(1) + ' vs losers ' + m(lo).toFixed(1)); }
  const kb = L.filter(o => o.know); if (kb.length) console.log('know at the end: base styles', (kb.reduce((t, o) => t + o.know.base, 0) / kb.length).toFixed(2), '| southpaw', (kb.reduce((t, o) => t + o.know.south, 0) / kb.length).toFixed(2), '| age at the end', (L.reduce((t, o) => t + o.age, 0) / L.length).toFixed(1));
  console.log('snowball (end skill minus his cap, early winners vs early losers, same band):', sn.join(' | '));
}
