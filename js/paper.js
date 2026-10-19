// Paper kit: gouache card, die-cut shapes with a white core at the cut edge,
// and a grass tree made of cut paper strips that bend in the wind.
import * as THREE from 'three';

export const C = {
  table: '#2c5fd0', sky: '#9cccf5', earth: '#c4461f', earthDeep: '#9e3516',
  gum: '#3d7a55', gumDeep: '#2b5a3e', crown: '#8fbf3a', crownDeep: '#5f8f22',
  ochre: '#e8892b', ink: '#1d1a16', paper: '#fdfcf9', core: '#f4efe4',
  straw: '#c99a52', strawPale: '#e0bf7f', sand: '#efcf98', soil: '#7a4a2a',
};

const rand = (a, b) => a + Math.random() * (b - a);
export function seeded(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)) >>> 0) / 4294967296;
}

/* ---------- textures ---------- */

let fibreTex = null;
export function fibre() {
  if (fibreTex) return fibreTex;
  const s = 256, c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  g.fillStyle = '#f4f4f4';
  g.fillRect(0, 0, s, s);
  const r = seeded(7);
  // gouache mottling, drawn wrapped so the tile repeats cleanly
  for (let i = 0; i < 70; i++) {
    const x = r() * s, y = r() * s, rad = 8 + r() * 46, v = (222 + r() * 33) | 0;
    g.fillStyle = `rgba(${v},${v},${v},0.22)`;
    for (const dx of [-s, 0, s]) for (const dy of [-s, 0, s]) { g.beginPath(); g.arc(x + dx, y + dy, rad, 0, 7); g.fill(); }
  }
  // fibres
  for (let i = 0; i < 520; i++) {
    const x = r() * s, y = r() * s, a = r() * Math.PI, l = 3 + r() * 9;
    g.strokeStyle = r() < 0.5 ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.06)';
    g.lineWidth = 0.6;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  const img = g.getImageData(0, 0, s, s), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * 10; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
  fibreTex = new THREE.CanvasTexture(c);
  fibreTex.wrapS = fibreTex.wrapT = THREE.RepeatWrapping;
  fibreTex.colorSpace = THREE.SRGBColorSpace;
  fibreTex.anisotropy = 4;
  return fibreTex;
}

let barkTex = null;
export function barkTexture() {
  if (barkTex) return barkTex;
  const w = 128, h = 256, c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = '#211c17';
  g.fillRect(0, 0, w, h);
  const r = seeded(11);
  // the stubs of old leaf bases, cut as little paper chevrons
  for (let y = 4; y < h; y += 9) {
    for (let x = (y / 9) % 2 ? 0 : 8; x < w; x += 16) {
      const v = (40 + r() * 30) | 0;
      g.fillStyle = `rgb(${v},${(v * 0.88) | 0},${(v * 0.72) | 0})`;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + 8, y + 5); g.lineTo(x + 16, y); g.lineTo(x + 8, y + 3); g.fill();
    }
  }
  barkTex = new THREE.CanvasTexture(c);
  barkTex.wrapS = barkTex.wrapT = THREE.RepeatWrapping;
  barkTex.colorSpace = THREE.SRGBColorSpace;
  return barkTex;
}

export function disposeTree(tree) {
  tree.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.dispose();
    (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (!matCacheHas(m)) m.dispose(); });
    o.customDepthMaterial?.dispose();
  });
}
const matCacheHas = (m) => [...matCache.values()].includes(m);

/* ---------- materials ---------- */

const matCache = new Map();
export function paperMat(color, { repeat = 2.2, side = THREE.FrontSide } = {}) {
  const key = color + repeat + side;
  if (matCache.has(key)) return matCache.get(key);
  const map = fibre().clone();
  map.needsUpdate = true;
  map.repeat.set(repeat, repeat);
  const m = new THREE.MeshStandardMaterial({ color, map, roughness: 0.92, metalness: 0, side });
  matCache.set(key, m);
  return m;
}

/* ---------- die-cut cards ---------- */

