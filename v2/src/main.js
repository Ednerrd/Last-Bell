// Last Bell v2 entry. M2: two men boxing (footwork, punches, defense), perf overlay, quality and cam switch, watch speed.
import { loadThree } from './render3d/three.js';
import { buildRing, buildLights } from './render3d/ring.js';
import { makeTvCamera, makeFightCamera } from './render3d/camera.js';
import { loadQuality, saveQuality, pixelRatio } from './ui/quality.js';
import { makeHud, fatal } from './ui/hud.js';
import { makeMen } from './render3d/men.js';
import { makeFight, DT } from './engine/fight.js';
import { makeRng } from './core/rng.js';
import { makeBus } from './core/events.js';
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
  const tv = makeTvCamera(THREE), fc = makeFightCamera(THREE);
  const drawMen = makeMen(THREE, scene);
  const bus = makeBus();
  bus.on('contact', (e) => drawMen.onContact(e));

  // A fresh random matchup every round, so the phone test shows every style, guard and stance.
  const pickRng = makeRng(Date.now() % 1e9);
  const randMan = () => ({
    style: pickRng.pick(STYLES), guard: pickRng.pick(GUARDS),
    stance: pickRng.chance(0.25) ? 'southpaw' : 'orthodox',
    height: pickRng.range(1.68, 1.9),
  });
  let fight = null, rest = 0, speed = '1x', acc = 0, prevS = null;
  function newRound() {
    const red = randMan(), blue = randMan();
    red.reach = red.height * pickRng.range(0.98, 1.06);
    blue.reach = blue.height * pickRng.range(0.98, 1.06);
    fight = makeFight({ seed: pickRng.int(1, 1e9), red, blue, bus });
    fight.startRound();
    prevS = null;
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

  // Render interpolation: positions, facing and feet from the tick before, blended to the last tick.
  function snapPrev() {
    prevS = fight.men.map((m) => ({ x: m.x, z: m.z, th: m.th, feet: { lead: { ...m.feet.lead }, rear: { ...m.feet.rear } } }));
  }
  const L = (a, b, k) => a + (b - a) * k;
  const LP = (a, b, k) => ({ x: L(a.x, b.x, k), z: L(a.z, b.z, k) });
  function interp(k) {
    return fight.men.map((m, i) => {
      const a = prevS && prevS[i];
      if (!a || k >= 1) return m;
      const dth = Math.atan2(Math.sin(m.th - a.th), Math.cos(m.th - a.th));
      return {
        ...m, x: L(a.x, m.x, k), z: L(a.z, m.z, k), th: a.th + dth * k,
        feet: { lead: LP(a.feet.lead, m.feet.lead, k), rear: LP(a.feet.rear, m.feet.rear, k) },
        ta: -(1 - k) * DT,
      };
    });
  }

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
    if (window.__lb && window.__lb.hold) { /* headless pose checks freeze the sim */ }
    else if (rest > 0) { if ((rest -= dt * parseInt(speed)) <= 0) newRound(); }
    else {
      acc += dt * parseInt(speed);
      let n = 0;
      while (acc >= DT && n++ < 30) {
        acc -= DT;
        snapPrev();
        if (!fight.tick()) { rest = 3; acc = 0; break; }
      }
    }
    // Draw between the last two ticks, so motion is smooth whatever the frame timing.
    const view = interp(rest > 0 || (window.__lb && window.__lb.hold) ? 1 : acc / DT);
    const shown = drawMen.update(view, window.__lb && window.__lb.hold ? 0.5 : rest > 0 ? dt : dt * parseInt(speed));
    const aspect = window.innerWidth / window.innerHeight;
    // Cam: 'auto' gives portrait the fight cam and landscape the wide cam (Ed's call).
    const useFight = q.cam === 'fight' || (q.cam === 'auto' && aspect < 1);
    let cam, dist;
    if (useFight) { dist = fc.update(dt, aspect, shown); cam = fc.cam; }
    else {
      const mid = { x: (shown[0].x + shown[1].x) / 2, z: (shown[0].z + shown[1].z) / 2 };
      dist = tv.update((now - t0) / 1000, aspect, mid); cam = tv.cam;
    }
    scene.fog.near = dist + 2; scene.fog.far = dist + 22; // haze past the ring, whatever the fit
    renderer.render(scene, cam);
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
