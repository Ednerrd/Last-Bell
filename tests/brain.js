// Brain report: how the AI boxer decides, how his rhythm moves, whether ring IQ wins fights, whether he learns.
// node tests/brain.js [mode] [N]   modes: tempo | iq | adapt | styles | all (default all, N per mode)
// Recording only: wraps Fight methods from the outside, never changes a fight.
const S = require('./sim.js');
const P = S.Fight.prototype;
const mode = process.argv[2] || 'all', N = +process.argv[3] || 200;
const BASE = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const pct = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '-';
const f1 = x => (isFinite(x) ? x : 0).toFixed(1), f2 = x => (isFinite(x) ? x : 0).toFixed(2);
const pickS = () => BASE[Math.random() * BASE.length | 0];
const bucket = (r, n) => r <= Math.ceil(n * .3) ? 0 : r <= Math.ceil(n * .7) ? 1 : 2;
const BK = ['early', 'mid', 'late'];

// ---- instrumentation ----
const DEC = { punch: 0, feint: 0, block: 0, move: 0, clinch: 0, nothing: 0 };
const D0 = P.decide;
P.decide = function (F) {
  const b = { cl: this.clinchT || 0, sl: F.slideT || 0, def: F.def };
  D0.call(this, F);
  if (!F.dec) F.dec = {}; let k;
  if ((this.clinchT || 0) > 0 && b.cl <= 0) k = 'clinch';
  else if (F.state === 'punch' && F.act) k = F.act.feint ? 'feint' : 'punch';
  else if ((F.slideT || 0) > b.sl + 1e-3) k = 'move';
  else if (F.def === 'block' && b.def !== 'block') k = 'block';
  else k = 'nothing';
  DEC[k]++;
};
let DIST = { sum: 0, n: 0 };
const S0 = P.step;
P.step = function (dt) { S0.call(this, dt); if (this.phase === 'fight' && !(this.clinchT > 0)) { const [A, B] = this.f, d = Math.hypot(A.x - B.x, A.z - B.z); DIST.sum += d; DIST.n++; } };

// habits for the adaptation test: a fighter who always does the same thing
const R0 = P.react, PC0 = P.pickCombo;
P.react = function (D, A, Pn, feint) {
  R0.call(this, D, A, Pn, feint);
  if (D.habit === 'slip' && D.pendingDef) D.pendingDef.kind = 'slip';   // slips everything, hooks included
};
P.pickCombo = function (F, d, sg, hurtOp) {
  if (F.habit === 'combo') return d < 82 ? ['jab', 'cross'] : null;  // the same 1-2, every time
  return PC0.call(this, F, d, sg, hurtOp);
};

function fight(A, B, opts, setup) {
  const f = new S.Fight(A, B, opts || {}); if (setup) setup(f); let n = 0;
  while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); }
  return f;
}
// round winner by the three judges: +1 side 0, -1 side 1, 0 even
function roundWins(f) {
  const out = []; const n = f.cards[0].length;
  for (let r = 0; r < n; r++) { let s = 0; for (const c of f.cards) { const x = c[r]; if (x) s += Math.sign(x[0] - x[1]); } out.push(Math.sign(s)); }
  return out;
}

