// Records one seeded fight from the real engine into JSON for the Unity viewer (plan A: Unity is a skin, JS is the truth).
//   node tools/unity/record.js [seed] [out.json] [rounds] [styleA] [styleB] [rating]
// Read-only: it only watches f.f[0..1] and f.events after each f.step(), so the engine and the same.js hash don't change.
// Format: docs in HANDOFF_ANTIGRAVITY.md ("The recording").
const fs = require('fs');
const seed = +(process.argv[2] || 7), out = process.argv[3] || 'tools/unity/fight.json', rounds = +(process.argv[4] || 4);
let s = seed >>> 0; Math.random = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
const S = require('../../tests/sim.js');
const base = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special), pick = () => base[Math.random() * base.length | 0];
const rt = +(process.argv[7] || 80), sa = process.argv[5] || pick(), sb = process.argv[6] || pick();
const A = S.sheet(rt, sa, S.rollGuard(sa)), B = S.sheet(rt, sb, S.rollGuard(sb)); A.name = 'Red'; B.name = 'Blue';
const f = new S.Fight(A, B, { rounds });
const EVERY = 2, KEEP = new Set(['throw', 'hit', 'miss', 'knockdown', 'count', 'up', 'rising', 'clinch', 'break', 'bell', 'corner', 'cut', 'swell', 'stun', 'stoppage', 'end', 'doctor', 'rtd', 'foul']);
const STATES = ['idle', 'move', 'punch', 'clinch', 'stun', 'slump', 'down'], PT = Object.keys(S.PUNCH);
const r2 = v => Math.round((v || 0) * 100) / 100;
const frames = [], events = []; let n = 0, phase0 = null;
// v = one fighter from f.snap(), the same view the 2D renderer draws from
const fr = (v, F) => [r2(v.x), r2(v.z), r2(F.yaw), STATES.indexOf(v.state), v.aT ? PT.indexOf(v.aT) : -1, r2(v.aP), v.feint ? 1 : 0, r2(v.hitT), v.hitZone || '', r2(v.hitPow), r2(v.downP), v.rise ? 1 : 0, v.sit, r2(v.tired), v.def || '', r2(v.defP), r2(v.dmg), r2(v.cut), r2(v.swL), r2(v.swR), v.hurt ? 1 : 0];
while (f.phase !== 'over' && n < 600000) {
  f.step(); n++;
  for (const e of f.events) if (KEEP.has(e.type)) { const o = {}; for (const k in e) if (typeof e[k] !== 'object') o[k] = e[k]; o.i = frames.length; events.push(o); }
  f.events = [];
  if (n % EVERY === 0 && f.phase !== 'corner') { const sn = f.snap(); frames.push([r2(f.t), f.round, f.phase === 'fight' ? 1 : 0, f.clinchT > 0 ? 1 : 0, fr(sn.f[0], f.f[0]), fr(sn.f[1], f.f[1])]); }
  if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1));
}
const who = (sh, F) => ({ name: sh.name, style: sh.style, guard: sh.guard, stance: sh.stance, reach: F.size && F.size.reach || null });
const rec = {
  v: 1, seed, dt: S.DT * EVERY, ring: { x: 146, z: 115 },
  fighters: [who(A, f.f[0]), who(B, f.f[1])],
  punches: PT.map(k => ({ id: k, name: S.PUNCH[k].name, dur: S.PUNCH[k].dur, kind: S.PUNCH[k].kind, zone: S.PUNCH[k].zone, arm: S.PUNCH[k].arm })),
  states: STATES, frameKeys: ['t', 'round', 'live', 'clinch', 'red', 'blue'], fighterKeys: ['x', 'z', 'yaw', 'state', 'punch', 'punchP', 'feint', 'hitT', 'hitZone', 'hitPow', 'downP', 'rise', 'sit', 'tired', 'def', 'defP', 'dmg', 'cut', 'swL', 'swR', 'hurt'],
  result: f.result, frames, events
};
fs.writeFileSync(out, JSON.stringify(rec));
console.log(out, (fs.statSync(out).size / 1e6).toFixed(2) + ' MB', frames.length, 'frames', events.length, 'events', sa, 'vs', sb, JSON.stringify(f.result).slice(0, 160));
