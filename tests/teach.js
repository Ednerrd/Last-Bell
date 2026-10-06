// corner as teacher: what the corner's calls leave behind, round by round (dev log).
// Side 0's corner shouts by the smart policy (or oracle), side 1 stays quiet. Mirrored stats.
//   node tests/teach.js 200 82 [smart|oracle|body|jab|...] [exp]   exp = career fights for side 0 (default 20); a call name = only that call
//   QUIET=3: the corner only talks in rounds 1-3, so rounds 4+ show what stuck. Control: PATCH="TEACH.max=0"
// Per round: lesson strength at the bell (sum over calls) and after the break (x TEACH.keep), how much of the
// bell figure was carried in from earlier rounds, payoffs taught, and side 0's body share / punches per round
// while no call is live (the lesson's own effect, without the shout on top).
const S = require('./sim.js');
const N = +process.argv[2] || 200, RT = +process.argv[3] || 82, pol = process.argv[4] || 'smart', EXP = process.argv[5] == null ? 20 : +process.argv[5];
const styles = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), gs = Object.keys(S.GUARDS), keys = Object.keys(S.SHOUTS);
function smart(f) {
  const F = f.f[0], O = F.op, hurt = X => X.state === 'stun' || X.head < X.headMax * .35;
  if (hurt(F)) return 'hands'; if (hurt(O)) return 'press'; if (f.trapped(F)) return 'move';
  if (F.stam < F.stamMax * .4) return 'move';
  if (O.guard === 'high' || O.guard === 'cross' || O.body < 60) return 'body';
  return F.rs.landedPow + F.rs.landedJab < O.rs.landedPow + O.rs.landedJab ? 'counter' : 'jab';
}
const oracle = f => { let best = null, bf = .5; for (const k of keys) { const v = f.shoutFit(f.f[0], k); if (v > bf) { bf = v; best = k; } } return best; };
const P = pol === 'oracle' ? oracle : pol === 'smart' ? smart : () => pol, QUIET = +process.env.QUIET || 99;
const rows = [], sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
let w = 0, l = 0, learned = 0, byK = {};
for (let i = 0; i < N; i++) {
  const st = styles[i % styles.length], g = gs[(i / styles.length | 0) % gs.length];
  const A = S.sheet(RT, st, g, EXP), B = Object.assign({}, A, { stats: Object.assign({}, A.stats), exp: 20 });
  const f = new S.Fight(A, B, { rounds: 10 }); let n = 0, next = 3, rd = 1, carry = 0;
  const F = f.f[0]; let cur = { teach: 0, free: 0, body: 0, all: 0, jab: 0 }, lastLv = 0, lastSum = 0;
  while (f.phase !== 'over' && n < 600000) {
    f.step(); n++;
    if (f.phase === 'fight' && f.round <= QUIET && f.t >= next) { const k = P(f); if (k && !(F.order && F.order.k === k && F.order.t > 6)) { f.shout(0, k); next = f.t + 8; } else next = f.t + .5; }
    const les = sum(F.read.les); if (les > lastSum + 1e-9) cur.teach++; lastSum = les;
    for (const e of f.events) {
      if (e.type === 'learned' && e.a === 0) { learned++; byK[e.k] = (byK[e.k] || 0) + 1; }
      if (e.type === 'throw' && e.a === 0) { cur.all++; if (e.p === 'jab' || e.p === 'bodyJab') cur.jab++; if (/^body/.test(e.p)) cur.ball = (cur.ball || 0) + 1; }
      if (e.type === 'throw' && e.a === 0 && !F.order) { cur.free++; if (/^body/.test(e.p)) cur.body++; }
    }
    f.events = [];
    if (f.phase === 'corner') {
      const bell = sum(F.read.les), les = Object.assign({}, F.read.les);
      if (!f.nextRound(f.aiStrategy(0), f.aiStrategy(1))) break;
      const after = sum(F.read.les);
      (rows[rd] = rows[rd] || []).push({ bell, after, carry, teach: cur.teach, free: cur.free, body: cur.body, all: cur.all, jab: cur.jab, ball: cur.ball || 0, les });
      carry = after; lastSum = after; cur = { teach: 0, free: 0, body: 0, all: 0, jab: 0 }; rd++;
    }
  }
  const r = f.result.winner; if (r === 0) w++; else if (r === 1) l++;
}
const avg = (a, k) => a.reduce((s, x) => s + x[k], 0) / a.length;
console.log(`policy ${pol}  exp ${EXP}  n ${N}  side 0 win ${(100 * w / (w + l)).toFixed(1)}%  'learned' events/fight ${(learned / N).toFixed(2)} ${JSON.stringify(byK)}`);
console.log('rd  fights  lesson@bell  after break  carried in  carried share  payoffs  free punches  body% free  thrown  jab%  body%');
for (let r = 1; r < rows.length; r++) {
  const a = rows[r]; if (!a) continue;
  const bell = avg(a, 'bell'), carry = avg(a, 'carry'), fr = a.reduce((s, x) => s + x.free, 0), bd = a.reduce((s, x) => s + x.body, 0);
  console.log(String(r).padStart(2), String(a.length).padStart(7), bell.toFixed(3).padStart(12), avg(a, 'after').toFixed(3).padStart(12), carry.toFixed(3).padStart(11),
    ((bell ? 100 * carry / bell : 0).toFixed(0) + '%').padStart(14), avg(a, 'teach').toFixed(1).padStart(8), (fr / a.length).toFixed(1).padStart(13), ((fr ? 100 * bd / fr : 0).toFixed(1) + '%').padStart(10), avg(a, 'all').toFixed(1).padStart(7), (100 * a.reduce((s, x) => s + x.jab, 0) / a.reduce((s, x) => s + x.all, 0)).toFixed(1).padStart(5) + '%', (100 * a.reduce((s, x) => s + x.ball, 0) / a.reduce((s, x) => s + x.all, 0)).toFixed(1).padStart(5) + '%');
}
const k1 = {}; for (const a of rows.slice(1)) if (a) for (const x of a) for (const k in x.les) k1[k] = (k1[k] || 0) + x.les[k];
const tot = rows.slice(1).reduce((s, a) => s + (a ? a.length : 0), 0);
console.log('mean lesson at the bell by call:', Object.entries(k1).map(([k, v]) => k + ' ' + (v / tot).toFixed(3)).join('  '));
