// Headless pose check (render only): freeze the sim at punch contact and mid-defense, screenshot each.
// node v2/tests/poses.mjs [three.module.min.js]  -> v2/shots/pose-*.png
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
const local = process.argv[2];
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await pw.chromium.launch({
  executablePath: existsSync(exe) ? exe : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1.5 });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
if (local) await page.route(/cdn\.jsdelivr\.net\/npm\/three@/, (r) =>
  r.fulfill({ body: readFileSync(local), contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await page.goto('file://' + join(here, '..', 'index.html'));
await page.waitForTimeout(2000);
await page.evaluate(() => { window.__lb.hold = true; const f = window.__lb.fight; while (f.clock < 30 && f.tick()); });

// Run the sim until `test(fight)` is true, then let the render settle on that frame.
async function grab(name, fn) {
  const found = await page.evaluate((src) => {
    const f = window.__lb.fight, test = new Function('f', 'return ' + src);
    for (let i = 0; i < 60 * 900; i++) { if (!f.tick()) { f.startRound(); } if (test(f)) return true; }
    return false;
  }, fn);
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(out, `pose-${name}.png`) });
  console.log(name, found ? 'ok' : 'NOT FOUND');
}
const at = (fam, frac) => `f.men.some((m) => m.punch && m.punch.P.fam === '${fam}' && Math.abs(m.punch.t - (m.punch.load + m.punch.snap) * ${frac}) < 0.009)`;
await grab('straight-contact', at('straight', 1));
await grab('straight-half', at('straight', 0.7));
await grab('hook-contact', at('hook', 1));
await grab('hook-half', at('hook', 0.65));
await grab('upper-contact', at('upper', 1));
for (const k of ['block', 'slip', 'roll', 'pull']) await grab('def-' + k, `f.men.some((m) => m.def && m.def.kind === '${k}' && Math.abs(m.def.t - m.def.dur * 0.45) < 0.009)`);
console.log(errs.length ? errs.join('\n') : 'no page errors');
await browser.close();
