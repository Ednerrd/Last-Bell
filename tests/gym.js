// gym mode smoke test: open a gym, sign walk-ins, train week by week, book and fight (headless), N years
// node tests/gym.js 3
const fs = require('fs');
const src = fs.readFileSync(process.env.LB || 'index.html', 'utf8');
const a = src.indexOf('/* ===== LAST BELL : engine'), b = src.indexOf('/* ===== LAST BELL : render');
const G_ = new Function(src.slice(a, b) + ';const money=n=>"$"+Math.round(n);return {Fight,newGym,bindGym,signWalkin,gymWeek,fightsDue,genOffers,fv,bookFight,playerSheet,oppSheet,applyResult,gymAfterFight,playerRank,ovr,gymP4P,GYMS,GYM_LV,rankList};')();
const yrs = +process.argv[2] || 3;
const G = G_.bindGym(G_.newGym({ name: 'Test Gym', town: 'SF' }));
const log = (...x) => console.log(...x);
let fights = 0, wins = 0;
for (let w = 0; w < yrs * 52; w++) {
  // sign whoever we can afford while there is room
  for (const wk of G.walkins.slice()) { if (G.fighters.length < G_.GYM_LV[G.gym.level].cap && G.gym.money >= wk.fee) { const P = G_.signWalkin(G, wk, wk.kind === 'raw' ? { style: 'boxerpuncher' } : null); if (P) log(`wk${G.week} signed ${P.name} (${wk.kind}, OVR ${G_.ovr(P.stats)}, div ${P.div})`); } }
  // book fights for anyone free
  if (w % 6 === 0) G.fighters.forEach(P => { const ks = ['power','speed','technique','conditioning','toughness','sparring']; P.plan.focus = [ks[(w / 6) % 6], ks[(w / 6 + 3) % 6]]; });
  G.fighters.forEach(P => { if (!P.booked && !P.injury && !(P.busy > 0) && !P.retired) { const v = G_.fv(G, P), offs = G_.genOffers(v); if (offs.length) G_.bookFight(G, P, offs[Math.min(1, offs.length - 1)]); } });
  // fight nights
  for (const P of G_.fightsDue(G)) {
    const v = G_.fv(G, P), o = P.booked.offer;
    const f = new G_.Fight(G_.playerSheet(v), G_.oppSheet(v, o), { rounds: o.rounds, cutmanA: G_.GYMS[P.gym].cut, cutmanB: .45 });
    let n = 0; while (f.phase !== 'over' && n++ < 600000) { f.step(); if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); }
    const out = G_.applyResult(v, o, f); G_.gymAfterFight(G, P, o, f, out);
    fights++; if (f.result.winner === 0) wins++;
  }
  if (G_.gymWeek(G) === null) { log('STUCK at week', G.week); process.exit(1); }
  if (G.gym.level < 3 && G.gym.money > G_.GYM_LV[G.gym.level + 1].cost * 1.5) { G.gym.level++; G_.bindGym(G); log(`wk${G.week} gym upgraded to ${G_.GYMS[G.gym.level].name}`); }
}
log(`\nafter ${yrs} yrs: week ${G.week}, money ${Math.round(G.gym.money)}, rep ${G.gym.rep.toFixed(1)}, level ${G.gym.level}, fights ${fights}, wins ${wins}`);
G.fighters.forEach(P => { const v = G_.fv(G, P); log(` ${P.name} (${P.kind}) ${P.record.w}-${P.record.l}-${P.record.d} OVR ${G_.ovr(P.stats)} rank #${G_.playerRank(v)} belts ${P.belts.join(',') || '-'} wear ${P.wear.toFixed(0)} age ${(P.startAge + G.week / 52).toFixed(1)}`); });
log(' P4P:', G_.gymP4P(G).map(e => e.name).join(', '));
log(' save size', JSON.stringify(G).length);
