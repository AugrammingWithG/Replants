// The hero specimen: a rescued grass tree on a floating island of soil and
// grass. Drag to turn it, tap to rustle it; it turns a little as you scroll.
import * as THREE from 'three';
import { grassTree, disposeTree, spring, seeded } from './paper.js';

const clamp01 = (x) => Math.min(1, Math.max(0, x));

function islandTop(r) {
  const g = new THREE.CircleGeometry(1, 72, 0, Math.PI * 2);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position, col = [], c = new THREE.Color();
  const greens = ['#7fae3c', '#6f9f33', '#8cbb46', '#5f8f2c'];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), d = Math.hypot(x, z);
    // a gentle dome with a soft lip at the edge
    p.setY(i, 0.05 * (1 - d * d) + (r() - 0.5) * 0.012);
    c.set(greens[(r() * greens.length) | 0]);
    const k = 0.92 + r() * 0.12;
    col.push(c.r * k, c.g * k, c.b * k);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

function islandRock(r) {
  const prof = [[1.0, 0.0], [0.99, -0.05], [0.92, -0.14], [0.8, -0.26], [0.64, -0.4], [0.46, -0.54], [0.28, -0.66], [0.12, -0.74], [0.0, -0.78]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(prof, 40);
  const p = g.attributes.position, col = [], c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = Math.atan2(z, x);
    // rough the rock up, more lower down
    const n = 1 + (Math.sin(a * 5 + y * 7) * 0.05 + Math.sin(a * 11 - y * 13) * 0.035 + (r() - 0.5) * 0.05) * clamp01(-y * 4);
    if (y < -0.001) { p.setX(i, x * n); p.setZ(i, z * n); }
    // soil strata: dark topsoil, sandy band, red clay below
    const band = y > -0.08 ? '#4a3424' : y > -0.22 ? '#b08a5c' : y > -0.45 ? '#8e5c38' : '#6e4630';
    c.set(band);
    const k = 0.88 + r() * 0.16;
    col.push(c.r * k, c.g * k, c.b * k);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

function tufts(r, count) {
  // three crossed blades per tuft, instanced over the grass
  const blade = new THREE.BufferGeometry();
  const v = [], n = 3;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI;
    const dx = Math.cos(a) * 0.018, dz = Math.sin(a) * 0.018;
    v.push(-dx, 0, -dz, dx, 0, dz, 0, 0.06, 0);
  }
  blade.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  blade.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', side: THREE.DoubleSide, roughness: 0.9 });
  const mesh = new THREE.InstancedMesh(blade, mat, count);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), pos = new THREE.Vector3();
  const color = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.95;
    pos.set(Math.cos(a) * d, 0.05 * (1 - d * d), Math.sin(a) * d);
    q.setFromEuler(new THREE.Euler((r() - 0.5) * 0.4, r() * Math.PI, (r() - 0.5) * 0.4));
    const k = 0.35 + r() * 0.55;
    s.set(k, k * (0.8 + r() * 0.6), k);
    m.compose(pos, q, s);
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, color.set(['#9cc455', '#8cbb46', '#a9cf63', '#7fae3c'][(r() * 4) | 0]));
  }
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function moteTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,235,1)');
  grad.addColorStop(0.4, 'rgba(240,250,190,0.6)');
  grad.addColorStop(1, 'rgba(240,250,190,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createHero(canvas, { size, reduced = false, mobile = () => false }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  scene.add(new THREE.HemisphereLight('#fffdf0', '#b4c08f', 1.7));
  const sun = new THREE.DirectionalLight('#fff2d6', 2.6);
  sun.position.set(-2.2, 4, 2.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -1.6, right: 1.6, top: 2.6, bottom: -1.4, near: 0.5, far: 12 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.01;
  scene.add(sun);

  const r = seeded(21);
  const world = new THREE.Group();
  scene.add(world);
  const island = new THREE.Group();
  world.add(island);

  const top = new THREE.Mesh(islandTop(r), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }));
  top.receiveShadow = true;
  island.add(top);
  const rock = new THREE.Mesh(islandRock(r), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
  rock.castShadow = true;
  island.add(rock);
  island.add(tufts(r, 700));
  // a few stones and dangling roots
  for (let i = 0; i < 6; i++) {
    const a = r() * Math.PI * 2, d = 0.45 + r() * 0.45;
    const s = new THREE.Mesh(new THREE.IcosahedronGeometry(0.04 + r() * 0.05, 0), new THREE.MeshStandardMaterial({ color: '#b9b4a6', roughness: 1, flatShading: true }));
    s.position.set(Math.cos(a) * d, 0.03, Math.sin(a) * d);
    s.scale.y = 0.6;
    s.castShadow = s.receiveShadow = true;
    island.add(s);
  }
  const rootMat = new THREE.MeshStandardMaterial({ color: '#4a3122', roughness: 1 });
  for (let i = 0; i < 6; i++) {
    const a = r() * Math.PI * 2, start = 0.2 + r() * 0.35;
    const y0 = -0.5 - (1 - start) * 0.25;
    const pts = [
      new THREE.Vector3(Math.cos(a) * start * 0.9, y0, Math.sin(a) * start * 0.9),
      new THREE.Vector3(Math.cos(a) * start * 0.98, y0 - 0.14, Math.sin(a) * start * 0.98),
      new THREE.Vector3(Math.cos(a + 0.2) * start * 1.05, y0 - 0.26 - r() * 0.12, Math.sin(a + 0.2) * start * 1.05),
    ];
    const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.008 + r() * 0.006, 5), rootMat);
    island.add(tube);
  }

  // the tree
  const holder = new THREE.Group();
  holder.position.y = 0.045;
  island.add(holder);
  let tree = null;
  const grow = spring(reduced ? 1 : 0.2, { k: 110, d: 11 });
  const gust = spring(0, { k: 30, d: 4 });
  const bend = spring(0, { k: 70, d: 3.4 });
  function setSize(s) {
    const old = tree;
    const oldH = old ? old.userData.height : 0;
    tree = grassTree({ h: s.over ? 1.6 : s.h, heads: s.heads, scale: 2.9 });
    holder.add(tree);
    if (old) { holder.remove(old); disposeTree(old); if (!reduced) { grow.x = oldH / tree.userData.height; gust.v += 4; } }
    grow.to = 1;
  }

  // drifting motes
  const N = 70, motes = new Float32Array(N * 3), seeds = [];
  for (let i = 0; i < N; i++) {
    seeds.push({ a: r() * Math.PI * 2, d: 0.6 + r() * 1.6, y: r() * 3 - 0.8, s: 0.05 + r() * 0.12 });
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motes, 3));
  const moteMat = new THREE.PointsMaterial({ map: moteTexture(), size: 0.07, transparent: true, depthWrite: false, opacity: 0.9 });
  const points = new THREE.Points(moteGeo, moteMat);
  if (!reduced) world.add(points);

  /* camera fit */
  let W = 1, H = 1;
  function fit() {
    const m = mobile();
    camera.aspect = W / H;
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const objH = 2.9, objW = 2.4;
    const dist = Math.max(objH / ((m ? 0.9 : 0.8) * 2 * tan), objW / ((m ? 0.86 : 0.46) * camera.aspect * 2 * tan));
    camera.position.set(0, 0.75, dist);
    camera.lookAt(0, 0.35, 0);
    if (!m) camera.setViewOffset(W, H, -W * 0.05, H * 0.03, W, H); else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  function resize() {
    const b = canvas.getBoundingClientRect();
    W = Math.max(1, b.width); H = Math.max(1, b.height);
    renderer.setSize(W, H, false);
    fit();
    wake();
  }

  /* pointer: drag to turn, tap to rustle */
  let turn = 0, vel = 0, drag = null, tiltX = 0, tiltY = 0, scrollTurn = 0;
  const tilt = { x: spring(0, { k: 40, d: 9 }), y: spring(0, { k: 40, d: 9 }) };
  canvas.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    drag = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
    vel = 0;
    canvas.setPointerCapture(e.pointerId);
    wake();
  });
  canvas.addEventListener('pointermove', (e) => {
    const b = canvas.getBoundingClientRect();
    tilt.x.to = ((e.clientY - b.top) / b.height - 0.5) * 0.08;
    tilt.y.to = ((e.clientX - b.left) / b.width - 0.5) * 0.1;
    if (drag) {
      const dx = e.clientX - drag.x, now = performance.now(), dt = Math.max(8, now - drag.t);
      drag.moved += Math.abs(dx) + Math.abs(e.clientY - drag.y);
      turn += dx * 0.008;
      vel = (dx * 0.008) / (dt / 1000);
      bend.to = Math.max(-0.08, Math.min(0.08, dx * 0.004));
      drag.x = e.clientX; drag.y = e.clientY; drag.t = now;
    }
    wake();
  });
  const end = (e) => {
    if (!drag) return;
    if (drag.moved < 6) { gust.v += 8; grow.v -= 1.6; }
    bend.to = 0;
    drag = null;
    try { canvas.releasePointerCapture(e.pointerId); } catch { /* released */ }
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('pointerleave', () => { tilt.x.to = 0; tilt.y.to = 0; });

  /* loop */
  let running = false, active = true, last = 0, nextGust = 2;
  const t0 = performance.now();
  function frame(now) {
    const dt = Math.min(0.064, Math.max(0, (now - last) / 1000));
    last = Math.max(last, now);
    const t = (now - t0) / 1000;
    if (!drag && !reduced) { turn += vel * dt + dt * 0.12; vel *= Math.exp(-2.4 * dt); }
    tilt.x.step(dt); tilt.y.step(dt);
    world.rotation.y = turn + scrollTurn;
    world.rotation.x = tilt.x.x;
    world.rotation.z = -tilt.y.x * 0.5;
    world.position.y = reduced ? 0 : Math.sin(t * 0.9) * 0.04;

    grow.step(dt);
    if (tree) {
      const u = tree.userData.uniforms;
      u.uTime.value = t;
      u.uWind.value = reduced ? 0 : 1;
      if (!reduced && t > nextGust) { gust.v += 2 + Math.random() * 3; nextGust = t + 3 + Math.random() * 5; }
      u.uGust.value = gust.step(dt);
      u.uBend.value.set(bend.step(dt), 0);
      const g = Math.max(0.001, grow.x);
      tree.scale.set(1 + (1 - g) * 0.12, g, 1 + (1 - g) * 0.12);
    }
    if (!reduced) {
      for (let i = 0; i < N; i++) {
        const s = seeds[i];
        const y = ((s.y + t * s.s) % 3.2) - 0.8;
        const a = s.a + t * 0.05;
        motes[i * 3] = Math.cos(a) * s.d;
        motes[i * 3 + 1] = y;
        motes[i * 3 + 2] = Math.sin(a) * s.d;
      }
      moteGeo.attributes.position.needsUpdate = true;
    }
    renderer.render(scene, camera);
    if (active && (!reduced || drag)) requestAnimationFrame(frame); else running = false;
  }
  function wake() {
    if (running || !active) return;
    running = true;
    requestAnimationFrame((tt) => { last = tt; frame(tt); });
  }

  setSize(size);
  resize();
  new ResizeObserver(resize).observe(canvas);

  return {
    setSize(s) { setSize(s); wake(); },
    setScroll(p) { scrollTurn = p * 1.4; wake(); },
    setActive(on) { active = on; if (on) wake(); },
    rustle() { gust.v += 6; wake(); },
  };
}
