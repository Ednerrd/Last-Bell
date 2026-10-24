// Steps vs punches and pivots: for each punch-driven step (by punch cat / push|drag|punch / lead|rear foot), the share of the punch
// when the foot left and when it landed (the hand lands at ~.54-.6: a stepping shot's lead foot should land there too), lone steps by foot.
//   node proto/tools/land.js proto/ring3d.html [secs] [seed]   (a landP below startP = it landed during the next punch). Fast + deterministic.
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
(async () => {
  const [file, secs = 120, seed = 7] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const fast = require('./fast'), pg = await fast.open(b, file, +seed);
  await pg.evaluate(`window.__feet=[];window.__land=[]`);
  await fast.run(pg, secs);
  const r = await pg.evaluate(`(()=>{const L=__land,F=__feet;const o={};
    const pun=L.filter(x=>x.p0>=0&&x.far>3);const by={};for(const x of pun){const k=(x.cat||'')+'/'+x.why+'/'+(x.i?'rear':'lead');(by[k]=by[k]||[]).push(x)}
    for(const k in by){const a=by[k],ps=a.map(x=>x.p).filter(p=>p>=0).sort((a,b)=>a-b),p0=a.map(x=>x.p0).sort((a,b)=>a-b);o[k]={n:a.length,startP_med:+p0[p0.length>>1].toFixed(2),landP_p25:ps.length?+ps[ps.length>>2].toFixed(2):null,landP_med:ps.length?+ps[ps.length>>1].toFixed(2):null,landP_p75:ps.length?+ps[Math.floor(ps.length*.75)].toFixed(2):null,landedAfterPunch:a.length-ps.length,farMed:+a.map(x=>x.far).sort((a,b)=>a-b)[a.length>>1].toFixed(1)}}
    const one=F.filter(x=>x.why==='one');o.one={lead:one.filter(x=>x.i===0).length,rear:one.filter(x=>x.i===1).length};
    const c={};for(const x of F)c[x.why+(x.i?'R':'L')]=(c[x.why+(x.i?'R':'L')]||0)+1;o.all=c;return o})()`);
  console.log(JSON.stringify(r, null, 1)); console.log(pg.errs);
  await b.close();
})();
