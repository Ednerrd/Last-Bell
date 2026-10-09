// Last Bell v2 entry. M0: the empty ring, the TV camera, perf overlay, quality switch.
import { loadThree } from './render3d/three.js';
import { buildRing, buildLights } from './render3d/ring.js';
import { makeTvCamera } from './render3d/camera.js';
import { loadQuality, saveQuality, pixelRatio } from './ui/quality.js';
import { makeHud, fatal } from './ui/hud.js';

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
  window.addEventListener('resize', resize);
  renderer.shadowMap.enabled = q.shadows !== 'on'; // force the first apply to set it
  applyQuality();

  // Render loop with an fps cap. Stats every half second.
  const t0 = performance.now();
  let last = 0, frames = 0, statT = t0, workMs = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (now - last < interval - 2) return;
    last = now;
    const w0 = performance.now();
    const dist = tv.update((now - t0) / 1000, window.innerWidth / window.innerHeight);
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
  }
  requestAnimationFrame(frame);
  window.__lb = { renderer, scene, THREE }; // for headless checks
}

start();
