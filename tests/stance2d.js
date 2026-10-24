// F1: stance stills for the 2D drawing. Rows = guards (cols = styles, idle), then strips of a cross, a lead hook and a jab.
// node tests/stance2d.js [html] [out.png] [extra opts json, e.g. '{"tired":1}'; '{"sel":[["peekaboo","swarmer"],["standard","boxerpuncher",{"aT":"cross","aP":.6}]]}' big cells of just those]
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
const html = process.argv[2] || 'index.html', out = process.argv[3] || 'shots/stance2d.png', extra = process.argv[4] || '{}';
fs.mkdirSync(path.dirname(out), { recursive: true });
(async () => {
  const b = await chromium.launch(), pg = await b.newPage({ viewport: { width: 760, height: 900 }, deviceScaleFactor: 1.5 });
  const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await pg.goto('file://' + path.resolve(html)); await pg.waitForTimeout(800);
  await pg.evaluate(extra => {
    extra = JSON.parse(extra);
    document.body.innerHTML = '<div id=g style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;background:#111"></div>';
    const g = document.getElementById('g'), mr = Math.random; let sd = 7; Math.random = () => (sd = (sd * 1664525 + 1013904223) >>> 0) / 4294967296; const look = randLook(4); Math.random = mr; look.h = 1; look.build = 1;
    const cell = (txt, o) => { const w = document.createElement('div'); w.style.cssText = 'color:#ccc;font:9px sans-serif;text-align:center';
      w.innerHTML = txt; const c = document.createElement('canvas'); c.style.cssText = 'width:104px;height:120px;display:block;margin:auto';
      w.appendChild(c); g.appendChild(w); o.v = Object.assign({}, extra.v || {}, o.v || {}); const x = Object.assign({}, extra); delete x.sel; Render.portrait(c, look, Object.assign({ stance: 'orthodox', dx: 6 }, x, o)); };
    if (extra.sel) { g.style.gridTemplateColumns = 'repeat(' + Math.min(4, extra.sel.length) + ',1fr)'; for (const [gd, st, v] of extra.sel) cell(gd + ' / ' + st, { guard: gd, v: Object.assign({ style: st }, v || {}) });
      g.querySelectorAll('canvas').forEach(c => { c.style.width = '150px'; c.style.height = '175px'; }); return; }
    const ST = ['outboxer', 'boxerpuncher', 'counter', 'slugger', 'swarmer', 'awkward'];
    for (const gd of Object.keys(GUARDS)) { cell(gd, { guard: gd }); for (const s of ST) cell(gd + ' / ' + s, { guard: gd, v: { style: s } }); }
    for (const [a, lab] of [['cross', 'cross'], ['hook', 'lead hook'], ['jab', 'jab']]) for (const p of [0, .2, .4, .55, .6, .75, .9]) cell(lab + ' ' + p, { guard: 'standard', v: { aT: a, aP: p, style: 'boxerpuncher' } });
  }, extra);
  await pg.waitForTimeout(300); await pg.screenshot({ path: out, fullPage: true }); await b.close();
  console.log('errors:', errs.length ? errs : 'none', '->', out);
})();
