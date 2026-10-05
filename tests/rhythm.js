// rhythm: how the punching is spread through a round (bursts, resets, feel-outs). Sim seconds; the clock runs 3x.
// node tests/rhythm.js 200
const S = require('./sim.js'); const N = +process.argv[2] || 200; const st = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const GAP = .7, WIN = 10, OPEN = 5;
let thrown = 0, fr = 0, ex = [], gaps = [], wins = [], open1 = [0, 0], openN = [0, 0], rest = [0, 0], perSt = {};
const q = (a, p) => { const b = a.slice().sort((x, y) => x - y); return b[Math.min(b.length - 1, b.length * p | 0)]; };
const mean = a => a.reduce((s, x) => s + x, 0) / Math.max(1, a.length), sd = a => { const m = mean(a); return Math.sqrt(mean(a.map(x => (x - m) ** 2))); };
for (let i = 0; i < N; i++) {
  const mk = () => { const y = st[Math.random() * st.length | 0]; return S.sheet(70 + Math.random() * 20 | 0, y, S.rollGuard(y), Math.random() * 30 | 0); };
  const f = S.run(mk(), mk(), { rounds: [8, 10, 12][i % 3] });
  // round start/end times in sim seconds
  const R0 = {}, R1 = {};
  for (const e of f.events) { if (e.type !== 'throw') continue; R0[e.round] = Math.min(R0[e.round] ?? 1e9, e.t - e.clock / 3); R1[e.round] = e.t; }
  for (const r in R0) {
    const t0 = R0[r], ths = f.events.filter(e => e.type === 'throw' && e.round == r), full = ths.length && ths[ths.length - 1].clock > 170;
    thrown += ths.length; fr += 2 * (ths.length ? Math.min(1, ths[ths.length - 1].clock / 180) : 0);
    // exchanges
    let cur = null;
    for (const e of ths) {
      if (cur && e.t - cur.end < GAP) { cur.n++; cur.end = e.t; cur.who.add(e.a); }
      else { if (cur) { ex.push(cur); gaps.push(e.t - cur.end); } cur = { st: e.t, end: e.t, n: 1, who: new Set([e.a]) }; }
    }
    if (cur) ex.push(cur);
    if (!full) continue;
    for (let w = 0; w + WIN <= 60; w += WIN) for (const a of [0, 1]) wins.push(ths.filter(e => e.a === a && e.t - t0 >= w && e.t - t0 < w + WIN).length);
    const o = ths.filter(e => e.t - t0 < OPEN).length, rs = ths.filter(e => e.t - t0 >= OPEN).length;
    if (r == 1) { open1[0] += o; open1[1]++; } else { openN[0] += o; openN[1]++; }
    rest[0] += rs; rest[1]++;
  }
}
const rate = rest[0] / rest[1] / (60 - OPEN) * OPEN; // throws a 5 s slice gets at the in-round rate
console.log(`fights ${N}  thrown/fighter/round ${(thrown / fr).toFixed(1)}`);
console.log(`exchanges: ${(mean(ex.map(e => e.n))).toFixed(2)} punches, ${mean(ex.map(e => e.end - e.st)).toFixed(2)} s, two-way ${(100 * mean(ex.map(e => e.who.size > 1 ? 1 : 0))).toFixed(0)}%`);
console.log(`gaps (s): mean ${mean(gaps).toFixed(2)} p25 ${q(gaps, .25).toFixed(2)} med ${q(gaps, .5).toFixed(2)} p90 ${q(gaps, .9).toFixed(2)}  >2s ${(100 * mean(gaps.map(g => g > 2 ? 1 : 0))).toFixed(1)}%  >3s ${(100 * mean(gaps.map(g => g > 3 ? 1 : 0))).toFixed(1)}%  CV ${(sd(gaps) / mean(gaps)).toFixed(2)}`);
console.log(`10s windows per fighter: mean ${mean(wins).toFixed(1)} CV ${(sd(wins) / mean(wins)).toFixed(2)}  zero-windows ${(100 * mean(wins.map(w => w <= 2 ? 1 : 0))).toFixed(1)}% (<=2)`);
console.log(`opening ${OPEN}s vs in-round rate: round 1 ${(open1[0] / open1[1] / rate * 100).toFixed(0)}%  later rounds ${(openN[0] / openN[1] / rate * 100).toFixed(0)}%`);
