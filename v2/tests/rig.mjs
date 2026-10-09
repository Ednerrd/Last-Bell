// Rendered-rig smoothness (render only): records every frame the page draws, then counts hip and
// head jolts (> 40 m/s2 change in a frame) and frames where a foot slides on the canvas, plus the gait:
// steps, stride length, and stop-go frames (hips stalled while he's moving overall).
// node v2/tests/rig.mjs <three.module.min.js> [page.html] [secs]. The matchup is random, so average a few runs.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const here = new URL('.', import.meta.url).pathname;
const [local, file, secs] = [process.argv[2], process.argv[3] || here + '../index.html', Number(process.argv[4] || 40)];
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 200, height: 400 } });
await page.clock.install({ time: new Date('2026-10-09T12:00:00Z') });
await page.route(/cdn\.jsdelivr\.net\/npm\/three@/, (r) => r.fulfill({ body: readFileSync(local), contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await page.goto('file://' + file);
await page.waitForFunction(() => window.__lb && window.__lb.fight);
await page.evaluate(() => {
  const rig = window.__lb.men.rig;
  window.__probe = () => [...rig.map((R) => [...R.probe.hip, ...R.probe.head]), rig.flatMap((R) => R.probe.feet.map((f) => [...f]))];
});
await page.evaluate(() => {
  window.__rec = [];
  const R = window.__lb.renderer, orig = R.render.bind(R);
  R.render = (sc, cam) => { orig(sc, cam); window.__rec.push({ r: window.__probe(), t: performance.now(), st: window.__lb.fight.men.map((m) => (m.step ? 'step ' : '') + (m.punch ? 'punch:' + m.punch.kind + ' ' : '') + (m.def ? 'def:' + m.def.kind + ' ' : '') + window.__lb.fight.clock.toFixed(2)) }); };
});
await page.clock.pauseAt(new Date(Date.now() + 3000));
const logs = []; let jHip = 0, jHead = 0, slide = 0, n = 0;
for (let i = 0; i < secs; i++) await page.clock.runFor(1000);
const hist = (await page.evaluate(() => window.__rec)).map((h, i, A) => ({ ...h, dt: i ? (h.t - A[i - 1].t) / 1000 : 0.0167 }));
// Gait: steps (a foot off the canvas, then down), their length, hip speed stops.
{
  let steps = 0, strideSum = 0, stops = 0, moving = 0;
  for (let k = 0; k < 4; k++) {
    let up = null;
    for (const h of hist) { const f = h.r[2][k]; if (!f) continue; const lifted = f[1] > 0.06;
      if (lifted && !up) up = f; else if (!lifted && up) { const d = Math.hypot(f[0] - up[0], f[2] - up[2]); if (d > 0.03) { steps++; strideSum += d; } up = null; } }
  }
  for (let g = 0; g < 2; g++) { let win = [];
    for (let i = 1; i < hist.length; i++) { const v = Math.hypot(hist[i].r[g][0] - hist[i - 1].r[g][0], hist[i].r[g][2] - hist[i - 1].r[g][2]) / hist[i].dt; win.push(v); }
    // over 0.5 s windows: moving overall but stopped in the middle = stop-go
    for (let i = 30; i < win.length; i++) { const w = win.slice(i - 30, i), avg = w.reduce((a, b) => a + b, 0) / 30; if (avg > 0.25) { moving++; if (win[i - 15] < 0.08) stops++; } }
  }
  console.log('gait: steps', steps, 'avg stride', (strideSum / Math.max(steps, 1)).toFixed(3), 'm; stop-go frames', stops, 'of', moving, 'moving');
}
for (let i = 2; i < hist.length; i++) {
  const [a, b, c] = [hist[i - 2], hist[i - 1], hist[i]];
  for (let g = 0; g < 2; g++) for (const [off, cnt] of [[0, 'hip'], [3, 'head']]) {
    const v1 = Math.hypot(b.r[g][off] - a.r[g][off], b.r[g][off + 2] - a.r[g][off + 2]) / b.dt;
    const v2 = Math.hypot(c.r[g][off] - b.r[g][off], c.r[g][off + 2] - b.r[g][off + 2]) / c.dt;
    const acc = Math.abs(v2 - v1) / c.dt;
    if (acc > 40 && v1 < 6 && v2 < 6) { cnt === 'hip' ? jHip++ : jHead++; if (process.env.LOG && logs.length < 30) logs.push(cnt + g + ' ' + acc.toFixed(0) + ' ' + c.st[g]); }
  }
  c.r[2].forEach((f, k) => { const p = b.r[2][k]; const v = Math.hypot(f[0] - p[0], f[2] - p[2]) / c.dt; if (f[1] < 0.075 && p[1] < 0.075 && Math.abs(f[1] - p[1]) < 0.002 && v > 0.4 && v < 5) slide++; });
  n++;
}
console.log(file.split('/').pop(), `frames ${n}: hip jolts ${jHip}, head jolts ${jHead}, foot-slide frames ${slide}`);
if (process.env.LOG) console.log(logs.join('\n'));
await browser.close();
