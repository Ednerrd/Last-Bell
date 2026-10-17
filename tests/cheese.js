// Plug-in brain P1 (docs/PLUGIN.md 2): can a player beat the brain with one trick all night? The cheese side's brain still decides WHEN (timing, gas, events stay real);
// its think() is wrapped and the script rewrites WHAT: feet, punches, defense. Same body both sides (rating 78); the cheese man is a Pro (sk 74), the brain hard (74) or expert (90).
//   TAG=x node tests/cheese.js 40 [hard|expert] [none,jabSpam,...]   (one line per cheese to /tmp/cheese_x.txt)    node tests/cheese.js agg x
// Out: the brain's win %, and the cheese's share of landed punches in rounds 1-3 vs 8-10 (the brain should take the trick away as he reads it)
const fs = require('fs'), OUT = t => '/tmp/cheese_' + t + '.txt';
const ALLC = ['none', 'jabSpam', 'oneTwo', 'pullCounter', 'shell', 'bodyOnly', 'haymaker', 'runner', 'clinch'];
if (process.argv[2] === 'agg') { const L = fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse), A = {};
  for (const o of L) { const k = o.lvl + ' ' + o.c, a = A[k] = A[k] || {}; for (const q in o) if (typeof o[q] === 'number') a[q] = (a[q] || 0) + o[q]; } report(A); return; }
process.env.PATCH = (process.env.PATCH || '') + ';globalThis.__BB=BoxerBrain;';
const S = require('./sim.js'), BB = globalThis.__BB, PU = BB.PUNCHES, ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), pick = a => a[Math.floor(Math.random() * a.length)];
const N = +process.argv[2] || 40, LVL = process.argv[3] || 'hard', CS = (process.argv[4] || ALLC.join(',')).split(','), SK = { easy: 56, hard: 74, expert: 90 }[LVL];
const mk = (ps, x) => Object.assign({ type: ps[0], combo: ps, feint: false, counter: false, tech: .75, tell: .15, commit: .4, why: 'cheese', num: ps.join('-') }, x || {});
const BODY = { jab: 'bodyJab', cross: 'bodyCross', hook: 'bodyHook', rhook: 'bodyHook', uppercut: 'bodyHook', lupper: 'bodyHook' };
const free = P => !P.me.busy && !P.me.punching;
const CHEESE = {
  none: o => o,
  jabSpam: (o, P, s, dt) => { o.move = Object.assign({}, o.move, { range: 74, lateral: 0, cut: 0, clinch: false }); o.punch = P.dist < 80 && (o.punch || (free(P) && Math.random() < 2 * dt)) ? mk(['jab']) : null; return o; },
  oneTwo: (o, P, s, dt) => { o.move = Object.assign({}, o.move, { range: 62, clinch: false }); o.punch = P.dist < 74 && (o.punch || (free(P) && Math.random() < 1.2 * dt)) ? mk(['jab', 'cross']) : null; return o; },
  pullCounter: (o, P, s, dt) => {
    o.move = Object.assign({}, o.move, { range: 66, clinch: false });
    if (P.him.punch) { const p = PU[P.him.punch.type] || {}; o.defend = { kind: 'pull', zone: p.zone || 'head', vs: P.him.punch.type, quality: .8 }; }
    for (const e of P.events) if (e.by === 'him' && (e.type === 'evaded' || e.type === 'missed')) s.ctr = P.t;
    o.punch = P.t - (s.ctr || -9) < .5 && free(P) ? mk(['cross'], { counter: true, commit: .6 }) : null; if (o.punch) s.ctr = -9; return o; },
  shell: (o, P, s, dt) => {
    o.move = Object.assign({}, o.move, { range: 88, lateral: 0, cut: 0, clinch: false }); o.guard = 1;
    if (P.him.punch) { const p = PU[P.him.punch.type] || {}; o.defend = { kind: 'block', zone: p.zone || 'head', vs: P.him.punch.type, quality: .8 }; s.quiet = P.t; }
    o.punch = P.t - (s.quiet || 0) > 1.2 && P.dist < 70 && free(P) && Math.random() < 1.5 * dt ? mk(['hook', 'cross'], { commit: .6 }) : null; return o; },
  bodyOnly: o => { if (o.punch && !o.punch.feint) { const c = o.punch.combo.map(p => PU[p].zone === 'body' ? p : BODY[p] || 'bodyHook'); o.punch = Object.assign({}, o.punch, { type: c[0], combo: c }); } return o; },
  haymaker: (o, P, s, dt) => { o.move = Object.assign({}, o.move, { range: 34, cut: 1, clinch: false }); o.punch = (o.punch || (free(P) && Math.random() < 1 * dt)) && P.dist < 74 ? mk([P.dist < 56 ? 'rhook' : 'cross'], { commit: .9, tell: .35 }) : null; return o; },
  runner: (o, P, s, dt) => { o.move = Object.assign({}, o.move, { range: 88, lateral: 1, cut: 0, clinch: false }); o.punch = o.punch && P.dist < 60 ? mk(['jab']) : null; return o; },
  clinch: (o, P) => { o.move = Object.assign({}, o.move, { clinch: P.dist < 50 }); return o; }
};
for (const c of CS) {
  const o = { lvl: LVL, c, n: 0, bw: 0, d: 0, cE: 0, bE: 0, cL: 0, bL: 0 };
  for (let i = 0; i < N; i++) {
    const side = i & 1, bst = pick(ALL), b = S.sheet(78, bst, S.rollGuard(bst)), ch = S.sheet(78, 'boxerpuncher', 'standard'); b.sk = S.skMake(SK, bst); ch.sk = S.skMake(74, 'boxerpuncher');
    const f = new S.Fight(side ? ch : b, side ? b : ch, { rounds: 10 }), C = f.f[1 - side], st = {}, real = C.brain.think.bind(C.brain);
    C.brain.think = (P, dt) => CHEESE[c](real(P, dt), P, st, dt);
    let n = 0; while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); f.events = []; }
    const r = f.result.winner; o.n++; if (r === side) o.bw++; else if (r !== 1 - side) o.d++;
    f.roundLog.forEach((l, j) => { const cs = side ? l.a : l.b, bs = side ? l.b : l.a, L = x => x.landedJab + x.landedPow + x.landedBody;
      if (j < 3) { o.cE += L(cs); o.bE += L(bs); } if (j >= 7) { o.cL += L(cs); o.bL += L(bs); } });
  }
  if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(o) + '\n');
  report({ [LVL + ' ' + c]: o });
}
function report(A) {
  console.log('brain   cheese        brain wins     cheese landed share R1-3 -> R8-10');
  for (const k of Object.keys(A)) { const a = A[k], d = a.n - a.d, q = a.bw / Math.max(1, d), [lv, c] = k.split(' ');
    console.log(lv.padEnd(8) + c.padEnd(14) + ((100 * q).toFixed(1) + '% ±' + (100 * Math.sqrt(q * (1 - q) / Math.max(1, d))).toFixed(0)).padEnd(15) + (100 * a.cE / Math.max(1, a.cE + a.bE)).toFixed(1) + '% -> ' + (a.cL + a.bL ? (100 * a.cL / (a.cL + a.bL)).toFixed(1) + '%' : '-') + '  (n' + a.n + ')'); }
}
