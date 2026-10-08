// Skill levels report (L0 baseline): win % by level gap, skill use and success by level, bad-technique counts.
// node tests/levels.js [N]   N fights per level pairing (default 200; 10 pairings). Recording only: wraps Fight methods, never changes a fight.
// No level system yet: a level is a proxy from what drives skill today (stats + exp -> ringIQ), one per walk-in type
// (docs/BRAIN.md "Skill levels"): raw beginner = Novice, journeyman = Intermediate, ranked pro = Pro, P4P = Worldclass.
// Re-run after L1-L6 with the same N and compare against the baseline in docs/BRAIN.md.
const S = require('./sim.js');
const P = S.Fight.prototype;
const N = +process.argv[2] || 200, ROUNDS = +(process.env.ROUNDS || 10);
const BASE = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const LV = [{ k: 'Novice', r: 42, exp: 0 }, { k: 'Inter', r: 59, exp: 12 }, { k: 'Pro', r: 75, exp: 30 }, { k: 'World', r: 90, exp: 45 }];
const pct = (a, b) => b ? (100 * a / b).toFixed(1) : '-';
const f1 = x => (isFinite(x) ? x : 0).toFixed(1), f2 = x => (isFinite(x) ? x : 0).toFixed(2);
const pad = (s, n) => String(s).padStart(n);
const pick = a => a[Math.random() * a.length | 0];

// ---- instrumentation: per fighter counters in F.lv ----
const C = F => F.lv || (F.lv = { combos: 0, comboLen: 0, combo3: 0, setup: 0, power: 0, reacts: 0, antSum: 0, ant3: 0 });
const PC0 = P.pickCombo;
P.pickCombo = function (F, d, sg, hurtOp) {
  const c = PC0.call(this, F, d, sg, hurtOp);
  if (c) { const n = c.filter(x => x !== '~').length, m = C(F); m.combos++; m.comboLen += n; if (n >= 3) m.combo3++; }
  return c;
};
const SP0 = P.startPunch;
P.startPunch = function (F, type) {
  SP0.call(this, F, type);
  const p = F.act && F.act.type; if (!p || F.act.feint) return;
  const m = C(F); if (p !== 'jab' && p !== 'bodyJab') { m.power++; if (F.prevP === 'jab') m.setup++; } // a power shot behind the jab
};
const R0 = P.react;
const SENT = {};
P.react = function (D, A, Pn, feint) {
  const prev = D.antic; D.antic = SENT;
  R0.call(this, D, A, Pn, feint);
  if (D.antic === SENT) { D.antic = prev; return; } // returned before the read (stunned, mid-punch, tied up)
  if (feint) return;
  const rd = D.antic ? D.antic.rd : 0, m = C(D); m.reacts++; m.antSum += rd; if (rd > .3) m.ant3++;
};

function fight(A, B) {
  const f = new S.Fight(A, B, { rounds: ROUNDS }); let n = 0;
  while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); }
  return f;
}
function mk(L) { const st = pick(BASE), r = L.r + Math.round((Math.random() - .5) * 6); const s = S.sheet(r, st, S.rollGuard(st), L.exp); s.stance = Math.random() < .2 ? 'southpaw' : 'orthodox'; return s; }

// ---- per level totals ----
const T = LV.map(() => ({ n: 0, rds: 0, iq: 0, thrown: 0, landed: 0, jabT: 0, jabL: 0, powT: 0, powL: 0, bodyT: 0, bodyL: 0, combos: 0, comboLen: 0, combo3: 0, setup: 0, power: 0, feint: 0,
  inc: 0, ev: 0, blk: 0, def: { slip: 0, duck: 0, pull: 0, roll: 0, block: 0 }, clinch: 0,
  esc: { pivot: 0, spin: 0, punch: 0 }, trap: 0, ctrl: 0, cutoff: 0, angle: 0,
  ctrT: 0, ctrL: 0, reacts: 0, antSum: 0, ant3: 0, early: 0, late: 0, earlyR: 0, lateR: 0,
  wild: 0, short: 0, jammed: 0, smoth: 0, glance: 0, landQ: 0 }));
