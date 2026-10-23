// usage: node dbg.js page.html "cond" "evalJs" out.png [setupJs]
const { chromium } = require(process.env.PW || '/opt/node22/lib/node_modules/playwright');
(async () => {
  const [file, cond, js, out, setup = "__dbg.newFight({sa:'spoiler',sb:'jabgrab'});document.getElementById('bSpd').click();document.getElementById('bSpd').click();"] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: 560, height: 420 } });
  const errs = []; pg.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await pg.goto('file://' + require('path').resolve(file)); await pg.waitForTimeout(2000);
  await pg.evaluate(setup);
  const ok = await pg.evaluate(`new Promise(res => { const t0 = performance.now(); const f = () => { const F = __dbg.fight, sn = F.snap(), s0 = sn.f[0], s1 = sn.f[1]; let hit = false; try { hit = !!(${cond}); } catch (e) {} if (hit) { window.__paused = true; setTimeout(() => res(true), 1000); } else if (performance.now() - t0 > 200000) res(false); else requestAnimationFrame(f); }; f(); })`);
  console.log('caught', ok);
  console.log(JSON.stringify(await pg.evaluate(js)));
  await pg.screenshot({ path: out });
  console.log('errors', errs); await b.close();
})();
