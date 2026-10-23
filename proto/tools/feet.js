// Footwork stats: steps a second, step length, how many steps come as a step-drag pair, stance width, feet crossing.
//   node proto/tools/feet.js proto/ring3d.html [secs] [seed] [setupJs]
// Deterministic and fast (fast.js: seeded, fixed 30 fps, no rendering), so two builds compare on the same fight.
// Works on any build: reads each man's foot states, a new step = a new `from`.
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
(async () => {
  const [file, secs = 90, seed = 7, setup = ''] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const fast = require('./fast'), pg = await fast.open(b, file, +seed), errs = pg.errs;
  await pg.evaluate(setup + `;window.__fR={steps:[],fr:0,cross:0,w:[],sp:[],pp:[null,null],last:[[null,null],[null,null]],n:0}`);
  await fast.run(pg, secs, `const R=__fR,last=R.last,tt=(R.n++)/30;const bx=__dbg.boxers(),F=__dbg.fight;
      if(F&&bx)bx.forEach((B,m)=>{if(!B.ft||!F.f[m]||F.f[m].walk||F.f[m].state==='down'||F.phase!=='fight')return;
        B.ft.forEach((f,i)=>{const k=f.from.x.toFixed(3)+','+f.from.z.toFixed(3);if(last[m][i]!==null&&k!==last[m][i]&&f.t<1)R.steps.push({m,i,t:tt,far:Math.hypot(f.to.x-f.from.x,f.to.z-f.from.z)});last[m][i]=k});
        const a=B.ft[0].at,c=B.ft[1].at,l={x:B.fwd.z,z:-B.fwd.x},sg=B.south?-1:1,lat=((a.x-c.x)*l.x+(a.z-c.z)*l.z)*sg;R.w.push(lat);if(R.pp[m])R.sp.push(Math.hypot(B.prev.x-R.pp[m].x,B.prev.z-R.pp[m].z)*30);R.pp[m]=B.prev.clone();(R.tr=R.tr||[[],[]])[m].push([B.prev.x,B.prev.z]);if(lat<1)R.cross++;R.fr++;});`);
  const r = await pg.evaluate(`(()=>{const R=__fR;const T=R.fr/2/30,S=R.steps,out={fightSecs:+T.toFixed(0),stepsPerSecPerMan:+(S.length/T/2).toFixed(2)};
    const fa=S.map(s=>s.far).sort((a,b)=>a-b);out.len_med=+(fa[fa.length>>1]||0).toFixed(1);out.len_p90=+(fa[Math.floor(fa.length*.9)]||0).toFixed(1);
    out.short_lt4=+(fa.filter(x=>x<4).length/Math.max(1,fa.length)).toFixed(2);
    let pair=0;for(const s of S)if(S.some(o=>o.m===s.m&&o.i!==s.i&&Math.abs(o.t-s.t)<.3))pair++;out.pairShare=+(pair/Math.max(1,S.length)).toFixed(2);
    const w=R.w.sort((a,b)=>a-b);out.width_p10=+w[Math.floor(w.length*.1)].toFixed(1);out.width_med=+w[w.length>>1].toFixed(1);out.crossFrames=+(R.cross/Math.max(1,R.fr)).toFixed(3);const q=R.sp.sort((a,b)=>a-b);out.bodySpd={p25:+q[q.length>>2].toFixed(0),med:+q[q.length>>1].toFixed(0),p75:+q[Math.floor(q.length*.75)].toFixed(0),mean:+(q.reduce((a,b)=>a+b,0)/q.length).toFixed(0),still_lt5:+(q.filter(x=>x<5).length/q.length).toFixed(2)};{let net=0,path=0;for(const tr of R.tr||[])for(let i=15;i<tr.length;i+=15){net+=Math.hypot(tr[i][0]-tr[i-15][0],tr[i][1]-tr[i-15][1]);for(let j=i-14;j<=i;j++)path+=Math.hypot(tr[j][0]-tr[j-1][0],tr[j][1]-tr[j-1][1])}out.net_per_path_halfsec=+(net/path).toFixed(2)}if(window.__feet){const c={};for(const x of __feet)c[x.why]=(c[x.why]||0)+1;for(const k in c)c[k]=+(c[k]/T/2).toFixed(2);out.perSecByWhy=c}return out})()`);
  console.log(JSON.stringify(r)); console.log('errors', errs);
  await b.close();
})();
