// The determinism hash: everything seeded goes in here.
// M0: RNG streams. From M1 on, headless fights get added.
import { makeRng } from '../src/core/rng.js';
import { hash } from './t.js';

export function determinism() {
  const out = [];
  for (const seed of [1, 42, 'last-bell', 987654321]) {
    const r = makeRng(seed);
    for (let i = 0; i < 2000; i++) out.push(Math.floor(r.next() * 1e9));
    for (let i = 0; i < 200; i++) out.push(Math.round(r.gauss(0, 1) * 1e6));
  }
  return hash(out);
}
