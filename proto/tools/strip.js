// usage: node strip.js page.html out.png "cond" frames stepTicks [w h] [camjs]
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const { execSync } = require('child_process');
(async () => {
  const [file, out, cond, nF = 8, st = 3, w = 360, h = 360, camjs = ''] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: +w, height: +h } });
  const errs = []; pg.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await pg.goto('file://' + require('path').resolve(file)); await pg.waitForTimeout(2500);
  await pg.evaluate(`document.querySelector('.ctl').style.display='none';document.querySelector('.hud').style.display='none';document.getElementById('hint').style.display='none';` + camjs);
  const ok = await pg.evaluate(`new Promise(res => { const t0 = performance.now(); const f = () => { const F = __dbg.fight, sn = F.snap(), s0 = sn.f[0], s1 = sn.f[1]; let hit = false; try { hit = !!(${cond}); } catch (e) {} if (hit) { window.__paused = true; setTimeout(() => res(true), 150); } else if (performance.now() - t0 > 60000) res(false); else requestAnimationFrame(f); }; f(); })`);
  console.log('caught', ok);
  const files = [];
  for (let i = 0; i < +nF; i++) {
    await pg.evaluate(`(()=>{ const F=__dbg.fight; __dbg.step(${st}); window.__paused=true; })()`);
    await pg.waitForTimeout(260);
    const info = await pg.evaluate(`(()=>{const s=__dbg.fight.snap().f;return s.map(x=>(x.aT||'-')+':'+(x.aP||0).toFixed(2)+(x.def?' '+x.def:'')).join(' | ')})()`);
    const fn = out.replace('.png', '_' + i + '.png'); await pg.screenshot({ path: fn }); files.push(fn); console.log(i, info);
  }
  console.log('errors', errs);
  await b.close();
  execSync(`python3 -c "
from PIL import Image; import sys
fs=sys.argv[1:]; ims=[Image.open(f) for f in fs]; w,h=ims[0].size; n=len(ims); c=4; r=(n+c-1)//c
g=Image.new('RGB',(w*c,h*r)); [g.paste(im,((k%c)*w,(k//c)*h)) for k,im in enumerate(ims)]; g.save('${out}')
" ${files.join(' ')}`);
})();
