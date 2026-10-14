// skill sheet defaults (skill levels L1): what level each walk-in type and each record comes out as, and how much he knows.
//   node tests/sheet.js [N]     N sheets per row (default 400), random styles
process.env.PATCH = (process.env.PATCH || '') + ';globalThis.__SK={skillSheet,skFromRecord,skCenter,levelOf,SKL,BoxerBrain};';
const S = require('./sim.js'), K = globalThis.__SK, N = +process.argv[2] || 400;
const ALL = Object.keys(S.STYLES), pick = a => a[Math.floor(Math.random() * a.length)];
const TI = ['novice', 'intermediate', 'pro', 'world'], f2 = x => x.toFixed(2);
function row(name, mk) {
  const cnt = { novice: 0, intermediate: 0, pro: 0, world: 0 }; let avg = 0, kn = 0, kSp = 0, kSouth = 0, lo = 0;
  for (let i = 0; i < N; i++) {
    const st = pick(ALL), sh = mk(S.sheet(78, st, S.rollGuard(st))), L = K.levelOf(sh);
    cnt[L.key]++; avg += L.avg;
    const ks = Object.keys(sh.know.style), base = ks.filter(k => !S.STYLES[k].special), sp = ks.filter(k => S.STYLES[k].special);
    kn += base.reduce((t, k) => t + sh.know.style[k], 0) / base.length; kSp += sp.reduce((t, k) => t + sh.know.style[k], 0) / sp.length; kSouth += sh.know.stance.southpaw;
    lo += Object.values(sh.sk).filter(v => v < 46).length;
  }
  console.log(name.padEnd(24) + String((avg / N).toFixed(1)).padStart(6) + TI.map(t => (100 * cnt[t] / N).toFixed(0).padStart(5) + '%').join('') + f2(kn / N).padStart(8) + f2(kSp / N).padStart(8) + f2(kSouth / N).padStart(8) + (lo / N).toFixed(1).padStart(8));
}
console.log(''.padEnd(24) + 'avg'.padStart(6) + '     N     I     P     W' + 'k base'.padStart(8) + 'k spec'.padStart(8) + 'k south'.padStart(8) + ' N skls');
for (const t of Object.keys(K.SKL.walkIn)) row(t, sh => K.skillSheet(sh, t));
for (const [w, l, d, r] of [[0, 0, 0, 70], [4, 0, 0, 74], [10, 0, 0, 78], [10, 6, 1, 74], [20, 25, 2, 72], [25, 0, 0, 82], [32, 3, 0, 86], [45, 2, 0, 90]])
  row(`${w}-${l}-${d} @${r} (c ${K.skCenter({ w, l, d }, r).toFixed(0)})`, sh => K.skFromRecord(sh, { w, l, d }, r));
const noSk = S.sheet(78, 'boxerpuncher', 'standard'); console.log('\nno sheet.sk (rating 78, boxer-puncher): level', JSON.stringify(K.levelOf(noSk)));