const W = LV.map(() => LV.map(() => ({ n: 0, w: 0, l: 0, d: 0, stop: 0 })));

function record(f, side, li) {
  const t = T[li], F = f.f[side], O = f.f[1 - side], rds = f.cards[0].length || 1;
  t.n++; t.rds += rds; t.iq += F.iq;
  const thr = F.tot.thrown, ld = F.tot.landed;
  t.thrown += thr.jab + thr.power + thr.body; t.landed += ld.jab + ld.power + ld.body;
  t.jabT += thr.jab; t.jabL += ld.jab; t.powT += thr.power; t.powL += ld.power; t.bodyT += thr.body; t.bodyL += ld.body;
  const m = F.lv || {}; for (const k of ['combos', 'comboLen', 'combo3', 'setup', 'power', 'reacts', 'antSum', 'ant3']) t[k] += m[k] || 0;
  for (const rl of f.roundLog) { const me = side === 0 ? rl.a : rl.b; t.trap += me.trap * 3; t.ctrl += me.ctrl * 3; }
  const third = Math.max(1, Math.floor(rds / 3));
  for (const e of f.events) {
    if (e.type === 'throw' && e.a === side) { if (e.round <= third) t.early++; else if (e.round > rds - third) t.late++; }
    else if (e.type === 'feint' && e.a === side) t.feint++;
    else if (e.type === 'clinch' && e.c === side) t.clinch++;
    else if (e.type === 'escape' && e.a === side) t.esc[e.how]++;
    else if (e.type === 'cutoff' && e.a === side) t.cutoff++;
    else if (e.type === 'angle' && e.a === side) t.angle++;
    else if (e.type === 'counterTry' && e.a === side) t.ctrT++;
    else if (e.type === 'hit' && e.a === side) { if (e.counter && !e.blocked) t.ctrL++; if (!e.blocked) { t.landQ++; if (e.q === 'smothered') t.smoth++; if (e.q === 'glancing') t.glance++; } }
    else if (e.type === 'hit' && e.d === side) { t.inc++; if (e.blocked) t.blk++; }
    else if (e.type === 'miss' && e.a === side) { if (e.why === 'wild') t.wild++; else if (e.mt === 'short') t.short++; else if (e.mt === 'jammed') t.jammed++; }
    else if (e.type === 'miss' && e.d === side) { t.inc++; if (e.why === 'evade') { t.ev++; if (t.def[e.def] != null) t.def[e.def]++; } }
  }
  t.earlyR += third; t.lateR += third;
}

const t0 = Date.now();
for (let i = 0; i < LV.length; i++) for (let j = i; j < LV.length; j++) {
  for (let n = 0; n < N; n++) {
    const sw = Math.random() < .5, a = sw ? j : i, b = sw ? i : j; // random corners
    const f = fight(mk(LV[a]), mk(LV[b])), r = f.result, w = W[i][j];
    w.n++; if (!r.decision) w.stop++;
    const lo = sw ? 1 : 0; // side of the lower level (i)
    if (r.winner == null) w.d++; else if (r.winner === lo) w.w++; else w.l++;
    record(f, 0, a); record(f, 1, b);
  }
}

