// F3c: what a shout does to what he does. Side 0's AI corner is off (the lab), side 1's on. Every ~20 s of a round, side 0 either gets
// the fight's call (k cycles by fight) or nothing (control); the next SHOUT_LEN s of his work are counted. Shout vs control by call.
// TAG=x node tests/callfx.js 80 [82] [keys]  (x4, appends /tmp/callfx_x.txt)  then  node tests/callfx.js agg x
const fs = require('fs');
const M = ['thr', 'jab', 'body', 'pow', 'ld', 'ctr', 'tk', 'tkPow', 'ev', 'dist', 'rope'];
if (process.argv[2] === 'agg') {
  const L = fs.readFileSync('/tmp/callfx_' + process.argv[3] + '.txt', 'utf8').trim().split('\n').map(JSON.parse), a = {};
  for (const r of L) { const o = a[r.k + (r.s ? '+' : '-')] = a[r.k + (r.s ? '+' : '-')] || { n: 0 }; o.n++; for (const m of M) o[m] = (o[m] || 0) + r[m]; }
  const ks = [...new Set(L.map(r => r.k))];
  console.log('per 14 s window: shout - control (control). n shout/control');
  console.log('call'.padEnd(8) + M.map(m => m.padStart(13)).join(''));
  for (const k of ks) { const s = a[k + '+'], c = a[k + '-']; if (!s || !c) continue;
    console.log(k.padEnd(8) + M.map(m => { const vs = s[m] / s.n, vc = c[m] / c.n; return ((vs - vc >= 0 ? '+' : '') + (vs - vc).toFixed(2) + ' (' + vc.toFixed(1) + ')').padStart(13); }).join('') + '  n' + s.n + '/' + c.n); }
  return;
}
const S = require('./sim.js');
const N = +process.argv[2] || 80, RT = +process.argv[3] || 82, keys = (process.argv[4] || Object.keys(S.SHOUTS).join(',')).split(',');
const styles = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), gs = Object.keys(S.GUARDS), LEN = S.SHOUT_LEN || 14;
const out = [];
for (let i = 0; i < N; i++) {
  const k = keys[i % keys.length], st = styles[(Math.random() * styles.length) | 0], st2 = styles[(Math.random() * styles.length) | 0];
  const A = S.sheet(RT, st, gs[(Math.random() * gs.length) | 0]), B = S.sheet(RT, st2, gs[(Math.random() * gs.length) | 0]);
  const f = new S.Fight(A, B, { rounds: 10, aiCorner: [0, 1] }); let n = 0, next = 6, W = null;
  while (f.phase !== 'over' && n < 600000) { f.step(); n++;
    if (f.phase === 'corner') { if (W) W = null; f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); next = f.t + 6; }
    if (W) {
      if (f.phase !== 'fight' && f.phase !== 'kd') W = null;
      else { const F0 = f.f[0], F1 = f.f[1]; W.dist += Math.abs(F0.x - F1.x) * S.DT; W.rope += (f.trapped(F0) ? 1 : 0) * S.DT;
        for (const e of f.events) { if (e.type !== 'hit' && e.type !== 'miss') continue; const P = S.PUNCH[e.p] || {}, hit = e.type === 'hit' && !e.blocked;
          if (e.a === 0) { W.thr++; if (P.cat === 'jab') W.jab++; else W.pow++; if ((e.zone || P.zone) === 'body') W.body++; if (hit) W.ld++; if (hit && e.counter) W.ctr++; }
          else { if (hit) { W.tk++; if (P.cat !== 'jab') W.tkPow++; } if (e.type === 'miss' && e.why === 'evade') W.ev++; } }
        if (f.t - W.t0 >= LEN) { W.dist /= LEN; W.rope /= LEN; delete W.t0; out.push(W); W = null; next = f.t + 6; } }
    } else if (f.phase === 'fight' && f.t >= next && !f.f[0].order && f.f[0].state !== 'stun' && f.f[1].state !== 'stun') {
      const s = Math.random() < .5; if (s) f.shout(0, k);
      W = { k, s: s ? 1 : 0, t0: f.t }; for (const m of M) W[m] = 0;
    }
    f.events = [];
  }
}
fs.appendFileSync('/tmp/callfx_' + (process.env.TAG || 'x') + '.txt', out.map(r => JSON.stringify(r)).join('\n') + '\n');
console.log('windows', out.length);
