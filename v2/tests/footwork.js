// Footwork report (not a test): node v2/tests/footwork.js [rounds]
// Per pairing: Blue's time near the ropes, circling (rad/min), mean distance, mean speed (m/s), Blue's mode shares.
import { makeFight } from '../src/engine/fight.js';
import { EDGE, dist } from '../src/engine/space.js';
import { STYLES } from '../src/fighter/make.js';

const N = Number(process.argv[2] || 10);
console.log('red      vs blue      ropesB  arc/min  dist  speed  blue modes');
for (const a of STYLES) for (const b of STYLES) {
  let t = 0, ropes = 0, arc = 0, dsum = 0, path = 0; const modes = {};
  for (let s = 0; s < N; s++) {
    const F = makeFight({ seed: `rep${s}${a}${b}`, red: { style: a }, blue: { style: b, stance: s % 2 ? 'southpaw' : 'orthodox' } });
    F.startRound();
    let last = null, px = F.men[1].x, pz = F.men[1].z;
    while (F.tick()) {
      const [r, bl] = F.men; t++;
      path += Math.hypot(bl.x - px, bl.z - pz); px = bl.x; pz = bl.z;
      if (Math.max(Math.abs(bl.x), Math.abs(bl.z)) > EDGE - 0.5) ropes++;
      const ang = Math.atan2(bl.z - r.z, bl.x - r.x);
      if (last !== null) arc += Math.abs(Math.atan2(Math.sin(ang - last), Math.cos(ang - last)));
      last = ang; dsum += dist(r, bl);
      modes[bl.mode] = (modes[bl.mode] || 0) + 1;
    }
  }
  const min = t / 3600;
  const ms = Object.entries(modes).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${(100 * v / t).toFixed(0)}`).join(' ');
  console.log(`${a.padEnd(8)} vs ${b.padEnd(8)}  ${(100 * ropes / t).toFixed(0).padStart(4)}%  ${(arc / min).toFixed(1).padStart(6)}  ${(dsum / t).toFixed(2)}  ${(path / (min * 60)).toFixed(2).padStart(5)}     ${ms}`);
}
