// The eyes (E2, docs/PLUGIN.md): what each level notices about the other man. One brain per level (sk N/I/P/W, same body 82) vs a random Pro; every cue episode
// (the truth goes over the cue's threshold until it drops under half of it) counts as seen if he noticed it before it ended, with the delay in clock seconds.
//   TAG=x node tests/eyes.js 40     (x4)     node tests/eyes.js agg x
const fs = require('fs'), OUT = t => '/tmp/eyes_' + t + '.txt';
const CUES = ['cut', 'body', 'arms', 'fold', 'legs', 'wobble'], LV = { N: 34, I: 56, P: 74, W: 90 };
if (process.argv[2] === 'agg') { const L = fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse), A = {};
  for (const o of L) { const a = A[o.lv] = A[o.lv] || {}; for (const c of CUES) { const x = a[c] = a[c] || { ep: 0, seen: 0, d: [] }, y = o[c]; x.ep += y.ep; x.seen += y.seen; x.d.push(...y.d); } } report(A); return; }
process.env.PATCH = (process.env.PATCH || '') + ';globalThis.__BB=BoxerBrain;';
const S = require('./sim.js'), BB = globalThis.__BB, ALL = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), pick = a => a[Math.floor(Math.random() * a.length)];
const N = +process.argv[2] || 40, B = BB.BR.eye, R = {};
for (const lv in LV) {
  const o = R[lv] = { lv }; for (const c of CUES) o[c] = { ep: 0, seen: 0, d: [] };
  for (let i = 0; i < N; i++) {
    const side = i & 1, st = pick(ALL), os = pick(ALL), me = S.sheet(82, st, S.rollGuard(st)), op = S.sheet(82, os, S.rollGuard(os)); me.sk = S.skMake(LV[lv], st); op.sk = S.skMake(74, os);
    const f = new S.Fight(side ? op : me, side ? me : op, { rounds: 10 }), Bn = f.f[side].brain, real = Bn.think.bind(Bn), ep = {};
    Bn.think = (P, dt) => { const out = real(P, dt), L = P.him.look; if (!L) return out;
      const v = { cut: L.cut, body: 1 - L.body, arms: 1 - L.arms, fold: L.fold, legs: L.legs, wobble: L.wobble };
      for (const c of CUES) { const e = ep[c], s = Bn.eye[c];
        if (!e && v[c] >= B.thr[c]) ep[c] = { t0: Bn.ct, seen: null };
        else if (e) { if (e.seen == null && s && s.ct >= e.t0) e.seen = s.ct - e.t0; if (v[c] < B.thr[c] * .5) { close(c, e); ep[c] = null; } } }
      return out; };
    const close = (c, e) => { o[c].ep++; if (e.seen != null) { o[c].seen++; o[c].d.push(+e.seen.toFixed(1)); } };
    let n = 0; while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); f.events = []; }
    for (const c of CUES) if (ep[c]) close(c, ep[c]);
  }
  if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(o) + '\n');
}
if (!process.env.TAG) report(Object.fromEntries(Object.entries(R).map(([k, o]) => [k, o])));
function report(A) {
  const med = a => { if (!a.length) return '-'; const b = a.slice().sort((x, y) => x - y); return b[b.length >> 1].toFixed(1); };
  console.log('level  ' + CUES.map(c => c.padEnd(16)).join('') + '  (seen % of episodes, median delay s of clock, episodes)');
  for (const lv of Object.keys(LV)) { const a = A[lv]; if (!a) continue;
    console.log(lv.padEnd(7) + CUES.map(c => { const x = a[c]; return ((x.ep ? (100 * x.seen / x.ep).toFixed(0) + '%' : '-') + ' ' + med(x.d) + 's n' + x.ep).padEnd(16); }).join('')); }
}
