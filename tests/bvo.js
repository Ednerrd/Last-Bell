// brain vs old engine AI, head to head: node tests/bvo.js N [rating]. Same sheet both sides (style rolls), sides swapped every other fight
const S = require('./sim.js');
const N = +process.argv[2] || 200, RT = +process.argv[3] || 82, st = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), by = {};
let w = 0, l = 0, d = 0;
for (let i = 0; i < N; i++) {
  const y = st[i % 5], sh = S.sheet(RT, y, 'standard'), sw = i % 2, br = sw ? [0, 1] : [1, 0];
  const f = new S.Fight(sh, JSON.parse(JSON.stringify(sh)), { brain: br }); let n = 0;
  while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); }
  const win = f.result.winner, b = by[y] = by[y] || [0, 0];
  if (win == null) d++; else if (win === (sw ? 1 : 0)) { w++; b[0]++; } else { l++; b[1]++; }
}
console.log(`brain vs old AI: brain wins ${(100 * w / (w + l)).toFixed(1)}% (${w}-${l}, ${d} draws) | by style ` + Object.entries(by).map(([k, v]) => k + ' ' + (100 * v[0] / (v[0] + v[1])).toFixed(0)).join(' '));