// ---- tempo: decision mix, exchange rhythm, output by round ----
function tempo(n) {
  for (const k in DEC) DEC[k] = 0;
  const gaps = [], ex = [], win = [], byRound = {}, rounds = 10;
  for (let i = 0; i < n; i++) {
    const a = pickS(), b = pickS();
    const f = fight(S.sheet(80, a, S.rollGuard(a)), S.sheet(80, b, S.rollGuard(b)), { rounds });
    const th = f.events.filter(e => e.type === 'throw');
    // exchanges: throws by either man less than .7 s apart
    let cur = null;
    for (const e of th) {
      if (cur && e.t - cur.end < .7 && e.round === cur.round) { cur.end = e.t; cur.n++; }
      else { if (cur) { ex.push(cur.n); if (e.round === cur.round) gaps.push(e.t - cur.end); } cur = { end: e.t, n: 1, round: e.round }; }
    }
    if (cur) ex.push(cur.n);
    // 10-second windows of fight time (30 s of clock): how bursty is the work
    const byWin = {};
    for (const e of th) { const w = e.round * 100 + Math.floor(e.clock / 30); byWin[w] = (byWin[w] || 0) + 1; byRound[e.round] = (byRound[e.round] || 0) + 1; }
    const rr = f.result.decision ? rounds : f.result.round - 1;
    for (let r = 1; r <= rr; r++) for (let w = 0; w < 6; w++) win.push(byWin[r * 100 + w] || 0);
    byRound['n' + Math.min(rounds, f.result.round)] = (byRound['n' + Math.min(rounds, f.result.round)] || 0) + 1;
  }
  const tot = Object.values(DEC).reduce((s, x) => s + x, 0);
  console.log(`\n== TEMPO (${n} fights, 10 rds, rating 80, random base styles) ==`);
  console.log('decide() outcomes: ' + Object.keys(DEC).map(k => `${k} ${pct(DEC[k], tot)}`).join(' | '));
  gaps.sort((x, y) => x - y); const mean = gaps.reduce((s, x) => s + x, 0) / gaps.length;
  const sd = Math.sqrt(gaps.reduce((s, x) => s + (x - mean) ** 2, 0) / gaps.length), q = p => gaps[Math.floor(p * (gaps.length - 1))];
  console.log(`quiet gaps between exchanges (sim s): mean ${f2(mean)} | p10 ${f2(q(.1))} p50 ${f2(q(.5))} p90 ${f2(q(.9))} | CV ${f2(sd / mean)} | >2s ${pct(gaps.filter(x => x > 2).length, gaps.length)} >4s ${pct(gaps.filter(x => x > 4).length, gaps.length)}`);
  const exm = ex.reduce((s, x) => s + x, 0) / ex.length;
  console.log(`exchange size: mean ${f2(exm)} punches | 1 punch ${pct(ex.filter(x => x === 1).length, ex.length)} | 6+ ${pct(ex.filter(x => x >= 6).length, ex.length)}`);
  const wm = win.reduce((s, x) => s + x, 0) / win.length, wsd = Math.sqrt(win.reduce((s, x) => s + (x - wm) ** 2, 0) / win.length);
  console.log(`punches per 30s of clock (both men): mean ${f1(wm)} | CV ${f2(wsd / wm)} (higher = burstier) | quiet windows (<40% of mean) ${pct(win.filter(x => x < wm * .4).length, win.length)}`);
  // output by round: fights still going into round r
  let alive = n; const line = [];
  for (let r = 1; r <= rounds; r++) { line.push(f1((byRound[r] || 0) / Math.max(1, alive) / 2)); alive -= byRound['n' + r] || 0; }
  console.log('thrown per man by round: ' + line.join(' '));
}

// ---- iq: same stats, same style, only ring IQ differs ----
function iqLadder(n, lo, hi) {
  let w = 0, l = 0, d = 0; const rw = [[0, 0], [0, 0], [0, 0]], ld = [[0, 0], [0, 0], [0, 0]], rounds = 10;
  for (let i = 0; i < n; i++) {
    const s = pickS(), g = S.rollGuard(s), sh = S.sheet(80, s, g), side = i & 1; // the smart one swaps sides
    const f = fight(sh, JSON.parse(JSON.stringify(sh)), { rounds }, f => { f.f[side].iq = hi; f.f[1 - side].iq = lo; });
    const r = f.result; if (r.winner === side) w++; else if (r.winner === 1 - side) l++; else d++;
    roundWins(f).forEach((x, j) => { const b = bucket(j + 1, rounds); const me = side === 0 ? x : -x; rw[b][1]++; if (me > 0) rw[b][0]++; else if (me === 0) rw[b][0] += .5; });
    for (const e of f.events) if (e.type === 'hit' && !e.blocked) { const b = bucket(e.round, rounds); ld[b][e.a === side ? 0 : 1]++; }
  }
  console.log(`IQ ${hi} vs ${lo} (${n} fights, mirror stats/style/guard): smart wins ${pct(w, n)} loses ${pct(l, n)} draws ${d}`);
  console.log('  rounds won by smart: ' + BK.map((k, b) => `${k} ${pct(rw[b][0], rw[b][1])}`).join(' | ') + '   landed share: ' + BK.map((k, b) => `${k} ${pct(ld[b][0], ld[b][0] + ld[b][1])}`).join(' | '));
}
function iq(n) {
  console.log(`\n== IQ LADDER (rating 80, 10 rds) ==`);
  iqLadder(n, 40, 90); iqLadder(n, 60, 80);
}

