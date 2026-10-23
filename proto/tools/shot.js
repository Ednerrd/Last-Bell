// usage: node shot.js file.html out.png [waitMs] [w h] [js]
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
(async () => {
  const [file, out, wait = 4000, w = 390, h = 844, js = ''] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  const errs = []; pg.on('console', m => { if (m.type() === 'error' || m.type()==='warning') errs.push(m.text()); }); pg.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await pg.goto('file://' + require('path').resolve(file));
  await pg.waitForTimeout(+wait);
  if (js) { const r = await pg.evaluate(js); if (r !== undefined) console.log('eval:', JSON.stringify(r)); await pg.waitForTimeout(300); }
  await pg.screenshot({ path: out });
  console.log('fps', await pg.evaluate(() => window.__fps), 'errors:', errs.slice(0, 8));
  await b.close();
})();
