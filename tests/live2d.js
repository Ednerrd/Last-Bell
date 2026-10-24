// F1: live fight stills: node tests/live2d.js [html] [outPrefix] [n] [gap ms] [speed]: boots the lab fight, n canvas grabs gap ms apart, prints page errors
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
const html = process.argv[2] || 'index.html', pre = process.argv[3] || 'shots/live2d', n = +process.argv[4] || 6, gap = +process.argv[5] || 1500;
fs.mkdirSync(path.dirname(pre), { recursive: true });
(async () => {
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await pg.goto('file://' + path.resolve(html)); await pg.waitForTimeout(4000);
  for (let i = 0; i < n; i++) { const c = await pg.$('canvas'); await c.screenshot({ path: pre + '_' + i + '.png' }); await pg.waitForTimeout(gap); }
  await b.close(); console.log('errors:', errs.length ? errs : 'none');
})();
