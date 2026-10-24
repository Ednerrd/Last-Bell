/* ===== LAST BELL : game career (game/build.js puts this in game.html; the fight engine and fighter gen come from index.html) =====
   The one-fighter career from before the Oct 10 cut (51ee63f^), rewired onto today's engine (docs/GAME.md):
   - the body (stats) still grows in camp and fades with age, the old way (FOCUS, INTENSITY, rest, age);
   - the skills (P.sk), what he knows of styles and stances (P.know), his talent caps (P.cap), the men he remembers (P.opp),
     KO scars (P.scar) and film (P.tape) live on the player and change through learn()/applyLearn() after every fight and camp() before it;
   - every man in the world gets skills off his record (skFromRecord) and a fixed height and reach (sizeOf) the first time he's needed (ready()). */
const STAT_LABEL = { power: 'Power', speed: 'Hand speed', accuracy: 'Accuracy', defense: 'Head movement', footwork: 'Footwork', chin: 'Chin', body: 'Body toughness', stamina: 'Stamina', recovery: 'Recovery', heart: 'Heart' };
const ORGS = [
  { k: 'WPC', name: 'World Prize Council', c: '#c9a24a' },
  { k: 'GRF', name: 'Global Ring Federation', c: '#9b2a24' },
  { k: 'IFU', name: 'International Fist Union', c: '#4b7896' },
  { k: 'RUO', name: 'Ring Union Organization', c: '#3f7a52' }
];
const TIERS = {
  club: { label: 'Club show', venue: 'gym', purse: [500, 1600] },
  regional: { label: 'Regional card', venue: 'hall', purse: [3000, 14000] },
  tv: { label: 'TV undercard', venue: 'civic', purse: [25000, 120000] },
  main: { label: 'Main event', venue: 'coliseum', purse: [150000, 650000] },
  title: { label: 'World title fight', venue: 'vegas', purse: [700000, 4500000] }
};
const GYMS = [
  { name: 'Garage gym', cost: 0, mult: .6, cut: .25, note: 'Free. Rusted bags, no cutman worth the name.' },
  { name: 'Neighborhood club', cost: 400, mult: .85, cut: .35, note: 'Real coaches, real sparring.' },
  { name: 'Pro training center', cost: 6000, mult: 1.1, cut: .5, note: 'Strength staff and a good cutman.' },
  { name: 'Elite fight camp', cost: 45000, mult: 1.35, cut: .62, note: 'Where champions get built.' }
];
const FOCUS = {
  power: { label: 'Strength & power', stats: ['power', 'body'] },
  speed: { label: 'Speed drills', stats: ['speed', 'footwork'] },
  technique: { label: 'Pads & technique', stats: ['accuracy', 'defense'] },
  conditioning: { label: 'Roadwork', stats: ['stamina', 'recovery'] },
  toughness: { label: 'Neck & core', stats: ['chin', 'heart'] },
  sparring: { label: 'Hard sparring', stats: ['accuracy', 'defense', 'heart', 'footwork'], small: true }
};
const INTENSITY = [
  { k: 'light', label: 'Light', mult: .7, inj: .3 },
  { k: 'normal', label: 'Normal', mult: 1, inj: 1 },
  { k: 'hard', label: 'Hard', mult: 1.35, inj: 2.2 }
];
const ADDONS = {
  sci: { label: 'Sports science team', cost: 12000, desc: 'Slows decline, lowers injury risk, heals wear' },
  spar: { label: 'Elite sparring partners', cost: 7000, desc: 'Bigger gains on your focus' }
};
const INJURIES = [
  { k: 'cut', name: 'Bad cut over the eye', weeks: 5 },
  { k: 'hand', name: 'Broken hand', weeks: 12 },
  { k: 'rib', name: 'Cracked rib', weeks: 9 },
  { k: 'conc', name: 'Concussion', weeks: 10, perm: { chin: -3 } },
  { k: 'ankle', name: 'Sprained ankle', weeks: 6 },
  { k: 'shoulder', name: 'Torn shoulder', weeks: 14, perm: { power: -2 } }
];
// ---------- legends: one per division, the only man in the world who fights his style. Beat him and it is yours to learn ----------
const LEGENDS = [
  { name: 'Román Gonzalo', nick: 'Chocolatito', style: 'volume', guard: 'high', stance: 'orthodox', rating: 91, age: 31, rec: [50, 3, 41] },
  { name: 'Vasyl Lomachuk', nick: 'Hi-Tech', style: 'angle', guard: 'standard', stance: 'southpaw', rating: 92, age: 30, rec: [17, 2, 11] },
  { name: 'Nazir Hameed', nick: 'The Prince', style: 'awkward', guard: 'handslow', stance: 'southpaw', rating: 89, age: 27, rec: [36, 0, 31] },
  { name: 'Terrance Crawfield', nick: 'Bud', style: 'switch', guard: 'standard', stance: 'orthodox', rating: 91, age: 33, rec: [40, 0, 31] },
  { name: 'Ricky Hattersley', nick: 'The Hitman', style: 'body', guard: 'peekaboo', stance: 'orthodox', rating: 89, age: 29, rec: [45, 1, 32] },
  { name: 'Gennadi Golovko', nick: 'Triple G', style: 'pboxer', guard: 'high', stance: 'orthodox', rating: 91, age: 34, rec: [42, 1, 37] },
  { name: 'Bernie Hoskins', nick: 'The Alien', style: 'spoiler', guard: 'philly', stance: 'orthodox', rating: 90, age: 40, rec: [55, 7, 32] },
  { name: 'Oleks Usykenko', nick: 'The Cat', style: 'feinter', guard: 'standard', stance: 'southpaw', rating: 91, age: 33, rec: [21, 0, 14] },
  { name: 'Vlad Klitchenko', nick: 'Dr. Steelhammer', style: 'jabgrab', guard: 'standard', stance: 'orthodox', rating: 91, age: 32, rec: [64, 5, 53] }
];
function genLegend(divIdx) {
  const L = LEGENDS[divIdx]; if (!L) return null;
  const f = genFighter(divIdx, L.rating, 400 + rnd(0, 25), L.age);
  return Object.assign(f, { id: 'L' + divIdx, name: L.name, nick: L.nick, style: L.style, guard: L.guard, stance: L.stance, legend: true, stats: genStats(L.rating, L.style), record: { w: L.rec[0], l: L.rec[1], d: 0, ko: L.rec[2] } });
}
// every division has its legend, and he stays near the top
function ensureLegend(roster, divIdx) {
  if (!roster.some(f => f.legend)) { const lg = genLegend(divIdx); if (lg) roster.push(lg); }
  roster.sort((a, b) => b.points - a.points);
  const i = roster.findIndex(f => f.legend);
  if (i > 4) { roster[i].points = roster[4].points + 1; roster.sort((a, b) => b.points - a.points); }
  return roster;
}
function genRoster(divIdx) {
  const r = [];
  for (let i = 0; i < 40; i++) {
    const t = i / 39;
    const rating = Math.round(clamp(lerp(88, 58, Math.pow(t, .8)) + gauss() * 2.5, 55, 93));
    r.push(genFighter(divIdx, rating, lerp(430, 40, Math.pow(t, .9)) + rnd(-8, 8)));
  }
  r.sort((a, b) => b.points - a.points);
  return ensureStars(ensureLegend(r, divIdx), divIdx);
}
function ensureStars(roster, divIdx) {
  P4P_2026.forEach((S, i) => { if (S.div === divIdx && !roster.some(f => f.id === 'S' + i)) roster.push(genStar(i)); });
  roster.sort((a, b) => b.points - a.points);
  roster.forEach((f, i) => { if (f.star && i > 4) f.points = roster[4].points + 1; });
  return roster.sort((a, b) => b.points - a.points);
}
// a man of the world, ready to fight: skills off his record (refreshed every few fights), size and flaw fixed for good
const SK_REFRESH = 4;
function ready(f, div) {
  if (f.div == null) f.div = div;
  const n = f.record ? f.record.w + f.record.l + f.record.d : 0;
  if (!f.sk || n - (f.skN || 0) >= SK_REFRESH) { skFromRecord(f, f.record || { w: 0, l: 0, d: 0 }, f.rating); f.skN = n; }
  if (f.ht == null || f.reach == null) { const z = sizeOf({ name: f.name, style: f.style, stats: f.stats, div: f.div }); f.ht = Math.round(z.ht * 10) / 10; f.reach = Math.round(z.reach * 10) / 10; }
  if (f.flaw === undefined) f.flaw = flawOf(f, brainStyle(domStyle(f))[0], f.sk);
  return f;
}
// his skills, level and flaw on the brain's scale (the player and world men alike)
const lvOf = f => BoxerBrain.tierOf(f.sk);
function newCareer(p) {
  // p: {name, nick, div, style, stance, stats, look, pot}
  const roster = genRoster(p.div);
  const belts = {};
  ORGS.forEach((o, i) => { belts[o.k] = roster[i < 2 ? 0 : i - 1].id; }); // top guy may hold two
  const s = {
    v: 2, savedAt: Date.now(), week: 0,
    player: {
      id: 'P', name: p.name, nick: p.nick || '', div: p.div, style: p.style, baseStyle: p.style, guard: p.guard || 'standard', stance: p.stance,
      stats: p.stats, pot: p.pot, look: p.look, startAge: p.age || 21,
      record: { w: 0, l: 0, d: 0, ko: 0 }, points: 0, money: 800, gym: 0, wear: 0,
      injury: null, belts: [], history: [], earnings: 0, owned: ['t_black', 't_ox', 'g_red', 'g_black', 's_black', 's_white'],
      retired: false, peakRank: null, titleDefenses: 0, campDone: false, exp: 0
    },
    world: { div: p.div, roster, belts },
    pending: null
  };
  newSkills(s.player); return s;
}
// the brain side of a new man: a beginner's skills, his talent caps off his ceiling (pot), his size and flaw for good
function newSkills(P, rng) {
  skillSheet(P, 'beginner', rng);
  const t = learnInit({ name: P.name, style: P.style, stats: P.pot, sk: P.sk, know: P.know }, rng); P.cap = t.cap; learnInit(P, rng);
  const z = sizeOf({ name: P.name, style: P.style, stats: P.stats, div: P.div }); P.ht = Math.round(z.ht * 10) / 10; P.reach = Math.round(z.reach * 10) / 10;
  P.flaw = flawOf(P, brainStyle(domStyle(P))[0], P.sk);
  return P;
}
function age(save) { return save.player.startAge + save.week / 52; }
function rankList(save) {
  const P = save.player;
  const list = save.world.roster.map(f => ({ id: f.id, name: f.name, points: f.points, rating: f.rating, record: f.record, f }));
  // a gym can have more than one man in the division: stablemates are ranked too (they never fight each other)
  list.push({ id: P.id, name: P.name, points: P.points, rating: ovr(P.stats), record: P.record, isPlayer: true });
  list.sort((a, b) => b.points - a.points);
  return list;
}
function playerRank(save) { return rankList(save).findIndex(e => e.isPlayer) + 1; }
function beltsOf(save, id) { return ORGS.filter(o => save.world.belts[o.k] === id).map(o => o.k); }
function findFighter(save, id) { return save.world.roster.find(f => f.id === id); }

