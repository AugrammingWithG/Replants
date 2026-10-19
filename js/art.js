// Flat cut-paper drawings for the height chart, the shelf and order lines.

const GREENS = ['#8fbf3a', '#7cad2f', '#a3cc4d', '#6d9f2a', '#5f8f22'];
const STRAWS = ['#c99a52', '#b98843', '#d8b06a'];
const INK = '#1d1a16';

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909)) >>> 0) / 4294967296;
}

function crown(cx, cy, r, rand, size = 1) {
  let out = '';
  // dry skirt first, so the green sits on top
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 2) + (rand() - 0.5) * 1.5;
    const l = (22 + rand() * 14) * size;
    const x2 = cx + Math.cos(a) * l * 0.8, y2 = cy + Math.sin(a) * l;
    out += `<path d="M${cx.toFixed(1)} ${cy.toFixed(1)} Q ${(cx + Math.cos(a) * l * 0.5).toFixed(1)} ${(cy + l * 0.4).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${STRAWS[i % 3]}" stroke-width="${(3 * size).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < 34; i++) {
    const a = -Math.PI + (i / 33) * Math.PI + (rand() - 0.5) * 0.12;
    const l = r * (0.75 + rand() * 0.3);
    const ex = cx + Math.cos(a) * l, ey = cy + Math.sin(a) * l * 0.95;
    // fronds droop as they reach out
    const droop = Math.abs(Math.cos(a)) * l * 0.45;
    out += `<path d="M${cx.toFixed(1)} ${cy.toFixed(1)} Q ${(cx + Math.cos(a) * l * 0.6).toFixed(1)} ${(cy + Math.sin(a) * l * 0.75).toFixed(1)} ${ex.toFixed(1)} ${(ey + droop).toFixed(1)}" stroke="${GREENS[(rand() * GREENS.length) | 0]}" stroke-width="${(3.2 * size).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
  }
  return out;
}

// A grass tree drawn to scale: trunk metres to pixels, ground at the bottom.
// Returns the svg string and its height in the shared chart scale.
export function treeSvg(h, heads = 1, { seed = 5, label = '' } = {}) {
  const rand = rng(seed + Math.round(h * 100) + heads);
  const trunk = Math.max(6, h * 200);
  const crownR = heads > 1 ? 44 : 58;
  const H = trunk + crownR + 26;
  const W = 170;
  const cx = W / 2, base = H;
  let body = '';
  const trunkW = 14 + h * 6;
  const trunkPath = (x1, y1, x2, y2, w) =>
    `<path d="M${x1 - w / 2} ${y1} L${x2 - w * 0.42} ${y2} L${x2 + w * 0.42} ${y2} L${x1 + w / 2} ${y1} Z" fill="${INK}"/>`;
  if (heads <= 1) {
    body += trunkPath(cx, base, cx, base - trunk, trunkW);
    // chevrons of old leaf bases on the trunk
    for (let y = base - 6; y > base - trunk + 4; y -= 8) body += `<path d="M${cx - trunkW * 0.35} ${y} l${trunkW * 0.35} -3 l${trunkW * 0.35} 3" stroke="#4a4036" stroke-width="1.6" fill="none"/>`;
    body += crown(cx, base - trunk, crownR, rand);
  } else {
    const fork = base - trunk * 0.55;
    body += trunkPath(cx, base, cx, fork, trunkW);
    const n = heads;
    for (let i = 0; i < n; i++) {
      const dx = (i - (n - 1) / 2) * 46;
      const ty = base - trunk - (i % 2) * 12;
      body += trunkPath(cx, fork + 2, cx + dx, ty, trunkW * 0.75);
    }
    for (let i = 0; i < n; i++) {
      const dx = (i - (n - 1) / 2) * 46;
      body += crown(cx + dx, base - trunk - (i % 2) * 12, crownR, rand, 0.85);
    }
  }
  const vbW = heads > 1 ? W + 60 : W;
  const x0 = heads > 1 ? -30 : 0;
  return {
    height: H,
    svg: `<svg viewBox="${x0} 0 ${vbW} ${H}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">${label}${body}</svg>`,
  };
}

const tub = (w, h, x, y, band = '#c4461f') =>
  `<path d="M${x} ${y} h${w} l-${w * 0.08} ${h} h-${w * 0.84} z" fill="#fdfcf9"/><rect x="${x + w * 0.04}" y="${y + h * 0.3}" width="${w * 0.92}" height="${h * 0.3}" fill="${band}"/><rect x="${x - 3}" y="${y - 7}" width="${w + 6}" height="9" rx="3" fill="#1d1a16"/>`;

