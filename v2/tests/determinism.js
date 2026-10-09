// The determinism hash: everything seeded goes in here.
// RNG streams, plus headless rounds (positions, facing and modes, sampled every 6 ticks).
import { makeRng } from '../src/core/rng.js';
import { makeFight } from '../src/engine/fight.js';
import { hash } from './t.js';

export function determinism() {
  const out = [];
  for (const seed of [1, 42, 'last-bell', 987654321]) {
    const r = makeRng(seed);
    for (let i = 0; i < 2000; i++) out.push(Math.floor(r.next() * 1e9));
    for (let i = 0; i < 200; i++) out.push(Math.round(r.gauss(0, 1) * 1e6));
  }
  for (const [a, b] of [['pressure', 'outboxer'], ['boxer', 'boxer']]) {
    const F = makeFight({ seed: 'hash-' + a + b, red: { style: a }, blue: { style: b, stance: 'southpaw' } });
    for (let rd = 0; rd < 2; rd++) {
      F.startRound();
      while (F.tick()) if (F.ticks % 6 === 0) for (const m of F.men) out.push(Math.round(m.x * 1e4), Math.round(m.z * 1e4), Math.round(m.th * 1e4), m.mode);
    }
  }
  return hash(out);
}
