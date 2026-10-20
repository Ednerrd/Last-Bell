// Watch one fight as a play-by-play of what each brain was thinking. node brain/tests/watch.js [styleA] [tierA] [styleB] [tierB] [seed]
const { BB, Ring } = require('./lib.js');
const [sa = 'counter', ta = 'world', sb = 'swarmer', tb = 'pro', seed = 1] = process.argv.slice(2);
const A = BB.makeProfile({ style: sa, tier: ta, seed: +seed * 2 + 1, name: 'Red' }), B = BB.makeProfile({ style: sb, tier: tb, seed: +seed * 2 + 2, name: 'Blue' });
const r = new Ring(A, B, { seed: +seed, debug: true }), res = r.run();
const tag = F => `${F.prof.name} (${F.prof.tier.label} ${F.prof.styleLabel})`;
console.log(`${tag(r.f[0])} vs ${tag(r.f[1])}`);
// the interesting lines only: mode changes, setups, counters, reads, misreads, bites, hurt responses, round notes
const keep = /->|setup|counter after|read the feint|it was a|bit on|round \d|hurt/;
const lines = [];
for (const F of r.f) for (const l of F.brain.log) if (keep.test(l)) lines.push([+l.split(' ')[0], F.prof.name + ': ' + l.slice(l.indexOf(' ') + 1)]);
lines.sort((x, y) => x[0] - y[0]);
const per = {}; for (const [t, s] of lines) { const rd = Math.min(r.o.rounds, Math.floor(t / r.o.roundLen) + 1); (per[rd] = per[rd] || []).push(`  ${String(Math.floor(t % r.o.roundLen)).padStart(3)}s ${s}`); }
const max = +(process.env.LINES || 8);
for (const rd in per) { console.log(`Round ${rd}`); const L = per[rd]; const pickL = L.length <= max ? L : L.filter((_, i) => i % Math.ceil(L.length / max) === 0); console.log(pickL.join('\n')); }
for (const F of r.f) { const T = F.T, th = T.thrown.jab + T.thrown.power + T.thrown.body, la = T.landed.jab + T.landed.power + T.landed.body; console.log(`${F.prof.name}: ${la}/${th} landed (${Math.round(la / th * 100)}%), ${T.ctrLanded} counters, ${T.kd} KDs`); }
console.log(`Result: ${res.winner == null ? 'draw' : r.f[res.winner].prof.name} by ${res.method}${res.why ? ' (' + res.why + ')' : ''} in round ${res.round}` + (res.cards ? ', cards ' + res.cards.map(c => c.join('-')).join(' ') : ''));
