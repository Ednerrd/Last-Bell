// side swaps: how often the fighters' left-right order flips (and the bodies mirror) during live action
// node tests/swap.js 100   (per fight-minute of sim time; cause = what the fighter that moved most was doing)
const S = require('./sim.js');
const N = +process.argv[2] || 100;
const st = Object.keys(S.STYLES).filter(k => !S.STYLES[k].special);
const sp = Object.keys(S.STYLES).filter(k => S.STYLES[k].special);
let mins = 0, swaps = 0, flips = 0, minGap = 0, gapN = 0; const why = {}, bySt = {};
for (let i = 0; i < N; i++) {
  const pick = () => (R => R < .7 ? st[Math.random() * st.length | 0] : sp[Math.random() * sp.length | 0])(Math.random());
  const sa = pick(), sb = pick();
  const f = new S.Fight(S.sheet(82, sa, S.rollGuard(sa)), S.sheet(82, sb, S.rollGuard(sb)), { rounds: 10 });
  let n = 0, sg = 0, dirs = [0, 0];
  while (f.phase !== 'over' && n < 600000) {
    f.step(); n++;
    if (f.phase === 'corner') f.nextRound(f.aiStrategy(0), f.aiStrategy(1));
    if (f.phase !== 'fight') { sg = 0; dirs = [0, 0]; continue; }
    mins += 1 / 60 / 60; // watched minutes (sim time, 1x)
    const [A, B] = f.f, dx = B.x - A.x;
    gapN++; if (Math.abs(dx) < 15) minGap++;
    if (Math.abs(dx) > 5) {
      const s = dx > 0 ? 1 : -1;
      if (sg && s !== sg) {
        swaps++;
        const M = Math.abs(A.vx) > Math.abs(B.vx) ? A : B;
        const c = M.slideT > 0 ? (M.spin ? 'spin' : M.esc ? 'escape' : 'slide') : M.state === 'punch' ? 'punch' : M.cutting ? 'cut' : M.st.angle ? 'angle' : 'footwork';
        why[c] = (why[c] || 0) + 1; bySt[M.st.label] = (bySt[M.st.label] || 0) + 1;
      }
      sg = s;
    }
    f.f.forEach((F, j) => { if (dirs[j] && F.dir !== dirs[j]) flips++; dirs[j] = F.dir; });
  }
}
console.log('fight min', mins.toFixed(0), '| swaps/min', (swaps / mins).toFixed(2), '| dir flips/min', (flips / mins).toFixed(2), '| time with |dx|<15', (100 * minGap / gapN).toFixed(1) + '%');
console.log('cause', JSON.stringify(why));
console.log('mover', JSON.stringify(bySt));
