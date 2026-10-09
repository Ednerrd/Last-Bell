// CompuBox-style audit (not a test): node v2/tests/audit.js [rounds per pairing]
// Per man per round: thrown / landed / connect, jabs vs power, how punches fail, how clean they land,
// where straights land (extension), defense used. Targets: ~53 thrown / ~15 landed / ~29%,
// jabs ~20-25% connect, power ~35%, straights land ~95% extended.
import { makeFight } from '../src/engine/fight.js';
import { makeBus } from '../src/core/events.js';
import { STYLES, GUARDS } from '../src/fighter/make.js';
import { PUNCH } from '../src/engine/punch.js';

const N = Number(process.argv[2] || 20);
const pct = (a, b) => (b ? (100 * a / b).toFixed(1) : '-') + '%';
const blank = () => ({ men: 0, thrown: 0, land: 0, jabT: 0, jabL: 0, powT: 0, powL: 0, bodyT: 0, bodyL: 0 });
const all = blank(), byStyle = {}, how = {}, q = {}, defs = {}, defOk = {}, ext = [], extFam = { hook: [], upper: [] };
let rounds = 0;

for (const a of STYLES) for (const b of STYLES) for (let s = 0; s < N; s++) {
  const bus = makeBus(), pick = (i) => GUARDS[(s * 7 + i * 3) % GUARDS.length];
  const F = makeFight({
    seed: `audit${s}${a}${b}`, bus,
    red: { style: a, guard: pick(0) }, blue: { style: b, guard: pick(1), stance: s % 3 === 0 ? 'southpaw' : 'orthodox' },
  });
  const rows = [blank(), blank()];
  const lastDef = [null, null];
  bus.on('punch', (e) => {
    const r = rows[e.corner], P = PUNCH[e.kind];
    r.thrown++; if (e.kind === 'jab' || e.kind === 'bjab') r.jabT++; else r.powT++;
    if (P.tgt === 'body') r.bodyT++;
  });
  bus.on('defend', (e) => { defs[e.kind] = (defs[e.kind] || 0) + 1; });
  bus.on('contact', (e) => {
    const r = rows[e.corner], P = PUNCH[e.kind], jab = e.kind === 'jab' || e.kind === 'bjab';
    const key = e.result + (e.how ? ' ' + e.how : '');
    how[key] = (how[key] || 0) + 1;
    if (e.how && ['block', 'slipped', 'rolled', 'ducked', 'pulled', 'slip', 'roll', 'pull'].includes(e.how)) defOk[e.how] = (defOk[e.how] || 0) + 1;
    if (e.result !== 'land') return;
    r.land++; if (jab) r.jabL++; else r.powL++;
    if (P.tgt === 'body') r.bodyL++;
    q[e.q] = (q[e.q] || 0) + 1;
    if (P.fam === 'straight') ext.push(e.ext); else extFam[P.fam].push(e.ext);
  });
  F.runRound(); rounds++;
  rows.forEach((r, i) => {
    const st = i ? b : a;
    byStyle[st] = byStyle[st] || blank();
    for (const k in r) { all[k] += r[k]; byStyle[st][k] += r[k]; }
    all.men++; byStyle[st].men++;
  });
}

const line = (name, r) => console.log(
  `${name.padEnd(9)} thrown ${(r.thrown / r.men).toFixed(1).padStart(5)}  landed ${(r.land / r.men).toFixed(1).padStart(5)}  ${pct(r.land, r.thrown).padStart(6)}` +
  `   jabs ${(r.jabT / r.men).toFixed(1).padStart(4)}/${(r.jabL / r.men).toFixed(1).padStart(4)} ${pct(r.jabL, r.jabT).padStart(6)}` +
  `   power ${(r.powT / r.men).toFixed(1).padStart(4)}/${(r.powL / r.men).toFixed(1).padStart(4)} ${pct(r.powL, r.powT).padStart(6)}` +
  `   body ${pct(r.bodyT, r.thrown)} of thrown`);
console.log(`audit: ${rounds} rounds, per man per round. Targets ~53 / ~15 / ~29%, jabs ~20-25%, power ~35%\n`);
line('all', all);
for (const s of STYLES) line(s, byStyle[s]);

const total = Object.values(how).reduce((x, y) => x + y, 0);
const share = (o, n) => Object.entries(o).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k} ${pct(v, n)}`).join(', ');
console.log('\noutcomes (all punches):', share(how, total));
const nq = Object.values(q).reduce((x, y) => x + y, 0);
console.log('landed clean:', share(q, nq));
const men = all.men;
console.log('defense tries per man per round:', Object.entries(defs).map(([k, v]) => `${k} ${(v / men).toFixed(1)}`).join(', '),
  ' | worked:', Object.entries(defOk).map(([k, v]) => `${k} ${(v / men).toFixed(1)}`).join(', '));
const stats = (v) => {
  v = v.slice().sort((x, y) => x - y);
  const mean = v.reduce((x, y) => x + y, 0) / v.length;
  return `mean ${(mean * 100).toFixed(0)}%  median ${(v[v.length >> 1] * 100).toFixed(0)}%  85-100%: ${pct(v.filter((x) => x >= 0.85 && x <= 1.0).length, v.length)}`;
};
console.log('\nstraights landed at extension:', stats(ext), '  (target ~95%)');
console.log('hooks landed at:', stats(extFam.hook), '| uppers:', stats(extFam.upper));
