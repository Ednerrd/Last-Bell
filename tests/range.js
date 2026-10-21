// where a style's fights happen and who wins there: one style vs each base style, identical stats + standard guard, sides swapped every other fight.
// Per range band (time share, landed per min and damage both ways), jabs (thrown/landed, landed on him while he jabs), misses short, ropes, clinches, counters, how he wins and loses.
//   TAG=x node tests/range.js 200 outboxer [slugger,swarmer,...]     appends to /tmp/range_TAG.txt
//   node tests/range.js agg x
// Bands by the punch reach (PUNCH min/max): in < 50 (hooks, uppercuts), mid 50-64 (hooks reach), long 64-80 (jab and cross only), out > 80.
const fs = require('fs');
const OUT = t => '/tmp/range_' + t + '.txt';
const BANDS = ['in', 'mid', 'long', 'out'], band = d => d < 50 ? 0 : d < 64 ? 1 : d < 80 ? 2 : 3;
const blank = () => ({ t: [0, 0, 0, 0], land: [0, 0, 0, 0], dmg: [0, 0, 0, 0], jabT: 0, jabL: 0, powT: 0, powL: 0, short: 0, miss: 0, rope: 0, clinch: 0, ctrL: 0, hitJab: 0, esc: 0, rd: 0 });
function agg(rows) {
  const by = {};
  for (const r of rows) {
    const k = r.a + ' vs ' + r.b, x = by[k] = by[k] || { w: 0, l: 0, d: 0, ko: 0, koA: 0, A: blank(), B: blank() };
    x.w += r.w; x.l += r.l; x.d += r.d; x.ko += r.ko; x.koA += r.koA;
    for (const s of ['A', 'B']) for (const f in r[s]) { if (Array.isArray(r[s][f])) r[s][f].forEach((v, i) => x[s][f][i] += v); else x[s][f] += r[s][f]; }
  }
  for (const k in by) {
    const x = by[k], n = x.w + x.l, A = x.A, B = x.B, tt = A.t.reduce((a, b) => a + b, 0), mins = tt / 60;
    console.log(`\n${k}: ${(100 * x.w / n).toFixed(1)}% (n ${n + x.d}, draws ${x.d}), his stops ${x.ko}, stopped ${x.koA}`);
    console.log('  band   time%  his land/min  his dmg/min | his land/min taken  dmg/min taken');
    BANDS.forEach((b, i) => { const m = A.t[i] / 60 || 1e-9; console.log('  ' + b.padEnd(5), (100 * A.t[i] / tt).toFixed(0).padStart(5), (A.land[i] / m).toFixed(2).padStart(12), (A.dmg[i] / m).toFixed(2).padStart(12), '|', (B.land[i] / m).toFixed(2).padStart(17), (B.dmg[i] / m).toFixed(2).padStart(14)); });
    const row = (s, o) => `jab ${(s.jabT / s.rd).toFixed(1)}/rd ${(100 * s.jabL / s.jabT).toFixed(0)}%, power ${(s.powT / s.rd).toFixed(1)}/rd ${(100 * s.powL / s.powT).toFixed(0)}%, short ${(100 * s.short / s.miss).toFixed(0)}% of misses, ropes ${(s.rope / s.rd).toFixed(1)} s/rd, escapes ${(s.esc / s.rd).toFixed(2)}/rd, clinches ${(s.clinch / s.rd).toFixed(2)}/rd, counters landed ${(s.ctrL / s.rd).toFixed(1)}/rd, hit while jabbing ${(s.hitJab / s.rd).toFixed(2)}/rd`;
    console.log('  him:  ' + row(A)); console.log('  opp:  ' + row(B));
  }
}
if (process.argv[2] === 'agg') { agg(fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse)); return; }

const S = require('./sim.js');
const N = +process.argv[2] || 200, ME = process.argv[3] || 'outboxer', RT = 82;
const opps = process.argv[4] ? process.argv[4].split(',') : Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
for (const opp of opps) {
  let w = 0, l = 0, dr = 0, ko = 0, koA = 0; const st = [blank(), blank()];
  for (let i = 0; i < N; i++) {
    const base = S.sheet(RT, 'boxerpuncher', 'standard');
    const mk = s => Object.assign({}, base, { style: s, guard: 'standard', stats: Object.assign({}, base.stats) });
    const sw = i % 2, f = new S.Fight(mk(sw ? opp : ME), mk(sw ? ME : opp), { rounds: 10 });
    const me = sw ? 1 : 0, who = side => side === me ? 0 : 1;
    let n = 0, wasCorner = false;
    while (f.phase !== 'over' && n < 600000) {
      f.step(); n++;
      if (f.phase === 'fight') {
        const d = Math.hypot(f.f[0].x - f.f[1].x, f.f[0].z - f.f[1].z), b = band(d), dt = 3 / 60; // DT x CLOCK: fight seconds
        st[0].t[b] += dt;
      }
      for (const e of f.events) {
        if (e.type === 'hit' && !e.blocked) {
          const A = f.f[e.a], D = f.f[e.d], b = band(Math.hypot(A.x - D.x, A.z - D.z)), x = st[who(e.a)];
          x.land[b]++; x.dmg[b] += e.dmg; if (e.counter || e.caught) x.ctrL++;
          if (D.act && D.act.type === 'jab') st[who(e.d)].hitJab++;
        } else if (e.type === 'miss') { const x = st[who(e.a)]; x.miss++; if (e.mt === 'short') x.short++; }
        else if (e.type === 'clinch') st[who(e.c)].clinch++;
        else if (e.type === 'escape') st[who(e.a)].esc++;
      }
      f.events = [];
      if (f.phase === 'corner' && !wasCorner) endRd(f, who, st, 1);
      wasCorner = f.phase === 'corner';
      if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1));
    }
    endRd(f, who, st, f.result.decision ? 1 : Math.max(.05, f.clock / 180));
    const r = f.result.winner, ws = r === 0 || r === 1 ? who(r) : -1;
    if (ws === 0) w++; else if (ws === 1) l++; else dr++;
    if (!f.result.decision) { if (ws === 0) ko++; else if (ws === 1) koA++; }
  }
  st[1].t = [0, 0, 0, 0];
  fs.appendFileSync(OUT(process.env.TAG || 'x'), JSON.stringify({ a: ME, b: opp, w, l, d: dr, ko, koA, A: st[0], B: st[1] }) + '\n');
  console.log(ME, 'vs', opp, (100 * w / Math.max(1, w + l)).toFixed(1) + '%', 'n' + N);
}
function endRd(f, who, st, fr) {
  for (const F of f.f) { const x = st[who(F.side)]; x.rd += fr; x.jabT += F.rs.thrown - F.rs.thrownPow; x.jabL += F.rs.landedJab; x.powT += F.rs.thrownPow; x.powL += F.rs.landedPow + F.rs.landedBody; x.rope += F.rs.trap; F.rs.thrown = F.rs.thrownPow = F.rs.landedJab = F.rs.landedPow = F.rs.landedBody = F.rs.trap = 0; }
}
