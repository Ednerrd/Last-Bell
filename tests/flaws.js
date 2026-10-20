// f3 easy flaws (docs/PLUGIN.md 1f): is each easy man's hole worth finding? Easy brain (Intermediate, sk 56) of one style vs an Intermediate "player" (a boxer-puncher, sk 56,
// same body, rating 78) who plays straight (his own brain) or runs the exploit for that flaw (bots.js). Four arms per style: flaw off / on x straight / exploit.
//   TAG=x node tests/flaws.js 150 [styles]   (x4 processes; one line per arm to /tmp/flaws_x.txt; rerun the same line after a restart)    node tests/flaws.js agg x
// Out: the player's win % per arm. The exploit should be worth +15-25 points with the flaw on (vs off); playing straight should barely change;
// and with the flaw on the trick should beat just boxing him (+10-20: otherwise the hole isn't worth finding, the bot's own handicap made the first number).
const pct = (a, b) => b ? (100 * a / b).toFixed(1) : '-';
const fs = require('fs'), OUT = t => '/tmp/flaws_' + t + '.txt';
const BOT = { slugger: 'jabIn2', outboxer: 'crowd4', swarmer: 'lungeCounter2', counter: 'slipCounter', boxerpuncher: 'overJab' };
for (const x of (process.env.BOTX || '').split(',').filter(Boolean)) { const [st, b] = x.split(':'); BOT[st] = b; } // BOTX=slugger:jabIn tries another bot; ARMS=X skips the straight arms
if (process.argv[2] === 'agg') { const L = fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse), A = {};
  for (const o of L) { const k = o.st + ' ' + o.fl + ' ' + o.bot, a = A[k] = A[k] || { st: o.st, fl: o.fl, bot: o.bot }; for (const q in o) if (typeof o[q] === 'number') a[q] = (a[q] || 0) + o[q]; } report(A); return; }
process.env.PATCH = (process.env.PATCH || '') + ';globalThis.__BB=BoxerBrain;';
const S = require('./sim.js'), BB = globalThis.__BB, BOTS = require('./bots.js')(BB.PUNCHES);
const N = +process.argv[2] || 150, STS = (process.argv[3] || Object.keys(BOT).join(',')).split(',');
const had = {}; if (process.env.TAG && fs.existsSync(OUT(process.env.TAG))) for (const l of fs.readFileSync(OUT(process.env.TAG), 'utf8').trim().split('\n')) if (l) { const o = JSON.parse(l), k = o.st + ' ' + o.fl + ' ' + o.bot; had[k] = (had[k] || 0) + 1; }
for (const st of STS) for (const fl of [0, 1]) for (const bot of ['none', BOT[st]].filter(b => !process.env.ARMS || (b === 'none') === (process.env.ARMS === 'S'))) {
  if ((had[st + ' ' + fl + ' ' + bot] || 0) >= (+process.env.PROCS || 4)) continue; // resumable: after a restart, rerun the same line (PROCS = how many processes you run)
  const o = { st, fl, bot, n: 0, pw: 0, d: 0, ko: 0, pL: 0, bL: 0, pT: 0, bT: 0 };
  for (let i = 0; i < N; i++) {
    const side = i & 1, b = S.sheet(78, st, S.rollGuard(st)), pl = S.sheet(78, 'boxerpuncher', 'standard'); b.sk = S.skMake(56, st); pl.sk = S.skMake(56, 'boxerpuncher');
    const f = new S.Fight(side ? pl : b, side ? b : pl, { rounds: 10 }), Pf = f.f[1 - side], st0 = {}, real = Pf.brain.think.bind(Pf.brain);
    f.f[side].brain.flawSet(fl ? BB.BR.flaw.by[st] : null);
    Pf.brain.think = (P, dt) => BOTS[bot](real(P, dt), P, st0, dt);
    let n = 0; while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); f.events = []; }
    const r = f.result.winner; o.n++; if (r === 1 - side) o.pw++; else if (r !== side) o.d++; if (r != null && !f.result.decision) o.ko++;
    for (const l of f.roundLog) { const ps = side ? l.a : l.b, bs = side ? l.b : l.a, L = x => x.landedJab + x.landedPow + x.landedBody, T = x => x.thrown; o.pL += L(ps); o.bL += L(bs); o.pT += T(ps); o.bT += T(bs); }
  }
  if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(o) + '\n');
  report({ [st + ' ' + fl + ' ' + bot]: o }, 1);
}
function report(A, one) {
  console.log('easy style    flaw  player        player wins    stops  landed (player / easy)  thrown (player / easy)');
  for (const k of Object.keys(A)) { const a = A[k], d = a.n - a.d, q = a.pw / Math.max(1, d);
    console.log(a.st.padEnd(14) + (a.fl ? 'on ' : 'off').padEnd(6) + a.bot.padEnd(14) + ((100 * q).toFixed(1) + '% ±' + (100 * Math.sqrt(q * (1 - q) / Math.max(1, d))).toFixed(0)).padEnd(15)
      + (pct(a.ko, a.n) + '%').padEnd(7) + (a.pL / a.n).toFixed(0).padStart(5) + ' / ' + (a.bL / a.n).toFixed(0).padEnd(16) + (a.pT / a.n).toFixed(0).padStart(5) + ' / ' + (a.bT / a.n).toFixed(0) + '  (n' + a.n + ')'); }
  if (one) return;
  const by = {}; for (const k in A) { const a = A[k], d = a.n - a.d; (by[a.st] = by[a.st] || {})[(a.fl ? 'on' : 'off') + (a.bot === 'none' ? 'S' : 'X')] = 100 * a.pw / Math.max(1, d); }
  console.log('\nworth of the flaw (player win %):   on - off: straight   exploit   |  flaw on: exploit - straight   (targets: exploit +15-25, straight small; the trick beats boxing him +10-20)');
  for (const st in by) { const b = by[st], f = x => x == null || isNaN(x) ? '   -' : (x >= 0 ? '+' : '') + x.toFixed(1); console.log('  ' + st.padEnd(14) + f(b.onS - b.offS).padStart(22) + f(b.onX - b.offX).padStart(10) + f(b.onX - b.onS).padStart(18)); }
}