// A card is a shape extruded to card thickness. Faces take the colour; the
// cut edge shows the white core, like real coloured card.
export function card(shape, color, { depth = 0.007, edge = C.core, back } = {}) {
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 20 });
  geo.translate(0, 0, -depth / 2);
  const mats = [paperMat(color), paperMat(edge)];
  const mesh = new THREE.Mesh(geo, mats);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (back) {
    // a different colour on the back face
    const b = new THREE.Mesh(new THREE.ShapeGeometry(shape, 20), paperMat(back, { side: THREE.BackSide }));
    b.position.z = -depth / 2 - 0.0005;
    mesh.add(b);
  }
  return mesh;
}

// A layer that stands up off the page on a hinge along its bottom edge.
// open 0 = folded flat on the page, 1 = standing at `angle` radians.
export function hinge(child, angle) {
  const g = new THREE.Group();
  g.add(child);
  g.userData.angle = angle;
  g.userData.open = 0;
  g.userData.vel = 0;
  g.userData.target = 1;
  g.userData.lean = 0;
  return g;
}
export function setHinge(g, open) {
  g.userData.open = open;
  const a = g.userData.angle * Math.max(0, open) + (g.userData.lean || 0);
  g.rotation.x = -(Math.PI / 2) + a;
}

/* ---------- shapes ---------- */

export function rectShape(w, h, x = -w / 2, y = 0) {
  const s = new THREE.Shape();
  s.moveTo(x, y); s.lineTo(x + w, y); s.lineTo(x + w, y + h); s.lineTo(x, y + h); s.closePath();
  return s;
}

export function roundRect(w, h, r, x = -w / 2, y = 0) {
  const s = new THREE.Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export function archShape(w, h) {
  const s = new THREE.Shape();
  const ry = Math.min(h * 0.55, w * 0.5);
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h - ry);
  s.absellipse(0, h - ry, w / 2, ry, 0, Math.PI, false);
  s.lineTo(-w / 2, 0);
  return s;
}

export function discShape(r) {
  const s = new THREE.Shape();
  s.absarc(0, 0, r, 0, Math.PI * 2, false);
  return s;
}

// A skyline of rounded bumps: gum canopy, dunes, tufts.
export function bumpsShape(w, h, { bumps = 9, amp = 0.35, seed = 1, round = 0.6, pointy = false } = {}) {
  const r = seeded(seed);
  const peaks = [];
  for (let i = 0; i < bumps; i++) {
    peaks.push({ c: (i + 0.5 + (r() - 0.5) * 0.6) / bumps, rad: (0.5 + r() * 0.7) / bumps, a: 1 - amp + r() * amp });
  }
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  const N = 110;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    let y = 0;
    for (const p of peaks) {
      const d = Math.abs(u - p.c) / p.rad;
      if (d < 1) y = Math.max(y, p.a * (pointy ? 1 - d : Math.pow(1 - d * d, round)));
    }
    s.lineTo(-w / 2 + u * w, Math.max(h * 0.08, y * h));
  }
  s.lineTo(w / 2, 0);
  s.closePath();
  return s;
}

export function cloudShape(w, h) {
  const s = new THREE.Shape();
  const circles = [[-0.32, 0.38, 0.3], [-0.05, 0.52, 0.42], [0.26, 0.42, 0.34], [0.42, 0.3, 0.22]];
  s.moveTo(-w / 2, 0);
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const u = -0.5 + i / N;
    let y = 0.12;
    for (const [cx, cy, cr] of circles) {
      const dx = (u - cx) * 1.0;
      if (Math.abs(dx) < cr) y = Math.max(y, cy + Math.sqrt(cr * cr - dx * dx) * 0.9);
    }
    s.lineTo(u * w, y * h);
  }
  s.lineTo(w / 2, 0);
  s.closePath();
  return s;
}

export function starShape(r) {
  const s = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 2, rr = i % 2 ? r * 0.38 : r;
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
    i ? s.lineTo(x, y) : s.moveTo(x, y);
  }
  s.closePath();
  return s;
}

export function polyShape(pts) {
  const s = new THREE.Shape();
  pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
  s.closePath();
  return s;
}