function p4p(save) {
  const P = save.player; const out = [];
  P4P_2026.forEach(S => { if (S.div !== save.world.div) out.push({ name: S.name, div: DIVS[S.div].name, score: S.rating + 3, belts: 0 }); });
  LEGENDS.forEach((L, d) => { if (d !== save.world.div) out.push({ name: L.name, div: DIVS[d].name, score: L.rating + 3, belts: 0 }); });
  save.world.roster.slice(0, 6).forEach(f => { const b = beltsOf(save, f.id).length; out.push({ name: f.name, div: DIVS[save.world.div].name, score: f.rating + b * 2.5 + (f.record.l === 0 ? 3 : 0), belts: b }); });
  const pr = playerRank(save);
  if (pr <= 15) out.push({ name: P.name, div: DIVS[P.div].name, score: ovr(P.stats) + P.belts.length * 2.5 + (P.record.l === 0 && P.record.w > 12 ? 3 : 0) - (pr > 5 ? 3 : 0), belts: P.belts.length, isPlayer: true });
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, 10);
}

function purseFor(save, tier, oppPoints, isTitle) {
  const T = TIERS[tier]; const P = save.player; const div = DIVS[P.div];
  const caps = { club: 35, regional: 110, tv: 240, main: 430, title: 430 };
  const q = clamp((Math.max(P.points, oppPoints) / caps[tier]) * .7 + R() * .3 + (P.belts.length ? .25 : 0), 0, 1);
  let v = lerp(T.purse[0], T.purse[1], q) * div.pay;
  if (isTitle && P.belts.length) v *= 1 + P.belts.length * .3;
  return Math.round(v / 50) * 50;
}
function tierFor(save, oppPoints, title) {
  if (title) return 'title';
  const p = Math.max(save.player.points, oppPoints || 0);
  return p < 35 ? 'club' : p < 110 ? 'regional' : p < 240 ? 'tv' : 'main';
}
function roundsFor(save, tier) {
  if (tier === 'club') return save.player.record.w + save.player.record.l < 3 ? 4 : 6;
  return { regional: 8, tv: 10, main: R() < .5 ? 10 : 12, title: 12 }[tier];
}
function genOffers(save) {
  const P = save.player; if (P.injury) return [];
  const pO = ovr(P.stats); const offers = [];
  const mk = (opp, title, label) => {
    const tier = tierFor(save, opp.points, !!(title && title.length));
    return { opp, oppId: opp.id, title: title || [], tier, label: label || TIERS[tier].label, rounds: roundsFor(save, tier), purse: purseFor(save, tier, opp.points, !!(title && title.length)), venue: TIERS[tier].venue };
  };
  if (P.points < 30) {
    [[-12, -5, 'Tune-up'], [-6, 1, 'Even match'], [-1, 6, 'Step up']].forEach(([a, b, lbl]) => {
      const r = clamp(pO + ri(a, b), 30, 75);
      const f = genFighter(P.div, r, rnd(2, 28), ri(19, 36));
      f.record = { w: ri(0, 8), l: ri(0, 9), d: R() < .2 ? 1 : 0, ko: 0 }; f.record.ko = Math.round(f.record.w * rnd(.2, .7)); f.club = true;
      offers.push(mk(f, null, lbl));
    });
    return offers;
  }
  const list = rankList(save).filter(e => !e.isPlayer); const r = playerRank(save) - 1;
  const take = (lo, hi) => { const c = list.slice(clamp(lo, 0, list.length - 1), clamp(hi, 1, list.length)); return c.length ? pick(c).f : null; };
  const used = new Set();
  const add = (f, title, lbl) => { if (f && !used.has(f.id)) { used.add(f.id); offers.push(mk(f, title, lbl)); return true; } return false; };
  // defenses / title shots
  if (P.belts.length) {
    const contender = list[0].f; const b = P.belts.slice();
    add(contender, b, 'Mandatory defense');
  }
  if (r <= 4) {
    const notMine = ORGS.filter(o => !P.belts.includes(o.k)).map(o => o.k);
    if (notMine.length) {
      const holderId = save.world.belts[notMine[0]];
      const holder = findFighter(save, holderId);
      if (holder) { const onLine = beltsOf(save, holder.id).filter(k => !P.belts.includes(k)); add(holder, P.belts.length ? onLine.concat(P.belts) : onLine, P.belts.length ? 'Unification' : 'Title shot'); }
    }
  }
  let tries = 0;
  while (offers.length < 3 && tries++ < 20) {
    const k = offers.length;
    if (k === 0) add(take(r + 2, r + 9), null, 'Tune-up');
    else if (k === 1) add(take(r - 2, r + 3), null, 'Even match');
    else add(take(r - 8, r - 1), null, 'Step up');
    if (tries > 6 && offers.length < 3) add(take(0, list.length), null, 'Open offer');
  }
  return offers.slice(0, 3);
}

