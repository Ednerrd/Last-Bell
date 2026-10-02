// style round robin: every pair of styles, identical stats + standard guard, sides swapped every other fight.
// Prints each style's win % vs the field, how he fights (punches/rd, power %, distance, gas, counters, time on the ropes) and the matchup grid.
//   TAG=x node tests/styles.js 300 82            all pairs (or pass a pair list: outboxer-counter,slugger-swarmer)
//   node tests/styles.js agg x                   pool every run with that TAG
//   TAG=x node tests/styles.js 200 82 vs:volume,angle   special style(s) vs each of the five base styles
// BIAS=1: each fighter gets his style's stat lean (like the AI roster). GRD=roll: each rolls his style's usual guard.
const fs = require('fs');
const OUT = t => '/tmp/styles_' + t + '.txt';
function report(rows) {
  const st = {}, mx = {};
  for (const r of rows) {
    for (const [s, o] of [[r.a, r.fa], [r.b, r.fb]]) { const x = st[s] = st[s] || { w: 0, l: 0, rd: 0, thr: 0, pow: 0, land: 0, d: 0, dn: 0, gas: 0, ctr: 0, trap: 0, stop: 0 }; for (const k in o) x[k] += o[k]; }
    st[r.a].w += r.w; st[r.a].l += r.l; st[r.b].w += r.l; st[r.b].l += r.w;
    const key = r.a + '|' + r.b, m = mx[key] = mx[key] || { w: 0, l: 0 }; m.w += r.w; m.l += r.l;
  }
  const names = Object.keys(st).sort((a, b) => st[b].w / (st[b].w + st[b].l) - st[a].w / (st[a].w + st[a].l));
  console.log('style          win%   n     thr/rd pow%  land/rd dist gas  ctr/rd rope/rd stops');
  for (const s of names) {
    const x = st[s], n = x.w + x.l, p = x.w / n;
    console.log(s.padEnd(14), (100 * p).toFixed(1).padStart(5), ('±' + (100 * Math.sqrt(p * (1 - p) / n)).toFixed(1)).padEnd(5), String(n).padEnd(5),
      (x.thr / x.rd).toFixed(0).padStart(6), (100 * x.pow / x.thr).toFixed(0).padStart(4), (x.land / x.rd).toFixed(1).padStart(8), (x.d / x.dn).toFixed(0).padStart(4),
      ((100 * x.gas / x.dn).toFixed(0) + '%').padStart(4), (x.ctr / x.rd).toFixed(1).padStart(7), (x.trap / x.rd).toFixed(1).padStart(7), String(x.stop).padStart(6));
  }
  console.log('\nrow vs column (row win %)');
  console.log(''.padEnd(14) + names.map(s => s.slice(0, 7).padStart(8)).join(''));
  for (const a of names) console.log(a.padEnd(14) + names.map(b => {
    if (a === b) return '-'.padStart(8);
    const m = mx[a + '|' + b], r = mx[b + '|' + a]; let w = 0, l = 0; if (m) { w += m.w; l += m.l; } if (r) { w += r.l; l += r.w; }
    return (w + l ? (100 * w / (w + l)).toFixed(0) : '?').padStart(8);
  }).join(''));
}
if (process.argv[2] === 'agg') { report(fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse)); return; }

const S = require('./sim.js');
const N = +process.argv[2] || 300, RT = +process.argv[3] || 82, styles = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
let pairs = [];
if (process.argv[4] && process.argv[4].startsWith('vs:')) { for (const sp of process.argv[4].slice(3).split(',')) for (const b of styles) pairs.push([sp, b]); } // special style(s) vs every base style
else if (process.argv[4]) pairs = process.argv[4].split(',').map(p => p.split('-'));
else for (let i = 0; i < styles.length; i++) for (let j = i + 1; j < styles.length; j++) pairs.push([styles[i], styles[j]]);
const blank = () => ({ rd: 0, thr: 0, pow: 0, land: 0, d: 0, dn: 0, gas: 0, ctr: 0, trap: 0, stop: 0 });
for (const [a, b] of pairs) {
  let w = 0, l = 0, dr = 0; const fp = [blank(), blank()];   // fp[0] = style a, fp[1] = style b
  for (let i = 0; i < N; i++) {
    const base = S.sheet(RT, 'boxerpuncher', 'standard');
    const mk = s => {
      const sh = process.env.BIAS ? S.sheet(RT, s, 'standard') : Object.assign({}, base, { style: s, stats: Object.assign({}, base.stats) });
      sh.style = s; sh.guard = process.env.GRD === 'roll' ? S.rollGuard(s) : 'standard'; return sh;
    };
    const sw = i % 2, f = new S.Fight(mk(sw ? b : a), mk(sw ? a : b), { rounds: 10 });
    const who = side => (side === 0) === !sw ? 0 : 1; // fight side -> style index (0 = a)
    let n = 0;
    const endRd = fr => { for (const F of f.f) { const x = fp[who(F.side)]; x.rd += fr; x.thr += F.rs.thrown; x.pow += F.rs.thrownPow; x.land += F.rs.landedJab + F.rs.landedPow + F.rs.landedBody; x.trap += F.rs.trap; } };
    while (f.phase !== 'over' && n < 600000) {
      const was = f.phase; f.step(); n++;
      if (f.phase === 'fight' && n % 10 === 0) for (const F of f.f) { const x = fp[who(F.side)]; x.d += Math.hypot(F.x - F.op.x, F.z - F.op.z); x.dn++; x.gas += F.stam / F.stamMax; }
      for (const e of f.events) if (e.type === 'counterTry') fp[who(e.a)].ctr++;
      f.events = [];
      if (was !== 'corner' && f.phase === 'corner') endRd(1);
      if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1));
    }
    endRd(f.result.decision ? 1 : Math.max(.05, f.clock / 180)); // a stoppage counts as part of a round
    const r = f.result.winner; let ws = r === 0 || r === 1 ? who(r) : -1;
    if (ws === 0) w++; else if (ws === 1) l++; else dr++;
    if (ws >= 0 && !f.result.decision) fp[ws].stop++;
  }
  const row = { a, b, RT, w, l, d: dr, n: N, fa: fp[0], fb: fp[1], bias: !!process.env.BIAS, grd: process.env.GRD || '' };
  fs.appendFileSync(OUT(process.env.TAG || 'x'), JSON.stringify(row) + '\n');
  console.log(a, 'vs', b, (100 * w / Math.max(1, w + l)).toFixed(1) + '%', 'n' + N, 'draws', dr);
}
