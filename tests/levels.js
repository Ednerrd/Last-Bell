// skill levels, L0 baseline (docs/BRAIN.md "Skill levels"): who wins across a level gap, and what each level does with his skills.
//   TAG=x node tests/levels.js 100            each pair 100 fights (mirrors N-N .. W-W, one level down, two down)
//   TAG=x node tests/levels.js 100 curve      a Pro (78) vs men 0/4/8/12/17 rating points under him
//   node tests/levels.js agg x                pool every run with that TAG
// Brain on by default (PATCH="AI.brain=0" for the old AI). Random styles (specials too) and rolled guards, 10 rounds, sides alternate.
// Levels come from the brain's skill sheet (BoxerBrain.tierOf). With AI.skill -8 the level centers sit at ratings ~40 / 60 / 78 / 93 (LV overrides: LV=40,60,78,93).
// "Bad technique" today = what the brain already models: a first punch thrown with tech < .5 (telegraphed, arm punch) and a feint sold under .35 (nobody buys it).
const fs = require('fs');
const OUT = t => '/tmp/levels_' + t + '.txt';
const TIERS = ['N', 'I', 'P', 'W'], TNAME = { N: 'Novice', I: 'Intermediate', P: 'Pro', W: 'World class', novice: 'N', intermediate: 'I', pro: 'P', world: 'W' };
const f1 = x => isFinite(x) ? x.toFixed(1) : '-', pc = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '-';

function report(rows) {
  // results by pair
  const by = {};
  for (const r of rows) { const p = by[r.pair] = by[r.pair] || { n: 0, fav: 0, dog: 0, d: 0, stop: 0, dogStop: 0, favStop: 0 }; p.n++; p[r.win]++; if (r.stop) { p.stop++; if (r.win === 'dog') p.dogStop++; else p.favStop++; } }
  const order = Object.keys(by).sort((a, b) => (a.includes('v') ? 0 : 1) - (b.includes('v') ? 0 : 1) || a.localeCompare(b));
  console.log(`\nRESULTS (${rows.length} fights). Underdog = the lower level (or lower rating); mirrors show side A.`);
  console.log('pair'.padEnd(14) + 'fights'.padStart(7) + 'fav win'.padStart(9) + 'dog win'.padStart(9) + 'draw'.padStart(7) + 'stops'.padStart(8) + ' dog wins by stoppage');
  for (const k of order) { const p = by[k]; console.log(k.padEnd(14) + String(p.n).padStart(7) + pc(p.fav, p.n).padStart(9) + pc(p.dog, p.n).padStart(9) + pc(p.d, p.n).padStart(7) + pc(p.stop, p.n).padStart(8) + ' ' + pc(p.dogStop, p.dog)); }
  // skill use by level: each man's numbers in mirror fights (same level both sides), then the underdog's numbers one level up
  const T = {};
  const add = (key, t) => { const o = T[key] = T[key] || {}; for (const x in t) o[x] = (o[x] || 0) + t[x]; };
  for (const r of rows) {
    if (r.mirror) { add(r.lv[0] + ' mirror', r.tel[0]); add(r.lv[1] + ' mirror', r.tel[1]); }
    else if (r.gap === 1) { add(r.lv[1] + ' vs one up', r.tel[1]); add(r.lv[0] + ' vs one down', r.tel[0]); }
  }
  const keys = Object.keys(T).sort((a, b) => TIERS.indexOf(a[0]) - TIERS.indexOf(b[0]) || a.localeCompare(b));
  const rowsOut = [
    ['thrown /rd', t => f1(t.thr / t.rd)],
    ['connect', t => pc(t.land, t.thr)],
    ['power landed /rd', t => f1(t.landP / t.rd)],
    ['feints /rd', t => f1(t.feint / t.rd)],
    ['feints bought', t => pc(t.feintBit, t.feint)],
    ['feints unsold (<.35)', t => pc(t.feintBad, t.feint)],
    ['setups /rd', t => f1(t.setup / t.rd)],
    ['counters tried /rd', t => f1(t.ctrTry / t.rd)],
    ['counters landed /rd', t => f1(t.ctrLand / t.rd)],
    ['first-punch tech', t => (t.techSum / Math.max(1, t.techN)).toFixed(2)],
    ['telegraphed (<.5)', t => pc(t.techBad, t.techN)],
    ['reaction (ms)', t => (1000 * t.reactSum / Math.max(1, t.reactN)).toFixed(0)],
    ['never saw it', t => pc(t.late, t.seen)],
    ['saw it, no try', t => pc(t.noTry, t.seen)],
    ['misread it', t => pc(t.misread, t.seen)],
    ['read a feint', t => pc(t.feintRead, t.feintsAtHim)],
    ['his punches evaded', t => pc(t.evAct, t.oppThr)],
    ['his punches blocked', t => pc(t.blk, t.oppThr)],
    ['on the ropes s/rd', t => f1(t.trap / t.rd)],
    ['rope escapes /rd', t => f1(t.esc / t.rd)],
    ['adjusts /fight', t => (t.adj / t.fights).toFixed(2)],
    ['hunts /fight', t => (t.hunt / t.fights).toFixed(2)],
    ['hurt: froze', t => pc(t.freeze, t.hurts)],
    ['dropped /fight', t => (t.kdT / t.fights).toFixed(2)]
  ];
  console.log('\nSKILL USE BY LEVEL (per man)');
  console.log(''.padEnd(22) + keys.map(k => k.padStart(15)).join(''));
  for (const [name, fn] of rowsOut) console.log(name.padEnd(22) + keys.map(k => fn(T[k]).padStart(15)).join(''));
}
if (process.argv[2] === 'agg') { report(fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse)); return; }

