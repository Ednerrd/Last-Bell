// The empty ring at real size, plus the dark arena around it.
// Instanced where it repeats, to keep draw calls low on phones.
import { RING } from '../core/math.js';

export function buildRing(THREE, scene) {
  const H = RING.half, P = RING.post, plat = H + RING.apron;
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), v = new THREE.Vector3();

  // Platform: canvas top at y = 0, skirt down to the arena floor.
  const canvas = new THREE.Mesh(
    new THREE.BoxGeometry(plat * 2, 0.08, plat * 2),
    new THREE.MeshStandardMaterial({ color: 0xc7ccd3, roughness: 0.92 }),
  );
  canvas.position.y = -0.04;
  canvas.receiveShadow = true;
  scene.add(canvas);

  const skirt = new THREE.Mesh(
    new THREE.BoxGeometry(plat * 2 + 0.02, RING.floorDrop - 0.08, plat * 2 + 0.02),
    new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 1 }),
  );
  skirt.position.y = -0.08 - (RING.floorDrop - 0.08) / 2;
  scene.add(skirt);

  // Apron edge trim, so the canvas reads as a platform from the TV angle.
  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(plat * 2 + 0.04, 0.06, plat * 2 + 0.04),
    new THREE.MeshStandardMaterial({ color: 0x7a1717, roughness: 0.7 }),
  );
  trim.position.y = -0.11;
  scene.add(trim);

  // Posts.
  const posts = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.055, 0.055, RING.postH, 12),
    new THREE.MeshStandardMaterial({ color: 0x9aa0a8, metalness: 0.7, roughness: 0.35 }),
    4,
  );
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  corners.forEach(([sx, sz], i) => {
    posts.setMatrixAt(i, m.compose(v.set(sx * P, RING.postH / 2, sz * P), q.identity(), s));
  });
  posts.castShadow = true;
  scene.add(posts);

  // Corner pads: red, neutral, blue, neutral.
  const pads = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.22, 1.12, 0.22),
    new THREE.MeshStandardMaterial({ roughness: 0.6 }),
    4,
  );
  const padCol = [0xb3201c, 0xe8e8e8, 0x1d4fb3, 0xe8e8e8].map((c) => new THREE.Color(c));
  corners.forEach(([sx, sz], i) => {
    const d = H + 0.06;
    q.setFromAxisAngle(v.set(0, 1, 0), Math.atan2(sx, sz));
    pads.setMatrixAt(i, m.compose(new THREE.Vector3(sx * d, 0.92, sz * d), q, s));
    pads.setColorAt(i, padCol[i]);
  });
  pads.castShadow = true;
  scene.add(pads);

  // Ropes: 4 heights x 4 sides. Inner face of each rope sits on the 6.1 m square.
  const len = P * 2;
  const ropes = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(RING.ropeR, RING.ropeR, len, 8),
    new THREE.MeshStandardMaterial({ roughness: 0.5 }),
    16,
  );
  const ropeCol = [0xd8d8d8, 0xb3201c, 0xd8d8d8, 0x1d4fb3].map((c) => new THREE.Color(c));
  const r = H + RING.ropeR;
  let k = 0;
  RING.ropes.forEach((y, level) => {
    for (const [x, z, alongX] of [[0, -r, 1], [0, r, 1], [-r, 0, 0], [r, 0, 0]]) {
      q.setFromAxisAngle(v.set(alongX ? 0 : 1, 0, alongX ? 1 : 0), Math.PI / 2);
      ropes.setMatrixAt(k, m.compose(new THREE.Vector3(x, y, z), q, s));
      ropes.setColorAt(k++, ropeCol[level]);
    }
  });
  ropes.castShadow = true;
  scene.add(ropes);

  // Arena floor and ringside risers, mostly lost in the dark.
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ color: 0x0b0c0f, roughness: 1 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -RING.floorDrop;
  floor.receiveShadow = true;
  scene.add(floor);

  const risers = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x14161b, roughness: 1 }),
    12,
  );
  k = 0;
  for (let row = 0; row < 3; row++) {
    const d = 7.5 + row * 1.6, h = 0.5 + row * 0.7, w = d * 2;
    for (const [x, z, sx, sz] of [[0, -d, w, 1.4], [0, d, w, 1.4], [-d, 0, 1.4, w], [d, 0, 1.4, w]]) {
      risers.setMatrixAt(k++, m.compose(new THREE.Vector3(x, -RING.floorDrop + h / 2, z), q.identity(), new THREE.Vector3(sx, h, sz)));
    }
  }
  scene.add(risers);

  return { canvas, posts, pads, ropes };
}

// Hot key light over the ring, soft fills on the men, dark everywhere else.
export function buildLights(THREE, scene) {
  scene.background = new THREE.Color(0x050608);
  scene.fog = new THREE.Fog(0x050608, 12, 30);

  const key = new THREE.SpotLight(0xfff1dc, 180, 0, Math.PI / 5.2, 0.45, 1.6);
  key.position.set(0, 8.5, 0.6);
  key.target.position.set(0, 0, 0);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 4;
  key.shadow.camera.far = 12;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03; // no self-shadow blotches on the curved skin
  scene.add(key, key.target);

  // Sky fill, plus the bounce off a white canvas under a hot light: legs and faces aren't black.
  scene.add(new THREE.HemisphereLight(0x8592ad, 0x6a6058, 0.55));
  // Warm fill from the broadcast side, cool rim from the far side: the Fight Night skin pop.
  const fill = new THREE.DirectionalLight(0xffdcc0, 0.55);
  fill.position.set(5, 4, 7);
  const rim = new THREE.DirectionalLight(0x7a92c0, 0.8);
  rim.position.set(-6, 5, -8);
  scene.add(fill, rim);

  return { key };
}