const STYLE_LEARN = { first: .55, camp: .3, fight: .08 }; // fluency: first camp of a new style/stance, each camp after, each fight
function learnRate(P, G) { return G.mult * (.8 + .4 * clamp((ringIQ({ stats: P.stats, exp: P.record.w + P.record.l + P.record.d }) - 35) / 55, 0, 1)); }
function settleStyle(P, notes) {
  if (P.styleFrom && P.styleFit >= 1) { delete P.styleFrom; P.styleFit = 1; if (notes) notes.push('The ' + STYLES[P.style].label.toLowerCase() + ' style is his now. He fights it like he was born to.'); }
  if (P.stanceFit != null && P.stanceFit >= 1) { delete P.stanceFit; if (notes) notes.push('Fighting ' + P.stance + ' feels natural now.'); }
}
// his style is locked in: the one he was built with, plus any legend's style he has earned
function campStyles(P) { return Array.from(new Set([P.baseStyle || P.style, ...(P.unlocked || [])])); }
function campCost(plan) { let c = GYMS[plan.gym].cost; if (plan.sci) c += ADDONS.sci.cost; if (plan.spar) c += ADDONS.spar.cost; return c; }
function runCamp(save, plan) {
  // plan: {gym, focus:[k,k], intensity, sci, spar} or null for rest
  const P = save.player; const a = age(save); const before = Object.assign({}, P.stats); const notes = [];
  const G = GYMS[plan.gym]; const I = INTENSITY.find(i => i.k === plan.intensity) || INTENSITY[1];
  const ageGain = a < 26 ? 1.15 : a < 30 ? 1 : a < 33 ? .75 : a < 36 ? .45 : .2;
  const focused = new Set();
  plan.focus.forEach(fk => {
    const F = FOCUS[fk]; if (!F) return;
    F.stats.forEach(k => {
      focused.add(k);
      const room = Math.max(0, 1 - P.stats[k] / Math.max(P.stats[k] + 1, P.pot[k]));
      let g = 5 * G.mult * I.mult * ageGain * Math.pow(room, .5) * rnd(.7, 1.3) * (F.small ? .55 : 1) * (plan.spar ? 1.2 : 1);
      if (k === 'chin') g *= .35;
      P.stats[k] = Math.min(P.pot[k], P.stats[k] + g);
    });
  });
  const decayBase = (0.08 + Math.max(0, a - 29) * 0.35) * (plan.sci ? .6 : 1);
  STATS.forEach(k => { if (!focused.has(k)) P.stats[k] = Math.max(20, P.stats[k] - decayBase * rnd(.4, 1.4)); });
  if (P.wear > 30) P.stats.chin = Math.max(20, P.stats.chin - (P.wear - 30) * .006);
  if (plan.sci) P.wear = Math.max(0, P.wear - 3);
  let injury = null;
  const injCh = .03 * I.inj * (plan.sci ? .5 : 1) * (plan.focus.includes('sparring') ? 1.6 : 1);
  if (R() < injCh) { injury = Object.assign({}, pick(INJURIES.filter(i => i.k !== 'conc'))); injury.weeks = Math.round(injury.weeks * .7); injury.source = 'camp'; P.injury = injury; notes.push('Got hurt in camp: ' + injury.name.toLowerCase() + '. Fight is off.'); }
  // new style / new stance: takes a focus slot, and he is only part of the way there after one camp
  const lm = learnRate(P, G);
  if (plan.learn && plan.learn !== P.style && STYLES[plan.learn] && campStyles(P).includes(plan.learn)) {
    const f = P.styleFrom ? P.styleFit : 1;
    if (plan.learn === P.styleFrom) { P.styleFrom = P.style; P.styleFit = Math.max(.5, 1 - f); }
    else { P.styleFrom = P.styleFrom && f < .5 ? P.styleFrom : P.style; P.styleFit = STYLE_LEARN.first * lm; }
    P.style = plan.learn;
    notes.push('Started learning the ' + STYLES[P.style].label.toLowerCase() + ' style. About ' + Math.round(P.styleFit * 100) + '% there. It will still look like the old him on fight night.');
  } else if (P.styleFrom) { P.styleFit = Math.min(1, P.styleFit + STYLE_LEARN.camp * lm); notes.push('The ' + STYLES[P.style].label.toLowerCase() + ' style is coming along: ' + Math.round(P.styleFit * 100) + '%.'); }
  if (plan.stance) {
    P.stanceFit = P.stanceFit != null && P.stanceFit < 1 ? Math.max(.5, 1 - P.stanceFit) : STYLE_LEARN.first * lm;
    P.stance = P.stance === 'southpaw' ? 'orthodox' : 'southpaw';
    notes.push('Switched to ' + P.stance + '. Still rusty: ' + Math.round(P.stanceFit * 100) + '%.');
  } else if (P.stanceFit != null) P.stanceFit = Math.min(1, P.stanceFit + STYLE_LEARN.camp * lm);
  settleStyle(P, notes);
  let work = null;
  if (!injury && plan.work && save.pending) { P.age = a; work = camp(P, plan.work, oppSheet(save, save.pending.offer)); } // L4d
  P.money -= campCost(plan);
  save.week += 8;
  P.campDone = !injury;
  const delta = {}; STATS.forEach(k => delta[k] = P.stats[k] - before[k]);
  worldSim(save, 8);
  return { delta, injury, notes, work };
}
function rest(save) {
  const P = save.player; const a = age(save); const wk = P.injury ? Math.min(P.injury.weeks, 8) : 6;
  const decay = (0.15 + Math.max(0, a - 29) * 0.45) * 1.3;
  const before = Object.assign({}, P.stats);
  STATS.forEach(k => P.stats[k] = Math.max(20, P.stats[k] - decay * rnd(.5, 1.4) * (wk / 6)));
  P.wear = Math.max(0, P.wear - 4);
  if (P.injury) { P.injury.weeks -= wk; if (P.injury.weeks <= 0) P.injury = null; }
  save.week += wk; worldSim(save, wk);
  const delta = {}; STATS.forEach(k => delta[k] = P.stats[k] - before[k]);
  return { weeks: wk, delta, healed: !P.injury };
}