if (process.env.PATCH == null) process.env.PATCH = 'AI.brain=1';
process.env.PATCH += ';globalThis.__BB=BoxerBrain';
const S = require('./sim.js');
const BB = globalThis.__BB;
const N = +process.argv[2] || 100, MODE = process.argv[3] || 'levels';
const LV = (process.env.LV || '40,60,78,93').split(',').map(Number), RT = { N: LV[0], I: LV[1], P: LV[2], W: LV[3] };
const POW = { cross: 1, hook: 1, rhook: 1, uppercut: 1, lupper: 1 };
const ALL = Object.keys(S.STYLES), pick = a => a[Math.floor(Math.random() * a.length)];
// the brain's own counts the engine can't see: technique per throw, how well a feint sells, between-round changes
let hooked = false;
function hook(brain) {
  if (hooked) return; hooked = true;
  const P = Object.getPrototypeOf(brain), fire = P.fire, feint = P.feint, rest = P.rest;
  P.fire = function (...a) { const o = fire.apply(this, a); if (o) { const L = this.lv || (this.lv = {}); L.techN = (L.techN || 0) + 1; L.techSum = (L.techSum || 0) + o.tech[0]; if (o.tech[0] < .5) L.techBad = (L.techBad || 0) + 1; } return o; };
  P.feint = function (...a) { const o = feint.apply(this, a); const L = this.lv || (this.lv = {}); if (o.sell < .35) L.feintBad = (L.feintBad || 0) + 1; return o; };
  P.rest = function (...a) { const o = rest.apply(this, a); if (o && o.change) { const L = this.lv || (this.lv = {}); L.adj = (L.adj || 0) + 1; } return o; };
}
const PAIRS = MODE === 'curve' ? [0, 4, 8, 12, 17].map(g => ({ pair: 'P78 v ' + (RT.P - g), r: [RT.P, RT.P - g], lv: ['P', 'P-' + g], gap: g ? 'c' : 0 }))
  : [['N', 'N'], ['I', 'I'], ['P', 'P'], ['W', 'W'], ['I', 'N'], ['P', 'I'], ['W', 'P'], ['P', 'N'], ['W', 'I']].map(([a, b]) => ({ pair: a === b ? a + ' mirror' : a + 'v' + b, r: [RT[a], RT[b]], lv: [a, b], gap: TIERS.indexOf(a) - TIERS.indexOf(b) }));
