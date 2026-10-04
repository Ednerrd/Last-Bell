// determinism check: seeded fights, prints a hash of every result. Recording-only engine changes must print the same hash before and after.
// node tests/same.js 200
let s = 12345; Math.random = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
const S = require('./sim.js'); const N = +process.argv[2] || 200; const st = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
let h = 0; const mix = v => { h = (Math.imul(h ^ (v * 1000 | 0), 2654435761) >>> 0); };
for (let i = 0; i < N; i++) {
  const mk = r => { const y = st[Math.random() * 5 | 0]; return S.sheet(r, y, S.rollGuard(y), Math.random() * 30 | 0); };
  const f = S.run(mk(70 + i % 15), mk(70 + i % 11), { rounds: [8, 10, 12][i % 3] });
  const r = f.result; mix(r.winner == null ? 9 : r.winner); mix(r.round); mix(f.t);
  for (const F of f.f) { mix(F.tot.landed.jab); mix(F.tot.landed.power); mix(F.tot.thrown.body); mix(F.head); }
}
console.log('fights', N, 'hash', h.toString(16));