function applyResult(save, offer, fight) {
  const P = save.player; const res = fight.result; const me = fight.f[0];
  const opp = offer.opp.club ? offer.opp : (findFighter(save, offer.oppId) || offer.opp);
  const win = res.winner === 0, draw = res.winner == null, loss = res.winner === 1;
  const stop = !res.decision; const out = { notes: [], pointsBefore: P.points, rankBefore: playerRank(save) };
  const isTitle = offer.title.length > 0;
  if (!draw) { const me = { name: P.name, isPlayer: true, wins: [] }; noteFight(win ? me : opp, win ? opp : me, { ko: stop, t: isTitle ? offer.title.filter(k => win ? save.world.belts[k] === opp.id : true) : [], r: win ? (opp.club ? null : rankList(save).findIndex(e => e.id === opp.id) + 1) : out.rankBefore, wk: save.week }); }
  else { if (opp.wins === undefined) seedResume(opp); opp.last = { w: null, n: P.name, wk: save.week, you: true }; }
  if (win) { P.record.w++; if (stop) P.record.ko++; } else if (loss) P.record.l++; else P.record.d++;
  if (opp.record) { if (loss) { opp.record.w++; if (stop) opp.record.ko++; } else if (win) opp.record.l++; else opp.record.d++; }
  const op = opp.points || 0;
  if (win) { const g = 8 + op * .16 + (stop ? 3 : 0) + (isTitle ? 30 : 0); P.points += g; if (!opp.club) opp.points = Math.max(0, opp.points - (4 + g * .3)); }
  else if (loss) { const l = 5 + Math.max(0, P.points - op) * .12 + P.points * .06; P.points = Math.max(0, P.points - l); if (!opp.club) opp.points += 6 + P.points * .1; }
  else { P.points += 2; if (!opp.club) opp.points += 2; }
  P.money += offer.purse; P.earnings += offer.purse;
  if (win && opp.legend && STYLES[opp.style]) {
    P.beatLegends = Array.from(new Set([...(P.beatLegends || []), opp.id]));
    if (!(P.unlocked || []).includes(opp.style)) {
      P.unlocked = [...(P.unlocked || []), opp.style];
      out.notes.push('You beat ' + opp.name + '. Nobody else in the world fights like him, and now you can learn it: the ' + STYLES[opp.style].label.toLowerCase() + ' style is unlocked in camp.');
    }
  }
  if (P.styleFrom) P.styleFit = Math.min(1, P.styleFit + STYLE_LEARN.fight);
  if (P.stanceFit != null) P.stanceFit = Math.min(1, P.stanceFit + STYLE_LEARN.fight);
  settleStyle(P, out.notes);
  // belts
  if (isTitle) {
    if (win) {
      offer.title.forEach(k => { if (!P.belts.includes(k)) { P.belts.push(k); out.notes.push('New ' + k + ' world champion.'); } else { P.titleDefenses++; } save.world.belts[k] = P.id; });
      P.titleDivs = Array.from(new Set([...(P.titleDivs || []), P.div]));
      if (P.titleDivs.length > 1) out.notes.push(['', '', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][P.titleDivs.length] + '-division world champion.');
    } else if (loss) {
      offer.title.forEach(k => { if (P.belts.includes(k)) { P.belts = P.belts.filter(b => b !== k); out.notes.push('Lost the ' + k + ' belt.'); } save.world.belts[k] = opp.id; });
    }
  }
  // damage, wear, injury
  const taken = me.tot.taken; const kds = me.kd;
  P.wear = Math.min(100, P.wear + taken * .007 + kds * 1.2 + (loss && stop ? 2 : 0));
  const injCh = clamp((taken - 160) / 900 + P.wear / 600 + kds * .03, 0, .4);
  let injury = null;
  if (R() < injCh) {
    injury = Object.assign({}, kds >= 2 || (loss && stop && R() < .4) ? INJURIES.find(i => i.k === 'conc') : pick(INJURIES.filter(i => i.k !== 'conc')));
    if (me.cut > 4 && R() < .5) injury = Object.assign({}, INJURIES[0]);
    if (injury.perm) for (const k in injury.perm) P.stats[k] = Math.max(20, P.stats[k] + injury.perm[k]);
    P.injury = injury; out.notes.push('Injury: ' + injury.name.toLowerCase() + ' (' + injury.weeks + ' weeks out).');
  }
  // what he takes from it (L4, docs/LEARN.md): skills by what he used and how it went, the style and stance he saw, the man himself, a scar after a KO loss
  P.age = age(save); const before = { know: JSON.parse(JSON.stringify(P.know)) }, d = learn(P, fight, 0); applyLearn(P, d); out.learn = { d, before };
  if (!opp.club) { const od = learn(Object.assign({}, ready(opp, P.div)), fight, 1); opp.opp = od.opp; } // he remembers you too (a rematch, BR.prior)
  const recWeeks = 2 + Math.round(taken / 90);
  save.week += 1 + recWeeks;
  if (P.injury) { P.injury.weeks = Math.max(0, P.injury.weeks - recWeeks); if (P.injury.weeks === 0) P.injury = null; }
  P.campDone = false;
  const entry = {
    wk: save.week, opp: opp.name, oppId: opp.id, oppRec: opp.record ? `${opp.record.w}-${opp.record.l}-${opp.record.d}` : '', r: win ? 'W' : loss ? 'L' : 'D',
    method: res.method, dec: res.decision, round: res.round, time: res.time, venue: VENUE_NAMES[offer.venue], purse: offer.purse, title: offer.title.slice(), cards: res.cards
  };
  P.history.unshift(entry);
  worldSim(save, 1 + recWeeks);
  out.rankAfter = playerRank(save); out.pointsAfter = P.points; out.taken = taken; out.injury = injury;
  P.peakRank = P.peakRank ? Math.min(P.peakRank, out.rankAfter) : out.rankAfter;
  save.pending = null;
  return out;
}