console.log(`\n== SKILL LEVELS L0 (${N} fights per pairing, ${ROUNDS} rds, random base styles + guards, ${((Date.now() - t0) / 1000).toFixed(0)} s) ==`);
console.log('Proxy levels: ' + LV.map((L, i) => `${L.k} r${L.r} exp${L.exp} (IQ ${f1(T[i].iq / T[i].n)})`).join(' | '));
console.log('\n-- Win % of the LOWER level (row) vs the higher (col); same level = side A. stop% = fights stopped --');
console.log(pad('', 8) + LV.map(L => pad(L.k, 16)).join(''));
for (let i = 0; i < LV.length; i++) {
  let s = pad(LV[i].k, 8);
  for (let j = 0; j < LV.length; j++) { if (j < i) { s += pad('', 16); continue; } const w = W[i][j]; s += pad(`${pct(w.w, w.n)} (${pct(w.stop, w.n)})`, 16); }
  console.log(s);
}
const gap = [0, 1, 2, 3].map(g => { let w = 0, n = 0; for (let i = 0; i + g < LV.length; i++) { w += W[i][i + g].w + W[i][i + g].d / 2; n += W[i][i + g].n; } return g + ` down: ${pct(w, n)}%`; });
console.log('By gap (draw = half): ' + gap.join(' | ') + '   target one down: 15-20%');

const row = (lab, fn) => console.log(pad(lab, 24) + T.map((t, i) => pad(fn(t, i), 12)).join(''));
console.log('\n-- Per level, per fighter (all opponents) --');
console.log(pad('', 24) + LV.map(L => pad(L.k, 12)).join(''));
console.log('OFFENSE');
row('thrown / rd', t => f1(t.thrown / t.rds));
row('landed / rd', t => f1(t.landed / t.rds));
row('connect %', t => pct(t.landed, t.thrown));
row('jab share % / conn %', t => pct(t.jabT, t.thrown) + '/' + pct(t.jabL, t.jabT));
row('power conn %', t => pct(t.powL, t.powT));
row('body share % / conn %', t => pct(t.bodyT, t.thrown) + '/' + pct(t.bodyL, t.bodyT));
row('combo len / 3+ %', t => f2(t.comboLen / t.combos) + '/' + pct(t.combo3, t.combos));
row('feints / rd', t => f2(t.feint / t.rds));
row('power behind jab %', t => pct(t.setup, t.power));
console.log('DEFENSE (shots at him)');
row('evaded %', t => pct(t.ev, t.inc));
row('blocked %', t => pct(t.blk, t.inc));
row('slip/duck/pull/roll %', t => ['slip', 'duck', 'pull', 'roll'].map(k => Math.round(100 * t.def[k] / Math.max(1, t.ev))).join('/'));
row('clinches / rd', t => f2(t.clinch / t.rds));
console.log('RING CRAFT');
row('on ropes s / rd', t => f1(t.trap / t.rds));
row('ring control s / rd', t => f1(t.ctrl / t.rds));
row('escapes / rd', t => f2((t.esc.pivot + t.esc.spin + t.esc.punch) / t.rds));
row('pivot/spin/punch %', t => { const e = t.esc.pivot + t.esc.spin + t.esc.punch || 1; return ['pivot', 'spin', 'punch'].map(k => Math.round(100 * t.esc[k] / e)).join('/'); });
row('cutoffs / rd', t => f2(t.cutoff / t.rds));
console.log('FIGHT IQ');
row('counters tried / rd', t => f2(t.ctrT / t.rds));
row('counters landed / rd', t => f2(t.ctrL / t.rds));
row('read the shot (avg)', t => f2(t.antSum / Math.max(1, t.reacts)));
row('read it >.3 %', t => pct(t.ant3, t.reacts));
row('pace late/early', t => f2((t.late / t.lateR) / Math.max(1e-9, t.early / t.earlyR)));
console.log('BAD TECHNIQUE (today: misses and contact quality only; L2 adds telegraph, off balance, arm punches)');
row('wild misses / rd', t => f2(t.wild / t.rds));
row('short / jammed / rd', t => f2(t.short / t.rds) + '/' + f2(t.jammed / t.rds));
row('smothered % landed', t => pct(t.smoth, t.landQ));
row('glancing % landed', t => pct(t.glance, t.landQ));
console.log('Not measured yet (no system): adjusting between rounds, taking corner advice, style/stance familiarity.');