const miniTree = (x, y, s = 1) => {
  const rand = rng(Math.round(x * 7 + y));
  return `<rect x="${x - 3 * s}" y="${y - 14 * s}" width="${6 * s}" height="${14 * s}" fill="${INK}"/>` + crown(x, y - 14 * s, 15 * s, rand, 0.55 * s);
};

export const ART = {
  special: `<svg viewBox="0 0 120 80" aria-hidden="true"><rect x="10" y="48" width="86" height="12" rx="2" fill="${INK}"/><path d="M96 54 h18" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="34" cy="64" r="9" fill="${INK}"/><circle cx="34" cy="64" r="3" fill="#9a9388"/>${miniTree(28, 48, 1.15)}${miniTree(56, 48, 0.85)}${miniTree(78, 48, 0.85)}</svg>`,
  multi: `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M56 90 L58 52 L64 52 L66 90Z" fill="${INK}"/><path d="M58 56 L38 30 L44 28 L63 54Z M64 56 L82 26 L88 30 L66 58Z" fill="${INK}"/>${crown(41, 30, 26, rng(3), 0.7)}${crown(85, 28, 26, rng(9), 0.7)}</svg>`,
  'tub-s': `<svg viewBox="0 0 120 80" aria-hidden="true">${tub(34, 34, 43, 38)}</svg>`,
  'tub-m': `<svg viewBox="0 0 120 80" aria-hidden="true">${tub(46, 44, 37, 28)}</svg>`,
  'tub-l': `<svg viewBox="0 0 120 80" aria-hidden="true">${tub(70, 58, 25, 16)}</svg>`,
  prune: `<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M30 64 L64 34" stroke="#c4461f" stroke-width="12" stroke-linecap="round"/><path d="M44 70 L68 38" stroke="#2c5fd0" stroke-width="12" stroke-linecap="round"/><path d="M64 34 L96 12 L92 24 Z M68 38 L100 22 L90 34 Z" fill="#cfc9be" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><circle cx="66" cy="36" r="4" fill="${INK}"/></svg>`,
  maint: `<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M36 30 h40 l-4 40 h-32 z" fill="#2c5fd0"/><path d="M76 40 L100 22" stroke="#2c5fd0" stroke-width="7" stroke-linecap="round"/><ellipse cx="102" cy="20" rx="6" ry="9" transform="rotate(-50 102 20)" fill="#2c5fd0"/><path d="M44 30 q12 -20 24 0" stroke="${INK}" stroke-width="5" fill="none"/><path d="M106 30 l4 8 M100 32 l2 9 M110 24 l6 6" stroke="#9cccf5" stroke-width="3" stroke-linecap="round"/></svg>`,
  makeover: `<svg viewBox="0 0 120 80" aria-hidden="true"><rect x="8" y="58" width="104" height="14" rx="4" fill="#c4461f"/>${miniTree(30, 58, 1)}${miniTree(66, 58, 1.3)}<circle cx="94" cy="50" r="9" fill="#e8892b"/><path d="M94 58 v-3" stroke="#3d7a55" stroke-width="3"/></svg>`,
  clearing: `<svg viewBox="0 0 120 80" aria-hidden="true"><rect x="14" y="52" width="66" height="14" rx="7" fill="${INK}"/><path d="M18 52 h56 v-14 h-22 l-6 -14 h-24 z" fill="#e8892b"/><rect x="26" y="28" width="16" height="12" fill="#9cccf5"/><path d="M80 44 l14 -4 l6 2 l2 26 h-10 z" fill="#3a352e"/>${miniTree(104, 52, 0.7)}</svg>`,
  voucher: `<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M16 22 h88 v12 a6 6 0 0 0 0 12 v12 h-88 v-12 a6 6 0 0 0 0 -12 z" fill="#fdfcf9" stroke="${INK}" stroke-width="2"/><path d="M40 24 v36" stroke="${INK}" stroke-width="2" stroke-dasharray="4 4"/>${miniTree(72, 54, 0.9)}</svg>`,
  timber: `<svg viewBox="0 0 120 80" aria-hidden="true"><g fill="#b4703a" stroke="${INK}" stroke-width="2"><circle cx="40" cy="56" r="16"/><circle cx="74" cy="56" r="16"/><circle cx="57" cy="30" r="16"/></g><g fill="none" stroke="#7a4a2a" stroke-width="2"><circle cx="40" cy="56" r="8"/><circle cx="74" cy="56" r="8"/><circle cx="57" cy="30" r="8"/></g></svg>`,
};

export const LEAF = (color) =>
  `<svg viewBox="0 0 60 160" aria-hidden="true"><path d="M30 2 C 58 40, 56 112, 30 158 C 4 112, 2 40, 30 2 Z" fill="${color}"/><path d="M30 10 Q 32 80 30 152" stroke="rgba(0,0,0,.18)" stroke-width="2" fill="none"/></svg>`;
