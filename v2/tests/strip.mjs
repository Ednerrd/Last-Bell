// Frame strip (render only): fake clock so headless renders real 60 fps frames, then grabs N in a row.
// node v2/tests/strip.mjs <three.module.min.js> [frames] [every] -> v2/shots/strip-*.png
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'shots');
mkdirSync(out, { recursive: true });
const [local, N = 16, every = 2] = [process.argv[2], Number(process.argv[3] || 16), Number(process.argv[4] || 2)];
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await pw.chromium.launch({
  executablePath: existsSync(exe) ? exe : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1 });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
await page.clock.install();
if (local) await page.route(/cdn\.jsdelivr\.net\/npm\/three@/, (r) =>
  r.fulfill({ body: readFileSync(local), contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await page.goto('file://' + join(here, '..', 'index.html'));
await page.waitForFunction(() => window.__lb && window.__lb.fight);
// Freeze time: from here only runFor() moves it, 16.67 ms per frame, however slow the screenshots are.
await page.clock.pauseAt(new Date(Date.now() + 3000));
// Skip to mid-round, then let the cam settle in real frames.
await page.evaluate(() => { const f = window.__lb.fight; while (f.clock < 40 && f.tick()); });
for (let i = 0; i < 120; i++) await page.clock.runFor(16.67);
for (let i = 0; i < N; i++) {
  for (let k = 0; k < every; k++) await page.clock.runFor(16.67);
  await page.screenshot({ path: join(out, `strip-${String(i).padStart(2, '0')}.png`) });
}
console.log(errs.length ? errs.join('\n') : 'no page errors');
await browser.close();