/* ---------- the grass tree ---------- */

const GREENS = ['#8fbf3a', '#7cad2f', '#a3cc4d', '#6d9f2a', '#98c442', '#5f8f22'];
const SKIRT = ['#c99a52', '#b98843', '#d8b06a', '#a7783a'];
const SHOOT = '#d9e86a';

// Wind, a pointer brush, a whole-tree bend (for grabbing) and shoot growth,
// shared by the colour pass and the shadow pass.
function patchTree(shader, uniforms) {
  Object.assign(shader.uniforms, uniforms);
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', `#include <common>
      attribute float aT; attribute float aPhase; attribute float aKind; attribute vec3 aRoot;
      uniform float uTime, uWind, uGust, uHeight, uShoot, uSkirt;
      uniform vec2 uBend; uniform vec3 uBrush; uniform float uBrushOn;`)
    .replace('#include <begin_vertex>', `#include <begin_vertex>
      // new centre shoots grow out from their root
      if (aKind > 1.5) transformed = aRoot + (transformed - aRoot) * uShoot;
      if (aKind > 0.5 && aKind < 1.5) transformed = aRoot + (transformed - aRoot) * uSkirt;
      float tip = aT * aT;
      float sway = sin(uTime * 1.9 + aPhase) * 0.6 + sin(uTime * 3.7 + aPhase * 2.3) * 0.25;
      transformed.x += (sway * uWind + uGust * (0.6 + 0.4 * sin(aPhase))) * tip * 0.03;
      transformed.z += cos(uTime * 1.6 + aPhase) * uWind * tip * 0.016;
      transformed.y -= abs(uGust) * tip * 0.008;
      // stroke the leaves: they part around the pointer
      vec3 d = transformed - uBrush;
      float fall = uBrushOn * smoothstep(0.16, 0.0, length(d)) * aT;
      transformed += normalize(d + vec3(0.0001)) * fall * 0.07;
      // the whole tree bends from its base when grabbed or twanged
      float hb = clamp(transformed.y / uHeight, 0.0, 1.4);
      transformed.xz += uBend * hb * hb;
      transformed.y -= dot(uBend, uBend) * hb * 0.6;`);
}

function frondGeometry(fronds) {
  // each frond: a narrow strip, cut to a point, drooping under its own weight
  const SEG = 6;
  const pos = [], col = [], aT = [], aPhase = [], aKind = [], aRoot = [], idx = [];
  const color = new THREE.Color();
  const up = new THREE.Vector3(0, 1, 0);
  for (const f of fronds) {
    const base = f.base, dir = f.dir.clone().normalize();
    let side = new THREE.Vector3().crossVectors(dir, up);
    if (side.lengthSq() < 1e-4) side.set(1, 0, 0);
    side.normalize().applyAxisAngle(dir, f.twist || 0);
    color.set(f.color);
    const start = pos.length / 3;
    for (let i = 0; i <= SEG; i++) {
      const t = i / SEG;
      const p = base.clone().addScaledVector(dir, f.len * t);
      p.y -= f.droop * t * t;
      const w = f.width * (1 - t * 0.92);
      for (const sgn of [-1, 1]) {
        const q = p.clone().addScaledVector(side, (sgn * w) / 2);
        pos.push(q.x, q.y, q.z);
        const shade = 0.86 + 0.14 * t + (sgn > 0 ? 0.03 : 0);
        col.push(color.r * shade, color.g * shade, color.b * shade);
        aT.push(t); aPhase.push(f.phase); aKind.push(f.kind); aRoot.push(base.x, base.y, base.z);
      }
      if (i < SEG) {
        const a = start + i * 2;
        idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('aT', new THREE.Float32BufferAttribute(aT, 1));
  g.setAttribute('aPhase', new THREE.Float32BufferAttribute(aPhase, 1));
  g.setAttribute('aKind', new THREE.Float32BufferAttribute(aKind, 1));
  g.setAttribute('aRoot', new THREE.Float32BufferAttribute(aRoot, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function crownFronds(top, scale, r, out) {
  const n = Math.round(150 * scale + 40);
  // live crown: a fountain of strips
  for (let i = 0; i < n; i++) {
    const az = r() * Math.PI * 2;
    const el = THREE.MathUtils.degToRad(rand(-8, 84) * (0.55 + 0.45 * r()) + 10);
    const dir = new THREE.Vector3(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el));
    const len = (0.17 + r() * 0.1) * scale;
    out.push({ base: top.clone().add(new THREE.Vector3((r() - 0.5) * 0.02, (r() - 0.5) * 0.02, (r() - 0.5) * 0.02)),
      dir, len, droop: len * (0.15 + (1 - Math.sin(el)) * 0.5), width: 0.013 * Math.sqrt(scale) + 0.004,
      color: GREENS[(r() * GREENS.length) | 0], phase: r() * 6.28, kind: 0, twist: (r() - 0.5) * 1.2 });
  }
  // dry skirt hanging under the crown
  const m = Math.round(70 * scale + 16);
  for (let i = 0; i < m; i++) {
    const az = r() * Math.PI * 2;
    const el = THREE.MathUtils.degToRad(-rand(55, 86));
    const dir = new THREE.Vector3(Math.cos(az) * Math.cos(el) * 1.4, Math.sin(el), Math.sin(az) * Math.cos(el) * 1.4);
    const len = (0.1 + r() * 0.07) * scale;
    out.push({ base: top.clone().add(new THREE.Vector3(Math.cos(az) * 0.025, -0.01, Math.sin(az) * 0.025)),
      dir, len, droop: 0, width: 0.012 * Math.sqrt(scale) + 0.003,
      color: SKIRT[(r() * SKIRT.length) | 0], phase: r() * 6.28, kind: 1, twist: (r() - 0.5) });
  }
  // new shoots in the centre (grown by uShoot; full size by default)
  for (let i = 0; i < 18; i++) {
    const az = r() * Math.PI * 2;
    const el = THREE.MathUtils.degToRad(rand(62, 88));
    const dir = new THREE.Vector3(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el));
    const len = (0.12 + r() * 0.06) * scale;
    out.push({ base: top.clone(), dir, len, droop: len * 0.1, width: 0.011 * Math.sqrt(scale) + 0.003,
      color: SHOOT, phase: r() * 6.28, kind: 2, twist: 0 });
  }
}

// trunk length in scene units for a real trunk height in metres
export const trunkLen = (h) => 0.035 + Math.min(h, 1.7) * 0.27;

export function grassTree({ h = 0.6, heads = 1, seed = 3, scale = 1 } = {}) {
  const r = seeded(seed + Math.round(h * 100) + heads * 7);
  const group = new THREE.Group();
  const uniforms = {
    uTime: { value: 0 }, uWind: { value: 1 }, uGust: { value: 0 },
    uBend: { value: new THREE.Vector2() }, uBrush: { value: new THREE.Vector3(9, 9, 9) }, uBrushOn: { value: 0 },
    uHeight: { value: 0.5 }, uShoot: { value: 1 }, uSkirt: { value: 1 },
  };
  const tl = trunkLen(h) * scale;
  const radius = (0.032 + h * 0.012) * scale;
  const fronds = [];
  const tops = [];
  const barkMat = new THREE.MeshStandardMaterial({ map: barkTexture(), roughness: 1, color: '#ffffff' });
  barkMat.onBeforeCompile = (s) => patchTree(s, uniforms);

  const addTrunk = (from, to, rad) => {
    const len = from.distanceTo(to);
    const geo = new THREE.CylinderGeometry(rad * 0.92, rad, len, 7, 6);
    geo.translate(0, len / 2, 0);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), to.clone().sub(from).normalize());
    geo.applyQuaternion(q);
    geo.translate(from.x, from.y, from.z);
    const n = geo.attributes.position.count;
    geo.setAttribute('aT', new THREE.Float32BufferAttribute(new Float32Array(n), 1));
    geo.setAttribute('aPhase', new THREE.Float32BufferAttribute(new Float32Array(n), 1));
    geo.setAttribute('aKind', new THREE.Float32BufferAttribute(new Float32Array(n), 1));
    geo.setAttribute('aRoot', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    geo.attributes.uv.array.forEach((v, i, a) => { if (i % 2) a[i] = v * len * 4; });
    const mesh = new THREE.Mesh(geo, barkMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  };

  const base = new THREE.Vector3(0, -0.02, 0);
  const top = new THREE.Vector3(0, tl, 0);
  addTrunk(base, top, radius);
  if (heads <= 1) {
    tops.push(top);
  } else {
    const fork = new THREE.Vector3(0, tl * 0.55, 0);
    for (let i = 0; i < heads; i++) {
      const a = (i / heads) * Math.PI * 2 + 0.4;
      const t = new THREE.Vector3(Math.cos(a) * 0.09 * scale, tl * (1 + 0.12 * (i % 2)), Math.sin(a) * 0.07 * scale);
      addTrunk(fork, t, radius * 0.7);
      tops.push(t);
    }
  }
  tops.forEach((t) => crownFronds(t, scale * (heads > 1 ? 0.78 : 1), r, fronds));

  const crownGeo = frondGeometry(fronds);
  const crownMat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.85, map: fibre() });
  crownMat.onBeforeCompile = (s) => patchTree(s, uniforms);
  const crown = new THREE.Mesh(crownGeo, crownMat);
  crown.castShadow = true;
  crown.receiveShadow = true;
  const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide });
  depth.onBeforeCompile = (s) => patchTree(s, uniforms);
  crown.customDepthMaterial = depth;
  group.add(crown);

  const topY = Math.max(...tops.map((t) => t.y));
  uniforms.uHeight.value = topY + 0.05;
  group.userData = { uniforms, crown, height: topY + 0.24 * scale, radius: 0.26 * scale, tops, base: crownGeo.attributes.color.array.slice() };
  return group;
}

// Recolour a tree for its months since planting: early stress browns the
// outer tips, centre shoots arrive from month 5, the skirt fills by year two.
export function paintAge(tree, months) {
  const geo = tree.userData.crown.geometry;
  const col = geo.attributes.color.array, base = tree.userData.base;
  const aT = geo.attributes.aT.array, kind = geo.attributes.aKind.array, phase = geo.attributes.aPhase.array;
  const stress = months < 6 ? 0.85 - months * 0.06 : Math.max(0, 0.5 - (months - 6) * 0.04);
  const brown = [0.62, 0.43, 0.2];
  for (let v = 0; v < aT.length; v++) {
    const i = v * 3;
    if (kind[v] > 1.5) continue;
    const outer = (Math.sin(phase[v] * 3.1) * 0.5 + 0.5);
    const k = kind[v] > 0.5 ? 0 : Math.min(1, stress * outer * 1.4) * Math.pow(aT[v], 0.7);
    col[i] = base[i] + (brown[0] - base[i]) * k;
    col[i + 1] = base[i + 1] + (brown[1] - base[i + 1]) * k;
    col[i + 2] = base[i + 2] + (brown[2] - base[i + 2]) * k;
  }
  geo.attributes.color.needsUpdate = true;
  const u = tree.userData.uniforms;
  u.uShoot.value = THREE.MathUtils.clamp((months - 4) / 8, 0.02, 1);
  u.uSkirt.value = THREE.MathUtils.clamp(0.35 + months / 24 * 0.65, 0.35, 1);
}

/* ---------- springs ---------- */

export function spring(value = 0, { k = 140, d = 14 } = {}) {
  return { x: value, v: 0, to: value, k, d,
    step(dt) {
      // fixed small steps keep it stable when a frame comes late
      for (let left = Math.min(dt, 0.064); left > 0; left -= 1 / 120) {
        const h = Math.min(1 / 120, left);
        this.v += (-(this.x - this.to) * this.k - this.v * this.d) * h;
        this.x += this.v * h;
      }
      return this.x;
    },
    snap(v) { this.x = this.to = v; this.v = 0; },
  };
}
