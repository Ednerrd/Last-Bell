// rhythm meter: how the action is spread over a round (bursts vs resets, feel-outs), not just how much.
//   node tests/rhythm.js 200        (LB=file.html to measure another copy)
// Exchange = throws (either man) less than .7 s apart. Times are sim seconds (a round is 60; the clock runs 3x).
process.env.PATCH = (process.env.PATCH || '') + ';{const e0=Fight.prototype.emit;Fight.prototype.emit=function(t,d){if(t==="throw"&&this.phase==="fight")(this._thr=this._thr||[]).push([this.t,d.a,this.clock]);return e0.call(this,t,d)}}';
const S = require('./sim.js'); const N = +process.argv[2] || 200; const st = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const gaps = [], exN = [], q10 = [], longest = [], early = [0, 0], late = [0, 0], r1 = [0, 0]; let thr = 0, rds = 0, two = 0, exc = 0;
for (let i = 0; i < N; i++) {
  const mk = () => { const y = st[Math.random() * 5 | 0]; return S.sheet(70 + Math.random() * 20 | 0, y, S.rollGuard(y), 10); };
  const f = new S.Fight(mk(), mk(), { rounds: 6 }); let n = 0, rd = 1, buf = [];
  const flush = () => {
    if (buf.length < 2) { buf = []; return; } rds++; thr += buf.length;
    let ex = [[buf[0]]];
    for (let j = 1; j < buf.length; j++) { if (buf[j][0] - buf[j - 1][0] < .7) ex[ex.length - 1].push(buf[j]); else ex.push([buf[j]]); }
    for (let j = 1; j < ex.length; j++) gaps.push(ex[j][0][0] - ex[j - 1][ex[j - 1].length - 1][0]);
    let lg = 0; for (let j = 1; j < ex.length; j++) lg = Math.max(lg, ex[j][0][0] - ex[j - 1][ex[j - 1].length - 1][0]); longest.push(lg);
    for (const e of ex) { exN.push(e.length); exc++; if (new Set(e.map(x => x[1])).size > 1) two++; }
    // punches per 10-clock-second... use 5 sim-s windows
    const t0 = buf[0][0] - buf[0][2] / 3, w = new Array(12).fill(0); for (const b of buf) { const k = Math.min(11, (b[2] / 15) | 0); w[k]++; }
    const m = w.reduce((a, b) => a + b) / 12, sd = Math.sqrt(w.reduce((a, b) => a + (b - m) ** 2, 0) / 12); q10.push(sd / m);
    if (rd === 1) { r1[0] += w[0] + w[1]; r1[1] += w.slice(2).reduce((a, b) => a + b) / 5; } rd++;
    early[0] += w[0] + w[1]; early[1] += 2; late[0] += w.slice(2).reduce((a, b) => a + b); late[1] += 10;
    buf = [];
  };
  while (f.phase !== 'over' && n < 400000) { f.step(); n++;
    if (f._thr && f._thr.length) { buf.push(...f._thr); f._thr = []; }
    if (f.phase === 'corner') { flush(); f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); } }
  flush();
}
gaps.sort((a, b) => a - b); const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
const gm = mean(gaps), gsd = Math.sqrt(mean(gaps.map(g => (g - gm) ** 2))), pc = p => gaps[Math.floor(gaps.length * p)].toFixed(2);
console.log(`thrown/fighter/rd ${(thr / rds / 2).toFixed(1)} | exchanges/rd ${(exc / rds).toFixed(1)}, ${mean(exN).toFixed(1)} punches each, ${(100 * two / exc).toFixed(0)}% two-way`);
console.log(`gap s: mean ${gm.toFixed(2)} median ${pc(.5)} p10 ${pc(.1)} p90 ${pc(.9)} CV ${(gsd / gm).toFixed(2)} | >2s ${(100 * gaps.filter(g => g > 2).length / gaps.length).toFixed(1)}% >3s ${(100 * gaps.filter(g => g > 3).length / gaps.length).toFixed(1)}%`);
console.log(`longest quiet per round ${mean(longest).toFixed(1)}s | 5s-window output CV ${mean(q10).toFixed(2)} | first 10s of a round vs the rest ${(early[0] / early[1] / (late[0] / late[1])).toFixed(2)}x, of round 1 ${(r1[0] / r1[1]).toFixed(2)}x`);
