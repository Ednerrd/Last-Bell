// Close-up look check (render only): runs the sim to [secs], then shoots the men in a bare studio
// (ring hidden) from a few angles: side, front, back, three (3/4), face / face1 (each man's face).
// VIEWS=side,face node v2/tests/close.mjs <three.module.min.js> [matchup] [secs] -> v2/shots/close-*.png
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const [three, mu = '', secs = '30'] = process.argv.slice(2);
const here = dirname(fileURLToPath(import.meta.url)), shots = join(here, '..', 'shots');
mkdirSync(shots, { recursive: true });
const out = join(shots, 'close');
const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1.5 });
const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await page.route(/cdn\.jsdelivr\.net\/npm\/three@/, (r) => r.fulfill({ body: readFileSync(three), contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' } }));
await page.goto('file://' + join(here, '..', 'index.html') + (mu ? '?m=' + mu : ''));
await page.waitForFunction(() => window.__lb && window.__lb.fight);
await page.waitForTimeout(1500);
await page.evaluate((secs) => {
  const L = window.__lb, T = L.THREE, R = L.renderer, orig = R.render.bind(R);
  L.hold = true; const f = L.fight; while (f.clock < +secs && f.tick());
  window.__cam = new T.PerspectiveCamera(30, 412 / 915, 0.1, 100);
  R.render = (sc, cam) => orig(sc, window.__camOn ? window.__cam : cam);
}, secs);
await page.waitForTimeout(1500);
await page.screenshot({ path: out + '-game.png' });
const views = (process.env.VIEWS || 'side').split(',').map((v) => ({ side: ['side', 0, 1.2, 4.6, 1.05, 38], front: ['front', 4.2, 1.3, 1.5, 1.05, 38], back: ['back', -4.2, 1.3, -1.5, 1.05, 38], face: ['face', 'F0', 0, 0, 1.55, 35], face1: ['face1', 'F1', 0, 0, 1.55, 35], three: ['three', 2.6, 1.5, 3.2, 1.1, 38] })[v]);
for (const [n, dx, y, dz, ty, fov] of views) {
  await page.evaluate(([dx, y, dz, ty, fov]) => {
    const rig = window.__lb.men.rig, a = rig[0].probe.hip, b = rig[1].probe.hip;
    let mx = (a[0] + b[0]) / 2, mz = (a[2] + b[2]) / 2;
    const c = window.__cam; c.position.set(mx + dx, y, mz + dz);
    if (dx === 'F0' || dx === 'F1') { const i = dx === 'F0' ? 0 : 1, h = rig[i].probe.head, o = rig[1 - i].probe.head, ux = o[0] - h[0], uz = o[2] - h[2], l = Math.hypot(ux, uz);
      c.position.set(h[0] + ux / l * 0.75 + uz / l * 0.35, h[1] + 0.02, h[2] + uz / l * 0.75 - ux / l * 0.35); mx = h[0]; mz = h[2]; } c.fov = fov; c.updateProjectionMatrix(); c.lookAt(mx, dx === 'F0' || dx === 'F1' ? rig[dx === 'F0' ? 0 : 1].probe.head[1] - 0.05 : ty, mz); window.__camOn = true;
    if (!window.__studio) { window.__studio = 1; const T = window.__lb.THREE, S = window.__lb.scene;
      S.traverse((o) => { if (o.isMesh && !o.isSkinnedMesh && !(o.material && o.material.vertexColors)) o.visible = false; });
      const fl = new T.Mesh(new T.PlaneGeometry(30, 30), new T.MeshStandardMaterial({ color: 0x3a3d44, roughness: 0.9 })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; S.add(fl); }
  }, [dx, y, dz, ty, fov]);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}-${n}.png`, clip: { x: 0, y: 120, width: 412, height: 640 } });
}
console.log(errs.length ? errs.join('\n') : 'no page errors');
await browser.close();
