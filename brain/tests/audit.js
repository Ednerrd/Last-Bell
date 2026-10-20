// CompuBox-style audit of the dummy ring: node brain/tests/audit.js [fights] [tier]
const { BB, N, fight, line, pct, f1 } = require('./lib.js');
const n = N(2, 300), tier = process.argv[3] || 'pro', styles = Object.keys(BB.STYLES);
let th = 0, la = 0, mins = 0, stops = 0, kds = 0, ctr = 0, r1 = 0, rMid = 0, n1 = 0, nMid = 0, gaps = 0, gapN = 0, jab = 0, body = 0, cl = 0, meth = {};
let bursts = [];
for (let i = 0; i < n; i++) {
  const a = BB.makeProfile({ style: styles[i % 5], tier, seed: i * 7 + 1 }), b = BB.makeProfile({ style: styles[(i * 3 + 1) % 5], tier, seed: i * 7 + 2 });
  const { res, r } = fight(a, b, 1000 + i);
  meth[res.method] = (meth[res.method] || 0) + 1;
  if (res.method === 'KO' || res.method === 'TKO') stops++;
  for (const F of r.f) {
    const L = line(F, r); th += L.th; la += L.la; mins += L.mins; kds += L.kd; ctr += L.ctr; jab += L.jab; body += L.body; cl += L.clinch;
    if (L.perRound.length >= 4) { r1 += L.perRound[0]; n1++; rMid += (L.perRound[2] + L.perRound[3]) / 2; nMid++; }
    const pt = L.pTimes; for (let j = 1; j < pt.length; j++) { const g = pt[j] - pt[j - 1]; if (g < 20) { gapN++; if (g > 4) gaps++; } }
    // burstiness: CV of punches per 30 s
    const bins = {}; for (const t of pt) bins[Math.floor(t / 30)] = (bins[Math.floor(t / 30)] || 0) + 1; const v = Object.values(bins); if (v.length > 4) { const m = v.reduce((s, x) => s + x, 0) / v.length, sd = Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / v.length); bursts.push(sd / m); }
  }
}
const perRd = x => f1(x / mins * 3);
console.log(`audit ${n} fights, tier ${tier}`);
console.log(`thrown/rd ${perRd(th)}  landed/rd ${perRd(la)}  connect ${pct(la / th)}  jab share ${pct(jab / th)}  body share ${pct(body / th)}`);
console.log(`stoppages ${pct(stops / n)}  KDs/fight ${f1(kds / n)}  counters landed/rd ${perRd(ctr)}  clinches/rd ${perRd(cl)}`);
console.log(`round 1 vs rounds 3-4 output ${(r1 / n1 / (rMid / nMid)).toFixed(2)}  gaps >4s ${pct(gaps / gapN)}  burstiness CV ${(bursts.reduce((s, x) => s + x, 0) / bursts.length).toFixed(2)}`);
console.log('methods', JSON.stringify(meth));
