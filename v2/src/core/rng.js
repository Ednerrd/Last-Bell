// Seeded PRNG (sfc32). Same seed, same sequence, in Node and in the browser.
// Every random call in the engine goes through one of these, never Math.random.

function hashSeed(seed) {
  // String or number -> four 32-bit words (splitmix-style mixing).
  let h = 1779033703 ^ String(seed).length;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  const out = [];
  for (let i = 0; i < 4; i++) {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    out.push((h ^= h >>> 16) >>> 0);
  }
  return out;
}

export function makeRng(seed = 1) {
  let [a, b, c, d] = hashSeed(seed);
  let spare = null;

  // Float in [0, 1).
  function next() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  }
  for (let i = 0; i < 12; i++) next(); // warm up

  return {
    next,
    // Float in [lo, hi).
    range: (lo, hi) => lo + (hi - lo) * next(),
    // Integer in [lo, hi] inclusive.
    int: (lo, hi) => lo + Math.floor((hi - lo + 1) * next()),
    pick: (arr) => arr[Math.floor(arr.length * next())],
    chance: (p) => next() < p,
    // Normal distribution (Box-Muller, caches the spare).
    gauss(mean = 0, sd = 1) {
      if (spare !== null) { const z = spare; spare = null; return mean + sd * z; }
      let u = 0, v = 0;
      while (u === 0) u = next();
      v = next();
      const r = Math.sqrt(-2 * Math.log(u)), th = 2 * Math.PI * v;
      spare = r * Math.sin(th);
      return mean + sd * r * Math.cos(th);
    },
    // Snapshot / restore, for replays that resume mid-fight.
    state: () => [a, b, c, d, spare],
    setState(s) { [a, b, c, d, spare] = s; },
  };
}
