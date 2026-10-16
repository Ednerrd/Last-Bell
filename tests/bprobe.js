// brain fingerprint: node tests/bprobe.js N [rating]
// per fighter per round: thrown, how punches end (landed / blocked / evaded by defense / range / wild), active defenses, counters, feints, clinches, distance, time on the ropes
const S = require('./sim.js');
const N = +process.argv[2] || 100, RT = +process.argv[3] || 82, st = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const c = { rd: 0, thrown: 0, landed: 0, blocked: 0, ev: 0, evAct: 0, range: 0, wild: 0, ctr: 0, feint: 0, clinch: 0, esc: 0, dist: 0, dn: 0, kd: 0, stop: 0 };
for (let i = 0; i < N; i++) {
  const y1 = st[i % 5], y2 = st[(i * 3 + 1) % 5];
  const f = new S.Fight(S.sheet(RT, y1, S.rollGuard(y1)), S.sheet(RT, y2, S.rollGuard(y2)), {});
  let n = 0;
  while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'fight' && f.clinchT <= 0) { c.dist += Math.hypot(f.f[0].x - f.f[1].x, f.f[0].z - f.f[1].z); c.dn++; } if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); }
  c.rd += f.round * 2; if (f.result && /KO|TKO|RTD/.test(f.result.method || '')) c.stop++;
  for (const e of f.events) {
    if (e.type === 'throw') c.thrown++;
    else if (e.type === 'hit') { if (e.blocked) c.blocked++; else c.landed++; }
    else if (e.type === 'miss') { if (e.why === 'range') c.range++; else if (e.why === 'wild') c.wild++; else { c.ev++; if (e.def) c.evAct++; } }
    else if (e.type === 'counterTry') c.ctr++; else if (e.type === 'feint') c.feint++; else if (e.type === 'clinch') c.clinch++; else if (e.type === 'escape') c.esc++; else if (e.type === 'knockdown') c.kd++;
  }
}
const r = x => (x / c.rd).toFixed(1), pc = x => (100 * x / c.thrown).toFixed(1) + '%';
console.log(`per man/rd: thrown ${r(c.thrown)} landed ${r(c.landed)} (${pc(c.landed)}) blocked ${pc(c.blocked)} evaded ${pc(c.ev)} (active ${pc(c.evAct)}) range ${pc(c.range)} wild ${pc(c.wild)}`);
console.log(`counters ${r(c.ctr)} feints ${r(c.feint)} clinches ${(c.clinch / c.rd * 2).toFixed(2)}/rd escapes ${r(c.esc)} | dist ${(c.dist / c.dn).toFixed(1)} | KD/fight ${(c.kd / N).toFixed(2)} stops ${(100 * c.stop / N).toFixed(1)}%`);
