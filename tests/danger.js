// the hurt man's danger (BR.hb danger, ROADMAP 1): a Pro hunter against a hurt Novice / Intermediate / Pro / World man.
// Same body (rating SKR 78), levels from sheet.sk only. Counts the Pro's hunts against him and how they end:
// stung = the hunter walked onto a clean power counter, caught = the hunter got hurt or dropped going for the finish.
//   TAG=x node tests/danger.js 250 [on|off] [N,I,P,W]     (off = PATCH BR.hb.on.danger=0; appends to /tmp/danger_x.txt)
//   node tests/danger.js agg x
const fs = require('fs'), OUT = t => '/tmp/danger_' + t + '.txt';
const p = (a, b) => (100 * a / Math.max(1, b)).toFixed(1) + '%', se = (a, b) => (100 * Math.sqrt(Math.max(1e-9, a / b * (1 - a / b)) / Math.max(1, b))).toFixed(1);
if (process.argv[2] === 'agg') {
  const A = {};
  for (const l of fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n')) { const o = JSON.parse(l), k = o.x + ' ' + o.cond, a = A[k] = A[k] || {}; for (const q in o) if (typeof o[q] === 'number') a[q] = (a[q] || 0) + o[q]; }
  console.log('hurt man  danger  fights  hunts/f  stung/hunt     caught/hunt    hurt man wins  stops');
  for (const k of Object.keys(A).sort()) { const a = A[k], [x, c] = k.split(' ');
    console.log(x.padEnd(10) + c.padEnd(8) + String(a.n).padStart(6) + (a.hunts / a.n).toFixed(2).padStart(9) + ('  ' + p(a.stung, a.hunts) + ' ±' + se(a.stung, a.hunts)).padEnd(15) + ('  ' + p(a.caught, a.hunts) + ' ±' + se(a.caught, a.hunts)).padEnd(15) + ('  ' + p(a.xWin, a.n)).padEnd(15) + p(a.stops, a.n)); }
  return;
}
const N = +process.argv[2] || 250, COND = process.argv[3] || 'on', XS = (process.argv[4] || 'N,I,P,W').split(',');
process.env.PATCH = (process.env.PATCH || '') + ';globalThis.__BB=BoxerBrain;globalThis.__SKM=skMake;' + (COND === 'off' ? 'BoxerBrain.BR.hb.on.danger=0;' : '');
const S = require('./sim.js'), BB = globalThis.__BB, ALL = Object.keys(S.STYLES), pick = a => a[Math.floor(Math.random() * a.length)];
const SKR = +(process.env.SKR || 78), CT = {}; BB.TIERS.forEach((t, i) => { CT['NIPW'[i]] = t.center; });
for (const X of XS) {
  const o = { x: X, cond: COND, n: 0, hunts: 0, stung: 0, caught: 0, xWin: 0, stops: 0 };
  for (let i = 0; i < N; i++) {
    const sh = ['P', X].map(t => { const st = pick(ALL), s = S.sheet(Math.round(SKR + Math.random() * 4 - 2), st, S.rollGuard(st)); s.sk = globalThis.__SKM(CT[t], st); return s; });
    const side = i % 2, f = new S.Fight(side ? sh[1] : sh[0], side ? sh[0] : sh[1], { rounds: 10 });
    const H = f.f[side], T = f.f[1 - side]; // H = the Pro hunter, T = the man he hunts
    let n = 0; while (f.phase !== 'over' && n < 600000) { f.step(); n++; if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); f.events = []; }
    const t = H.brain.tel; o.n++; o.hunts += t.hunts || 0; o.stung += t.stung || 0; o.caught += t.caught || 0;
    if (f.result.winner === T.side) o.xWin++; if (!f.result.decision) o.stops++;
  }
  if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify(o) + '\n');
  console.log(X, COND, 'hunts/f', (o.hunts / o.n).toFixed(2), 'stung', p(o.stung, o.hunts), 'caught', p(o.caught, o.hunts), 'hurt man wins', p(o.xWin, o.n));
}
