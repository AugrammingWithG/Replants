import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// A procedural Xanthorrhoea: fire-blackened trunk of packed leaf bases, a burst
// of needle leaves, a dry skirt, pink flagging tape and a stamped price tag.
// One module drives two scenes: the hero tree (reacts to the visitor, gets dug
// out as the page scrolls) and the care tree (recovers over 24 months).

const COL = {
  tape: new THREE.Color('#ff2d87'),
  leafBase: new THREE.Color('#3b5716'),
  leafTip: new THREE.Color('#9fbc3a'),
  leafNew: new THREE.Color('#cddc58'),
  leafDark: new THREE.Color('#283f10'),
  skirtBase: new THREE.Color('#4a3823'),
  skirtTip: new THREE.Color('#9c8150'),
  stressTip: new THREE.Color('#9a7a45'),
  shootYoung: new THREE.Color('#f2e64e'),
  soil: new THREE.Color('#5b3f26'),
};

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInCubic = (t) => t * t * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* ---------- Textures ---------- */

function barkTexture() {
  const w = 512, h = 1024;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  const r = rng(11);
  g.fillStyle = '#100e0c';
  g.fillRect(0, 0, w, h);
  // packed leaf bases, laid like scales
  for (let row = 0, y = -10; y < h + 20; row++, y += 13) {
    const off = (row % 2) * 11;
    for (let x = -22 + off; x < w + 22; x += 22) {
      const lum = 18 + r() * 26;
      const warm = r() < 0.08 ? 14 : 0;
      g.fillStyle = `rgb(${lum + warm + 6},${lum + 3},${lum - 2})`;
      g.beginPath();
      g.ellipse(x + r() * 3, y + r() * 3, 10 + r() * 2, 7 + r() * 2, 0, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = `rgba(150,130,110,${0.05 + r() * 0.1})`;
      g.lineWidth = 1.2;
      g.beginPath();
      g.ellipse(x, y - 1.5, 9, 5.5, 0, Math.PI * 1.1, Math.PI * 1.9);
      g.stroke();
    }
  }
  // char sheen streaks
  for (let i = 0; i < 70; i++) {
    g.strokeStyle = `rgba(0,0,0,${0.15 + r() * 0.25})`;
    g.lineWidth = 2 + r() * 6;
    const x = r() * w;
    g.beginPath(); g.moveTo(x, r() * h); g.lineTo(x + (r() - 0.5) * 20, r() * h); g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

function paintTag(c, size) {
  const g = c.getContext('2d');
  const w = c.width, h = c.height, rad = 44;
  g.clearRect(0, 0, w, h);
  g.save();
  g.beginPath();
  g.roundRect(4, 4, w - 8, h - 8, rad);
  g.clip();
  const grad = g.createLinearGradient(0, 0, w * 0.4, h);
  grad.addColorStop(0, '#eceff1');
  grad.addColorStop(0.45, '#cfd4d8');
  grad.addColorStop(1, '#a9b0b6');
  g.fillStyle = grad;
  g.fillRect(0, 0, w, h);
  const r = rng(77);
  for (let y = 0; y < h; y += 3) {
    g.fillStyle = `rgba(255,255,255,${0.04 + r() * 0.08})`;
    g.fillRect(0, y, w, 1);
  }
  // stamped lettering: dark strike plus a lit lower edge
  const stamp = (text, x, y, font, align = 'left') => {
    g.font = font;
    if ('fontStretch' in g) g.fontStretch = 'semi-condensed';
    g.textAlign = align;
    g.fillStyle = 'rgba(255,255,255,0.7)';
    g.fillText(text, x + 2, y + 3);
    g.fillStyle = 'rgba(28,28,32,0.9)';
    g.fillText(text, x, y);
  };
  const height = size.over ? '1.2+ M' : size.h.toFixed(2) + ' M';
  const price = size.price == null ? 'POA' : '$' + size.price;
  const heads = size.heads > 1 ? (size.over ? 'MULTI HEAD' : size.heads + ' HEADS') : 'SINGLE HEAD';
  stamp('REPLANTS · SAVED', 140, 92, '700 40px Anybody', 'left');
  stamp(height, 60, 230, '900 132px Anybody');
  stamp(heads, 62, 300, '700 40px Anybody');
  stamp(price, w - 56, 352, '900 96px Anybody', 'right');
  g.restore();
  // punched hole
  g.globalCompositeOperation = 'destination-out';
  g.beginPath(); g.arc(82, 80, 26, 0, Math.PI * 2); g.fill();
  g.globalCompositeOperation = 'source-over';
  g.strokeStyle = 'rgba(0,0,0,0.35)';
  g.lineWidth = 4;
  g.beginPath(); g.arc(82, 80, 28, 0, Math.PI * 2); g.stroke();
}

function staffTexture() {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 1024;
  const g = c.getContext('2d');
  const r = rng(5);
  g.fillStyle = '#c99a62';
  g.fillRect(0, 0, 64, 1024);
  for (let i = 0; i < 40; i++) {
    g.fillStyle = `rgba(120,80,40,${r() * 0.18})`;
    g.fillRect(r() * 64, 0, 1 + r() * 2, 1024);
  }
  // 1.6 m staff: tick every 0.1 m, painted numbers every 0.5 m
  const pxPerM = 1024 / 1.6;
  g.fillStyle = '#1a1714';
  for (let i = 1; i < 16; i++) {
    const y = 1024 - i * 0.1 * pxPerM;
    g.fillRect(0, y - 2, i % 5 === 0 ? 64 : 30, 4);
  }
  g.font = '900 26px Anybody';
  g.textAlign = 'center';
  for (const m of [0.5, 1.0, 1.5]) {
    const y = 1024 - m * pxPerM;
    g.save(); g.translate(44, y + 34); g.rotate(-Math.PI / 2);
    g.fillText(m.toFixed(1), 0, 0); g.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function sprayRingTexture() {
  const s = 512, c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  const r = rng(29);
  const cx = s / 2, cy = s / 2, R = s * 0.4;
  // a hand-sprayed peg-orange circle: dense core, soft overspray, loose speckle
  for (let i = 0; i < 9000; i++) {
    const a = r() * Math.PI * 2;
    const wob = 1 + 0.035 * Math.sin(a * 3 + 1.2) + 0.02 * Math.sin(a * 7);
    const spread = (r() + r() + r() - 1.5) * (r() < 0.85 ? 10 : 34);
    const d = R * wob + spread;
    g.fillStyle = `rgba(255,122,26,${(0.25 + r() * 0.55) * (1 - Math.min(1, Math.abs(spread) / 40))})`;
    g.beginPath();
    g.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 0.6 + r() * 2.2, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// crumbly sandy soil for the root ball
function soilTexture() {
  const s = 256, c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  const r = rng(43);
  g.fillStyle = '#5b3f26';
  g.fillRect(0, 0, s, s);
  for (let i = 0; i < 2600; i++) {
    const l = r();
    g.fillStyle = l < 0.45 ? `rgba(30,20,12,${0.3 + r() * 0.4})` : l < 0.8 ? `rgba(150,112,70,${0.25 + r() * 0.4})` : `rgba(214,190,150,${0.3 + r() * 0.4})`;
    const rad = 0.6 + r() * (l < 0.45 ? 3.2 : 1.6);
    g.beginPath(); g.arc(r() * s, r() * s, rad, 0, Math.PI * 2); g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return tex;
}

// wood-chip mulch that thins out to nothing at its edge
function mulchTexture() {
  const s = 512, c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  const r = rng(61);
  for (let i = 0; i < 3800; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * s * 0.48;
    const edge = d / (s * 0.48);
    if (r() < edge * edge * 0.9) continue;
    const x = s / 2 + Math.cos(a) * d, y = s / 2 + Math.sin(a) * d;
    const l = r();
    g.fillStyle = l < 0.4 ? '#4a3220' : l < 0.75 ? '#6e4c2f' : l < 0.93 ? '#8d6a45' : '#b08a5c';
    g.save(); g.translate(x, y); g.rotate(r() * Math.PI);
    g.fillRect(-(3 + r() * 7), -(1 + r() * 2), 6 + r() * 14, 2 + r() * 4);
    g.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.45, 'rgba(255,255,255,.75)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/* ---------- Wind ---------- */

// Every leaf and tape vertex carries aT (0 at its root, 1 at its tip) so the
// tip moves most. uGust adds a push in the wind's direction on top of the sway.
// aKind lets the care scene grow new shoots (1) and the dry skirt (2).
function windMaterial(base, uniforms, amp) {
  base.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, {
      uTime: uniforms.uTime, uWind: uniforms.uWind, uGust: uniforms.uGust,
      uGustDir: uniforms.uGustDir, uShoot: uniforms.uShoot, uSkirt: uniforms.uSkirt,
    });
    shader.vertexShader =
      'attribute float aT;\nattribute float aPhase;\nattribute float aKind;\nuniform float uTime;\nuniform float uWind;\nuniform float uGust;\nuniform vec2 uGustDir;\nuniform float uShoot;\nuniform float uSkirt;\n' +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        if (aKind > 0.5 && aKind < 1.5) transformed *= uShoot;
        if (aKind > 1.5) transformed *= uSkirt;
        float sw = aT * aT;
        float energy = uWind + uGust * 2.2;
        transformed.x += sin(uTime * (1.7 + uGust) + aPhase) * ${amp.toFixed(3)} * sw * energy;
        transformed.z += cos(uTime * (1.3 + uGust) + aPhase * 1.7) * ${(amp * 0.8).toFixed(3)} * sw * energy;
        transformed.y += sin(uTime * 2.3 + aPhase * 0.7) * ${(amp * 0.3).toFixed(3)} * sw * energy;
        transformed.xz += uGustDir * uGust * sw * ${(amp * 2.6).toFixed(3)};`
      );
  };
  return base;
}

/* ---------- Geometry builders ---------- */

// Thin tapered ribbons along a drooping curve, merged into one geometry.
// Per-leaf metadata is kept so the care scene can recolour by age.
function crownGeometry({ seed, leaves, skirt, len, spread = 1, floor = -10 }) {
  const r = rng(seed);
  const SEG = 7;
  const pos = [], nor = [], col = [], at = [], ph = [], kind = [], idx = [];
  const meta = { kind: [], t: [], shade: [], polar: [], tipNew: [] };
  const v = new THREE.Vector3(), tan = new THREE.Vector3(), side = new THREE.Vector3(), n = new THREE.Vector3();
  const rnd = new THREE.Vector3();
  const c = new THREE.Color();

  const addLeaf = (dir, L, sag, width, c0, c1, phase, startR, hang, k, shade, polar) => {
    const base = pos.length / 3;
    rnd.set(r() - 0.5, r() - 0.5, r() - 0.5).normalize();
    for (let i = 0; i <= SEG; i++) {
      const t = i / SEG;
      v.copy(dir).multiplyScalar(L * t);
      v.y -= sag * L * t * t;
      if (hang) { v.x *= 0.55 + 0.45 * (1 - t); v.z *= 0.55 + 0.45 * (1 - t); }
      v.x += dir.x * startR; v.z += dir.z * startR;
      // leaves that reach the ground splay out across it
      if (v.y < floor) { const over = floor - v.y; v.y = floor + over * 0.04; v.x *= 1 + over * 0.6; v.z *= 1 + over * 0.6; }
      tan.copy(dir); tan.y -= 2 * sag * t; tan.normalize();
      side.crossVectors(tan, rnd).normalize();
      n.crossVectors(tan, side).normalize();
      const wdt = width * (1 - 0.88 * t);
      c.copy(c0).lerp(c1, Math.pow(t, 0.8));
      for (const s of [-1, 1]) {
        pos.push(v.x + side.x * wdt * s, v.y + side.y * wdt * s, v.z + side.z * wdt * s);
        nor.push(n.x, n.y, n.z);
        col.push(c.r, c.g, c.b);
        at.push(t);
        ph.push(phase);
        kind.push(k);
        meta.kind.push(k); meta.t.push(t); meta.shade.push(shade); meta.polar.push(polar);
      }
    }
    for (let i = 0; i < SEG; i++) {
      const a = base + i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  };

  const dir = new THREE.Vector3();
  const c0 = new THREE.Color(), c1 = new THREE.Color();
  for (let i = 0; i < leaves; i++) {
    // denser near horizontal, a tuft of new growth straight up
    const u = r();
    const isNew = u < 0.12;
    const polar = isNew ? r() * 0.35 : 0.25 + Math.pow(r(), 0.85) * 1.55 * spread;
    const az = r() * Math.PI * 2;
    dir.set(Math.sin(polar) * Math.cos(az), Math.cos(polar), Math.sin(polar) * Math.sin(az));
    const L = len * (0.7 + r() * 0.45) * (isNew ? 0.75 : 1);
    const sag = 0.04 + (polar / Math.PI) * 0.4 + r() * 0.06;
    const shade = r();
    c0.copy(shade < 0.25 ? COL.leafDark : COL.leafBase);
    c1.copy(polar < 0.4 ? COL.leafNew : COL.leafTip).lerp(COL.leafBase, shade * 0.35);
    addLeaf(dir, L, sag, 0.0085, c0, c1, r() * 6.28, 0.02, false, isNew ? 1 : 0, shade, polar);
  }
  for (let i = 0; i < skirt; i++) {
    const polar = 2.0 + r() * 0.9;
    const az = r() * Math.PI * 2;
    dir.set(Math.sin(polar) * Math.cos(az), Math.cos(polar), Math.sin(polar) * Math.sin(az));
    const L = len * (0.3 + r() * 0.32);
    const shade = r();
    c0.copy(COL.skirtBase);
    c1.copy(COL.skirtTip).multiplyScalar(0.85 + shade * 0.3);
    addLeaf(dir, L, 0.15, 0.008, c0, c1, r() * 6.28, 0.09, true, 2, shade, polar);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setAttribute('aT', new THREE.Float32BufferAttribute(at, 1));
  geo.setAttribute('aPhase', new THREE.Float32BufferAttribute(ph, 1));
  geo.setAttribute('aKind', new THREE.Float32BufferAttribute(kind, 1));
  geo.setIndex(idx);
  geo.computeBoundingSphere();
  geo.userData.meta = meta;
  return geo;
}

// Recolour a crown for a point in its first two years after transplanting.
function paintAge(geo, months) {
  const m = geo.userData.meta, col = geo.attributes.color;
  const stress = 1 - smooth(0, 12, months);      // brown tips fade as roots establish
  const ripen = smooth(6, 16, months);           // new shoots turn from yellow to green
  const ageing = smooth(12, 26, months);         // older outer leaves dry into the skirt
  const c = new THREE.Color(), tip = new THREE.Color();
  for (let i = 0; i < m.kind.length; i++) {
    const t = m.t[i], shade = m.shade[i];
    if (m.kind[i] === 1) {
      c.copy(COL.shootYoung).lerp(COL.leafNew, ripen).lerp(COL.leafTip, ripen * 0.4);
      c.lerp(COL.leafBase, (1 - t) * 0.35);
    } else if (m.kind[i] === 2) {
      c.copy(COL.skirtBase).lerp(COL.skirtTip, Math.pow(t, 0.8)).multiplyScalar(0.85 + shade * 0.3);
    } else {
      c.copy(shade < 0.25 ? COL.leafDark : COL.leafBase);
      tip.copy(COL.leafTip).lerp(COL.leafBase, shade * 0.35);
      c.lerp(tip, Math.pow(t, 0.8));
      // transplant stress browns the outer third of each leaf
      const brownFrom = 1 - (0.25 + shade * 0.3) * stress;
      if (t > brownFrom) c.lerp(COL.stressTip, Math.min(1, (t - brownFrom) / 0.12) * (0.55 + 0.45 * stress));
      // the lowest leaves dry out as the skirt forms
      if (m.polar[i] > 1.0) c.lerp(COL.skirtTip, ageing * smooth(1.0, 1.6, m.polar[i]));
    }
    col.setXYZ(i, c.r, c.g, c.b);
  }
  col.needsUpdate = true;
}

function trunkGeometry(seed) {
  const r = rng(seed);
  const geo = new THREE.CylinderGeometry(0.14, 0.165, 1, 44, 24, true);
  geo.translate(0, 0.5, 0);
  const p = geo.attributes.position;
  const k1 = r() * 6, k2 = r() * 6;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const th = Math.atan2(z, x);
    const s = 1 + 0.06 * Math.sin(3 * th + 5 * y + k1) + 0.035 * Math.sin(7 * th - 3 * y + k2) + 0.05 * Math.sin(y * 9 + k1);
    p.setXYZ(i, x * s, y, z * s);
  }
  geo.computeVertexNormals();
  return geo;
}

// The soil and roots that come up with the tree when it is dug out.
function rootBallGeometry(seed) {
  const r = rng(seed);
  const geo = new THREE.SphereGeometry(0.34, 40, 24);
  const p = geo.attributes.position;
  const k = r() * 6;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = 1 + 0.08 * Math.sin(x * 14 + k) * Math.cos(z * 12) + 0.05 * Math.sin(y * 20 + k * 2);
    p.setXYZ(i, x * n, y * 0.72 * n, z * n);
  }
  geo.computeVertexNormals();
  return geo;
}

function tapeLoopGeometry(radius, width) {
  const seg = 64;
  const pos = [], idx = [], nor = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const wob = 1 + 0.03 * Math.sin(a * 3);
    const x = Math.cos(a) * radius * wob, z = Math.sin(a) * radius * wob;
    const tilt = Math.sin(a) * 0.012;
    pos.push(x, -width / 2 + tilt, z, x, width / 2 + tilt, z);
    nor.push(Math.cos(a), 0, Math.sin(a), Math.cos(a), 0, Math.sin(a));
  }
  for (let i = 0; i < seg; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  // the loop is tied tight: no wind
  const zeros = new Float32Array(pos.length / 3);
  geo.setAttribute('aT', new THREE.Float32BufferAttribute(zeros, 1));
  geo.setAttribute('aPhase', new THREE.Float32BufferAttribute(zeros, 1));
  geo.setAttribute('aKind', new THREE.Float32BufferAttribute(zeros, 1));
  geo.setIndex(idx);
  return geo;
}

function tapeTailGeometry(length, width, curl) {
  const seg = 14;
  const pos = [], idx = [], at = [], ph = [], nor = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const x = Math.sin(t * 2.4) * curl;
    pos.push(x - width / 2, -t * length, t * 0.03, x + width / 2, -t * length, t * 0.03);
    nor.push(0, 0, 1, 0, 0, 1);
    at.push(t, t); ph.push(curl * 40, curl * 40);
  }
  for (let i = 0; i < seg; i++) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute('aT', new THREE.Float32BufferAttribute(at, 1));
  geo.setAttribute('aPhase', new THREE.Float32BufferAttribute(ph, 1));
  geo.setAttribute('aKind', new THREE.Float32BufferAttribute(new Float32Array(at.length), 1));
  geo.setIndex(idx);
  return geo;
}

/* ---------- Scene ---------- */

/**
 * mode 'hero': staff, price tag, pointer parallax, gusts, pollen, dig-out on scroll.
 * mode 'care': one 0.6 m tree, no tag, recolours with setAge(months).
 */
export async function createTreeScene(canvas, initialSize, { mode = 'hero' } = {}) {
  const hero = mode === 'hero';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);

  scene.add(new THREE.HemisphereLight('#fff6e6', '#8f7552', 0.55));
  const sun = new THREE.DirectionalLight('#fff1dc', 2.6);
  sun.position.set(-2.4, 4.2, 2.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -2, right: 2, top: 3, bottom: -1, near: 0.5, far: 12 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  const rim = new THREE.DirectionalLight('#ffd6ea', 0.6);
  rim.position.set(2.5, 2, -2.5);
  scene.add(rim);

  const uniforms = {
    uTime: { value: 0 }, uWind: { value: reduced ? 0 : 1 }, uGust: { value: 0 },
    uGustDir: { value: new THREE.Vector2(1, 0) }, uShoot: { value: 1 }, uSkirt: { value: 1 },
  };

  // Ground: a soft shadow catcher, a peg-orange spray circle, a low mound of sand with its moat
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.3, color: '#5b4630' }));
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  const spray = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({ map: sprayRingTexture(), transparent: true, depthWrite: false, toneMapped: false })
  );
  spray.rotation.x = -Math.PI / 2;
  spray.position.y = 0.004;
  spray.visible = hero;
  scene.add(spray);

  const SAND = new THREE.Color('#cfc8b7'), DUG = new THREE.Color('#8a6440');
  const moundMat = new THREE.MeshStandardMaterial({ color: hero ? SAND : '#5a3e27', roughness: 1, envMapIntensity: 0.25 });
  const mound = new THREE.Mesh(new THREE.SphereGeometry(0.42, 48, 12, 0, Math.PI * 2, 0, Math.PI / 2), moundMat);
  mound.scale.y = 0.07;
  if (!hero) {
    mound.visible = false;
    const mulch = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7), new THREE.MeshStandardMaterial({ map: mulchTexture(), transparent: true, depthWrite: false, roughness: 1, envMapIntensity: 0.2 }));
    mulch.rotation.x = -Math.PI / 2;
    mulch.position.y = 0.006;
    mulch.receiveShadow = true;
    scene.add(mulch);
  }
  mound.receiveShadow = true;
  scene.add(mound);
  const moat = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 8, 64), moundMat);
  moat.rotation.x = -Math.PI / 2;
  moat.position.y = 0.03;
  moat.scale.z = 0.6;
  moat.receiveShadow = true;
  scene.add(moat);
  if (!hero) {
    // the moat is a low lip of dark soil, not a ring of plain colour
    const moatTex = soilTexture();
    moatTex.repeat.set(8, 1);
    moat.material = new THREE.MeshStandardMaterial({ map: moatTex, bumpMap: moatTex, bumpScale: 2, color: '#8a7462', roughness: 1, envMapIntensity: 0.1 });
    moat.scale.set(1, 1, 0.45);
  }
  // the dark hole left behind when the tree is lifted out
  const hole = new THREE.Mesh(new THREE.CircleGeometry(0.3, 40), new THREE.MeshBasicMaterial({ color: '#2a1f15', transparent: true, opacity: 0 }));
  hole.rotation.x = -Math.PI / 2;
  hole.position.y = 0.075;
  hole.scale.set(1, 0.85, 1);
  scene.add(hole);

  const tapeMat = windMaterial(new THREE.MeshBasicMaterial({ color: COL.tape, side: THREE.DoubleSide, toneMapped: false }), uniforms, 0.06);

  let staffTagMount = null;
  if (hero) {
    // Height staff, for honest scale
    const staff = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 1.6, 0.04),
      new THREE.MeshStandardMaterial({ map: staffTexture(), roughness: 0.85 })
    );
    staff.position.set(-0.85, 0.8, -0.25);
    staff.rotation.y = 0.5;
    staff.castShadow = true;
    scene.add(staff);
    const staffTape = new THREE.Mesh(tapeLoopGeometry(0.032, 0.035), tapeMat);
    staffTape.position.set(-0.85, 1.52, -0.25);
    scene.add(staffTape);
    const staffTail = new THREE.Mesh(tapeTailGeometry(0.28, 0.03, 0.04), tapeMat);
    staffTail.position.set(-0.83, 1.52, -0.21);
    staffTail.rotation.y = 0.4;
    scene.add(staffTail);
    staffTagMount = new THREE.Vector3(-0.81, 1.08, -0.18);
  }

  const bark = barkTexture();
  const trunkMat = new THREE.MeshStandardMaterial({ map: bark, bumpMap: bark, bumpScale: 2.2, roughness: 0.92, color: '#ffffff', envMapIntensity: 0.3 });
  const leafMat = windMaterial(
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, side: THREE.DoubleSide, envMapIntensity: 0.35 }),
    uniforms, 0.03
  );
  // roots and soil only show above the ground line
  const ground = [new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.002)];
  const soilTex = soilTexture();
  const soilMat = new THREE.MeshStandardMaterial({ map: soilTex, bumpMap: soilTex, bumpScale: 3, roughness: 1, envMapIntensity: 0.2, clippingPlanes: ground });
  const rootMat = new THREE.MeshStandardMaterial({ color: '#3b2a1b', roughness: 1, clippingPlanes: ground });

  const tagC = document.createElement('canvas');
  tagC.width = 640; tagC.height = 400;
  const tagTex = new THREE.CanvasTexture(tagC);
  tagTex.colorSpace = THREE.SRGBColorSpace;
  tagTex.anisotropy = 8;
  const tagMat = new THREE.MeshStandardMaterial({ map: tagTex, transparent: true, alphaTest: 0.5, metalness: 0.55, roughness: 0.38, side: THREE.DoubleSide });
  const wireMat = new THREE.MeshStandardMaterial({ color: '#9aa0a6', metalness: 0.9, roughness: 0.3 });

  // lift: the whole tree rises out of the ground; front: the tag, which always faces the viewer
  const lift = new THREE.Group();
  scene.add(lift);
  const yaw = new THREE.Group();
  lift.add(yaw);
  const front = new THREE.Group();
  scene.add(front);

  // Soil specks that fall off the root ball as the tree comes up
  const SPECKS = 140;
  const speckGeo = new THREE.BufferGeometry();
  const speckPos = new Float32Array(SPECKS * 3);
  const speckSeed = [];
  { const r = rng(91); for (let i = 0; i < SPECKS; i++) speckSeed.push([r() * Math.PI * 2, 0.15 + r() * 0.2, r() * 0.7, 0.4 + r() * 0.6]); }
  speckGeo.setAttribute('position', new THREE.BufferAttribute(speckPos, 3));
  const specks = new THREE.Points(speckGeo, new THREE.PointsMaterial({ color: '#5b3f26', size: 0.03, sizeAttenuation: true, transparent: true, opacity: 0.9 }));
  specks.visible = false;
  scene.add(specks);

  // Pollen and dust drifting through the light
  let motes = null;
  if (!reduced) {
    const N = hero ? 110 : 60;
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(N * 3);
    const r = rng(17);
    for (let i = 0; i < N; i++) { p[i * 3] = (r() - 0.5) * 3.4; p[i * 3 + 1] = r() * 2.6; p[i * 3 + 2] = (r() - 0.5) * 2; }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    motes = new THREE.Points(g, new THREE.PointsMaterial({
      map: dotTexture(), color: '#d8c27c', size: 0.035, transparent: true, opacity: 0.75, depthWrite: false, sizeAttenuation: true,
    }));
    scene.add(motes);
  }

  /* -- one tree, built for a size -- */
  function buildTree(size) {
    const group = new THREE.Group();
    const parts = { trunks: [], crowns: [], h: size.h };
    const seed = Math.round(size.h * 100) + size.heads * 31;
    const crownLen = 0.55 + Math.min(size.h, 1.2) * 0.32;

    const addHead = (base, dir, len, hScale) => {
      const t = new THREE.Mesh(trunkGeometry(seed + parts.trunks.length), trunkMat);
      t.castShadow = t.receiveShadow = true;
      t.position.copy(base);
      t.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      t.scale.set(hScale, Math.max(len, 0.001), hScale);
      group.add(t);
      parts.trunks.push({ mesh: t, len, dir: dir.clone(), base: base.clone(), hScale });

      const at = base.clone().addScaledVector(dir, len);
      const crown = new THREE.Mesh(
        crownGeometry({
          seed: seed * 7 + parts.crowns.length,
          leaves: size.heads > 1 ? 1300 : 2200,
          skirt: Math.round(420 + len * 340),
          len: crownLen * (size.heads > 1 ? 0.85 : 1),
          floor: -at.y + 0.04,
        }),
        leafMat
      );
      crown.castShadow = true;
      crown.position.copy(at);
      group.add(crown);
      parts.crowns.push(crown);
      return crown.position.clone();
    };

    let tapeAt, tapeR;
    if (size.heads === 1) {
      const h = Math.max(size.h, 0.03);
      const top = addHead(new THREE.Vector3(0, -0.02, 0), new THREE.Vector3(0, 1, 0), h + 0.02, 1);
      tapeAt = size.h >= 0.6 ? new THREE.Vector3(0, Math.max(h * 0.62, 0.44), 0)
        : size.h >= 0.3 ? new THREE.Vector3(0, h * 0.4, 0)
        : top.clone().add(new THREE.Vector3(0, 0.07, 0));
      tapeR = size.h >= 0.3 ? 0.165 : 0.06;
      parts.top = top.y + crownLen * 0.9;
    } else {
      const fork = size.over ? 0.75 : size.h * 0.45;
      const stem = new THREE.Vector3(0, 1, 0);
      const forkTop = new THREE.Vector3(0, fork, 0);
      const t = new THREE.Mesh(trunkGeometry(seed + 99), trunkMat);
      t.castShadow = t.receiveShadow = true;
      t.position.set(0, -0.02, 0);
      t.scale.set(1.25, fork + 0.04, 1.25);
      group.add(t);
      parts.trunks.push({ mesh: t, len: fork + 0.04, dir: stem, base: t.position.clone(), hScale: 1.25 });
      const armLen = (size.over ? 1.0 : size.h) - fork + 0.12;
      let maxY = 0;
      for (let i = 0; i < size.heads; i++) {
        const az = (i / size.heads) * Math.PI * 2 + 0.6;
        const lean = 0.38 + (i % 2) * 0.12;
        const d = new THREE.Vector3(Math.sin(lean) * Math.cos(az), Math.cos(lean), Math.sin(lean) * Math.sin(az)).normalize();
        const p = addHead(forkTop.clone().addScaledVector(d, -0.04), d, armLen * (1 - i * 0.12), 0.72);
        maxY = Math.max(maxY, p.y);
      }
      tapeAt = new THREE.Vector3(0, Math.max(fork * 0.8, 0.44), 0);
      tapeR = 0.2;
      parts.top = maxY + crownLen * 0.8;
    }

    // root ball and a few hanging roots, hidden below ground until the tree is lifted
    const bs = size.heads > 1 || size.h > 0.9 ? 1.2 : size.h < 0.3 ? 0.75 : 1;
    const halfH = 0.34 * 0.72 * 1.13 * bs;
    const ball = new THREE.Mesh(rootBallGeometry(seed), soilMat);
    ball.scale.setScalar(bs);
    ball.position.y = -halfH - 0.01;
    ball.castShadow = true;
    group.add(ball);
    parts.ballBottom = ball.position.y - halfH;
    const rr = rng(seed + 5);
    for (let i = 0; i < 14; i++) {
      const a = rr() * Math.PI * 2, rad = (0.08 + rr() * 0.16) * bs, l = 0.1 + rr() * 0.22;
      const root = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.009, l, 5), rootMat);
      root.position.set(Math.cos(a) * rad, parts.ballBottom - l / 2 + 0.06, Math.sin(a) * rad);
      root.rotation.set((rr() - 0.5) * 0.6, 0, (rr() - 0.5) * 0.6);
      group.add(root);
    }

    // tape loop and tails
    const tapeGroup = new THREE.Group();
    tapeGroup.position.copy(tapeAt);
    group.add(tapeGroup);
    if (hero) tapeGroup.add(new THREE.Mesh(tapeLoopGeometry(tapeR, 0.045), tapeMat));
    if (hero) for (const [len, curl] of [[0.32, 0.05], [0.24, -0.04]]) {
      const tail = new THREE.Mesh(tapeTailGeometry(len, 0.042, curl), tapeMat);
      tail.position.set(0, 0, tapeR + 0.004);
      tapeGroup.add(tail);
    }
    parts.tape = tapeGroup;

    // the tag: hung at the front of the loop (a ring looks the same from every side),
    // or from the stake when the trunk is too short to carry it
    const mount = new THREE.Group();
    if (hero) {
      const onStake = size.h < 0.6;
      if (onStake) {
        mount.position.copy(staffTagMount);
        const loop = new THREE.Mesh(tapeLoopGeometry(0.032, 0.035), tapeMat);
        loop.position.set(-0.04, 0, -0.07);
        mount.add(loop);
      } else {
        mount.position.set(0, tapeAt.y, tapeR + 0.004);
      }
      const tagPivot = new THREE.Group();
      tagPivot.position.set(0.02, -0.01, onStake ? 0.03 : 0.1);
      mount.add(tagPivot);
      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0025, 0.08, 6), wireMat);
      wire.position.y = -0.04;
      tagPivot.add(wire);
      const TW = 0.46, TH = 0.2875;
      const tag = new THREE.Mesh(new THREE.PlaneGeometry(TW, TH), tagMat);
      tag.castShadow = true;
      // the punched hole is at (82, 80) on the 640x400 canvas: hang it from the wire's end
      tag.position.set(-(82 / 640 - 0.5) * TW, -0.08 - (0.5 - 80 / 400) * TH, 0.004);
      tagPivot.add(tag);
      parts.tagPivot = tagPivot;
      parts.onStake = onStake;
      paintTag(tagC, size);
      tagTex.needsUpdate = true;
    }
    front.add(mount);
    parts.mount = mount;
    return { group, parts };
  }

  /* -- grow and swap -- */
  let current = null, leaving = null, growStart = 0, leaveStart = 0;
  const GROW_MS = reduced ? 1 : 1400;
  const LEAVE_MS = reduced ? 1 : 380;

  function applyGrowth(t, k) {
    const e = easeOutExpo(k);
    const multi = t.parts.trunks.length !== t.parts.crowns.length;
    t.parts.trunks.forEach((tr, j) => {
      // arms ride up on the growing stem
      tr.cur = multi && j > 0 ? tr.mesh.position.copy(tr.base).multiplyScalar(e) : tr.base;
      tr.mesh.scale.y = Math.max(tr.len * e, 0.0005);
    });
    const s = 0.25 + 0.75 * easeOutExpo(Math.min(1, k * 1.15));
    t.parts.crowns.forEach((c, i) => {
      const tr = t.parts.trunks[multi ? i + 1 : i];
      c.position.copy(tr.cur).addScaledVector(tr.dir, tr.len * e);
      c.scale.setScalar(s);
    });
    const tie = Math.max(0.0001, easeOutExpo(Math.max(0, k * 1.6 - 0.6)));
    t.parts.tape.scale.setScalar(tie);
    t.parts.mount.scale.setScalar(tie);
  }

  function setSize(size) {
    if (current) { leaving = current; leaveStart = performance.now(); }
    current = buildTree(size);
    current.group.visible = !leaving;
    yaw.add(current.group);
    if (ageMonths != null) current.parts.crowns.forEach((c) => paintAge(c.geometry, ageMonths));
    growStart = leaving ? performance.now() + LEAVE_MS : performance.now();
    applyGrowth(current, 0);
    targetFrame(current.parts.top);
    swing(0.9);
    wake();
  }

  /* -- care scene: the first two years -- */
  let ageMonths = null;
  function setAge(months) {
    ageMonths = months;
    uniforms.uShoot.value = 0.12 + 0.88 * smooth(3, 13, months);
    uniforms.uSkirt.value = 0.3 + 0.7 * smooth(8, 24, months);
    current?.parts.crowns.forEach((c) => paintAge(c.geometry, months));
    wake();
  }

  /* -- framing, pointer parallax -- */
  const look = new THREE.Vector3(0, 0.8, 0);
  const lookTo = look.clone();
  let dist = 6, distTo = 6;
  function targetFrame(topY) {
    const h = Math.max(hero ? 1.75 : 1.45, topY + 0.2);
    lookTo.set(0, h * 0.46, 0);
    distTo = (h * 0.62) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (camera.aspect < 0.9 ? 1.25 : 1);
  }
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (current) targetFrame(current.parts.top);
    wake();
  }
  new ResizeObserver(resize).observe(canvas);

  // the camera leans toward the pointer; fast pointer movement stirs the wind
  const lean = { x: 0, y: 0, tx: 0, ty: 0 };
  let gust = 0, gustTo = 0, lastMove = { x: 0, y: 0, t: 0 };
  const rect = () => canvas.getBoundingClientRect();
  function onPointer(e) {
    const r = rect();
    if (e.clientY < r.top - 200 || e.clientY > r.bottom + 200) return;
    lean.tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    lean.ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    const now = performance.now();
    const dt = Math.max(16, now - lastMove.t);
    const vx = (e.clientX - lastMove.x) / dt, vy = (e.clientY - lastMove.y) / dt;
    lastMove = { x: e.clientX, y: e.clientY, t: now };
    const speed = Math.hypot(vx, vy);
    if (speed > 0.4 && !reduced) {
      gustTo = Math.max(gustTo, Math.min(1, (speed - 0.4) * 0.6));
      uniforms.uGustDir.value.set(vx, vy * 0.3).normalize();
    }
    wake();
  }
  if (hero && !reduced && matchMedia('(hover: hover)').matches) addEventListener('pointermove', onPointer, { passive: true });

  // the price tag swings on its wire: a damped spring
  const tagSwing = { a: 0, v: 0 };
  function swing(strength) { if (!reduced) tagSwing.v += strength * (Math.random() < 0.5 ? -1 : 1) * 0.06; }

  /* -- drag to turn, tap to rustle -- */
  let yawAngle = -0.35, yawVel = reduced ? 0 : 0.0016, dragging = false, lastX = 0, downX = 0, userTouched = false;
  canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = downX = e.clientX; userTouched = true; canvas.setPointerCapture(e.pointerId); wake(); });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    yawVel = dx * 0.006; yawAngle += yawVel; wake();
  });
  const end = (e) => {
    if (dragging && Math.abs(e.clientX - downX) < 6 && !reduced) {
      // a tap: a gust through the crown and a knock to the tag
      gustTo = 1.2;
      uniforms.uGustDir.value.set(Math.random() - 0.5, 0.3).normalize();
      swing(1.6);
    }
    dragging = false;
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', () => { dragging = false; });

  /* -- dig-out, driven by scroll (0 in the ground, 1 lifted clear) -- */
  let liftK = 0;
  function setLift(k) {
    const v = reduced ? 0 : Math.max(0, Math.min(1, k));
    if (Math.abs(v - liftK) > 0.0005) { liftK = v; wake(); }
  }
  function applyLift() {
    const e = easeInOut(liftK);
    const h = current ? -current.parts.ballBottom + 0.05 : 0.5;
    lift.position.y = e * h;
    lift.rotation.z = Math.sin(e * Math.PI) * 0.06;
    front.position.y = lift.position.y;
    hole.material.opacity = smooth(0.05, 0.3, liftK) * 0.85;
    if (hero) moundMat.color.lerpColors(SAND, DUG, smooth(0.02, 0.35, liftK));
    specks.visible = liftK > 0.02 && liftK < 0.999;
    if (specks.visible) {
      for (let i = 0; i < SPECKS; i++) {
        const [a, rad, start, fall] = speckSeed[i];
        const t = Math.max(0, liftK - start * 0.6) * 2.2;
        const y0 = lift.position.y - 0.18 + Math.sin(a * 3) * 0.08;
        speckPos[i * 3] = Math.cos(a) * rad * (1 + t * 0.4);
        speckPos[i * 3 + 1] = Math.max(0.01, y0 - fall * t * t * 1.4);
        speckPos[i * 3 + 2] = Math.sin(a) * rad * (1 + t * 0.4);
      }
      speckGeo.attributes.position.needsUpdate = true;
    }
  }

  /* -- loop, paused off-screen -- */
  let visible = true, running = false, last = performance.now(), nextGust = 4;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) wake(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
  function wake() { if (!running) { running = true; requestAnimationFrame((t) => { last = t; frame(t); }); } }

  function frame(now) {
    // a restarted loop can hand us a timestamp from before wake(): never step backwards
    const dt = Math.min(64, Math.max(0, now - last)); last = Math.max(last, now);
    const sec = dt / 1000;
    uniforms.uTime.value += sec;

    // natural gusts every few seconds, plus whatever the visitor stirred up
    if (!reduced) {
      nextGust -= sec;
      if (nextGust <= 0) { gustTo = Math.max(gustTo, 0.35 + Math.random() * 0.35); nextGust = 5 + Math.random() * 6; uniforms.uGustDir.value.set(Math.random() - 0.5, 0.2).normalize(); }
    }
    gust += (gustTo - gust) * Math.min(1, sec * 6);
    gustTo *= Math.pow(0.25, sec);
    uniforms.uGust.value = gust;

    if (!dragging) {
      if (!userTouched && !reduced) yawVel += (0.0016 - yawVel) * 0.02;
      else yawVel *= 0.94;
      yawAngle += yawVel * (dt / 16);
    }
    yaw.rotation.y = yawAngle;

    let animating = false;
    if (leaving) {
      const k = Math.min(1, (now - leaveStart) / LEAVE_MS);
      leaving.group.scale.set(1, 1 - easeInCubic(k), 1);
      leaving.group.position.y = -0.1 * k;
      leaving.parts.mount.scale.setScalar(Math.max(0.0001, 1 - k));
      if (k >= 1) {
        yaw.remove(leaving.group);
        front.remove(leaving.parts.mount);
        leaving.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
        leaving.parts.mount.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
        leaving = null;
        current.group.visible = true;
      }
      animating = true;
    }
    if (current && !leaving) {
      const k = Math.min(1, Math.max(0, (now - growStart) / GROW_MS));
      applyGrowth(current, k);
      if (k < 1) animating = true;
      if (current.parts.tagPivot) {
        // spring + wind on the tag
        // damped spring, integrated in fixed 16 ms steps so slow frames stay stable
        for (let left = dt; left > 0; left -= 16) {
          const f = Math.min(16, left) / 16;
          tagSwing.v += (-tagSwing.a * 0.02 - tagSwing.v * 0.06 + gust * 0.004 * Math.sin(uniforms.uTime.value * 3)) * f;
          tagSwing.a = Math.max(-0.7, Math.min(0.7, tagSwing.a + tagSwing.v * f));
        }
        const sway = reduced ? 0 : Math.sin(uniforms.uTime.value * 1.4) * 0.05;
        current.parts.tagPivot.rotation.set(0, -0.12 + sway, tagSwing.a + sway * 0.5);
        if (Math.abs(tagSwing.v) > 0.0005) animating = true;
      }
    }
    applyLift();

    if (motes) {
      const p = motes.geometry.attributes.position;
      for (let i = 0; i < p.count; i++) {
        let y = p.getY(i) + sec * (0.04 + (i % 7) * 0.008);
        let x = p.getX(i) + Math.sin(uniforms.uTime.value * 0.5 + i) * sec * 0.05 + uniforms.uGustDir.value.x * gust * sec * 0.6;
        if (y > 2.6) y = 0;
        if (x > 1.8) x = -1.8; else if (x < -1.8) x = 1.8;
        p.setXY(i, x, y);
      }
      p.needsUpdate = true;
    }

    lean.x += (lean.tx - lean.x) * Math.min(1, sec * 3);
    lean.y += (lean.ty - lean.y) * Math.min(1, sec * 3);
    look.lerp(lookTo, reduced ? 1 : 0.06);
    dist += (distTo - dist) * (reduced ? 1 : 0.06);
    if (Math.abs(dist - distTo) > 0.002) animating = true;
    const theta = lean.x * 0.22;
    const elev = 0.16 - lean.y * 0.05;
    camera.position.set(look.x + Math.sin(theta) * dist, look.y + dist * elev, Math.cos(theta) * dist);
    camera.lookAt(look.x, look.y + liftK * 0.25, look.z);

    renderer.render(scene, camera);

    const keepGoing = visible && !document.hidden && (!reduced || animating || dragging || Math.abs(yawVel) > 0.0002);
    if (keepGoing) requestAnimationFrame(frame); else running = false;
  }

  resize();
  setSize(initialSize);
  look.copy(lookTo); dist = distTo;
  return { setSize, setLift, setAge, gust: () => { gustTo = 1; swing(1.2); wake(); } };
}
