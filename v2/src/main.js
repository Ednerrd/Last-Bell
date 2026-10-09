// Last Bell v2 entry. M1: two men footworking in the ring, perf overlay, quality switch, watch speed.
import { loadThree } from './render3d/three.js';
import { buildRing, buildLights } from './render3d/ring.js';
import { makeTvCamera } from './render3d/camera.js';
import { loadQuality, saveQuality, pixelRatio } from './ui/quality.js';
import { makeHud, fatal } from './ui/hud.js';
import { makeMen } from './render3d/men.js';
import { makeFight, DT } from './engine/fight.js';
import { makeRng } from './core/rng.js';
import { GUARDS, STYLES } from './fighter/make.js';

const root = document.getElementById('app');

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch { return false; }
}

async function start() {
  if (!hasWebGL()) return fatal(root, "Your phone can't run it", 'Last Bell needs WebGL. Try a newer browser or phone.');
  let THREE;
  try { THREE = await loadThree(); }
  catch { return fatal(root, 'No ring today', "Couldn't load the 3D engine. Check your connection and reload."); }

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  root.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  buildRing(THREE, scene);
  const { key } = buildLights(THREE, scene);
  const tv = makeTvCamera(THREE);
  const drawMen = makeMen(THREE, scene);

  // A fresh random matchup every round, so the phone test shows every style, guard and stance.
  const pickRng = makeRng(Date.now() % 1e9);
  const randMan = () => ({
    style: pickRng.pick(STYLES), guard: pickRng.pick(GUARDS),
    stance: pickRng.chance(0.25) ? 'southpaw' : 'orthodox',
    height: pickRng.range(1.68, 1.9),
  });
  let fight = null, rest = 0, speed = '1x', acc = 0;
  function newRound() {
    const red = randMan(), blue = randMan();
    red.reach = red.height * pickRng.range(0.98, 1.06);
    blue.reach = blue.height * pickRng.range(0.98, 1.06);
    fight = makeFight({ seed: pickRng.int(1, 1e9), red, blue });
    fight.startRound();
  }
  newRound();

  const q = loadQuality();
  let interval = 0;
  function applyQuality() {
    renderer.setPixelRatio(pixelRatio(q, window.devicePixelRatio || 1));
    const sh = q.shadows === 'on';
    if (renderer.shadowMap.enabled !== sh) {
      renderer.shadowMap.enabled = sh;
      key.castShadow = sh;
      scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; });
    }
    interval = 1000 / Number(q.cap);
    resize();
  }
  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  const hud = makeHud(root, q, () => { saveQuality(q); applyQuality(); });
  hud.button('speed', ['1x', '2x', '4x'], () => speed, (v) => { speed = v; });
  window.addEventListener('resize', resize);
  renderer.shadowMap.enabled = q.shadows !== 'on'; // force the first apply to set it
  applyQuality();

  // Render loop with an fps cap. Stats every half second.
  const t0 = performance.now();
  let last = 0, frames = 0, statT = t0, workMs = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (now - last < interval - 2) return;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const w0 = performance.now();
    // Fixed-step sim: the engine ticks at 60/s whatever the frame rate.
    if (rest > 0) { if ((rest -= dt * parseInt(speed)) <= 0) newRound(); }
    else {
      acc += dt * parseInt(speed);
      let n = 0;
      while (acc >= DT && n++ < 30) { acc -= DT; if (!fight.tick()) { rest = 3; acc = 0; break; } }
    }
    drawMen.update(fight.men);
    const mid = { x: (fight.men[0].x + fight.men[1].x) / 2, z: (fight.men[0].z + fight.men[1].z) / 2 };
    const dist = tv.update((now - t0) / 1000, window.innerWidth / window.innerHeight, mid);
    scene.fog.near = dist + 2; scene.fog.far = dist + 22; // haze past the ring, whatever the fit
    renderer.render(scene, tv.cam);
    workMs += performance.now() - w0;
    frames++;
    if (now - statT >= 500) {
      const dt = now - statT, sz = renderer.getDrawingBufferSize(new THREE.Vector2());
      hud.perf({
        fps: (frames * 1000) / dt, ms: workMs / frames,
        calls: renderer.info.render.calls, tris: renderer.info.render.triangles,
        w: sz.x, h: sz.y, pr: renderer.getPixelRatio(),
      });
      frames = 0; workMs = 0; statT = now;
    }
    if (frames % 6 === 0) hud.fight({ ...fight, rest: rest > 0 });
  }
  requestAnimationFrame(frame);
  window.__lb = { renderer, scene, THREE, get fight() { return fight; } }; // for headless checks
}

start();
