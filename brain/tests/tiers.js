// Tier ladder: same body (all stats 70), random styles, tier vs tier. node brain/tests/tiers.js [fights per pair]
// node brain/tests/tiers.js 150 adj: only neighbouring tiers (faster)
// Target (Ed, Oct 7): one level down wins ~15-20%. Also shows how each tier's brain behaves.
const { BB, N, fight, line, pct, f1 } = require('./lib.js');
const n = N(2, 200), T = BB.TIERS.map(t => t.key), styles = Object.keys(BB.STYLES);
const agg = {}; for (const t of T) agg[t] = { th: 0, la: 0, mins: 0, react: 0, rn: 0, seen: 0, late: 0, mis: 0, bites: 0, fin: 0, feints: 0, setups: 0, ctr: 0, tech: 0, techN: 0, holds: 0, dec: 0, defTry: 0, defOk: 0 };
const add = (t, F, r) => { const L = line(F, r), A = agg[t], tl = L.tel; A.th += L.th; A.la += L.la; A.mins += L.mins; A.react += tl.reactSum; A.rn += tl.reactN; A.seen += tl.seen; A.late += tl.late; A.mis += tl.misreads; A.bites += L.bites; A.feints += L.feints; A.setups += tl.setups; A.ctr += L.ctr; A.tech += tl.techSum; A.techN += tl.techN; A.holds += tl.holds; A.dec += tl.decisions; A.defTry += L.defTry; A.defOk += L.defOk; };
console.log(`tier ladder, ${n} fights per pair, identical stats`);
const adj = process.argv[3] === 'adj'; // adj: only neighbours (faster)
for (let i = 0; i < T.length; i++) for (let j = i; j < T.length; j++) {
  if (adj && j !== i + 1) continue;
  let w = 0, l = 0, ko = 0;
  for (let k = 0; k < n; k++) {
    const s1 = styles[k % 5], s2 = styles[Math.floor(k / 5) % 5], swap = k % 2;
    const a = BB.makeProfile({ style: s1, tier: T[i], seed: 50000 + k * 13 + i * 7 }), b = BB.makeProfile({ style: s2, tier: T[j], seed: 90000 + k * 13 + j * 7 });
    const { res, r } = swap ? fight(b, a, 7000 + k) : fight(a, b, 7000 + k);
    const hi = swap ? 0 : 1; // the higher (or equal) tier's side
    if (res.winner === hi) w++; else if (res.winner === 1 - hi) l++;
    if (res.method === 'KO' || res.method === 'TKO') ko++;
    add(T[i], r.f[1 - hi], r); add(T[j], r.f[hi], r);
  }
  if (i !== j) console.log(`${T[j].padEnd(12)} vs ${T[i].padEnd(12)} wins ${pct(w / n).padStart(6)}  loses ${pct(l / n).padStart(6)}  stoppages ${pct(ko / n)}`);
}
console.log('\nhow each tier fights (all fights pooled)');
console.log('tier          thrown/rd landed/rd connect react(s) late   misread bites/feint  setups/rd ctr/rd  tech  holds  def ok');
for (const t of T) { const A = agg[t], r = A.mins / 3;
  console.log(`${t.padEnd(13)} ${f1(A.th / r).padStart(9)} ${f1(A.la / r).padStart(9)} ${pct(A.la / A.th).padStart(7)} ${(A.react / A.rn).toFixed(3).padStart(8)} ${pct(A.late / A.seen).padStart(6)} ${pct(A.mis / A.seen).padStart(7)} ${f1(A.bites / r).padStart(11)} ${f1(A.setups / r).padStart(9)} ${f1(A.ctr / r).padStart(6)} ${(A.tech / A.techN).toFixed(2).padStart(5)} ${pct(A.holds / A.dec).padStart(6)} ${pct(A.defOk / Math.max(1, A.defTry)).padStart(7)}`); }
