// scouting report: one new fighter, N fights against a random field, then what he's good at and where he leaks.
//   node tests/scout.js [N=20] [style|random] [rating=82] [guard|roll] [field spread=5]
//   brain on by default (PATCH="AI.brain=0" for the old AI). SEED=n for a repeatable fighter and field.
// He doesn't learn between fights yet (skill levels, ROADMAP item 2): fight 20 is the same man as fight 1. This is the scouting half.
if (process.env.PATCH == null) process.env.PATCH = 'AI.brain=1';
if (process.env.SEED) { let s = +process.env.SEED >>> 0; Math.random = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const S = require('./sim.js');
const N = +process.argv[2] || 20, RT = +process.argv[4] || 82, SPREAD = +process.argv[6] || 5;
const ALL = Object.keys(S.STYLES), pick = a => a[Math.floor(Math.random() * a.length)];
const ST = !process.argv[3] || process.argv[3] === 'random' ? pick(ALL) : process.argv[3];
const GD = !process.argv[5] || process.argv[5] === 'roll' ? S.rollGuard(ST) : process.argv[5];
const me = S.sheet(RT, ST, GD); me.name = 'Prospect';
const PN = { jab: 'jab', cross: 'right hand', hook: 'lead hook', rhook: 'rear hook', uppercut: 'rear uppercut', lupper: 'lead uppercut', bodyJab: 'jab to the body', bodyHook: 'body hook (liver)', bodyCross: 'right hand to the body' };
const pn = p => PN[p] || p;
const zero = () => ({ rd: 0, thr: 0, landJ: 0, landP: 0, landB: 0, thrJ: 0, thrP: 0, thrB: 0, dmg: 0, kd: 0, stun: 0, trap: 0, ctrl: 0, early: [0, 0], late: [0, 0], gotBy: {}, gotDmg: 0, ctrAte: 0, ctrLanded: 0, kdBy: {}, landBy: {}, missBy: {}, blocked: 0, hitsOn: 0, stunsTaken: 0, kdTaken: 0, hurtRdsLost: 0 });
const A = zero(), O = zero(), rec = { w: 0, l: 0, d: 0, ko: 0, lostKo: 0 }, vs = {}, fights = [];
for (let i = 0; i < N; i++) {
  const os = pick(ALL), og = S.rollGuard(os), orate = Math.round(RT + (Math.random() * 2 - 1) * SPREAD), opp = S.sheet(orate, os, og); opp.name = 'Opp';
  const side = i % 2, f = new S.Fight(side ? opp : me, side ? me : opp, { rounds: 10 }), F = f.f[side], X = F.op;
  const lastHit = [null, null];
  let n = 0, rd = 0;
  const tally = (W, P) => { W.thr += P.rs.thrown; W.thrP += P.rs.thrownPow; W.landJ += P.rs.landedJab; W.landP += P.rs.landedPow; W.landB += P.rs.landedBody; W.trap += P.rs.trap; W.ctrl += P.rs.ctrl;
    if (rd <= 3) { W.early[0] += P.rs.thrown; W.early[1]++; } if (rd >= 8) { W.late[0] += P.rs.thrown; W.late[1]++; } };
  while (f.phase !== 'over' && n < 600000) {
    const was = f.phase; f.step(); n++;
    for (const e of f.events) {
      if (e.type === 'hit') {
        const W = e.a === side ? A : O, T = e.a === side ? O : A; lastHit[e.d] = e.p;
        if (e.blocked) { T.blocked++; continue; }
        W.landBy[e.p] = (W.landBy[e.p] || 0) + 1; W.dmg += e.dmg; T.gotBy[e.p] = (T.gotBy[e.p] || 0) + e.dmg; T.gotDmg += e.dmg; T.hitsOn++;
        if (e.counter) { W.ctrLanded++; T.ctrAte++; }
      } else if (e.type === 'miss' && e.a != null) { const W = e.a === side ? A : O; if (e.p) W.missBy[e.p] = (W.missBy[e.p] || 0) + 1; }
      else if (e.type === 'stun') { (e.d === side ? A : O).stunsTaken++; }
      else if (e.type === 'knockdown') { const T = e.d === side ? A : O; T.kdTaken++; const by = e.liver ? 'bodyHook' : lastHit[e.d] || '?'; T.kdBy[by] = (T.kdBy[by] || 0) + 1; }
    }
    f.events = [];
    if (was !== 'corner' && f.phase === 'corner') { rd++; A.rd++; O.rd++; tally(A, F); tally(O, X); }
    if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1));
  }
  if (!f.result.decision) { rd++; const fr = Math.max(.05, f.clock / 180); A.rd += fr; O.rd += fr; tally(A, F); tally(O, X); }
  const r = f.result, won = r.winner === side, lost = r.winner === 1 - side, how = r.decision ? r.method : r.method + ' R' + r.round;
  if (won) { rec.w++; if (!r.decision) rec.ko++; } else if (lost) { rec.l++; if (!r.decision) rec.lostKo++; } else rec.d++;
  const v = vs[os] = vs[os] || { w: 0, l: 0, d: 0 }; if (won) v.w++; else if (lost) v.l++; else v.d++;
  fights.push(`${String(i + 1).padStart(2)}. ${won ? 'W' : lost ? 'L' : 'D'}  vs ${S.STYLES[os].label} (${og}, ${orate})  ${how}`);
}
// ---------- the report ----------
const pc = (a, b) => b ? (100 * a / b).toFixed(0) + '%' : '-', f1 = x => x.toFixed(1);
const LEAGUE = .304, conn = W => (W.landJ + W.landP + W.landB) / Math.max(1, W.thr);
console.log(`\nSCOUTING REPORT: ${S.STYLES[ST].label}, ${GD} guard, rating ${RT}, ${N} fights vs a random field (${RT - SPREAD}-${RT + SPREAD})${process.env.PATCH.includes('brain=1') ? ', brain on' : ''}`);
console.log('stats:', Object.entries(me.stats).map(([k, v]) => k + ' ' + v).join(', '));
console.log(`\nRECORD ${rec.w}-${rec.l}-${rec.d} (${rec.ko} KO/TKO wins, ${rec.lostKo} stopped)`);
for (const l of fights) console.log('  ' + l);
console.log('\nvs styles:', Object.entries(vs).sort((a, b) => (b[1].w - b[1].l) - (a[1].w - a[1].l)).map(([k, v]) => `${S.STYLES[k].label} ${v.w}-${v.l}${v.d ? '-' + v.d : ''}`).join(', '));
console.log(`\nOFFENSE (him / his opponents, per round)`);
console.log(`  thrown ${f1(A.thr / A.rd)} / ${f1(O.thr / O.rd)}, landed ${f1((A.landJ + A.landP + A.landB) / A.rd)} / ${f1((O.landJ + O.landP + O.landB) / O.rd)}, connect ${pc(A.landJ + A.landP + A.landB, A.thr)} / ${pc(O.landJ + O.landP + O.landB, O.thr)}`);
const best = Object.entries(A.landBy).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([p, c]) => `${pn(p)} ${f1(c / A.rd)}/rd`);
console.log('  lands most:', best.join(', '), `| counters landed ${f1(A.ctrLanded / A.rd)}/rd (opp ${f1(O.ctrLanded / O.rd)})`);
const er = A.early[0] / Math.max(1, A.early[1]), lr = A.late[0] / Math.max(1, A.late[1]), oer = O.early[0] / Math.max(1, O.early[1]), olr = O.late[0] / Math.max(1, O.late[1]);
console.log(`  gas: thrown rds 1-3 ${f1(er)}, rds 8-10 ${f1(lr)} (${pc(lr, er)} kept; opponents kept ${pc(olr, oer)})`);
console.log(`\nDEFENSE`);
console.log(`  they land ${f1((O.landJ + O.landP + O.landB) / O.rd)}/rd on him at ${pc(conn(O) * 100, 100)} (he lands ${pc(conn(A) * 100, 100)} on them), his guard catches ${pc(A.blocked, A.blocked + A.hitsOn)} of what reaches him (theirs ${pc(O.blocked, O.blocked + O.hitsOn)})`);
const share = (W, p) => (W.gotBy[p] || 0) / Math.max(1, W.gotDmg);
const hurtBy = Object.keys(A.gotBy).sort((a, b) => A.gotBy[b] - A.gotBy[a]).slice(0, 4).map(p => `${pn(p)} ${pc(A.gotBy[p], A.gotDmg)} (field ${pc(O.gotBy[p] || 0, O.gotDmg)})`);
console.log('  damage taken from:', hurtBy.join(', '));
console.log(`  counters eaten ${f1(A.ctrAte / A.rd)}/rd (opp ${f1(O.ctrAte / O.rd)}), stunned ${A.stunsTaken}x, dropped ${A.kdTaken}x` + (A.kdTaken ? ' by ' + Object.entries(A.kdBy).map(([p, c]) => pn(p) + ' ' + c).join(', ') : '') + ` | he stunned ${O.stunsTaken}x, dropped ${O.kdTaken}x`);
console.log(`  on the ropes ${f1(A.trap / A.rd)} s/rd (opp ${f1(O.trap / O.rd)}), ring control ${f1(A.ctrl / A.rd)} s/rd (opp ${f1(O.ctrl / O.rd)})`);
// strengths and weaknesses: where he's clearly off his opponents' numbers in the same fights
const notes = [];
const add = (good, score, txt) => notes.push({ good, score, txt });
// league average with the brain on (audit, Oct 14): 30.4% connect
{ const d = conn(A) - LEAGUE; if (Math.abs(d) > .025) add(d > 0, Math.abs(d) * 10, `${d > 0 ? 'accurate' : 'wild'}: connects ${pc(conn(A) * 100, 100)} (league ${pc(LEAGUE * 100, 100)})`); }
{ const d = conn(O) - LEAGUE; if (Math.abs(d) > .025) add(d < 0, Math.abs(d) * 10, `${d < 0 ? 'hard' : 'easy'} to hit: they connect ${pc(conn(O) * 100, 100)} on him (league ${pc(LEAGUE * 100, 100)})`); }
for (const p of Object.keys(A.gotBy)) { const s = share(A, p), o = share(O, p); if (s > .12 && s - o > .06) add(false, (s - o) * 8, `leaks to the ${pn(p)}: ${pc(s * 100, 100)} of his damage (field ${pc(o * 100, 100)})`); }
{ const k = lr / Math.max(1, er), ok = olr / Math.max(1, oer); if (Math.abs(k - ok) > .08) add(k > ok, Math.abs(k - ok) * 6, k > ok ? `deep gas tank: keeps ${pc(lr, er)} of his output late` : `fades: keeps ${pc(lr, er)} of his output late (field ${pc(olr, oer)})`); }
{ const a = A.trap / A.rd, o = O.trap / O.rd; if (a - o > 2) add(false, (a - o) / 3, `gets trapped: ${f1(a)} s/rd on the ropes (they're there ${f1(o)})`); else if (o - a > 2) add(true, (o - a) / 3, `ring general: puts them on the ropes ${f1(o)} s/rd, he's there ${f1(a)}`); }
{ const a = A.ctrAte / A.rd, o = O.ctrAte / O.rd; if (a - o > .6) add(false, (a - o) / 1.5, `walks onto counters: eats ${f1(a)}/rd (they eat ${f1(o)})`); if (A.ctrLanded / A.rd - O.ctrLanded / O.rd > .6) add(true, (A.ctrLanded - O.ctrLanded) / A.rd / 1.5, `sharp counterpuncher: lands ${f1(A.ctrLanded / A.rd)} counters/rd`); }
if (A.kdTaken >= 2 && A.kdTaken > O.kdTaken * 1.5) add(false, A.kdTaken / N * 4, `chin questions: down ${A.kdTaken}x in ${N} fights (dropped them ${O.kdTaken}x)`);
if (O.kdTaken >= 2 && O.kdTaken > A.kdTaken * 1.5) add(true, O.kdTaken / N * 4, `power: dropped them ${O.kdTaken}x in ${N} fights`);
const worst = Object.entries(vs).filter(([, v]) => v.l >= 2 && v.l > v.w).map(([k, v]) => `${S.STYLES[k].label} ${v.w}-${v.l}`);
if (worst.length) add(false, .5, 'trouble with: ' + worst.join(', '));
const top = g => notes.filter(x => x.good === g).sort((a, b) => b.score - a.score).slice(0, 4).map(x => '  - ' + x.txt);
console.log('\nSTRENGTHS'); console.log(top(true).join('\n') || '  - nothing that stands out from the field');
console.log('WEAKNESSES'); console.log(top(false).join('\n') || '  - nothing that stands out from the field');
console.log(`\nWhat he learned: nothing yet. He fights fight ${N} with the same brain as fight 1 (learning comes with skill levels, ROADMAP item 2).`);
