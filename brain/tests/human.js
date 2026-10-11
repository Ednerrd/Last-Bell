// Is he human? node brain/tests/human.js [fights]
// 1. Adaptation: a man who slips everything. A smart opponent should learn to hook him (hook/upper share climbs by round); a novice stays flat.
// 2. Variety: the same two fighters, many fights. No two fights the same; outcomes spread.
const { BB, N, fight, line, pct, f1 } = require('./lib.js');
const n = N(2, 120);
function hookShare(tier) {
  const by = Array.from({ length: 10 }, () => ({ h: 0, t: 0 })); let w = 0;
  for (let k = 0; k < n; k++) {
    const slipper = BB.makeProfile({ style: 'outboxer', tier: 'pro', seed: 1e6 + k, traits: { slip: 1, shell: 0, legs: 0, circle: .3 } });
    const me = BB.makeProfile({ style: 'boxerpuncher', tier, seed: 2e6 + k });
    const { res, r } = fight(me, slipper, 31000 + k), F = r.f[0];
    if (res.winner === 0) w++;
    // count my punches per round by kind, from the brain's history isn't per round: use the ring's thrown log via events instead
    for (const e of F.hookLog || []) { by[e.r].t++; if (e.h) by[e.r].h++; }
  }
  return { by, w: w / n };
}
// hook the ring so we know what kind each thrown punch was, per round
const { Ring } = require('../ring.js'), sp = Ring.prototype.startPunch;
Ring.prototype.startPunch = function (F, type, info, i) { if (!info.feint) { (F.hookLog = F.hookLog || []).push({ r: this.round - 1, h: ['hook', 'rhook', 'uppercut', 'lupper', 'bodyHook'].includes(type) }); } return sp.call(this, F, type, info, i); };
console.log(`1. vs a man who slips everything (${n} fights each): my hook + uppercut share, rounds 1-2 / 4-6 / 8-10`);
for (const t of ['novice', 'intermediate', 'pro', 'world']) {
  const { by, w } = hookShare(t), sh = (a, b) => { let h = 0, x = 0; for (let i = a; i <= b; i++) { h += by[i].h; x += by[i].t; } return x ? pct(h / x) : '-'; };
  console.log(`  ${t.padEnd(13)} ${sh(0, 1)} -> ${sh(3, 5)} -> ${sh(7, 9)}   wins ${pct(w)}`);
}
console.log(`\n2. the same two men, ${n} fights (pro counter-puncher vs pro swarmer)`);
const a = BB.makeProfile({ style: 'counter', tier: 'pro', seed: 77 }), b = BB.makeProfile({ style: 'swarmer', tier: 'pro', seed: 78 });
const meth = {}, seqs = new Set(); let wa = 0, wb = 0;
for (let k = 0; k < n; k++) {
  const { res, r } = fight(a, b, 50000 + k);
  meth[res.method + (res.winner == null ? '' : res.winner ? ' swarmer' : ' counter')] = (meth[res.method + (res.winner == null ? '' : res.winner ? ' swarmer' : ' counter')] || 0) + 1;
  if (res.winner === 0) wa++; else if (res.winner === 1) wb++;
  seqs.add(r.f[0].brain.hist.join(',') + '|' + r.f[1].brain.hist.join(',') + '|' + r.f[0].T.pTimes.slice(0, 20).map(x => x.toFixed(1)).join(','));
}
console.log(`  counter wins ${pct(wa / n)}, swarmer ${pct(wb / n)}; distinct fights ${seqs.size}/${n}`);
console.log('  ' + Object.entries(meth).sort((x, y) => y[1] - x[1]).map(([k, v]) => k + ' ' + v).join(', '));
