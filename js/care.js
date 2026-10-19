// The care wheel's window: a paper grass tree planted in mulch, browning and
// recovering as the months turn.
import * as THREE from 'three';
import { C, paperMat, grassTree, paintAge, spring } from './paper.js';

export function createCare(canvas, { reduced = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 20);
  camera.position.set(0, 0.95, 2.5);
  camera.lookAt(0, 0.28, 0);

  scene.add(new THREE.HemisphereLight('#ffffff', '#c9d3f0', 1.6));
  const sun = new THREE.DirectionalLight('#fff4e2', 2.4);
  sun.position.set(-1.2, 2.6, 1.8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -0.8, right: 0.8, top: 0.8, bottom: -0.8, near: 0.5, far: 6 });
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  // a mulch bed with a moat ring, cut from card
  const bed = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.05, 48), paperMat('#8a5a34', { repeat: 3 }));
  bed.position.y = -0.025;
  bed.receiveShadow = true;
  scene.add(bed);
  const moat = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.018, 8, 40), paperMat('#5c3a20'));
  moat.rotation.x = -Math.PI / 2;
  moat.position.y = 0.004;
  moat.receiveShadow = true;
  scene.add(moat);
  const sand = new THREE.Mesh(new THREE.CircleGeometry(0.18, 40), paperMat(C.sand));
  sand.rotation.x = -Math.PI / 2;
  sand.position.y = 0.003;
  sand.receiveShadow = true;
  scene.add(sand);
  // a dripper line into the moat, never on the leaves
  const drip = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 8), paperMat(C.ink));
  drip.rotation.z = Math.PI / 2;
  drip.rotation.y = 0.5;
  drip.position.set(0.32, 0.01, 0.14);
  scene.add(drip);

  const tree = grassTree({ h: 0.4, heads: 1, seed: 9, scale: 1.05 });
  scene.add(tree);
  const pop = spring(1, { k: 160, d: 10 });
  let months = 0, last = 0, t0 = performance.now(), running = false, active = true, stage = 0;

  function resize() {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
    camera.aspect = r.width / Math.max(1, r.height);
    camera.updateProjectionMatrix();
    wake();
  }

  function frame(now) {
    const dt = Math.min(0.064, Math.max(0, (now - last) / 1000));
    last = Math.max(last, now);
    const t = (now - t0) / 1000;
    const u = tree.userData.uniforms;
    u.uTime.value = t;
    u.uWind.value = reduced ? 0 : 0.8;
    pop.step(dt);
    tree.scale.set(1, pop.x, 1);
    if (!reduced) tree.rotation.y = t * 0.15;
    renderer.render(scene, camera);
    if (active && !reduced) requestAnimationFrame(frame);
    else running = false;
  }
  function wake() {
    if (running || !active) return;
    running = true;
    requestAnimationFrame((t) => { last = t; frame(t); });
  }

  resize();
  new ResizeObserver(resize).observe(canvas);
  paintAge(tree, 0);

  return {
    setMonths(m) {
      months = m;
      paintAge(tree, months);
      const s = m < 6 ? 0 : m < 12 ? 1 : m < 24 ? 2 : 3;
      // a little hop each time it reaches a new stage
      if (s !== stage && !reduced) pop.v += 2.2;
      stage = s;
      if (reduced) renderer.render(scene, camera);
      wake();
    },
    setActive(on) { active = on; if (on) wake(); },
  };
}
