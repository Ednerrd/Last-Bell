// how jabs end (1c): node tests/jabprobe.js N [rating]   (LB=copy.html, PATCH pass through)
// per jab thrown: landed, blocked (his active defense / jammed off the long guard / reflex guard), evaded (active slip, pull, parry... / passive), range, wild; parried; countered (the other man lands within .6 s of the jab's end); landed jabs by his state (punching: committed past 30%)
const S = require('./sim.js');
const N = +process.argv[2] || 100, RT = +process.argv[3] || 82, st = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const c = { st: {}, aN: 0, aL: 0, nL: 0, n: 0, landed: 0, bAct: 0, bJam: 0, bRef: 0, evAct: {}, evPas: 0, range: 0, wild: 0, ctr: 0, parry: 0, rd: 0, thr: 0, pT: 0, pL: 0 };
const proto = S.Fight.prototype, res = proto.resolve;
proto.resolve = function (A, D, a) {
  if (a.type !== 'jab') return res.call(this, A, D, a);
  const n = this.events.length, act = D.def && D.state !== 'stun' ? D.def : null, jam0 = D.rs.jam || 0, par0 = D.rs.parry || 0;
  res.call(this, A, D, a);
  c.n++; if ((D.rs.parry || 0) > par0) c.parry++;
  const e = this.events.slice(n).find(e => e.type === 'hit' || e.type === 'miss'); if (!e) return;
  const st0 = D.state === 'punch' ? 'punching' + (D.act && D.act.t / D.act.dur > .3 ? '' : ' (early)') : D.state;
  if (act) c.aN++; if (e.type === 'hit' && !e.blocked) { if (act) c.aL++; else c.nL++; c.st[st0] = (c.st[st0] || 0) + 1; }
  if (e.type === 'hit') { if (!e.blocked) c.landed++; else if ((D.rs.jam || 0) > jam0) c.bJam++; else if (act === 'block' || act === 'roll' || act === 'parry') c.bAct++; else c.bRef++; }
  else if (e.why === 'range') c.range++; else if (e.why === 'wild') c.wild++; else if (e.def) c.evAct[e.def] = (c.evAct[e.def] || 0) + 1; else c.evPas++;
  A.jEnd = this.t;
};
for (let i = 0; i < N; i++) {
  const y1 = st[i % 5], y2 = st[(i * 3 + 1) % 5];
  const f = new S.Fight(S.sheet(RT, y1, S.rollGuard(y1)), S.sheet(RT, y2, S.rollGuard(y2)), {});
  let n = 0, seen = 0;
  while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1));
    for (; seen < f.events.length; seen++) { const e = f.events[seen]; if (e.type === 'hit' && !e.blocked && e.p !== 'jab') { const J = f.f[e.d]; if (J.jEnd != null && f.t - J.jEnd < .6) { c.ctr++; J.jEnd = null; } } } }
  c.rd += f.round * 2;
  for (const F of f.f) { c.thr += F.tot.thrown.jab + F.tot.thrown.power + F.tot.thrown.body; c.pT += F.tot.thrown.power + F.tot.thrown.body; c.pL += F.tot.landed.power + F.tot.landed.body; }
}
const p = x => (100 * x / c.n).toFixed(1);
console.log(`jabs ${(c.n / c.rd).toFixed(1)}/rd (${(100 * c.n / c.thr).toFixed(1)}% of thrown) landed ${p(c.landed)}% | power+body conn ${(100 * c.pL / c.pT).toFixed(1)}%`);
console.log(`blocked: active ${p(c.bAct)} jammed ${p(c.bJam)} reflex ${p(c.bRef)} | evaded: ${Object.keys(c.evAct).map(k => k + ' ' + p(c.evAct[k])).join(' ')} passive ${p(c.evPas)} | range ${p(c.range)} wild ${p(c.wild)} | parried ${p(c.parry)} | countered ${p(c.ctr)}`);
console.log('landed jabs by his state: ' + Object.keys(c.st).map(k => k + ' ' + (100 * c.st[k] / c.landed).toFixed(1)).join(' | '));
console.log(`his defense up at contact ${p(c.aN)}% (lands ${(100 * c.aL / c.aN).toFixed(1)}%), none ${p(c.n - c.aN)}% (lands ${(100 * c.nL / (c.n - c.aN)).toFixed(1)}%)`);