// ---- adapt: one man has a habit, does the other exploit it more as the fight goes on? ----
function adaptOne(n, habit, oppIQ) {
  const rounds = 10, land = [[0, 0], [0, 0], [0, 0]], av = [[0, 0], [0, 0], [0, 0]], kinds = [{}, {}, {}], ctr = [0, 0, 0], rn = [0, 0, 0];
  let w = 0;
  for (let i = 0; i < n; i++) {
    const s = pickS(), g = S.rollGuard(s), sh = S.sheet(80, s, g);
    const f = fight(sh, JSON.parse(JSON.stringify(sh)), { rounds }, f => { f.f[1].habit = habit; f.f[1].iq = 60; f.f[0].iq = oppIQ; });
    if (f.result.winner === 0) w++;
    const lastR = f.result.decision ? rounds : f.result.round;
    for (let r = 1; r <= lastR; r++) rn[bucket(r, rounds)]++;
    for (const e of f.events) {
      const b = bucket(e.round, rounds);
      if (e.type === 'throw' && e.a === 0) kinds[b][e.p] = (kinds[b][e.p] || 0) + 1;
      if (e.type === 'hit' && e.a === 0) { land[b][1]++; if (!e.blocked) land[b][0]++; if (e.counter && !e.blocked) ctr[b]++; }
      if (e.type === 'miss' && e.a === 0) land[b][1]++;
      if ((e.type === 'hit' || e.type === 'miss') && e.a === 1) { av[b][1]++; if (e.type === 'miss' || e.blocked) av[b][0]++; }
    }
  }
  const hook = b => { const k = kinds[b], t = Object.values(k).reduce((s, x) => s + x, 0); return pct((k.hook || 0) + (k.rhook || 0) + (k.bodyHook || 0) + (k.uppercut || 0) + (k.lupper || 0), t); };
  console.log(`  opp IQ ${oppIQ}: wins ${pct(w, n)} | his connect ${BK.map((k, b) => pct(land[b][0], land[b][1])).join(' → ')} | stops habit's shots ${BK.map((k, b) => pct(av[b][0], av[b][1])).join(' → ')} | counters landed/rd ${BK.map((k, b) => f2(ctr[b] / Math.max(1, rn[b]))).join(' → ')} | hooks+ups share ${BK.map((k, b) => hook(b)).join(' → ')}`);
}
function adapt(n) {
  console.log(`\n== ADAPTATION (mirror fighters, habit man IQ 60; columns early → mid → late) ==`);
  console.log('habit "slip": slips every shot, hooks included (the fix: throw hooks, he slips into them)');
  adaptOne(n, 'slip', 40); adaptOne(n, 'slip', 90);
  console.log('habit "combo": only ever throws a 1-2 (the fix: read it, slip the 2, counter)');
  adaptOne(n, 'combo', 40); adaptOne(n, 'combo', 90);
}

// ---- styles: what each style actually looks like ----
function styles(n) {
  console.log(`\n== STYLE IDENTITY (${n} fights per style vs random base styles, rating 80, 10 rds) ==`);
  console.log('style          thrown/rd  jab%  body%  power%  connect  ctr landed/rd  avg dist  clinch/rd');
  for (const s of Object.keys(S.STYLES)) {
    let thr = 0, jab = 0, body = 0, pow = 0, ld = 0, att = 0, ctr = 0, rds = 0, cl = 0; DIST = { sum: 0, n: 0 };
    for (let i = 0; i < n; i++) {
      const o = pickS();
      const f = fight(S.sheet(80, s, S.rollGuard(s)), S.sheet(80, o, S.rollGuard(o)), { rounds: 10 });
      rds += f.result.decision ? 10 : f.result.round - .5;
      for (const e of f.events) {
        if (e.type === 'throw' && e.a === 0) { thr++; if (e.p === 'jab') jab++; else if (e.p === 'bodyJab' || e.p === 'bodyHook') body++; else pow++; }
        if ((e.type === 'hit' || e.type === 'miss') && e.a === 0) { att++; if (e.type === 'hit' && !e.blocked) { ld++; if (e.counter) ctr++; } }
        if (e.type === 'clinch' && e.c === 0) cl++;
      }
    }
    console.log(`${(S.STYLES[s].label || s).padEnd(15)}${f1(thr / rds).padStart(8)}  ${pct(jab, thr).padStart(6)} ${pct(body, thr).padStart(6)} ${pct(pow, thr).padStart(7)} ${pct(ld, att).padStart(8)} ${f2(ctr / rds).padStart(10)} ${f1(DIST.sum / DIST.n).padStart(11)} ${f2(cl / rds).padStart(10)}`);
  }
}

const t0 = Date.now();
if (mode === 'tempo' || mode === 'all') tempo(N);
if (mode === 'iq' || mode === 'all') iq(N);
if (mode === 'adapt' || mode === 'all') adapt(N);
if (mode === 'styles' || mode === 'all') styles(Math.max(40, N / 4 | 0));
console.log(`\n(${((Date.now() - t0) / 1000).toFixed(0)} s)`);