for (const PR of PAIRS) for (let i = 0; i < N; i++) {
  const sh = PR.r.map(r => { const st = pick(ALL), s = S.sheet(Math.round(r + (Math.random() * 4 - 2)), st, S.rollGuard(st)); return s; });
  const side = i % 2, f = new S.Fight(side ? sh[1] : sh[0], side ? sh[0] : sh[1], { rounds: 10 });
  const F = [f.f[side], f.f[1 - side]]; // F[0] = the favourite (or side A of a mirror)
  if (F[0].brain) hook(F[0].brain);
  const z = () => ({ fights: 1, rd: 0, thr: 0, land: 0, landP: 0, feint: 0, feintBit: 0, feintBad: 0, setup: 0, ctrTry: 0, ctrLand: 0, techSum: 0, techN: 0, techBad: 0, reactSum: 0, reactN: 0, late: 0, noTry: 0, misread: 0, seen: 0, feintRead: 0, feintsAtHim: 0, evAct: 0, blk: 0, oppThr: 0, trap: 0, esc: 0, adj: 0, hunt: 0, freeze: 0, hurts: 0, kdT: 0 });
  const tel = [z(), z()], idx = s => s === F[0].side ? 0 : 1;
  let n = 0;
  while (f.phase !== 'over' && n < 600000) {
    f.step(); n++;
    for (const e of f.stepEv) {
      if (e.type === 'throw') { tel[idx(e.a)].thr++; tel[1 - idx(e.a)].oppThr++; }
      else if (e.type === 'hit') { const t = tel[idx(e.a)]; if (e.blocked) tel[1 - idx(e.a)].blk++; else { t.land++; if (POW[e.p]) t.landP++; if (e.counter) t.ctrLand++; } }
      else if (e.type === 'miss' && e.def) tel[1 - idx(e.a)].evAct++;
      else if (e.type === 'counterTry') tel[idx(e.a)].ctrTry++;
      else if (e.type === 'feint') tel[idx(e.a)].feint++;
      else if (e.type === 'escape') tel[idx(e.a)].esc++;
      else if (e.type === 'knockdown') tel[idx(e.d)].kdT++;
    }
    f.events = [];
    if (f.phase === 'corner') { tel[0].trap += F[0].rs.trap; tel[1].trap += F[1].rs.trap; f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); }
  }
  tel[0].trap += F[0].rs.trap; tel[1].trap += F[1].rs.trap;
  const rds = f.round - 1 + (f.result.decision ? 1 : Math.max(.05, f.clock / 180));
  for (let j = 0; j < 2; j++) {
    const t = tel[j], X = F[j], b = X.brain, o = F[1 - j].brain;
    t.rd = rds;
    if (b) { const T = b.tel, L = b.lv || {};
      Object.assign(t, { setup: T.setups, reactSum: T.reactSum, reactN: T.reactN, late: T.late, noTry: T.noTry, misread: T.misreads, seen: T.seen, feintRead: T.feintsRead, hunt: T.hunts, freeze: T.hurtR.freeze || 0, hurts: T.hurts,
        techSum: L.techSum || 0, techN: L.techN || 0, techBad: L.techBad || 0, feintBad: L.feintBad || 0, adj: L.adj || 0 });
      if (o) t.feintBit = o.tel.bites;
    }
    if (o) t.feintsAtHim = tel[1 - j].feint;
  }
  const row = { pair: PR.pair, lv: PR.lv, gap: PR.gap, mirror: PR.lv[0] === PR.lv[1], win: f.result.winner === F[0].side ? 'fav' : f.result.winner === F[1].side ? 'dog' : 'd', stop: !f.result.decision, tel };
  fs.appendFileSync(OUT(process.env.TAG || 'x'), JSON.stringify(row) + '\n');
}
