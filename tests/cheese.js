// Plug-in brain P1 (docs/PLUGIN.md 2): can a player beat the brain with one trick all night? The bots live in bots.js (the cheese side's brain decides WHEN, the bot WHAT).
// Same body both sides (rating 78); the cheese man is a Pro (sk 74), the brain hard (74) or expert (90).
//   TAG=x node tests/cheese.js 40 [easy|hard|expert] [none,jabSpam,...]   (easy carries his style's f3 flaw like preset('easy'); FLAW=0 for none)   (one line per cheese to /tmp/cheese_x.txt)    node tests/cheese.js agg x
// Out: the brain's win %, and the cheese's share of landed punches in rounds 1-3 vs 8-10 (the brain should take the trick away as he reads it)
// Fair check (Ed, Oct 17: smart, not psychic): how the brain defends each punch type the first 5 times he sees it vs from the 30th on, his counters landed per 100 of the cheese's punches
// on first look vs read, and his mean reaction time. First look should sit near the control's; a first look as good as the read is a brain that knew before it saw.
const fs = require('fs'), OUT = t => '/tmp/cheese_' + t + '.txt';
const ALLC = ['none', 'jabSpam', 'oneTwo', 'pullCounter', 'shell', 'bodyOnly', 'haymaker', 'runner', 'clinch'];
if (process.argv[2] === 'agg') { const L = fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse), A = {};
  for (const o of L) { const k = o.lvl + ' ' + o.c, a = A[k] = A[k] || {}; for (const q in o) if (typeof o[q] === 'number') a[q] = (a[q] || 0) + o[q]; } report(A); return; }
process.env.PATCH = (process.env.PATCH || '') + ';globalThis.__BB=BoxerBrain;';
const S = require('./sim.js'), BB = globalThis.__BB, PU = BB.PUNCHES, ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), pick = a => a[Math.floor(Math.random() * a.length)];
const N = +process.argv[2] || 40, LVL = process.argv[3] || 'hard', CS = (process.argv[4] || ALLC.join(',')).split(','), SK = { easy: 56, hard: 74, expert: 90 }[LVL];
const CHEESE = require('./bots.js')(PU);
for (const c of CS) {
  const o = { lvl: LVL, c, n: 0, bw: 0, d: 0, cE: 0, bE: 0, cL: 0, bL: 0, fN: 0, fD: 0, fC: 0, rN: 0, rD: 0, rC: 0, rs: 0, rn: 0 };
  for (let i = 0; i < N; i++) {
    const side = i & 1, bst = pick(ALL), b = S.sheet(78, bst, S.rollGuard(bst)), ch = S.sheet(78, 'boxerpuncher', 'standard'); b.sk = S.skMake(SK, bst); ch.sk = S.skMake(74, 'boxerpuncher');
    const f = new S.Fight(side ? ch : b, side ? b : ch, { rounds: 10 }), C = f.f[1 - side], st = {}, real = C.brain.think.bind(C.brain);
    if (LVL === 'easy' && process.env.FLAW !== '0') f.f[side].brain.flawSet(BB.BR.flaw.by[bst]); // f3: easy has his style's hole, like preset('easy') (FLAW=0: the old rung, no hole)
    C.brain.think = (P, dt) => CHEESE[c](real(P, dt), P, st, dt);
    const Bb = f.f[side].brain, hr = Bb.hear.bind(Bb), seen = {}; let ph = null; // fair check: what he does with each punch type by how often he's seen it
    Bb.hear = ev => { if (ev.by === 'him' && PU[ev.p] && ev.type !== 'feinted' && ev.type !== 'thrown' && ev.type !== 'pulled') { const k = seen[ev.p] = (seen[ev.p] || 0) + 1, def = ev.type === 'blocked' || ev.type === 'evaded';
        ph = k <= 5 ? 'f' : k > 30 ? 'r' : null; if (ph) { o[ph + 'N']++; if (def) o[ph + 'D']++; } }
      else if (ev.by === 'me' && ev.type === 'landed' && ev.counter && ph) o[ph + 'C']++;
      return hr(ev); };
    let n = 0; while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); f.events = []; }
    o.rs += Bb.tel.reactSum; o.rn += Bb.tel.reactN;
    const r = f.result.winner; o.n++; if (r === side) o.bw++; else if (r !== 1 - side) o.d++;
    f.roundLog.forEach((l, j) => { const cs = side ? l.a : l.b, bs = side ? l.b : l.a, L = x => x.landedJab + x.landedPow + x.landedBody;
      if (j < 3) { o.cE += L(cs); o.bE += L(bs); } if (j >= 7) { o.cL += L(cs); o.bL += L(bs); } });
  }
  if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(o) + '\n');
  report({ [LVL + ' ' + c]: o });
}
function report(A) {
  console.log('brain   cheese        brain wins     cheese landed share R1-3 -> R8-10   | fair: defends 1st look -> read, counters/100 1st -> read, react s');
  for (const k of Object.keys(A)) { const a = A[k], d = a.n - a.d, q = a.bw / Math.max(1, d), [lv, c] = k.split(' ');
    console.log(lv.padEnd(8) + c.padEnd(14) + ((100 * q).toFixed(1) + '% ±' + (100 * Math.sqrt(q * (1 - q) / Math.max(1, d))).toFixed(0)).padEnd(15) + (100 * a.cE / Math.max(1, a.cE + a.bE)).toFixed(1) + '% -> ' + (a.cL + a.bL ? (100 * a.cL / (a.cL + a.bL)).toFixed(1) + '%' : '-') + '  (n' + a.n + ')'
      + (a.fN ? '  | ' + (100 * a.fD / a.fN).toFixed(0) + '% -> ' + (a.rN ? (100 * a.rD / a.rN).toFixed(0) + '%' : '-') + ', ' + (100 * a.fC / a.fN).toFixed(1) + ' -> ' + (a.rN ? (100 * a.rC / a.rN).toFixed(1) : '-') + ', ' + (a.rn ? (a.rs / a.rn).toFixed(3) : '-') : '')); }
}
