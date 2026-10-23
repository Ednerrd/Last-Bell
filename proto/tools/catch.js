// usage: node catch.js page.html outprefix "cond1;;cond2;..." [w h] [camjs]
// each cond is a JS expression over (s0, s1, F) of fight.snap(); the page pauses when it's true, we screenshot, unpause
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
const { execSync } = require('child_process');
(async () => {
  const [file, pre, conds, w = 560, h = 420, camjs = ''] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  const errs = []; pg.on('pageerror', e => errs.push('PAGEERR ' + e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + require('path').resolve(file)); await pg.waitForTimeout(2500);
  await pg.evaluate(`document.querySelector('.ctl').style.display='none';document.getElementById('hint').style.display='none';` + camjs);
  const files = [];
  let i = 0;
  for (const c of conds.split(';;')) {
    const ok = await pg.evaluate(`new Promise(res => { const t0 = performance.now(); const f = () => { const F = __dbg.fight, sn = F.snap(), s0 = sn.f[0], s1 = sn.f[1]; let hit = false; try { hit = !!(${c}); } catch (e) {} if (hit) { window.__paused = true; setTimeout(() => res(true), 120); } else if (performance.now() - t0 > 240000) res(false); else requestAnimationFrame(f); }; f(); })`);
    const fn = `${pre}${i++}.png`; await pg.screenshot({ path: fn }); files.push(fn); console.log(c, ok ? 'caught' : 'TIMEOUT');
    await pg.evaluate('window.__paused = false'); await pg.waitForTimeout(400);
  }
  console.log('errors:', errs.slice(0, 5));
  await b.close();
  execSync(`python3 -c "
from PIL import Image; import sys
fs=sys.argv[1:]; ims=[Image.open(f) for f in fs]; w,h=ims[0].size; n=len(ims); c=min(3,n); r=(n+c-1)//c
g=Image.new('RGB',(w*c,h*r)); [g.paste(im,((k%c)*w,(k//c)*h)) for k,im in enumerate(ims)]; g.save('${pre}sheet.png')
" ${files.join(' ')}`);
})();