function worldSim(save, weeks) {
  const W = save.world; const n = Math.max(1, Math.round(weeks / 2));
  for (let i = 0; i < n; i++) {
    const L = W.roster; if (L.length < 4) break;
    const a = ri(0, L.length - 1); let b = clamp(a + ri(-5, 5), 0, L.length - 1); if (b === a) b = (a + 1) % L.length;
    const A = L[a], B = L[b]; const aw = (A.rating - B.rating) + gauss() * 6 > 0;
    const Wn = aw ? A : B, Ls = aw ? B : A, ko = R() < .55;
    Wn.record.w++; Ls.record.l++; if (ko) Wn.record.ko++;
    const g = 6 + Ls.points * .1; Wn.points += g; Ls.points = Math.max(5, Ls.points - (4 + g * .3));
    // belts change hands sometimes
    const took = []; ORGS.forEach(o => { if (W.belts[o.k] === Ls.id && R() < .5) { W.belts[o.k] = Wn.id; took.push(o.k); } });
    noteFight(Wn, Ls, { ko, t: took, r: (aw ? b : a) + 1, wk: save.week });
  }
  W.roster.forEach(f => {
    f.age += weeks / 52; if (f.legend) return; // legends don't fade
    const drift = f.age < 27 ? rnd(0, .25) : f.age > 32 ? -rnd(0, .3) : rnd(-.1, .1);
    f.rating = Math.round(clamp(f.rating + drift * weeks / 4, 50, 95) * 10) / 10;
  });
  // retirements -> new prospects
  for (let i = W.roster.length - 1; i >= 0; i--) {
    const f = W.roster[i];
    if (!f.legend && ((f.age > 37 && R() < .08 * weeks / 4) || f.rating < 54)) {
      const held = ORGS.filter(o => W.belts[o.k] === f.id);
      W.roster.splice(i, 1);
      const nf = genFighter(W.div, ri(60, 74), rnd(30, 70), ri(20, 24)); W.roster.push(nf);
      held.forEach(o => { const top = W.roster.slice().sort((x, y) => y.points - x.points)[0]; W.belts[o.k] = top.id; });
    }
  }
  ensureStars(ensureLegend(W.roster, W.div), W.div);
}

