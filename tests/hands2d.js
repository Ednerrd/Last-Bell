// F1: share of fight time each man's hands are dropped (the lazy-guard spells), by round, sampled from the live page.
// node tests/hands2d.js [html] [rounds] [speed] [fights]
const { chromium } = require('playwright'), path = require('path');
const html = process.argv[2] || 'index.html', RD = +process.argv[3] || 4, SP = +process.argv[4] || 8, NF = +process.argv[5] || 1;
(async () => {
  const b = await chromium.launch(), tot = {};
  for (let k = 0; k < NF; k++) {
    const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = []; pg.on('pageerror', e => errs.push(String(e)));
    await pg.goto('file://' + path.resolve(html)); await pg.waitForTimeout(1500);
    const r = await pg.evaluate(async ([RD, SP]) => {
      FX.speed = SP; const out = {};
      while (F && F.round <= RD && !F.result) {
        await new Promise(r => setTimeout(r, 50));
        if (F.phase !== 'fight') continue;
        const S = Render.sm(), o = out[F.round] || (out[F.round] = { n: 0, d: 0 });
        for (const s of S) { o.n++; if ((s.dT || 0) > 0) o.d++; } // in a spell (the gloves lag it a beat)
      }
      return out;
    }, [RD, SP]);
    for (const k in r) { const t = tot[k] || (tot[k] = { n: 0, d: 0 }); t.n += r[k].n; t.d += r[k].d; }
    if (errs.length) console.log('errors', errs);
    await pg.close();
  }
  for (const k in tot) console.log('round', k, 'dropped', (100 * tot[k].d / tot[k].n).toFixed(1) + '%', 'samples', tot[k].n);
  await b.close();
})();
