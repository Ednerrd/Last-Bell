const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
(async () => {
  const [file, secs = 60] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: 400, height: 300 } });
  const errs = []; pg.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await pg.goto('file://' + require('path').resolve(file)); await pg.waitForTimeout(2000);
  await pg.evaluate(`window.__clip={n:0,glove:0,glove2:0,gmax:0,chest:0};document.getElementById('bSpd').click();`);
  await pg.waitForTimeout(+secs * 1000);
  const r = await pg.evaluate(`(()=>{const C=__clip;return {frames:C.n,glovePct:+(C.glove/C.n*100).toFixed(2),glove2Pct:+(C.glove2/C.n*100).toFixed(2),gmax:+C.gmax.toFixed(1),chestPct:+(C.chest/C.n*100).toFixed(2),calls:__dbg.renderer.info.render.calls,tris:__dbg.renderer.info.render.triangles}})()`);
  console.log(JSON.stringify(r), 'errors', errs);
  await b.close();
})();
