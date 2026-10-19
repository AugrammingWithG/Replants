// The hero: an open pop-up book. The right page stands up a paper bush with a
// grass tree in a bulldozer's way; scrolling plays the rescue and turns the page.
import * as THREE from 'three';
import {
  C, paperMat, card, hinge, setHinge, archShape, bumpsShape, cloudShape, discShape, starShape,
  polyShape, roundRect, rectShape, grassTree, disposeTree, spring, fibre,
} from './paper.js';

const deg = THREE.MathUtils.degToRad;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => x * x * (3 - 2 * x);
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeIn = (x) => x * x * x;
const ph = (s, a, b) => clamp01((s - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;

const PW = 1.0;   // page width
const PD = 1.38;  // page depth
const TREE_AT = new THREE.Vector3(0.5, 0, -0.02);

const SKY_STOPS = [
  [0.0, '#1f2f6b'], [0.1, '#f6b48f'], [0.24, '#9cccf5'], [0.76, '#9cccf5'], [0.9, '#f08a6b'], [1.0, '#1f2f6b'],
];
function skyAt(t) {
  for (let i = 1; i < SKY_STOPS.length; i++) {
    if (t <= SKY_STOPS[i][0]) {
      const [a, ca] = SKY_STOPS[i - 1], [b, cb] = SKY_STOPS[i];
      return new THREE.Color(ca).lerp(new THREE.Color(cb), (t - a) / (b - a));
    }
  }
  return new THREE.Color(SKY_STOPS.at(-1)[1]);
}

export function createBook(canvas, { size, reduced = false, perthHour = 12, onLayout = () => {}, onHint = () => {} }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 40);

  const hemi = new THREE.HemisphereLight('#ffffff', '#ddd8cf', 1.6);
  scene.add(hemi);
  const sunLight = new THREE.DirectionalLight('#fff4e2', 2.5);
  sunLight.position.set(-1.4, 3.4, 2.2);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  Object.assign(sunLight.shadow.camera, { left: -1.8, right: 1.8, top: 1.6, bottom: -1.6, near: 0.5, far: 9 });
  sunLight.shadow.bias = -0.0004;
  sunLight.shadow.normalBias = 0.012;
  scene.add(sunLight);

  // the table only shows the book's shadow; the cobalt is the page behind the canvas
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.ShadowMaterial({ color: '#0a1d57', opacity: 0.32 }));
  catcher.rotation.x = -Math.PI / 2;
  catcher.position.y = -0.076;
  catcher.receiveShadow = true;
  scene.add(catcher);

  /* ---------- the book ---------- */

  const book = new THREE.Group();
  scene.add(book);

  const board = new THREE.Mesh(new THREE.BoxGeometry(2 * PW + 0.12, 0.024, PD + 0.08), paperMat(C.earth, { repeat: 3 }));
  board.position.y = -0.062;
  board.castShadow = board.receiveShadow = true;
  book.add(board);

  const edgeTex = (() => {
    const c = document.createElement('canvas');
    c.width = 8; c.height = 64;
    const g = c.getContext('2d');
    for (let y = 0; y < 64; y++) { const v = y % 3 ? 244 : 214; g.fillStyle = `rgb(${v},${v - 4},${v - 12})`; g.fillRect(0, y, 8, 1); }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const edgeMat = new THREE.MeshStandardMaterial({ map: edgeTex, roughness: 1 });
  for (const sx of [-1, 1]) {
    const block = new THREE.Mesh(new THREE.BoxGeometry(PW - 0.01, 0.046, PD), [edgeMat, edgeMat, paperMat(C.core), edgeMat, edgeMat, edgeMat]);
    block.position.set(sx * (PW / 2 + 0.004), -0.027, 0);
    block.castShadow = block.receiveShadow = true;
    book.add(block);
  }

  const gutterY = (u) => -0.03 * Math.exp(-u * 9);
  function sheetGeometry(side) {
    const g = new THREE.PlaneGeometry(PW, PD, 40, 1);
    g.rotateX(-Math.PI / 2);
    g.translate((side * PW) / 2, 0, 0);
    const p = g.attributes.position, col = [];
    for (let i = 0; i < p.count; i++) {
      const u = Math.abs(p.getX(i));
      p.setY(i, gutterY(u));
      const shade = 0.8 + 0.2 * clamp01(u / 0.14);
      col.push(shade, shade, shade);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.userData.rest = Float32Array.from(p.array);
    g.computeVertexNormals();
    return g;
  }
  const pageMat = (color, side = THREE.FrontSide) => {
    const map = fibre().clone();
    map.needsUpdate = true;
    map.repeat.set(2.4, 2.4);
    // a touch of self-light keeps the reading page white under any sky
    return new THREE.MeshStandardMaterial({ color, map, vertexColors: true, roughness: 0.96, side, emissive: new THREE.Color(color).multiplyScalar(0.2) });
  };

  const leftSheet = new THREE.Mesh(sheetGeometry(-1), pageMat(C.paper));
  leftSheet.receiveShadow = true;
  book.add(leftSheet);

  // what the turn reveals: the next spread, in the next chapter's sky blue
  const under = new THREE.Mesh(sheetGeometry(1), pageMat(C.sky));
  under.position.y = -0.0015;
  under.receiveShadow = true;
  book.add(under);

  const leafGeo = sheetGeometry(1);
  const leafFront = new THREE.Mesh(leafGeo, pageMat(C.paper));
  const leafBack = new THREE.Mesh(leafGeo, pageMat(C.sky, THREE.BackSide));
  leafFront.receiveShadow = leafBack.receiveShadow = true;
  leafFront.castShadow = true;
  book.add(leafFront, leafBack);

  /* ---------- the pop-up ---------- */

  const pop = new THREE.Group();
  book.add(pop);
  const hinges = [];
  const stand = (child, angle, x, z, delay) => {
    const h = hinge(child, angle);
    h.position.set(x, 0.001, z);
    h.userData.delay = delay;
    h.userData.spring = spring(reduced ? 1 : 0, { k: 90, d: 9 });
    setHinge(h, h.userData.spring.x);
    pop.add(h);
    hinges.push(h);
    return h;
  };

  // sky arch with its own material so the colour can follow the time of day
  const archMesh = card(archShape(0.94, 0.68), C.sky);
  const skyMat = paperMat(C.sky).clone();
  archMesh.material = [skyMat, paperMat(C.core)];
  stand(archMesh, deg(80), 0.5, -0.56, 0);

  const ARC = { cx: 0, cy: 0.22, r: 0.27 };
  const sunMat = paperMat('#ffe7a3').clone();
  const sun = card(discShape(0.07), '#ffe7a3', { depth: 0.006 });
  sun.material = [sunMat, paperMat(C.core)];
  sun.position.z = 0.01;
  archMesh.add(sun);
  // a crescent is a second disc of sky laid over the moon
  const biteMat = skyMat.clone();
  const bite = new THREE.Mesh(new THREE.CircleGeometry(0.062, 32), biteMat);
  bite.position.set(0.035, 0.022, 0.0045);
  sun.add(bite);
  const stars = [];
  [[-0.33, 0.46], [-0.2, 0.58], [0.04, 0.62], [0.24, 0.54], [0.36, 0.42], [-0.08, 0.5], [0.15, 0.44]].forEach(([x, y], i) => {
    const s = card(starShape(0.022 + (i % 3) * 0.006), '#fff4cf', { depth: 0.004 });
    s.position.set(x, y, 0.006);
    s.rotation.z = i;
    archMesh.add(s);
    stars.push(s);
  });
  const clouds = [[-0.22, 0.4, 0.19], [0.25, 0.3, 0.15]].map(([x, y, w], i) => {
    const c = card(cloudShape(w, w * 0.55), C.paper, { depth: 0.006 });
    c.position.set(x, y, 0.016 + i * 0.004);
    c.userData = { x0: x, phase: i * 2.1, squash: spring(1, { k: 160, d: 8 }) };
    archMesh.add(c);
    return c;
  });

  stand(card(bumpsShape(0.98, 0.33, { bumps: 9, seed: 4, amp: 0.4, round: 0.7 }), C.gumDeep), deg(76), 0.5, -0.46, 110);
  stand(card(bumpsShape(0.98, 0.24, { bumps: 12, seed: 21, amp: 0.45, round: 0.55 }), C.gum), deg(72), 0.5, -0.35, 200);
  stand(card(bumpsShape(1.0, 0.16, { bumps: 4, seed: 9, amp: 0.25, round: 1.6 }), C.earth), deg(66), 0.5, -0.2, 290);
  // a pair of banksias on the dune
  [[0.2, -0.205], [0.86, -0.21]].forEach(([x, z], i) => {
    const g = new THREE.Group();
    const stem = card(rectShape(0.008, 0.08), C.gumDeep, { depth: 0.004 });
    const cone = card(roundRect(0.032, 0.07, 0.016, -0.016, 0.07), C.ochre, { depth: 0.008 });
    g.add(stem, cone);
    stand(g, deg(70), x, z + 0.012, 340 + i * 40);
  });

  // the sand the tree stands in, and the hole it leaves
  const mound = new THREE.Mesh(new THREE.CircleGeometry(0.16, 40), paperMat(C.sand));
  mound.rotation.x = -Math.PI / 2;
  mound.scale.set(1.2, 0.8, 1);
  mound.position.set(TREE_AT.x, 0.0015, TREE_AT.z + 0.01);
  mound.receiveShadow = true;
  pop.add(mound);
  const holeMat = paperMat('#4a2c19').clone();
  holeMat.transparent = true;
  holeMat.opacity = 0;
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.075, 32), holeMat);
  hole.rotation.x = -Math.PI / 2;
  hole.scale.set(1.25, 0.85, 1);
  hole.position.set(TREE_AT.x, 0.0025, TREE_AT.z + 0.01);
  pop.add(hole);

  // tufts along the front edge
  [[0.1, 0.44, 0.2, 3], [0.42, 0.5, 0.16, 8], [0.78, 0.45, 0.22, 14]].forEach(([x, z, w, seed], i) => {
    stand(card(bumpsShape(w, 0.075, { bumps: 7, seed, pointy: true, amp: 0.5 }), i % 2 ? C.crownDeep : C.crown), deg(58), x, z, 520 + i * 60);
  });

  /* ---------- bulldozer ---------- */

  const dozer = new THREE.Group();
  const add = (parent, mesh, x = 0, y = 0, z = 0) => { mesh.position.set(x, y, z); parent.add(mesh); return mesh; };
  add(dozer, card(roundRect(0.27, 0.056, 0.028, -0.14, 0), C.ink, { depth: 0.008 }));
  [-0.11, -0.055, 0, 0.055, 0.1].forEach((x) => add(dozer, card(discShape(0.016), '#5a544b', { depth: 0.004 }), x, 0.028, 0.006));
  add(dozer, card(polyShape([[-0.13, 0.05], [0.1, 0.05], [0.1, 0.115], [0.03, 0.125], [-0.13, 0.125]]), C.ochre), 0, 0, 0.003);
  add(dozer, card(polyShape([[-0.12, 0.12], [-0.03, 0.12], [-0.03, 0.215], [-0.12, 0.215]]), C.ochre), 0, 0, 0.002);
  add(dozer, card(polyShape([[-0.108, 0.135], [-0.045, 0.135], [-0.045, 0.2], [-0.108, 0.2]]), C.sky, { depth: 0.004 }), 0, 0, 0.007);
  const stack = add(dozer, card(rectShape(0.014, 0.07, 0.04, 0.115), C.ink, { depth: 0.005 }), 0, 0, 0.001);
  add(dozer, card(polyShape([[0.1, 0.07], [0.15, 0.06], [0.15, 0.08], [0.1, 0.09]]), '#4a443b', { depth: 0.006 }), 0, 0, 0.004);
  add(dozer, card(polyShape([[0.145, -0.004], [0.175, -0.004], [0.19, 0.04], [0.18, 0.13], [0.15, 0.135], [0.158, 0.06]]), '#3a352e', { depth: 0.008 }), 0, 0, 0.004);
  const dozerH = stand(dozer, deg(74), 0.17, 0.1, 420);
  const dozerShake = spring(0, { k: 260, d: 7 });
  const puffs = [];

  // the white core of the card shows round every cut piece, as it does on the hills
  function rim(group, t = 0.0055) {
    [...group.children].forEach((m) => {
      if (!m.isMesh || !m.geometry.parameters?.shapes) return;
      m.geometry.computeBoundingBox();
      const b = m.geometry.boundingBox, w = b.max.x - b.min.x, h = b.max.y - b.min.y;
      const cx = (b.max.x + b.min.x) / 2, cy = (b.max.y + b.min.y) / 2;
      const sx = 1 + (2 * t) / w, sy = 1 + (2 * t) / h;
      const back = new THREE.Mesh(m.geometry, paperMat(C.core));
      back.scale.set(sx, sy, 1);
      back.position.set(m.position.x + cx * (1 - sx), m.position.y + cy * (1 - sy), m.position.z - 0.0035);
      back.castShadow = true;
      group.add(back);
    });
  }

  /* ---------- crane truck ---------- */

  const truck = new THREE.Group();
  add(truck, card(rectShape(0.3, 0.045, -0.2, 0.055), C.ink));
  add(truck, card(polyShape([[0.1, 0.05], [0.18, 0.05], [0.215, 0.1], [0.215, 0.165], [0.1, 0.165]]), C.table), 0, 0, 0.003);
  add(truck, card(polyShape([[0.155, 0.11], [0.2, 0.11], [0.2, 0.155], [0.155, 0.155]]), C.sky, { depth: 0.004 }), 0, 0, 0.007);
  add(truck, card(rectShape(0.21, 0.02, -0.195, 0.1), '#f2ece0', { depth: 0.006 }), 0, 0, 0.004);
  const wheels = [-0.14, -0.07, 0.15].map((x) => {
    const w = add(truck, card(discShape(0.034), C.ink, { depth: 0.008 }), x, 0.034, 0.005);
    add(w, card(roundRect(0.022, 0.022, 0.006, -0.011, -0.011), '#8a8478', { depth: 0.004 }), 0, 0, 0.005);
    return w;
  });
  add(truck, card(roundRect(0.05, 0.05, 0.01, -0.025, 0), C.earthDeep, { depth: 0.008 }), 0.06, 0.1, 0.002);
  const boom = new THREE.Group();
  boom.position.set(0.06, 0.135, 0.008);
  truck.add(boom);
  add(boom, card(roundRect(0.36, 0.026, 0.012, -0.012, -0.013), C.earth, { depth: 0.008 }));
  const boomTip = new THREE.Object3D();
  boomTip.position.set(0.335, 0, 0.01);
  boom.add(boomTip);
  rim(dozer);
  rim(truck);
  rim(boom);
  const truckH = stand(truck, deg(76), 1.5, 0.13, 0);
  truckH.visible = false;

  const cableGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const cable = new THREE.Line(cableGeo, new THREE.LineBasicMaterial({ color: C.ink }));
  cable.visible = false;
  scene.add(cable);

  /* ---------- the tree ---------- */

  const holder = new THREE.Group();
  holder.position.copy(TREE_AT);
  pop.add(holder);
  const rootBall = new THREE.Mesh(new THREE.IcosahedronGeometry(0.075, 1), paperMat(C.soil));
  rootBall.scale.set(1, 0.72, 1);
  rootBall.position.y = -0.045;
  rootBall.castShadow = true;
  holder.add(rootBall);
  const proxy = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.12, 1, 10), new THREE.MeshBasicMaterial());
  proxy.visible = false;
  holder.add(proxy);

  let tree = null;
  const grow = spring(reduced ? 1 : 0, { k: 120, d: 10 });
  const bendX = spring(0, { k: 70, d: 3.2 }), bendZ = spring(0, { k: 70, d: 3.2 });
  const gust = spring(0, { k: 30, d: 4 });
  let spin = 0, spinVel = 0;

  function setSize(s) {
    const old = tree;
    const oldH = old ? old.userData.height : 0;
    tree = grassTree({ h: s.over ? 1.6 : s.h, heads: s.heads, scale: 1.1 });
    holder.add(tree);
    const h = tree.userData.height;
    proxy.scale.set(1, h, 1);
    proxy.position.y = h / 2;
    if (old) {
      holder.remove(old);
      disposeTree(old);
      if (!reduced) {
        grow.x = oldH / h;
        grow.v = 0;
        gust.v += 5;
        flutter(6);
      }
    }
    // the first tree waits for the pages to stand, then springs up
    grow.to = old || reduced ? 1 : 0;
  }

  /* ---------- paper bits ---------- */

  const bits = [];
  const bitGeo = new THREE.PlaneGeometry(0.012, 0.05);
  function flutter(n) {
    if (reduced || !tree) return;
    const top = tree.localToWorld(new THREE.Vector3(0, tree.userData.height * 0.75, 0));
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(bitGeo, paperMat(i % 3 ? C.crown : C.straw, { side: THREE.DoubleSide }));
      m.position.copy(top).add(new THREE.Vector3((Math.random() - 0.5) * 0.15, Math.random() * 0.05, (Math.random() - 0.5) * 0.1));
      m.userData = { v: new THREE.Vector3((Math.random() - 0.5) * 0.6, 0.4 + Math.random() * 0.5, (Math.random() - 0.3) * 0.4), spin: new THREE.Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8), life: 0 };
      m.castShadow = true;
      scene.add(m);
      bits.push(m);
    }
  }
  function puff() {
    const m = card(discShape(0.02), C.paper, { depth: 0.004 });
    m.position.set(0.047, 0.19, 0.004);
    m.userData.life = 0;
    dozer.add(m);
    puffs.push(m);
  }

  /* ---------- time of day ---------- */

  let dayT = perthHour < 5.5 ? 0.015 : perthHour > 19 ? 0.985 : 0.1 + ((perthHour - 5.5) / 13.5) * 0.8;
  function setDay(t) {
    dayT = clamp01(t);
    const a = Math.PI * dayT;
    sun.position.set(-Math.cos(a) * ARC.r, ARC.cy + Math.sin(a) * ARC.r, 0.01);
    const sky = skyAt(dayT);
    skyMat.color.copy(sky);
    biteMat.color.copy(sky);
    const night = Math.max(clamp01((0.08 - dayT) / 0.06), clamp01((dayT - 0.92) / 0.06));
    const low = Math.max(clamp01((0.24 - dayT) / 0.14), clamp01((dayT - 0.76) / 0.14));
    sunMat.color.set(night > 0.5 ? '#f3efe2' : low > 0.3 ? '#ffb35c' : '#ffe7a3');
    bite.visible = night > 0.5;
    stars.forEach((s, i) => s.scale.setScalar(clamp01(night * 1.4 - i * 0.05)));
    clouds.forEach((c) => (c.visible = night < 0.6));
    // the page light warms at the ends of the day but never dims the reading page much
    sunLight.color.set('#fff4e2').lerp(new THREE.Color(night > 0.5 ? '#d6ddff' : '#ffd29e'), Math.max(low * 0.35, night * 0.3));
    sunLight.intensity = 2.5 - night * 0.5;
  }
  setDay(dayT);

  /* ---------- story ---------- */

  let story = 0;
  const lifted = new THREE.Vector3();
  function applyStory() {
    const s = story;
    // truck backs in, lifts, drives off
    let tx = 1.5;
    if (s < 0.07) tx = 1.5;
    else if (s < 0.3) tx = lerp(1.5, 0.8, easeOut(ph(s, 0.07, 0.3)));
    else if (s < 0.6) tx = 0.8;
    else tx = lerp(0.8, 2.1, easeIn(ph(s, 0.6, 0.76)));
    truckH.position.x = tx;
    truckH.visible = s > 0.05 && s < 0.78;
    const roll = (tx - 1.5) / 0.034;
    wheels.forEach((w) => (w.rotation.z = -roll));

    const raise = ease(ph(s, 0.3, 0.4));
    const swing = ease(ph(s, 0.48, 0.57));
    boom.rotation.z = lerp(Math.PI - 0.08, 2.35, raise) + (1.85 - 2.35) * swing;

    const up = easeOut(ph(s, 0.4, 0.48));
    const trayX = tx - 0.12, trayY = 0.105, trayZ = 0.13 - 0.1 * Math.cos(deg(76));
    lifted.set(
      lerp(TREE_AT.x, trayX, swing),
      lerp(0, 0.34, up) * (1 - swing) + lerp(0.34, trayY, ease(ph(s, 0.53, 0.58))) * swing,
      lerp(TREE_AT.z, trayZ, swing),
    );
    holder.position.copy(lifted);
    holder.rotation.z = Math.sin(swing * Math.PI) * 0.22 + (s > 0.58 ? Math.sin(ph(s, 0.6, 0.76) * Math.PI * 3) * 0.04 : 0);
    rootBall.visible = s > 0.38;

    holeMat.opacity = ease(ph(s, 0.41, 0.47));
    mound.scale.set(1.2 * (1 - 0.3 * up), 0.8 * (1 - 0.3 * up), 1);

    // the bulldozer rolls into the empty spot
    dozerH.position.x = lerp(0.17, 0.4, ease(ph(s, 0.62, 0.76)));

    cable.visible = s > 0.31 && s < 0.6;

    // the page turns
    const phi = ease(ph(s, 0.78, 1)) * Math.PI;
    turnPage(phi);
  }

  function turnPage(phi) {
    const p = leafGeo.attributes.position, rest = leafGeo.userData.rest;
    for (let i = 0; i < p.count; i++) {
      const x0 = rest[i * 3], y0 = rest[i * 3 + 1], z0 = rest[i * 3 + 2];
      const u = x0;
      const a = phi - 0.6 * Math.sin(phi) * u;
      const r = u;
      p.setXYZ(i, Math.cos(a) * r, Math.sin(a) * r + y0 * Math.cos(phi) + 0.002 * Math.sin(phi), z0);
    }
    p.needsUpdate = true;
    leafGeo.computeVertexNormals();
    const fold = clamp01(phi / 0.9);
    pop.rotation.z = phi - 0.3 * Math.sin(phi);
    pop.visible = phi < 1.6;
    hinges.forEach((h) => setHinge(h, h.userData.spring.x * (1 - fold)));
    holder.scale.setScalar(Math.max(0.001, 1 - fold));
    leafBack.visible = phi > 0.01;
  }

  /* ---------- camera fit ---------- */

  let W = 1, H = 1, portrait = false;
  const tmp = new THREE.Vector3();
  function project(v) { tmp.copy(v).project(camera); return tmp; }
  function placeCamera(target, tilt, dist) {
    camera.position.set(target.x, target.y + Math.cos(tilt) * dist, target.z + Math.sin(tilt) * dist);
    camera.lookAt(target);
    camera.updateMatrixWorld();
  }
  function fit() {
    portrait = W / H < 1.15 || W < 900;
    camera.aspect = W / H;
    camera.fov = portrait ? 34 : 26;
    camera.updateProjectionMatrix();
    const tilt = deg(portrait ? 40 : 27);
    const target = new THREE.Vector3(portrait ? 0.52 : 0, 0.05, 0.1);
    const xs = portrait ? [new THREE.Vector3(0.05, 0, 0), new THREE.Vector3(0.95, 0, 0)] : [new THREE.Vector3(-1.08, 0, 0.05), new THREE.Vector3(1.08, 0, 0.05)];
    const archTop = new THREE.Vector3(0.5, Math.sin(deg(80)) * 0.68, -0.56 - Math.cos(deg(80)) * 0.68);
    const wantTop = portrait ? 0.92 : 0.7;
    // on phones the whole pop-up has to fit between the header and the panel
    const near = new THREE.Vector3(0.5, 0, 0.24), wantBottom = -0.9;
    let dist = 4;
    for (let it = 0; it < 4; it++) {
      // width fit by bisection
      let lo = 0.5, hi = 20;
      for (let k = 0; k < 30; k++) {
        dist = (lo + hi) / 2;
        placeCamera(target, tilt, dist);
        const m = Math.max(...xs.map((v) => Math.abs(project(v).x)));
        if (m > 0.97) lo = dist; else hi = dist;
      }
      placeCamera(target, tilt, dist);
      if (portrait) {
        const span = project(archTop).y - project(near).y;
        if (span > wantTop - wantBottom) { dist *= span / (wantTop - wantBottom); placeCamera(target, tilt, dist); }
      }
      // slide the view so the top of the sky arch sits under the header
      const y = project(archTop).y;
      target.z -= (y - wantTop) * dist * 0.35;
    }
    placeCamera(target, tilt, dist);
    // tell the page where the left page lands, for the HTML printed on it
    if (!portrait) {
      const pts = [[-0.95, -0.64], [-0.1, -0.64], [-0.95, 0.66], [-0.1, 0.66]].map(([x, z]) => {
        const v = project(new THREE.Vector3(x, 0, z));
        return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
      });
      const g = project(new THREE.Vector3(0.03, 0, -0.62));
      onLayout({
        pop: (g.x * 0.5 + 0.5) * W,
        left: Math.max(pts[0].x, pts[2].x), right: Math.min(pts[1].x, pts[3].x),
        top: Math.min(pts[0].y, pts[1].y), bottom: Math.max(pts[2].y, pts[3].y),
      });
    } else onLayout(null);
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false);
    fit();
    wake();
  }

  /* ---------- pointer ---------- */

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const hover = matchMedia('(hover: hover)').matches;
  let drag = null, brushOn = 0;
  const setNdc = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  };
  const hit = (obj) => ray.intersectObject(obj, true)[0];
  const interactive = () => story < 0.06;

  function brushAt() {
    if (!tree) return;
    const top = tree.localToWorld(new THREE.Vector3(0, tree.userData.height * 0.7, 0));
    const n = camera.getWorldDirection(new THREE.Vector3()).negate();
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(n, top);
    const p = ray.ray.intersectPlane(plane, new THREE.Vector3());
    if (!p) return;
    const local = tree.worldToLocal(p.clone());
    tree.userData.uniforms.uBrush.value.copy(local);
    brushOn = p.distanceTo(top) < 0.3 ? 1 : 0;
  }

  canvas.addEventListener('pointermove', (e) => {
    setNdc(e);
    if (drag?.kind === 'tree') {
      const dx = e.clientX - drag.x;
      drag.moved += Math.abs(dx) + Math.abs(e.clientY - drag.y);
      const now = performance.now(), dt = Math.max(8, now - drag.t);
      spin += dx * 0.012;
      spinVel = (dx * 0.012) / (dt / 1000);
      bendX.to = THREE.MathUtils.clamp(dx * 0.004, -0.06, 0.06);
      drag.x = e.clientX; drag.y = e.clientY; drag.t = now;
      wake();
      return;
    }
    if (drag?.kind === 'sun') {
      const p = hit(archMesh);
      if (p) {
        const local = archMesh.worldToLocal(p.point.clone());
        const ang = Math.atan2(local.y - ARC.cy, local.x - ARC.cx);
        setDay(1 - clamp01(ang < -Math.PI / 2 ? 1 : ang / Math.PI));
      }
      wake();
      return;
    }
    if (!interactive()) { canvas.style.cursor = ''; return; }
    if (hover) brushAt();
    const over = hit(sun) ? 'grab' : hit(proxy) ? 'grab' : hit(dozer) || clouds.some((c) => hit(c)) ? 'pointer' : '';
    canvas.style.cursor = over;
    wake();
  });
  canvas.addEventListener('pointerleave', () => { brushOn = 0; });

  canvas.addEventListener('pointerdown', (e) => {
    if (!interactive()) return;
    setNdc(e);
    if (hit(sun)) {
      drag = { kind: 'sun' };
    } else if (hit(proxy)) {
      drag = { kind: 'tree', x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
      spinVel = 0;
    } else if (hit(dozer)) {
      dozerShake.v += 9;
      for (let i = 0; i < 3; i++) setTimeout(puff, i * 140);
      onHint('dozer');
    } else {
      const c = clouds.find((cl) => hit(cl));
      if (c) { c.userData.squash.v -= 6; c.userData.phase += 1.2; }
      return;
    }
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
    wake();
  });
  const endDrag = (e) => {
    if (!drag) return;
    if (drag.kind === 'tree') {
      bendX.to = 0;
      if (drag.moved < 6) {
        // a tap: rustle, squash, and shake some leaves loose
        gust.v += 9;
        grow.v -= 2.2;
        bendZ.v += 0.5;
        flutter(10);
        onHint('tap');
      } else onHint('turn');
    } else if (drag.kind === 'sun') onHint('sun');
    drag = null;
    canvas.style.cursor = '';
    try { canvas.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    wake();
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  /* ---------- loop ---------- */

  let running = false, active = true, last = 0, t0 = performance.now(), nextGust = 3;
  const tipWorld = new THREE.Vector3(), topWorld = new THREE.Vector3();

  function frame(now) {
    const dt = Math.min(0.064, Math.max(0, (now - last) / 1000));
    last = Math.max(last, now);
    const t = (now - t0) / 1000;

    // pop-up layers stand up one after another on load
    for (const h of hinges) {
      const sp = h.userData.spring;
      if (t * 1000 > h.userData.delay + 250) sp.to = 1;
      sp.step(dt);
    }
    grow.step(dt);
    if (tree && t > 0.6) grow.to = 1;

    if (tree) {
      const u = tree.userData.uniforms;
      u.uTime.value = t;
      if (!reduced) {
        if (t > nextGust) { gust.v += 2 + Math.random() * 3; nextGust = t + 4 + Math.random() * 5; }
        u.uWind.value = 1;
      } else u.uWind.value = 0;
      u.uGust.value = gust.step(dt);
      u.uBend.value.set(bendX.step(dt), bendZ.step(dt));
      u.uBrushOn.value += (brushOn - u.uBrushOn.value) * Math.min(1, dt * 8);
      if (!drag) { spin += spinVel * dt; spinVel *= Math.exp(-2.6 * dt); }
      tree.rotation.y = spin;
      const g = Math.max(0.001, grow.x);
      tree.scale.set(1 + (1 - g) * 0.15, g, 1 + (1 - g) * 0.15);
    }

    dozerShake.step(dt);
    dozer.rotation.z = dozerShake.x * 0.02 + (reduced ? 0 : Math.sin(t * 40) * 0.0025);
    for (let i = puffs.length - 1; i >= 0; i--) {
      const p = puffs[i];
      p.userData.life += dt;
      const l = p.userData.life;
      p.position.y = 0.19 + l * 0.18;
      p.position.x = 0.047 - l * 0.05;
      p.scale.setScalar(1 + l * 2.4);
      if (l > 1.1) { dozer.remove(p); p.geometry.dispose(); puffs.splice(i, 1); }
    }

    clouds.forEach((c) => {
      c.userData.squash.step(dt);
      c.position.x = c.userData.x0 + (reduced ? 0 : Math.sin(t * 0.25 + c.userData.phase) * 0.06);
      c.scale.set(1 + (1 - c.userData.squash.x) * 0.5, c.userData.squash.x, 1);
    });

    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i], d = b.userData;
      d.life += dt;
      d.v.y -= 0.9 * dt;
      d.v.multiplyScalar(Math.exp(-1.5 * dt));
      b.position.addScaledVector(d.v, dt);
      b.rotation.x += d.spin.x * dt; b.rotation.y += d.spin.y * dt; b.rotation.z += d.spin.z * dt;
      if (b.position.y < 0.004) { b.position.y = 0.004; d.v.set(0, 0, 0); d.spin.multiplyScalar(0.9); }
      if (d.life > 3) { scene.remove(b); bits.splice(i, 1); }
    }

    applyStory();

    if (cable.visible && tree) {
      boomTip.getWorldPosition(tipWorld);
      tree.localToWorld(topWorld.set(0, tree.userData.height * 0.82, 0));
      const pos = cableGeo.attributes.position;
      const reach = clamp01((story - 0.31) / 0.06);
      pos.setXYZ(0, tipWorld.x, tipWorld.y, tipWorld.z);
      pos.setXYZ(1, lerp(tipWorld.x, topWorld.x, reach), lerp(tipWorld.y, topWorld.y, reach), lerp(tipWorld.z, topWorld.z, reach));
      pos.needsUpdate = true;
    }

    renderer.render(scene, camera);

    const settling = hinges.some((h) => Math.abs(h.userData.spring.v) > 0.001 || Math.abs(h.userData.spring.x - 1) > 0.001)
      || bits.length || puffs.length || drag || Math.abs(spinVel) > 0.01;
    if (active && (!reduced || settling)) requestAnimationFrame(frame);
    else running = false;
  }
  function wake() {
    if (running || !active) return;
    running = true;
    requestAnimationFrame((t) => { last = t; frame(t); });
  }

  setSize(size);
  resize();
  new ResizeObserver(resize).observe(canvas);

  return {
    setSize(s) { setSize(s); wake(); },
    setStory(s) { story = clamp01(s); wake(); },
    setActive(on) { active = on; if (on) wake(); },
    resize,
    grab() { gust.v += 6; flutter(8); wake(); },
  };
}
