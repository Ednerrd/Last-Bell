// 2a, the f3 retune (docs/PLUGIN.md "f3 retune, part 1"): why do the exploit bots rarely catch the easy man in his hole? Same fights as flaws.js
// (easy Intermediate of a style vs an Intermediate boxer-puncher "player" running the bot for that flaw), but every player punch is followed:
// thrown by the trick (the bot's own punch) or his own brain, the hole open when it left (launch) and when it got there (impact, the engine's holeF), and how it ended.
//   TAG=x node tests/trick.js 60 [styles] [on|off|both]   (x4: one line per style/arm to /tmp/trick_x.txt)    node tests/trick.js agg x
// Also the hole itself: how many times a fight it opens, how long it stays open (s a fight), and the share of the player's punches that land in it.
const fs = require('fs'), OUT = t => '/tmp/trick_' + t + '.txt';
const BOT = { slugger: 'jabIn2', outboxer: 'crowd4', swarmer: 'lungeCounter2', counter: 'slipCounter', boxerpuncher: 'overJab' };
for (const x of (process.env.BOTX || '').split(',').filter(Boolean)) { const [st, b] = x.split(':'); BOT[st] = b; }
if (process.argv[2] === 'agg') { const L = fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse), A = {};
  for (const o of L) { const k = o.st + ' ' + o.fl + ' ' + o.bot; A[k] = add(A[k] || { st: o.st, fl: o.fl, bot: o.bot }, o); } report(A); return; }
process.env.PATCH = (process.env.PATCH || '') + ';globalThis.__BB=BoxerBrain;globalThis.__E={holeF,PUNCH};';
const S = require('./sim.js'), BB = globalThis.__BB, E = globalThis.__E, BOTS = require('./bots.js')(BB.PUNCHES);
const N = +process.argv[2] || 60, STS = (!process.argv[3] || process.argv[3] === "all" ? Object.keys(BOT) : process.argv[3].split(",")), FL = { on: [1], off: [0], both: [0, 1] }[process.argv[4] || 'on'];
// follow every punch: launch (startPunch) and impact (resolve, miss)
const sp = S.Fight.prototype.startPunch, rs = S.Fight.prototype.resolve, ms = S.Fight.prototype.miss;
S.Fight.prototype.startPunch = function (F, type) { sp.call(this, F, type); const a = F.act; if (a) { a.trick = !!(F.binfo && F.binfo.why === 'cheese'); a.hL = E.holeF(F.op, E.PUNCH[type]) > 0; } };
S.Fight.prototype.miss = function (A, D, a, why, def) { a.res = why === 'evade' ? 'ev:' + (def || 'passive') : why; return ms.call(this, A, D, a, why, def); };
S.Fight.prototype.resolve = function (A, D, a) { a.hR = E.holeF(D, E.PUNCH[a.type]) > 0; a.bd = !!D.def; a.res = null; A.lastRes = null; rs.call(this, A, D, a); if (!a.res) a.res = A.lastRes || 'none'; if (this.tap) this.tap(A, a); };
for (const st of STS) for (const fl of FL) {
  const bot = BOT[st], o = { st, fl, bot, n: 0, pw: 0, d: 0, open: 0, openT: 0, P: {} };
  for (let i = 0; i < N; i++) {
    const side = i & 1, b = S.sheet(78, st, S.rollGuard(st)), pl = S.sheet(78, 'boxerpuncher', 'standard'); b.sk = S.skMake(56, st); pl.sk = S.skMake(56, 'boxerpuncher');
    const f = new S.Fight(side ? pl : b, side ? b : pl, { rounds: 10 }), Pf = f.f[1 - side], Ef = f.f[side], st0 = {}, real = Pf.brain.think.bind(Pf.brain);
    Ef.brain.flawSet(fl ? BB.BR.flaw.by[st] : null);
    Pf.brain.think = (P, dt) => BOTS[bot](real(P, dt), P, st0, dt);
    // a punch: who threw it (trick / own), hole at launch L and at impact R (1/0), how it ended
    f.tap = (A, a) => { if (A !== Pf || a.feint) return; const k = (a.trick ? 'trick' : 'own') + ' ' + (a.hL ? 'L' : '-') + (a.hR ? 'R' : '-'), r = o.P[k] = o.P[k] || {}; r.n = (r.n || 0) + 1; r[a.res] = (r[a.res] || 0) + 1; if (a.bd) r.bdef = (r.bdef || 0) + 1; };
    let n = 0, was = false; while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); f.events = [];
      const h = !!Ef.hole; if (h && !was) o.open++; if (h) o.openT += 1 / 60; was = h; }
    const r = f.result.winner; o.n++; if (r === 1 - side) o.pw++; else if (r !== side) o.d++;
  }
  if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(o) + '\n');
  report({ [st + ' ' + fl + ' ' + bot]: o });
}
function add(a, o) { for (const q in o) if (typeof o[q] === 'number') a[q] = (a[q] || 0) + o[q]; else if (o[q] && typeof o[q] === 'object') a[q] = add(a[q] || {}, o[q]); return a; }
function report(A) {
  for (const k of Object.keys(A)) { const a = A[k], n = a.n, d = n - a.d;
    console.log(`\n${a.st} (${a.bot}), flaw ${a.fl ? 'on' : 'off'}: player wins ${(100 * a.pw / Math.max(1, d)).toFixed(1)}% (n${n}) | hole opens ${(a.open / n).toFixed(0)}x a fight, open ${(a.openT / n).toFixed(0)} s a fight (${(a.openT / Math.max(1, a.open)).toFixed(2)} s each)`);
    console.log('  punches (L = hole open at launch, R = at impact)   /fight  landed  blocked  evaded(brain def / passive / parry)  range  wild  | brain def up');
    const tot = {}; for (const q of Object.keys(a.P).sort()) { const r = a.P[q], ev = x => Object.keys(r).filter(y => y.startsWith('ev:') && x(y)).reduce((s, y) => s + r[y], 0), p = x => (100 * (x || 0) / r.n).toFixed(0).padStart(5) + '%';
      console.log('  ' + q.padEnd(10) + (r.n / n).toFixed(1).padStart(40) + p(r.landed) + p(r.blocked) + '   ' + p(ev(y => y !== 'ev:passive' && y !== 'ev:parry')) + ' /' + p(r['ev:passive']) + ' /' + p(r['ev:parry']) + '       ' + p(r.range) + p(r.wild) + '  |' + p(r.bdef));
      add(tot, { [q.split(' ')[0]]: r.n, ['R' + q.split(' ')[0]]: q.endsWith('R') ? r.n : 0, ['RL' + q.split(' ')[0]]: q.endsWith('R') ? r.landed || 0 : 0 }); }
    for (const w of ['trick', 'own']) if (tot[w]) console.log(`  ${w}: ${(tot[w] / n).toFixed(1)} a fight, ${(100 * tot['R' + w] / tot[w]).toFixed(1)}% into the open hole, landed in it ${(tot['RL' + w] / n).toFixed(1)} a fight`);
  }
}
