import { test, ok, eq } from './t.js';
import { makeRng } from '../src/core/rng.js';

test('rng: same seed, same sequence', () => {
  const a = makeRng(7), b = makeRng(7);
  for (let i = 0; i < 1000; i++) eq(a.next(), b.next());
});

test('rng: different seeds differ', () => {
  const a = makeRng(7), b = makeRng(8);
  let same = 0;
  for (let i = 0; i < 100; i++) if (a.next() === b.next()) same++;
  ok(same < 3, 'seeds 7 and 8 overlap');
});

test('rng: string seeds work', () => {
  eq(makeRng('abc').next(), makeRng('abc').next());
});

test('rng: next in [0,1), mean ~0.5', () => {
  const r = makeRng(1); let s = 0;
  for (let i = 0; i < 100000; i++) { const v = r.next(); ok(v >= 0 && v < 1); s += v; }
  ok(Math.abs(s / 100000 - 0.5) < 0.005, 'mean ' + s / 100000);
});

test('rng: range, int, pick, chance', () => {
  const r = makeRng(3);
  const seen = new Set();
  let hits = 0;
  for (let i = 0; i < 20000; i++) {
    const x = r.range(2, 5); ok(x >= 2 && x < 5);
    const n = r.int(1, 6); ok(Number.isInteger(n) && n >= 1 && n <= 6); seen.add(n);
    ok(['a', 'b'].includes(r.pick(['a', 'b'])));
    if (r.chance(0.3)) hits++;
  }
  eq(seen.size, 6, 'int covers 1..6');
  ok(Math.abs(hits / 20000 - 0.3) < 0.015, 'chance ' + hits / 20000);
});

test('rng: gauss mean 0 sd 1', () => {
  const r = makeRng(5); let s = 0, s2 = 0; const n = 50000;
  for (let i = 0; i < n; i++) { const g = r.gauss(); s += g; s2 += g * g; }
  const m = s / n, sd = Math.sqrt(s2 / n - m * m);
  ok(Math.abs(m) < 0.02, 'mean ' + m);
  ok(Math.abs(sd - 1) < 0.02, 'sd ' + sd);
});

test('rng: state snapshot resumes the same stream', () => {
  const r = makeRng(9);
  for (let i = 0; i < 50; i++) r.gauss();
  const s = r.state(), x = [r.next(), r.gauss()];
  r.setState(s);
  eq([r.next(), r.gauss()], x);
});