function playerSheet(save) {
  const P = save.player;
  return JSON.parse(JSON.stringify({ id: P.id, name: P.name, nick: P.nick, style: P.style, styleFrom: P.styleFrom, styleFit: P.styleFit, guard: P.guard || 'standard', stance: P.stance, stanceFit: P.stanceFit, stats: P.stats, look: P.look, wear: P.wear, exp: P.record.w + P.record.l + P.record.d,
    record: P.record, div: P.div, age: age(save), ht: P.ht, reach: P.reach, sk: P.sk, know: P.know, flaw: P.flaw, opp: P.opp, scar: P.scar, tape: P.tape }));
}
// worldSim moves a fighter's rating (young men improve, old men fade) but never touched his stats, so after a few years
// the OVR on the card could be 10 off from the man in the ring. His stats follow his rating (OVR_W sums to 1, so +1 to every stat = +1 OVR)
function liveStats(f) {
  const st = Object.assign({}, f.stats); if (f.rating == null) return st;
  let raw = 0; for (const k of STATS) raw += st[k] * OVR_W[k];
  const sh = f.rating - raw; for (const k of STATS) st[k] = clamp(st[k] + sh, 20, 99);
  return st;
}
// ---------- resumes: what the world knows about a man (notable wins, last fight, belts). His real numbers need scouting ----------
const fakeName = () => pick(FIRST) + ' ' + pick(LAST);
// men made before resumes existed get a believable past: better men have bigger wins
function seedResume(f, belts) {
  const pts = f.points || 0, rc = f.record || { w: 0, l: 0, ko: 0 }, koR = rc.w ? rc.ko / rc.w : .5;
  const n = f.legend ? 3 : f.club ? 0 : pts > 300 ? ri(2, 3) : pts > 160 ? ri(1, 2) : pts > 70 ? ri(0, 1) : 0;
  f.wins = [];
  for (let i = 0; i < Math.min(n, rc.w); i++) f.wins.push({ n: fakeName(), ko: R() < koR, r: pts > 300 ? ri(1, 8) : ri(4, 18), t: [] });
  const bl = (belts || []).slice(); if (f.legend && !bl.length) bl.push(pick(ORGS).k);
  if (bl.length) { if (!f.wins.length) f.wins.push({ n: fakeName(), ko: R() < koR, r: ri(1, 3), t: [] }); f.wins[0].t = bl; f.wins[0].r = ri(1, 3); }
  if (!f.last && rc.w + rc.l > 0) { const lost = R() < rc.l / (rc.w + rc.l) * 1.2; f.last = { w: lost ? 0 : 1, n: fakeName(), ko: R() < (lost ? .35 : koR) }; }
}
function resumeOf(save, f) { if (f.wins === undefined) seedResume(f, f.club ? [] : beltsOf(save, f.id)); return f; }
// a result goes on both men's resumes. A win is notable if he beat a top-10 man, a legend, took a belt, or beat you
function noteFight(W, L, o) {
  if (W.wins === undefined) seedResume(W); if (L.wins === undefined) seedResume(L);
  W.last = { w: 1, n: L.name, ko: o.ko, wk: o.wk, you: !!L.isPlayer }; L.last = { w: 0, n: W.name, ko: o.ko, wk: o.wk, you: !!W.isPlayer };
  if ((o.t && o.t.length) || (o.r && o.r <= 10) || L.legend || L.isPlayer) W.wins = [{ n: L.name, ko: o.ko, r: o.r, t: o.t || [], wk: o.wk, you: !!L.isPlayer }, ...W.wins].slice(0, 3);
  if (o.t && o.t.length && !L.isPlayer) L.exBelts = Array.from(new Set([...(L.exBelts || []), ...o.t.filter(k => !(W.exBelts || []).includes(k))]));
}
// you know a man's real numbers if you fought him or paid for film in the last year
const SCOUT_FOR = 52, SCOUT_CAP = { club: 150, regional: 1000, tv: 5000, main: 15000, title: 25000 };
function scoutCost(offer) { return Math.max(100, Math.round(Math.min(offer.purse * .08, SCOUT_CAP[offer.tier] || 1000) / 50) * 50); }
function isScouted(save, f) {
  const P = save.player; if (f.scouted) return true;
  const wk = (P.scout || {})[f.id]; if (wk != null && save.week - wk <= SCOUT_FOR) return true;
  return P.history.some(h => h.oppId ? h.oppId === f.id : h.opp === f.name);
}
function scoutHim(save, offer) {
  const P = save.player, f = oppNow(save, offer), c = scoutCost(offer);
  if (P.money < c || isScouted(save, f)) return false;
  P.money -= c; if (offer.opp.club) offer.opp.scouted = true; else (P.scout = P.scout || {})[f.id] = save.week;
  return true;
}
function oppNow(save, offer) { return offer.opp.club ? offer.opp : (findFighter(save, offer.oppId) || offer.opp); }
function oppSheet(save, offer) {
  const o = ready(oppNow(save, offer), save.world.div);
  return JSON.parse(JSON.stringify({ id: o.id, name: o.name, nick: o.nick, style: o.style, guard: o.guard || offer.opp.guard || 'standard', stance: o.stance, stats: liveStats(o), look: o.look, wear: 0, exp: o.record ? o.record.w + o.record.l + o.record.d : 0,
    record: o.record, div: o.div, age: o.age, ht: o.ht, reach: o.reach, sk: o.sk, know: o.know, flaw: o.flaw, opp: o.opp }));
}
function playerIQ(save) { const P = save.player; return Math.round(ringIQ({ stats: P.stats, exp: P.record.w + P.record.l + P.record.d })); }
// saves are v2 (this build); a v1 save from the old game has no skill side: give him one
function migrateSave(s) {
  if (!s || !s.player) return s;
  if (!s.player.sk) newSkills(s.player);
  if (!s.world.away) s.world.away = {};
  return s;
}
// ---------- weight classes: one fighter, many divisions. Each division keeps its own world while he is away ----------
const DIV_MOVE = { up: { power: -2, chin: -1, speed: 1 }, down: { power: 1, chin: 1, stamina: -3, recovery: -2 }, keep: .6 };
function divMoveOk(save, to) { const P = save.player; return to >= 0 && to < DIVS.length && Math.abs(to - P.div) === 1 && !save.pending && !P.retired && !P.injury; }
function changeDiv(save, to) {
  const P = save.player, W = save.world, from = P.div, notes = [];
  if (!divMoveOk(save, to)) return null;
  W.away = W.away || {};
  // he vacates: the belts go to the top man in the old division
  const held = ORGS.filter(o => W.belts[o.k] === P.id);
  if (held.length) { const top = W.roster.slice().sort((x, y) => y.points - x.points)[0]; held.forEach(o => { W.belts[o.k] = top.id; }); notes.push('Vacated the ' + held.map(o => o.k).join(', ') + ' ' + DIVS[from].name.toLowerCase() + (held.length > 1 ? ' belts.' : ' belt.')); }
  P.belts = [];
  W.away[from] = { roster: W.roster, belts: W.belts, week: save.week };
  const back = W.away[to];
  if (back) { W.roster = back.roster; W.belts = back.belts; delete W.away[to]; }
  else { W.roster = genRoster(to); W.belts = {}; ORGS.forEach((o, i) => { W.belts[o.k] = W.roster[i < 2 ? 0 : i - 1].id; }); }
  W.div = to; P.div = to;
  if (back) worldSim(save, Math.min(52, save.week - back.week));
  // the body changes: bigger men hit harder going up, the cut drains you going down
  const ch = DIV_MOVE[to > from ? 'up' : 'down'];
  for (const k in ch) { P.stats[k] = clamp(P.stats[k] + ch[k], 20, 99); P.pot[k] = clamp(P.pot[k] + ch[k], 20, 99); }
  P.look.build = P.look.build * DIVS[to].build / DIVS[from].build;
  P.points = Math.round(P.points * DIV_MOVE.keep);
  P.divs = Array.from(new Set([...(P.divs || [from]), to]));
  notes.push((to > from ? 'Moved up' : 'Moved down') + ' to ' + DIVS[to].name.toLowerCase() + ' (' + DIVS[to].lb + '). Ranked #' + playerRank(save) + ' here.');
  notes.push(to > from ? 'Bigger men up here. His power will not carry the same, but he is the quicker man.' : 'He hits harder at this weight, but the cut takes something out of his gas tank.');
  return notes;
}
