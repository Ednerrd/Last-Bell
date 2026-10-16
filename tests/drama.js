// drama metrics (docs/DRAMA.md section 6): what a fight feels like, round to round. 10-rounders, audit-style field (ratings 60-90, gaps 0/3/6/10).
//   TAG=x node tests/drama.js 250        appends to /tmp/drama_x.txt;  node tests/drama.js agg x [0]   (0 = only gap-0 fights)
// Per fight: lead changes on the cards (the 3-judge average after each scored round; ties don't count as a lead), the man behind at halfway wins,
// rounds the winner lost on the cards (decisions), rounds with a moment (knockdown, hurt, a fresh cut, the doctor, the stoppage), dead rounds.
// Dead round: no moment, both men together under DEAD.thr thrown and under DEAD.pow clean power shots landed.
const fs = require('fs'), OUT = t => '/tmp/drama_' + t + '.txt';
const DEAD = { thr: +(process.env.DTHR || 80), pow: +(process.env.DPOW || 8) };
if (process.argv[2] === 'agg') {
  const only = process.argv[4] != null ? +process.argv[4] : null;
  const L = fs.readFileSync(OUT(process.argv[3]), 'utf8').trim().split('\n').map(JSON.parse).flatMap(o => o.fights).filter(f => only == null || f.gap === only);
  report(L, only); return;
}
const S = require('./sim.js'), st = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const N = +process.argv[2] || 250, ROUNDS = 10, out = [];
for (let i = 0; i < N; i++) {
  const base = 60 + Math.random() * 30 | 0, gap = [0, 3, 6, 10][i % 4];
  const mk = r => { const s = st[Math.random() * 5 | 0]; return S.sheet(r, s, S.rollGuard(s), Math.random() * 30 | 0); };
  const f = new S.Fight(mk(base + gap / 2 | 0), mk(base - gap / 2 | 0), { rounds: ROUNDS });
  const mom = {}; let n = 0;
  while (f.phase !== 'over' && n < 600000) {
    f.step(); n++;
    const rd = f.round; // nextRound moves the round on: everything read below belongs to this one
    if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1)); // the doctor and the corner retirement happen here: read its events too
    for (const e of f.events) {
      const k = e.type === 'knockdown' ? 'kd' : e.type === 'stun' ? 'hurt' : e.type === 'cut' && e.fresh ? 'cut' : e.type === 'doctorLook' || e.type === 'doctor' || e.type === 'rtd' ? 'doc' : e.type === 'stoppage' ? 'stop' : null;
      if (k) (mom[rd] = mom[rd] || {})[k] = 1;
    }
    f.events = [];
  }
  if (!f.result.decision) (mom[f.result.round] = mom[f.result.round] || {}).stop = 1; // the stoppage round, however it ended
  const r = f.result, rds = f.roundLog.map(l => ({ thr: l.a.thrown + l.b.thrown, pow: l.a.landedPow + l.b.landedPow + l.a.landedBody + l.b.landedBody, d: l.cards.reduce((s, c) => s + c[0] - c[1], 0) / 3, cards: l.cards }));
  if (!r.decision) rds.push({ thr: f.f[0].rs.thrown + f.f[1].rs.thrown, pow: f.f[0].rs.landedPow + f.f[1].rs.landedPow + f.f[0].rs.landedBody + f.f[1].rs.landedBody, partial: 1 }); // the stoppage round
  let lead = 0, sgn = 0, ch = 0, chLate = 0, half = null; const H = ROUNDS / 2;
  rds.forEach((x, j) => { if (x.partial) return; lead += x.d; const s = Math.sign(Math.round(lead * 3)); if (s && sgn && s !== sgn) { ch++; if (j >= ROUNDS - 3) chLate++; } if (s) sgn = s; if (j + 1 === H) half = lead; });
  let lost = null; // rounds the winner lost, the judges' average (decisions)
  if (r.decision && r.winner >= 0) lost = rds.filter(x => !x.partial).reduce((s, x) => s + x.cards.filter(c => (r.winner === 0 ? c[1] > c[0] : c[0] > c[1])).length / 3, 0);
  out.push({ gap, dec: r.decision ? 1 : 0, rd: rds.length, ch, chLate, half: half == null ? null : Math.round(half * 3) / 3, win: r.winner, lost,
    mom: rds.map((x, j) => mom[j + 1] ? Object.keys(mom[j + 1]).join('') : ''), thr: rds.map(x => x.thr), pow: rds.map(x => x.pow) });
}
if (process.env.TAG) fs.appendFileSync(OUT(process.env.TAG), JSON.stringify({ fights: out }) + '\n');
report(out, null);

function report(L, only) {
  const p = (a, b) => (100 * a / Math.max(1, b)).toFixed(1) + '%', n = L.length;
  const rounds = L.reduce((s, f) => s + f.rd, 0);
  console.log(`drama: ${n} fights${only != null ? ' (gap ' + only + ')' : ''}, ${rounds} rounds | stoppages ${p(L.filter(f => !f.dec).length, n)}`);
  console.log(`lead changes on the cards: fights with one ${p(L.filter(f => f.ch).length, n)} (2+ ${p(L.filter(f => f.ch >= 2).length, n)}), per fight ${(L.reduce((s, f) => s + f.ch, 0) / n).toFixed(2)}, in the last 3 rounds ${p(L.filter(f => f.chLate).length, n)}`);
  const hb = L.filter(f => f.half != null && Math.abs(f.half) >= .34 && f.win >= 0), cb = hb.filter(f => (f.half > 0 ? 1 : 0) === f.win);
  const hbS = cb.filter(f => !f.dec);
  console.log(`comebacks: the man behind at halfway wins ${p(cb.length, hb.length)} of ${hb.length} (by stoppage ${p(hbS.length, cb.length)} of those)`);
  const D = L.filter(f => f.lost != null), b = k => D.filter(f => k(Math.round(f.lost))).length;
  console.log(`decisions (${D.length}), rounds the winner lost: 0 ${p(b(x => x === 0), D.length)} | 1 ${p(b(x => x === 1), D.length)} | 2 ${p(b(x => x === 2), D.length)} | 3+ ${p(b(x => x >= 3), D.length)} (close: 4+ ${p(b(x => x >= 4), D.length)})`);
  let mr = 0, dead = 0; const kinds = {};
  for (const f of L) f.mom.forEach((m, j) => { if (m) { mr++; for (const c of m.match(/kd|hurt|cut|doc|stop/g) || []) kinds[c] = (kinds[c] || 0) + 1; } else if (f.thr[j] < DEAD.thr && f.pow[j] < DEAD.pow) dead++; });
  console.log(`rounds with a moment ${p(mr, rounds)} (${(10 * mr / rounds).toFixed(1)} per 10 rounds; ${Object.entries(kinds).map(([k, v]) => k + ' ' + v).join(', ')}) | dead rounds ${p(dead, rounds)} (thrown < ${DEAD.thr} and power landed < ${DEAD.pow}, both men)`);
  const q = a => { a = a.slice().sort((x, y) => x - y); return [.1, .25, .5, .75, .9].map(z => a[Math.floor(z * (a.length - 1))]).join(' / '); };
  console.log(`per round, both men (10/25/50/75/90%): thrown ${q(L.flatMap(f => f.thr))} | power landed ${q(L.flatMap(f => f.pow))}`);
}
