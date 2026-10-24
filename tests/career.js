// The game's one-fighter career, headless (game/career.js on the engine + career sections of index.html): docs/GAME.md.
//   node tests/career.js [careers 3] [fights 30] [div 4]
// Each career: a random beginner (the create screen's 'random' roll), then offers -> camp (the body + a camp pick) -> the fight -> learn -> rankings.
// Prints one line every 5 fights (record, rank, skill level, OVR, money, age) and the end: belts, peak rank, what he learned.
const fs = require('fs'), src = fs.readFileSync(process.env.LB || 'index.html', 'utf8');
const a = src.indexOf('/* ===== LAST BELL : engine'), b = src.indexOf('/* ===== LAST BELL : render');
const G = new Function(src.slice(a, b) + fs.readFileSync('game/career.js', 'utf8') + `;return {newCareer,genOffers,runCamp,rest,applyResult,playerSheet,oppSheet,Fight,playerRank,lvOf,age,ovr,STATS,genStats,randLook,
  BASE_STYLES,rollGuard,FIRST,LAST,pick,ri,BoxerBrain,FOCUS,camp};`)();
const NC = +process.argv[2] || 3, NF = +process.argv[3] || 30, DIV = process.argv[4] != null ? +process.argv[4] : 4;
const run = (A, B, rounds) => { const f = new G.Fight(A, B, { rounds, cutmanA: .5, cutmanB: .45 }); let n = 0; while (f.phase !== 'over' && n++ < 600000) { f.step(); if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); f.events = []; } return f; };
const t0 = Date.now();
for (let c = 0; c < NC; c++) {
  const style = G.pick(G.BASE_STYLES), stats = G.genStats(G.ri(50, 58), style), pot = {}; G.STATS.forEach(k => pot[k] = Math.min(97, stats[k] + G.ri(16, 42)));
  const save = G.newCareer({ name: G.pick(G.FIRST) + ' ' + G.pick(G.LAST), nick: '', div: DIV, style, guard: G.rollGuard(style), stance: Math.random() < .22 ? 'southpaw' : 'orthodox', stats, pot, look: G.randLook(DIV), age: G.ri(19, 22) });
  const P = save.player, sk0 = G.lvOf(P).avg; let fights = 0, ko = 0;
  console.log(`\n${P.name}, ${style}, ${P.guard}, ${P.stance}, OVR ${G.ovr(P.stats)}, ceiling ${G.ovr(pot)}, skills ${sk0} (${G.lvOf(P).label}), ${P.ht}" / ${P.reach}" reach, flaw ${P.flaw}`);
  while (fights < NF && !P.retired) {
    if (P.injury) { G.rest(save); continue; }
    const offers = G.genOffers(save); if (!offers.length) { G.rest(save); continue; }
    const o = offers.find(x => x.title.length) || offers[Math.min(offers.length - 1, 1)]; // the title shot if there is one, else the even match
    save.pending = { offer: o, campDone: false };
    const weak = Object.keys(P.sk).sort((x, y) => P.sk[x] / P.cap[x] - P.sk[y] / P.cap[y])[0], k = fights % 3; // rotate the camp pick: drill his weakest skill, spar, film
    const r = G.runCamp(save, { gym: P.money > 6000 ? 2 : P.money > 400 ? 1 : 0, focus: ['technique', 'conditioning'], intensity: 'normal', work: k === 0 ? { kind: 'drill', skill: weak } : k === 1 ? { kind: 'spar' } : { kind: 'tape' } });
    if (r.injury) { save.pending = null; continue; }
    const f = run(G.playerSheet(save), G.oppSheet(save, o), o.rounds), out = G.applyResult(save, o, f); fights++;
    if (f.result.winner === 0 && !f.result.decision) ko++;
    if (out.learn.d.cross.length) console.log('   level up:', out.learn.d.cross.map(x => x.join(' -> ')).join(', '));
    if (fights % 5 === 0 || out.notes.length) console.log(`  #${fights} ${P.record.w}-${P.record.l}-${P.record.d} rank ${G.playerRank(save)} | ${o.label} ${o.rounds}r vs ${o.opp.name} (${o.opp.style}) -> ${f.result.winner === 0 ? 'W' : f.result.winner == null ? 'D' : 'L'} ${f.result.method} | skills ${G.lvOf(P).avg} ${G.lvOf(P).label}, OVR ${G.ovr(P.stats)}, $${Math.round(P.money)}, age ${G.age(save).toFixed(1)}${out.notes.length ? ' | ' + out.notes.join(' ') : ''}`);
  }
  if (process.env.SIZES) { const kb = o => (JSON.stringify(o || {}).length / 1024).toFixed(1), Rs = save.world.roster; console.log("save KB: player", kb(P), "(opp memory", kb(P.opp) + ", tape", kb(P.tape) + ", history", kb(P.history) + ") roster", kb(Rs), "(men", Rs.length + ", their memory", kb(Rs.map(f => f.opp)) + ", skills+know", kb(Rs.map(f => [f.sk, f.know])) + ") away", kb(save.world.away)); }
  const top = Object.entries(P.sk).sort((x, y) => y[1] - x[1]).slice(0, 4).map(([k, v]) => k + ' ' + Math.round(v)).join(', ');
  console.log(`END ${P.record.w}-${P.record.l}-${P.record.d} (${P.record.ko} KO), belts ${P.belts.join(',') || '-'}, peak #${P.peakRank}, skills ${sk0} -> ${G.lvOf(P).avg} (${G.lvOf(P).label}), best: ${top}, remembers ${Object.keys(P.opp || {}).length} men${P.scar ? ', scar ' + P.scar.kind : ''}, wear ${Math.round(P.wear)}, save ${(JSON.stringify(save).length / 1024).toFixed(0)} KB`);
}
console.log(`\n${((Date.now() - t0) / 1000).toFixed(0)} s`);
