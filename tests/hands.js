// The hands tell the truth (1f f1b, docs/PLUGIN.md): body then head. Random levels N/I/P/W both sides, @82, styles roll, 10 rounds.
// Per head shot thrown: was his body gone (meter < GONE, default 60) and were his elbows clamped (F.clamp > .2). Clean = landed, not blocked.
// KDs by zone, and head KDs on a man whose body had gone (the 'body first, the head follows' finish). Seen = the thrower had spotted the elbows.
//   TAG=x node tests/hands.js 300     node tests/hands.js agg x
const fs = require('fs'), OUT = t => '/tmp/hands_' + t + '.txt', GONE = +process.env.GONE || 60;
const LV = { N: 34, I: 56, P: 74, W: 90 }, LK = Object.keys(LV), BODYP = { bodyJab: 1, bodyCross: 1, bodyHook: 1 };
const blank = () => ({ fights: 0, stops: 0, kd: 0, kdBody: 0, kdHeadGone: 0, kdHeadClamp: 0, hT: [0, 0, 0], hL: [0, 0, 0], hS: [0, 0], hG: [0, 0], bT: [0, 0], bL: [0, 0], clampT: 0, rT: 0, gasR: [0, 0], grdR: [0, 0] });
let A = blank();
if (process.argv[2] === 'agg') { for (const l of fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n')) add(A, JSON.parse(l)); report(); return; }
const S = require('./sim.js'), ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), pick = a => a[Math.floor(Math.random() * a.length)];
const N = +process.argv[2] || 100;
for (let i = 0; i < N; i++) {
  const sh = [0, 1].map(() => { const st = pick(ALL), s = S.sheet(82, st, S.rollGuard(st)); s.sk = S.skMake(LV[pick(LK)], st); return s; });
  const f = new S.Fight(sh[0], sh[1], { rounds: 10 });
  const st = D => (D.body < GONE ? 1 : 0) + ((D.clamp || 0) > .2 ? 1 : 0) * (D.body < GONE ? 1 : 2); // 0 fresh, 1 gone, 2 clamped (gone or not)
  const ok = f.knockdown.bind(f);
  f.knockdown = (D, Ak, zone, lv) => { A.kd++; if (zone === 'body' || lv) A.kdBody++; else { if (D.body < GONE) A.kdHeadGone++; if ((D.clamp || 0) > .2) A.kdHeadClamp++; } return ok(D, Ak, zone, lv); };
  const oe = f.emit.bind(f);
  f.emit = (t, e) => {
    if (t === 'throw') { const D = f.f[1 - e.a], s = st(D); if (BODYP[e.p]) A.bT[D.body < GONE ? 1 : 0]++; else { A.hT[s]++; A.hG[D.body < GONE ? 1 : 0]++; if (s === 2) { const W = f.f[e.a].brain; if (W.seen && W.seen('elbows') > .1) A.hS[0]++; } } }
    if (t === 'hit' && !e.blocked) { const D = f.f[e.d], s = st(D); if (e.zone === 'body') A.bL[D.body < GONE ? 1 : 0]++; else { A.hL[s]++; if (s === 2) { const W = f.f[e.a].brain; if (W.seen && W.seen('elbows') > .1) A.hS[1]++; } } }
    return oe(t, e);
  };
  let n = 0;
  while (f.phase !== 'over' && n < 600000) {
    f.step(); n++;
    if (n % 20 === 0) for (const F of f.f) { A.rT++; if ((F.clamp || 0) > .2) A.clampT++; const W = F.op.brain; if (W.ph) { A.gasR[0] += Math.abs(W.ph.gas - F.stam / Math.max(1, F.stamMax)); A.grdR[0] += Math.abs(W.ph.guard - F.bg * (.5 + .5 * F.gi)); A.gasR[1]++; A.grdR[1]++; } }
    if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1));
  }
  A.fights++; if (f.result && !f.result.decision) A.stops++;
}
if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(A) + '\n'); else report();
function add(T, o) { for (const k in o) { if (Array.isArray(o[k])) o[k].forEach((v, j) => T[k][j] += v); else T[k] += o[k]; } }
function report() {
  const pc = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '-';
  console.log(`fights ${A.fights}, stops ${pc(A.stops, A.fights)}, KDs ${(A.kd / A.fights).toFixed(2)}/fight, body KDs ${pc(A.kdBody, A.kd)}, head KDs on a gone body ${pc(A.kdHeadGone, A.kd - A.kdBody)}, on clamped elbows ${pc(A.kdHeadClamp, A.kd - A.kdBody)}`);
  console.log(`head shots clean: fresh ${pc(A.hL[0], A.hT[0])} (${A.hT[0]}), body gone ${pc(A.hL[1], A.hT[1])} (${A.hT[1]}), clamped ${pc(A.hL[2], A.hT[2])} (${A.hT[2]}; seen ${pc(A.hS[0], A.hT[2])} of them, clean ${pc(A.hS[1], A.hS[0])})`);
  console.log(`body shots clean: fresh ${pc(A.bL[0], A.bT[0])}, body gone ${pc(A.bL[1], A.bT[1])}; head share at a gone body ${pc(A.hG[1], A.hG[1] + A.bT[1])} (fresh ${pc(A.hG[0], A.hG[0] + A.bT[0])}); clamped ${pc(A.clampT, A.rT)} of the time`);
  console.log(`reads off the truth (mean |seen - true|): gas ${(A.gasR[0] / Math.max(1, A.gasR[1])).toFixed(3)}, guard ${(A.grdR[0] / Math.max(1, A.grdR[1])).toFixed(3)}`);
}
