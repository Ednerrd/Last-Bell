// Size s1: mirror matches with a forced reach gap. Both men the same sheet (style cycles the 5 base styles, sides swap every fight),
// the long man gets reach + gap/2, the short man reach - gap/2 (around the division's mean, so rs = 1 +- per x gap/2). Same height.
//   TAG=x node tests/size.js 300 [gaps 0,4,8,12] [rating 80] [div 4]   (run x4, one process a core)
//   node tests/size.js agg x                                          pool every run with that TAG
//   PAIR=outboxer:swarmer   not a mirror: the long man is the first style, the short man the second (own sheets, same rating; s3)
// Prints by gap: the long man's win %, stops, KDs and landed a fight both ways, connect %, jab share of his landed. Since s1 rs reads only
// the gap (not the division), a division changes nothing here but the noise: run one.
const fs = require('fs');
const OUT = t => '/tmp/size_' + t + '.txt';
const pr = (x, d = 1) => (+x).toFixed(d);
function report(rows) {
  const G = {};
  for (const r of rows) { const g = G[r.gap] = G[r.gap] || {}; for (const k in r) if (k !== 'gap') g[k] = (g[k] || 0) + r[k]; }
  console.log('gap  fights  long win%  (dec)  stops%  KD long/short  landed long/short  connect long/short  jab share long/short');
  for (const gap of Object.keys(G).map(Number).sort((a, b) => a - b)) {
    const g = G[gap], n = g.n, dec = g.w + g.l;
    console.log(`${String(gap).padEnd(4)} ${String(n).padEnd(7)} ${pr(100 * g.w / Math.max(1, dec)).padEnd(10)} (${pr(100 * g.dw / Math.max(1, g.dw + g.dl))})`.padEnd(37) +
      `${pr(100 * g.stop / n).padEnd(7)} ${pr(g.kdL / n, 2)} / ${pr(g.kdS / n, 2)}`.padEnd(23) + `${pr(g.ldL / n)} / ${pr(g.ldS / n)}`.padEnd(19) +
      `${pr(100 * g.ldL / g.thL)} / ${pr(100 * g.ldS / g.thS)}`.padEnd(20) + `${pr(100 * g.jL / g.ldL)} / ${pr(100 * g.jS / g.ldS)}`);
  }
}
if (process.argv[2] === 'agg') { report(fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse)); return; }
const S = require('./sim.js');
const N = +process.argv[2] || 100, GAPS = (process.argv[3] || '0,4,8,12').split(',').map(Number), RT = +process.argv[4] || 80, DIV = process.argv[5] != null ? +process.argv[5] : 4;
const styles = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const MEAN = [[64.5, 65.5], [65.5, 67.5], [66.5, 68.5], [67.5, 69], [69.5, 71.5], [71.5, 73.5], [72.5, 74.5], [74, 76], [75.8, 79]][DIV];
const PAIR = process.env.PAIR ? process.env.PAIR.split(':') : null;
const tot = (F, w) => F.tot[w].jab + F.tot[w].power + F.tot[w].body;
for (const gap of GAPS) {
  const row = { gap, n: 0, w: 0, l: 0, dw: 0, dl: 0, stop: 0, kdL: 0, kdS: 0, ldL: 0, ldS: 0, thL: 0, thS: 0, jL: 0, jS: 0 };
  for (let i = 0; i < N; i++) {
    const st = PAIR ? PAIR[0] : styles[i % 5], g = S.rollGuard(st);
    const L = Object.assign(S.sheet(RT, st, g), { name: 'm' + i, div: DIV, ht: MEAN[0], reach: MEAN[1] + gap / 2 });
    const Sh = PAIR ? Object.assign(S.sheet(RT, PAIR[1], S.rollGuard(PAIR[1])), { name: 's' + i, div: DIV, ht: MEAN[0], reach: MEAN[1] - gap / 2 })
      : Object.assign({}, L, { stats: Object.assign({}, L.stats), reach: MEAN[1] - gap / 2 });
    const side = i % 2, f = side ? S.run(Sh, L, { rounds: 10 }) : S.run(L, Sh, { rounds: 10 });
    const FL = f.f[side], FS = f.f[1 - side], win = f.result.winner;
    row.n++; if (win === side) { row.w++; if (f.result.decision) row.dw++; } else if (win != null) { row.l++; if (f.result.decision) row.dl++; }
    if (!f.result.decision) row.stop++;
    row.kdL += FL.kd; row.kdS += FS.kd; row.ldL += tot(FL, 'landed'); row.ldS += tot(FS, 'landed'); row.thL += tot(FL, 'thrown'); row.thS += tot(FS, 'thrown');
    row.jL += FL.tot.landed.jab; row.jS += FS.tot.landed.jab;
  }
  fs.appendFileSync(OUT(process.env.TAG || 'x'), JSON.stringify(row) + '\n');
}
