// the referees side by side: each ref works N fights (audit-style field, 10-rounders), per fight: clinches, warnings, points docked, stoppages.
//   node tests/refs.js 150        (every ref in REFS, the same seeds per ref so only the ref changes; ONLY=3 runs one ref, no header)
const S = require('./sim.js'), st = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const N = +process.argv[2] || 150, nRefs = S.REFS.length;
const pct = (a, b) => (100 * a / Math.max(1, b)).toFixed(1) + '%', tot = { n: 0, cl: 0, warn: 0, ded: 0, stop: 0, hold: 0 };
if (process.env.ONLY == null) console.log('ref'.padEnd(22) + 'clinch/f  warn/f  hold-warn/f  pts off/f  fights w/ a point off  stops');
for (let k = 0; k < nRefs; k++) {
  if (process.env.ONLY != null && k !== +process.env.ONLY) continue;
  const o = { n: 0, cl: 0, warn: 0, ded: 0, dedF: 0, stop: 0, hold: 0 }; let name = '';
  for (let i = 0; i < N; i++) {
    const base = 60 + (i * 37 % 30), gap = [0, 3, 6, 10][i % 4];
    const mk = (r, j) => { const s = st[(i * 7 + j * 3) % 5]; return S.sheet(r, s, S.rollGuard(s), (i * 11 + j) % 30); };
    const f = new S.Fight(mk(base + gap / 2 | 0, 0), mk(base - gap / 2 | 0, 1), { rounds: 10, ref: k }); name = f.ref.name;
    let n = 0, ded = 0;
    while (f.phase !== 'over' && n < 600000) {
      f.step(); n++;
      if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1));
      for (const e of f.events) { if (e.type === 'clinch') o.cl++; if (e.type === 'foul') { o.warn++; if (e.why === 'hold') o.hold++; if (e.ded) { o.ded++; ded++; } } }
      f.events = [];
    }
    o.n++; if (ded) o.dedF++; if (!f.result.decision) o.stop++;
  }
  for (const x in tot) tot[x] += o[x];
  console.log(name.padEnd(22) + (o.cl / o.n).toFixed(1).padStart(8) + (o.warn / o.n).toFixed(2).padStart(8) + (o.hold / o.n).toFixed(2).padStart(13) + (o.ded / o.n).toFixed(2).padStart(11) + pct(o.dedF, o.n).padStart(23) + pct(o.stop, o.n).padStart(7));
}
if (process.env.ONLY == null) console.log('all'.padEnd(22) + (tot.cl / tot.n).toFixed(1).padStart(8) + (tot.warn / tot.n).toFixed(2).padStart(8) + (tot.hold / tot.n).toFixed(2).padStart(13) + (tot.ded / tot.n).toFixed(2).padStart(11) + ''.padStart(23) + pct(tot.stop, tot.n).padStart(7));
