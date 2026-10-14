// ropes probe: how a style ends up on the ropes and how he gets off (brain on: PATCH="AI.brain=1").
//   node tests/ropes.js N [style] [rating]   style (default outboxer) vs each base style, N fights per pair, identical stats, standard guard
// Prints per round: seconds trapped (same clock as styles.js rope/rd), spells, how spells end (pivot, slide, he walked off, the other man left),
// what the trapped time looks like (hurt, the other man cutting him off, his brain mode, his feet: how much he circles vs pushes for range),
// and how he got there (backing straight up vs circling into them).
const S = require('./sim.js');
const N = +process.argv[2] || 40, ST = process.argv[3] || 'outboxer', RT = +process.argv[4] || 82;
const bases = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special && k !== ST);
const T = { rd: 0, trap: 0, spells: 0, end: {}, hurt: 0, cut: 0, mode: {}, lat: 0, out: 0, dWant: 0, frames: 0, entry: { back: 0, side: 0 }, len: [] };
for (const b of bases) for (let i = 0; i < N; i++) {
  const base = S.sheet(RT, 'boxerpuncher', 'standard');
  const mk = s => Object.assign({}, base, { style: s, guard: 'standard', stats: Object.assign({}, base.stats) });
  const sw = i % 2, f = new S.Fight(mk(sw ? b : ST), mk(sw ? ST : b), { rounds: 10 }), me = sw ? 1 : 0;
  let spell = null, n = 0, hist = [];
  while (f.phase !== 'over' && n < 600000) {
    const was = f.phase; f.step(); n++;
    const F = f.f[me], O = F.op;
    if (f.phase === 'fight') {
      const d = Math.hypot(F.x - O.x, F.z - O.z), tr = F.state !== 'down' && d < 92 && f.trapped(F);
      const ux = (F.x - O.x) / d, uz = (F.z - O.z) / d; // away from him
      hist.push(F.vx * ux + F.vz * uz); if (hist.length > 30) hist.shift();
      if (tr) {
        T.frames++;
        if (F.state === 'stun' || F.head < F.headMax * .3) T.hurt++;
        if (O.cutting) T.cut++;
        const md = F.brain ? F.brain.mode + (F.brain.mode === 'survive' ? ':' + F.brain.hurtResp : '') : 'old'; T.mode[md] = (T.mode[md] || 0) + 1;
        T.lat += F.circ || 0; if (F.want > d) T.out++; T.dWant += F.want - d;
        if (!spell) { spell = { t: f.t }; T.spells++; const back = hist.reduce((a, v) => a + v, 0) / hist.length; if (back > 15) T.entry.back++; else T.entry.side++; }
      } else if (spell) {
        const e = spell.how || (F.slideT > 0 ? 'slide' : d >= 92 ? 'apart' : 'walked');
        T.end[e] = (T.end[e] || 0) + 1; T.len.push(f.t - spell.t); spell = null;
      }
      for (const e of f.events) if (spell && e.a === me && (e.type === 'escape')) spell.how = 'pivot';
    }
    f.events = [];
    if (was !== 'corner' && f.phase === 'corner') { T.rd++; T.trap += F.rs.trap; }
    if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1));
  }
  if (f.result && !f.result.decision) { T.rd += f.clock / 180; T.trap += f.f[me].rs.trap; }
}
const pc = (a, b) => (100 * a / Math.max(1, b)).toFixed(0) + '%';
T.len.sort((a, b) => a - b);
console.log(`${ST} vs ${bases.join(',')} x${N}: trapped ${(T.trap / T.rd).toFixed(1)} s/rd, spells ${(T.spells / T.rd).toFixed(2)}/rd, spell median ${(T.len[T.len.length >> 1] || 0).toFixed(1)} s, p90 ${(T.len[Math.floor(T.len.length * .9)] || 0).toFixed(1)} s`);
console.log('spell ends:', Object.entries(T.end).map(([k, v]) => k + ' ' + pc(v, T.spells)).join(', '), '| got there: backing straight up', pc(T.entry.back, T.spells), 'circling/pushed', pc(T.entry.side, T.spells));
console.log('trapped time: hurt', pc(T.hurt, T.frames), '| he cuts him off', pc(T.cut, T.frames), '| circling', (T.lat / T.frames).toFixed(2), '| still wants more range', pc(T.out, T.frames), `(by ${(T.dWant / T.frames).toFixed(0)})`);
console.log('mode on the ropes:', Object.entries(T.mode).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ' ' + pc(v, T.frames)).join(', '));
