const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
(async () => {
  const [file, secs = 60, patch = ''] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const F = process.env.FAST, fast = require('./fast'); // FAST=seed: deterministic, fixed 30 fps, no rendering (secs = fight time)
  const pg = F ? await fast.open(b, file, +F) : await b.newPage({ viewport: { width: 400, height: 300 } });
  const errs = F ? pg.errs : []; if (!F) { pg.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await pg.goto('file://' + require('path').resolve(file)); await pg.waitForTimeout(2000); }
  await pg.evaluate(`window.__probe=[];` + patch);
  if (F) await fast.run(pg, secs); else await pg.waitForTimeout(+secs * 1000);
  const r = await pg.evaluate(`(()=>{const o={};for(const h of __probe){if(h.ext==null)continue;const k=h.p;(o[k]=o[k]||[]).push(h)}const out={};for(const k in o){const a=o[k],m=f=>a.reduce((s,h)=>s+f(h),0)/a.length;out[k]={n:a.length,ext:+m(h=>h.ext).toFixed(3),d:+m(h=>h.d/h.rs).toFixed(1),d3:+m(h=>h.d3).toFixed(1),lunge:+m(h=>h.lg).toFixed(1),ext_lo:+Math.min(...a.map(h=>h.ext)).toFixed(2),want:+m(h=>h.want).toFixed(2)}}return out})()`);
  console.log(JSON.stringify(r, null, 0).replace(/},/g, '},\n')); console.log('errors', errs);
  await b.close();
})();
