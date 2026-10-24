// Guard down by round: share of fight time each man's hands are dropped (a drop spell, `dropW` > .5), and for reference each glove
// under his chin by more than `lo` (per 100 of height: the loose guard counts too), and the average tired. The real line (Dunn 2017, elite amateurs): guard down 24 / 31 / 34 s of rounds 1-3 = 13 / 17 / 19%.
//   node proto/tools/hands.js proto/ring3d.html [secs] [seed] [lo]   (hands-low men left out: their guard is down by design). Fast + deterministic.
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
(async () => {
  const [file, secs = 800, seed = 7, lo = 6] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const fast = require('./fast'), pg = await fast.open(b, file, +seed);
  await pg.evaluate(`window.__hd={}`);
  await fast.run(pg, secs, `{const F=__dbg.fight,bx=__dbg.boxers();if(F&&F.phase==='fight'&&bx)bx.forEach((B,m)=>{const X=F.f[m];if(!B.col||!B.glT||X.guard==='handslow'||X.state==='down'||X.walk)return;
    const H=100/(B.hs*100),c=B.col.chin.y,lh=B.south?1:0,r=__hd[F.round]=__hd[F.round]||{n:0,rear:0,lead:0,either:0,tired:0,drop:0};
    const dr=(c-B.glT[1-lh].y)*H>${+lo},dl=(c-B.glT[lh].y)*H>${+lo};r.n++;r.rear+=dr;r.lead+=dl;r.either+=dr||dl;r.tired+=Math.max(0,Math.min(1,1-X.stam/Math.max(1,X.stamMax)/.45));r.drop+=(B.dropW||0)>.5;r.spell=(r.spell||0)+((B.dropT||0)>0)})}`);
  const r = await pg.evaluate(`(()=>{const o={};for(const k in __hd){const r=__hd[k];o['R'+k]={secs:+(r.n/60).toFixed(0),drop:+(r.drop/r.n*100).toFixed(1),spell:+((r.spell||0)/r.n*100).toFixed(1),rear:+(r.rear/r.n*100).toFixed(1),lead:+(r.lead/r.n*100).toFixed(1),either:+(r.either/r.n*100).toFixed(1),tired:+(r.tired/r.n).toFixed(2)}}return o})()`);
  console.log(JSON.stringify(r)); if (pg.errs.length) console.log(pg.errs);
  await b.close();
})();
