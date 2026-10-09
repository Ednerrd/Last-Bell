import { test, ok } from './t.js';
import { makeFight } from '../src/engine/fight.js';
import { MIN_D, EDGE, dist } from '../src/engine/space.js';
import { STYLES } from '../src/fighter/make.js';

// Every style pairing, both stances, a few seeds: 3-minute rounds tick by tick.
test('footwork: no overlap ever, always inside the ropes, facing each other', () => {
  let ticks = 0, off = 0, minD = 9;
  for (const a of STYLES) for (const b of STYLES) for (const st of ['orthodox', 'southpaw']) for (let s = 0; s < 2; s++) {
    const F = makeFight({ seed: `${a}-${b}-${st}-${s}`, red: { style: a }, blue: { style: b, stance: st } });
    F.startRound();
    while (F.tick()) {
      ticks++;
      const [r, bl] = F.men, d = dist(r, bl);
      minD = Math.min(minD, d);
      ok(d >= MIN_D - 1e-9, `overlap ${d.toFixed(3)} at ${F.clock.toFixed(2)}s ${a} vs ${b}`);
      for (const m of F.men) ok(Math.abs(m.x) <= EDGE + 1e-9 && Math.abs(m.z) <= EDGE + 1e-9, 'outside the ropes');
      for (const m of F.men) {
        const want = Math.atan2(F.men[1 - m.corner].z - m.z, F.men[1 - m.corner].x - m.x);
        if (Math.abs(Math.atan2(Math.sin(want - m.th), Math.cos(want - m.th))) > 0.6) off++;
      }
    }
  }
  ok(off / (ticks * 2) < 0.02, `not facing ${(100 * off / ticks / 2).toFixed(1)}% of ticks`);
  ok(minD >= MIN_D - 1e-9, 'min distance ' + minD);
});

// The behaviors M1 has to show: circling, cutting off, backing up.
function sample(red, blue, n = 8) {
  const out = { nearRopesB: 0, arc: 0, backs: 0, ticks: 0, modes: {} };
  for (let s = 0; s < n; s++) {
    const F = makeFight({ seed: 'beh' + s + red.style + blue.style, red, blue });
    F.startRound();
    let last = null;
    while (F.tick()) {
      const [r, b] = F.men;
      out.ticks++;
      if (Math.max(Math.abs(b.x), Math.abs(b.z)) > EDGE - 0.5) out.nearRopesB++;
      const ang = Math.atan2(b.z - r.z, b.x - r.x);
      if (last !== null) out.arc += Math.abs(Math.atan2(Math.sin(ang - last), Math.cos(ang - last)));
      last = ang;
      out.modes[b.mode] = (out.modes[b.mode] || 0) + 1;
    }
  }
  out.ropes = out.nearRopesB / out.ticks;
  out.arcPerMin = out.arc / (out.ticks / 3600);
  return out;
}

test('footwork: a pressure man cuts off the ring (outboxer ends up on the ropes more)', () => {
  const vsPress = sample({ style: 'pressure' }, { style: 'outboxer' });
  const vsOut = sample({ style: 'outboxer' }, { style: 'outboxer' });
  ok(vsPress.ropes > vsOut.ropes * 1.3, `ropes vs pressure ${vsPress.ropes.toFixed(2)}, vs outboxer ${vsOut.ropes.toFixed(2)}`);
});

test('footwork: outboxers circle and back up', () => {
  const s = sample({ style: 'boxer' }, { style: 'outboxer' });
  ok(s.arcPerMin > 3, 'circling ' + s.arcPerMin.toFixed(1) + ' rad/min');
  ok((s.modes.back || 0) + (s.modes.escape || 0) > 0, 'never backed up or escaped');
  ok((s.modes.circle || 0) / s.ticks > 0.15, 'circle share ' + ((s.modes.circle || 0) / s.ticks).toFixed(2));
});
