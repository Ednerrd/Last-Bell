// The bluff (1f, docs/PLUGIN.md): every hurt spell (his brain's survive mode), by the hurt man's level and the watcher's. Random levels N/I/P/W both sides, body 82, styles roll.
// Per spell: did it start in a stun, did he bluff, did the other man see it at all (ph.hurt, the stun shows in full), did he catch it (still going after him, hunt or huntSafe,
// once the stun is CATCH clock s behind), did he hunt at all, a knockdown or a stop in the spell (+3 s).
//   TAG=x node tests/fakes.js 200     node tests/fakes.js agg x
const fs = require('fs'), OUT = t => '/tmp/fakes_' + t + '.txt';
const LV = { N: 34, I: 56, P: 74, W: 90 }, LK = Object.keys(LV);
const blank = () => ({ n: 0, stun: 0, bluff: 0, seen: 0, caught: 0, cT: 0, hunt: 0, kd: 0, stop: 0 }), CATCH = +process.env.CATCH || 1.5;
let A = { fights: 0, stops: 0, by: {}, cross: {} };
if (process.argv[2] === 'agg') {
  for (const l of fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n')) add(A, JSON.parse(l));
  report(); return;
}
const S = require('./sim.js'), ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), pick = a => a[Math.floor(Math.random() * a.length)];
const N = +process.argv[2] || 100;
for (let i = 0; i < N; i++) {
  const lv = [pick(LK), pick(LK)], sh = lv.map(l => { const st = pick(ALL), s = S.sheet(82, st, S.rollGuard(st)); s.sk = S.skMake(LV[l], st); return s; });
  const f = new S.Fight(sh[0], sh[1], { rounds: 10 }), sp = [null, null];
  const close = (x, why) => { const s = sp[x]; if (!s) return; sp[x] = null; s.end = why; tally(s); };
  const tally = s => { for (const o of [A.by[s.lv] = A.by[s.lv] || {}, A.cross[s.lv + s.wl] = A.cross[s.lv + s.wl] || {}]) { const k = s.bluff ? 'bluff' : 'plain', a = o[k] = o[k] || blank(); a.n++; a.stun += s.stun; a.bluff += s.bluff; a.seen += s.seen; if (s.ct != null) { a.caught++; a.cT += s.ct; } a.hunt += s.hunt; a.kd += s.kd; a.stop += s.stop; } };
  f.f.forEach((F, x) => { const Bn = F.brain, W = f.f[1 - x].brain, real = Bn.think.bind(Bn);
    Bn.think = (P, dt) => { const was = Bn.mode, out = real(P, dt);
      if (Bn.mode === 'survive' && was !== 'survive') { close(x, 'new'); sp[x] = { lv: lv[x], wl: lv[1 - x], t0: Bn.ct, stun: F.state === 'stun' ? 1 : 0, bluff: Bn.hurtResp === 'bluff' ? 1 : 0, seen: 0, ct: null, st: Bn.ct, hunt: 0, kd: 0, stop: 0, h0: W.tel.hunts, kdUp: P.me.down ? 1 : 0 }; }
      const s = sp[x]; if (s) { if (F.state === 'stun') s.st = Bn.ct; if (W.ph && W.ph.hurt) s.seen = 1; if (s.ct == null && (W.mode === 'hunt' || W.mode === 'huntSafe') && Bn.ct - s.st >= CATCH) s.ct = Bn.ct - s.t0; if (W.tel.hunts > s.h0) s.hunt = 1; if (Bn.mode !== 'survive' && !s.left) s.left = Bn.ct; if (s.left && Bn.ct - s.left > 3) close(x, 'over'); }
      return out; }; });
  let n = 0;
  while (f.phase !== 'over' && n < 600000) {
    f.step(); n++;
    for (const e of f.stepEv) { if (e.type === 'knockdown' && sp[e.d]) sp[e.d].kd = 1; if (e.type === 'stoppage') { A.stops++; const d = f.result ? 1 - f.result.winner : null; if (d != null && sp[d]) sp[d].stop = 1; } }
    if (f.phase === 'corner') { close(0, 'bell'); close(1, 'bell'); f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); }
  }
  if (f.result && !f.result.decision) { const d = 1 - f.result.winner; if (sp[d]) sp[d].stop = 1; }
  close(0, 'end'); close(1, 'end'); A.fights++; f.events = [];
}
if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(A) + '\n'); else report();
function add(T, o) { T.fights += o.fights; T.stops += o.stops; for (const g of ['by', 'cross']) for (const k in o[g]) for (const b in o[g][k]) { const a = ((T[g][k] = T[g][k] || {})[b] = T[g][k][b] || blank()); for (const z in o[g][k][b]) a[z] += o[g][k][b][z]; } }
function report() {
  const pc = (a, b) => b ? (100 * a / b).toFixed(0) + '%' : '-';
  console.log(`fights ${A.fights}, stoppages ${pc(A.stops, A.fights)} (any reason; the audit is the real stop rate)`);
  console.log('hurt man   spells  bluffed  | plain: stun seen caught hunt kd stop | bluffed: seen caught (mean s) hunt kd stop');
  for (const l of LK) { const o = A.by[l] || {}, p = o.plain || blank(), b = o.bluff || blank(), n = p.n + b.n;
    console.log(`${l.padEnd(10)} ${String(n).padStart(6)}  ${pc(b.n, n).padStart(6)}   | ${pc(p.stun, p.n).padStart(4)} ${pc(p.seen, p.n).padStart(4)} ${pc(p.caught, p.n).padStart(5)} ${pc(p.hunt, p.n).padStart(4)} ${pc(p.kd, p.n).padStart(3)} ${pc(p.stop, p.n).padStart(4)} | ${pc(b.seen, b.n).padStart(4)} ${pc(b.caught, b.n).padStart(5)} ${(b.caught ? (b.cT / b.caught).toFixed(1) : '-').padStart(5)} ${pc(b.hunt, b.n).padStart(4)} ${pc(b.kd, b.n).padStart(3)} ${pc(b.stop, b.n).padStart(4)}`); }
  console.log('watcher catches (row = watcher level; plain / bluffed, all hurt men)');
  for (const w of LK) { let p = blank(), b = blank(); for (const l of LK) { const o = A.cross[l + w] || {}; for (const z in p) { p[z] += (o.plain || blank())[z]; b[z] += (o.bluff || blank())[z]; } }
    console.log(`${w.padEnd(10)} plain ${pc(p.caught, p.n).padStart(4)} of ${p.n} (stun-start ${pc(p.stun, p.n)})   bluffed ${pc(b.caught, b.n).padStart(4)} of ${b.n}`); }
}
