// Is he human? node brain/tests/human.js [fights]
// 1. Adaptation: a man who always throws the 1-2. A smart opponent should start calling the right hand: defend it more, counter it more, round by round. A novice stays flat.
// 2. Variety: the same two men, many fights. No two fights the same; outcomes spread.
const { BB, N, fight, line, pct, f1 } = require('./lib.js');
const { Ring } = require('../ring.js');
const n = N(2, 120);
function habit(tier, on) {
  const by = Array.from({ length: 10 }, () => ({ seen: 0, ok: 0, ctr: 0 })); let w = 0;
  for (let k = 0; k < n; k++) {
    const hab = BB.makeProfile({ style: 'boxerpuncher', tier: 'pro', seed: 1e6 + k }), me = BB.makeProfile({ style: 'boxerpuncher', tier, seed: 2e6 + k });
    const r = new Ring(me, hab, { seed: 31000 + k }), H = r.f[1].brain;
    if (on) { H.pickCombo = () => ({ ps: ['jab', 'cross'], why: 'habit', id: '1-2' }); H.startSetup = () => null; H.feint = () => null; }
    // log every right hand: did my man get out of the way, and did he counter?
    const rs = r.resolve;
    r.resolve = function (A, D) { const a = A.act; const ok0 = D.T.defOk, c0 = D.T.ctrLanded; rs.call(this, A, D); if (A.side === 1 && a.type === 'cross') { const b = by[this.round - 1]; b.seen++; if (D.T.defOk > ok0) b.ok++; } };
    const ctrBy = []; const rc = r.ev; r.ev = function (A, D, type, x) { if (type === 'landed' && A.side === 0 && x.counter) by[this.round - 1].ctr++; return rc.call(this, A, D, type, x); };
    const res = r.run(); if (res.winner === 0) w++;
  }
  return { by, w: w / n };
}
console.log(`1. vs a man who always throws the 1-2 (${n} fights each): right hands defended, counters landed per fight-round; rounds 1-2 / 4-6 / 8-10`);
for (const t of ['novice', 'intermediate', 'pro', 'world']) for (const on of [0, 1]) {
  const { by, w } = habit(t, on), sh = (a, b) => { let o = 0, x = 0; for (let i = a; i <= b; i++) { o += by[i].ok; x += by[i].seen; } return x ? pct(o / x) : '-'; };
  const cr = (a, b) => { let c = 0; for (let i = a; i <= b; i++) c += by[i].ctr; return f1(c / n / (b - a + 1)); };
  console.log(`  ${(on ? t : '  (no habit)').padEnd(13)} right hands defended ${sh(0, 1)} -> ${sh(3, 5)} -> ${sh(7, 9)}   counters ${cr(0, 1)} -> ${cr(3, 5)}   beats him ${pct(w)}`);
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
