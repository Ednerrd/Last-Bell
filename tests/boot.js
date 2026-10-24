// node tests/boot.js page.html ["js to eval after load"] [shot.png]: loads the page headless (390x844), prints the eval and any page errors
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + require('path').resolve(process.argv[2])); await pg.waitForTimeout(1500);
  const js = process.argv[3] || "document.querySelector('#app').className + ' | ' + (typeof F !== 'undefined' && F ? 'fight on, t=' + F.t.toFixed(1) : 'no fight')";
  try { console.log('->', await pg.evaluate(js)); } catch (e) { errs.push('eval: ' + e.message); }
  if (process.argv[4]) await pg.screenshot({ path: process.argv[4], fullPage: true });
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no errors'); await b.close();
})();
