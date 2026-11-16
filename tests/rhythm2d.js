// The rhythm pass: hip height, hip x and head x over N seconds by style (idle, standard guard), one man's seed; two pages side by side.
// node tests/rhythm2d.js [before.html] [after.html] [out.png] [secs]
const { chromium } = require('playwright'), path = require('path');
const [A = 'index.html', B = 'index.html', out = 'shots/rhythm2d.png', secs = '10'] = process.argv.slice(2);
const ST = ['outboxer', 'boxerpuncher', 'counter', 'slugger', 'swarmer', 'awkward'];
async function trace(b, html) {
  const pg = await b.newPage(); await pg.goto('file://' + path.resolve(html)); await pg.waitForTimeout(600);
  return pg.evaluate(([ST, secs]) => ST.map(st => { const look = randLook(4), r = [];
    for (let t = 0; t < secs; t += 1 / 30) { const v = { x: 0, dir: 1, guard: 'standard', tired: 0, gi: 1, defZ: 'head', state: 'idle', aT: null, aP: 0, def: null, defP: 0, hitT: 0, downP: 0, cut: 0, swL: 0, swR: 0, dmg: 0, bob: 2.3, sk: st, style: st, stance: 'orthodox', mv: 0 };
      const J = Render.pose(v, look, t); r.push([J.hip.y, J.hip.x, J.head.x]); } return r; }), [ST, +secs]);
}
(async () => {
  const b = await chromium.launch(), ta = await trace(b, A), tb = await trace(b, B);
  const pg = await b.newPage({ viewport: { width: 900, height: 120 * ST.length + 40 }, deviceScaleFactor: 2 });
  await pg.setContent('<body style="margin:0;background:#111"><canvas id=c width=900 height=' + (120 * ST.length + 40) + '></canvas></body>');
  await pg.evaluate(([ST, ta, tb]) => { const c = document.getElementById('c').getContext('2d'); c.font = '13px sans-serif';
    c.fillStyle = '#ddd'; c.fillText('BEFORE (metronome)', 120, 22); c.fillText('AFTER (phrases, pauses, tempo shifts)', 510, 22);
    const plot = (tr, x0, row) => { const y0 = 40 + row * 120;
      c.strokeStyle = '#333'; c.strokeRect(x0, y0, 380, 110);
      for (const [i, col, k] of [[0, '#ffb020', 9], [1, '#36c2ff', 6], [2, '#7ddc6f', 4]]) { const vals = tr.map(p => p[i]), m = vals.reduce((a, b) => a + b) / vals.length;
        c.strokeStyle = col; c.lineWidth = 1.4; c.beginPath(); vals.forEach((v, j) => { const x = x0 + j / vals.length * 380, y = y0 + 55 + (v - m) * k; j ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); } };
    ST.forEach((st, r) => { c.fillStyle = '#ddd'; c.fillText(st, 8, 100 + r * 120); plot(ta[r], 110, r); plot(tb[r], 505, r); });
    c.fillStyle = '#ffb020'; c.fillText('hip up/down', 110, 36 + 120 * ST.length); c.fillStyle = '#36c2ff'; c.fillText('hip fwd/back', 220, 36 + 120 * ST.length); c.fillStyle = '#7ddc6f'; c.fillText('head fwd/back', 340, 36 + 120 * ST.length);
  }, [ST, ta, tb]);
  await pg.screenshot({ path: out }); await b.close(); console.log('->', out);
})();
