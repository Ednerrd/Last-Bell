// Headless check of v2/index.html: page errors + screenshots into v2/shots/ (gitignored).
// node v2/tests/shot.mjs [three.module.min.js]
// jsdelivr may be blocked in the sandbox, so pass a local copy of the pinned three.js to serve instead.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const here = dirname(fileURLToPath(import.meta.url));
const page_ = join(here, '..', 'index.html');
const out = join(here, '..', 'shots');
mkdirSync(out, { recursive: true });
const local = process.argv[2];
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await pw.chromium.launch({
  executablePath: existsSync(exe) ? exe : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
let bad = 0;
for (const [name, vp] of [['portrait', { width: 412, height: 915 }], ['landscape', { width: 915, height: 412 }]]) {
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  if (local) await page.route(/cdn\.jsdelivr\.net\/npm\/three@/, (r) =>
    r.fulfill({ body: readFileSync(local), contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
  await page.goto('file://' + page_);
  await page.waitForTimeout(2500);
  const perf = await page.$eval('.perf', (e) => e.textContent).catch(() => '(no perf overlay)');
  const fatal = await page.$eval('.fatal', (e) => e.textContent).catch(() => null);
  await page.screenshot({ path: join(out, `m0-${name}.png`) });
  // Mid-round frames: run the sim ahead (render-side only) and grab a few shots.
  for (const sec of [25, 60, 110]) {
    await page.evaluate((s) => { const f = window.__lb.fight; while (f.clock < s && f.tick()); }, sec);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: join(out, `mid-${name}-${sec}.png`) });
  }
  // Tap every quality button through all its options and back.
  for (const b of await page.$$('.qbar button')) for (let i = 0; i < 3; i++) { await b.click(); await page.waitForTimeout(150); }
  const after = await page.$$eval('.qbar button', (bs) => bs.map((b) => b.textContent).join(' | ')).catch(() => '');
  console.log(`${name}: ${errs.length} errors${fatal ? '  FATAL: ' + fatal : ''}\n${perf}\nbuttons after taps: ${after}`);
  errs.forEach((e) => console.log('  ! ' + e));
  bad += errs.length + (fatal ? 1 : 0);
  await page.close();
}
await browser.close();
process.exit(bad ? 1 : 0);
