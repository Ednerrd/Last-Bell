// movement probe: how they move around each other (circling, the line between them turning, re-facing, resets, cutting, ropes).
//   node tests/move.js N [styles] [rating]     N fights of each style vs each base style (identical stats, standard guard, sides swapped every other fight)
//   TAG=x ... appends one JSON line per style to /tmp/move_TAG.txt; node tests/move.js agg x prints the table
// Columns, per style (as the man measured):
//   ang     mean |angle| of the line between them off the camera axis (deg); >25 share of time past 25 deg
//   rot     how fast the line turns (deg/s, mean |d angle/dt|, smoothed over .25 s)
//   lat     his speed across the line (u/s, not punching), rad his speed along it (+ in / - out)
//   lag     how far his facing trails the line to the other man (deg, mean; only once facing exists in the engine)
//   off     share of time he's off his line (offK > 0: past TURN.lo)
//   turn    share of time he's turning to re-face (facing turning > 30 deg/s)
//   rs1/rs2 a reset (brain mode -> reset): ground gained straight back in the first .45 s / across the line .45-1.2 s
//   trap    s/rd trapped (ropes or corner, d < 92), cut share of time the other man is cutting him off, ctr his mean distance from center
const fs = require('fs');
const OUT = t => '/tmp/move_' + t + '.txt';
const COLS = ['ang', '>25', 'rot', 'lat', 'rad', 'lag', 'off', 'turn', 'rs1', 'rs2', 'trap', 'cut', 'ctr'];
function show(rows) {
  const by = {};
  for (const r of rows) { const x = by[r.s] = by[r.s] || { n: 0 }; for (const c in r.v) x[c] = (x[c] || 0) + r.v[c]; x.n++; }
  console.log('style'.padEnd(14) + COLS.map(c => c.padStart(7)).join(''));
  for (const s in by) { const x = by[s]; console.log(s.padEnd(14) + COLS.map(c => (x[c] / x.n).toFixed(c === '>25' || c === 'off' || c === 'turn' || c === 'cut' ? 2 : 1).padStart(7)).join('')); }
}
if (process.argv[2] === 'agg') { show(fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse)); return; }
const S = require('./sim.js');
const N = +process.argv[2] || 20, RT = +process.argv[4] || 82;
const bases = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const mine = process.argv[3] ? process.argv[3].split(',') : bases;
const D = Math.PI / 180, wrap = a => Math.atan2(Math.sin(a), Math.cos(a));
const res = [];
for (const ST of mine) {
  const T = { fr: 0, ang: 0, a25: 0, rot: 0, lat: 0, rad: 0, mvF: 0, lag: 0, off: 0, lagF: 0, turn: 0, rs1: 0, rs2: 0, rsN: 0, trap: 0, rd: 0, cut: 0, ctr: 0 };
  for (const b of bases) for (let i = 0; i < N; i++) {
    const base = S.sheet(RT, 'boxerpuncher', 'standard');
    const mk = s => Object.assign({}, base, { style: s, guard: 'standard', stats: Object.assign({}, base.stats) });
    const sw = i % 2, f = new S.Fight(mk(sw ? b : ST), mk(sw ? ST : b), { rounds: 10 }), me = sw ? 1 : 0;
    let n = 0, a0 = null, rotS = 0, mode0 = null, rs = null, y0 = null;
    while (f.phase !== 'over' && n < 600000) {
      const was = f.phase; f.step(); n++;
      const F = f.f[me], O = F.op;
      if (f.phase === 'fight' && f.clinchT <= 0 && F.state !== 'down' && O.state !== 'down') {
        const dx = O.x - F.x, dz = O.z - F.z, d = Math.hypot(dx, dz), ux = dx / d, uz = dz / d;
        const a = Math.atan2(dz, Math.abs(dx)); // off the camera axis, either side
        T.fr++; T.ang += Math.abs(a) / D; if (Math.abs(a) > 25 * D) T.a25++;
        if (a0 != null) rotS += (Math.abs(a - a0) / S.DT / D - rotS) * (1 - Math.exp(-S.DT / .25)); a0 = a; T.rot += rotS;
        if (F.state !== 'punch') { T.lat += Math.abs(F.vx * -uz + F.vz * ux); T.rad += F.vx * ux + F.vz * uz; T.mvF++; }
        if (F.yaw != null) { const ln = Math.atan2(dz, dx); T.lag += Math.abs(wrap(F.yaw - ln)) / D; T.lagF++; if ((F.offK || 0) > 0) T.off++; if (y0 != null && Math.abs(wrap(F.yaw - y0)) / S.DT > 30 * D) T.turn++; y0 = F.yaw; }
        const md = F.brain && F.brain.mode;
        if (md === 'reset' && mode0 !== 'reset' && !rs) rs = { t: f.t, x: F.x, z: F.z, ux, uz };
        if (rs) {
          const e = f.t - rs.t;
          if (Math.abs(e - .45) < S.DT / 2) { rs.x1 = F.x; rs.z1 = F.z; }
          if (e >= 1.2) { if (rs.x1 != null) { T.rs1 += -((rs.x1 - rs.x) * rs.ux + (rs.z1 - rs.z) * rs.uz); T.rs2 += Math.abs((F.x - rs.x1) * -rs.uz + (F.z - rs.z1) * rs.ux); T.rsN++; } rs = null; }
        }
        mode0 = md;
        if (O.cutting) T.cut++;
        T.ctr += Math.hypot(F.x, F.z);
      } else { a0 = null; y0 = null; }
      f.events = [];
      if (was !== 'corner' && f.phase === 'corner') { T.rd++; T.trap += F.rs.trap; }
      if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1));
    }
    if (f.result && !f.result.decision) { T.rd += f.clock / 180; T.trap += f.f[me].rs.trap; }
  }
  const v = { ang: T.ang / T.fr, '>25': T.a25 / T.fr, rot: T.rot / T.fr, lat: T.lat / T.mvF, rad: T.rad / T.mvF, lag: T.lagF ? T.lag / T.lagF : 0, off: T.lagF ? T.off / T.lagF : 0, turn: T.lagF ? T.turn / T.lagF : 0, rs1: T.rsN ? T.rs1 / T.rsN : 0, rs2: T.rsN ? T.rs2 / T.rsN : 0, trap: T.trap / T.rd, cut: T.cut / T.fr, ctr: T.ctr / T.fr };
  res.push({ s: ST, v });
  if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify({ s: ST, v }) + '\n');
}
show(res);
