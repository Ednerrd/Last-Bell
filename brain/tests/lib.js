// shared sim helpers for the brain tests. Run from the repo root: node brain/tests/<name>.js
const BB = require('../brain.js'), { Ring, RS } = require('../ring.js');
if (process.env.BRP) Object.assign(BB.BR, Function("return (" + process.env.BRP + ")")());   // BRP='{"throwP":.06}' overrides a brain knob
if (process.env.RSP) Object.assign(RS, Function("return (" + process.env.RSP + ")")());      // RSP='{"dmg":.5}' overrides a ring knob
const N = (i, d) => +(process.argv[i] || d);
function fight(pa, pb, seed, opts) { const r = new Ring(pa, pb, Object.assign({ seed }, opts || {})); const res = r.run(); return { res, r }; }
// per-fighter numbers from a finished ring
function line(F, ring) {
  const T = F.T, rds = T.perRound.length || 1, th = T.thrown.jab + T.thrown.power + T.thrown.body, la = T.landed.jab + T.landed.power + T.landed.body;
  const mins = (ring.round - 1) * 3 + (ring.over && ring.over.time != null && ring.over.method !== 'UD' && ring.over.method !== 'SD' && ring.over.method !== 'MD' && ring.over.method !== 'D' ? ring.over.time / 60 : 3);
  return { th, la, rds, mins, jab: T.thrown.jab, pow: T.thrown.power, body: T.thrown.body, ctr: T.ctrLanded, feints: T.feints, clinch: T.clinches, dist: T.dist / T.distN, kd: T.kd, perRound: T.perRound, pTimes: T.pTimes, tel: F.brain.tel, defTry: T.defTry, defOk: T.defOk, bites: T.bites };
}
const pct = x => (x * 100).toFixed(1) + '%';
const f1 = x => x.toFixed(1);
module.exports = { BB, Ring, RS, N, fight, line, pct, f1 };
