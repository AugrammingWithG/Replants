// One table drives the size rail, the docket, the readout and the 3D tree.
// Prices are replants.com salvage-site prices (October 2026).
export const SIZES = [
  { id: 's010', heads: 1, h: 0.10, price: 50 },
  { id: 's020', heads: 1, h: 0.20, price: 100 },
  { id: 's040', heads: 1, h: 0.40, price: 150 },
  { id: 's060', heads: 1, h: 0.60, price: 200 },
  { id: 's080', heads: 1, h: 0.80, price: 250 },
  { id: 's100', heads: 1, h: 1.00, price: 300 },
  { id: 's120', heads: 1, h: 1.20, price: 350 },
  { id: 'm040', heads: 2, h: 0.40, price: 340 },
  { id: 'm120', heads: 3, h: 1.20, price: 750 },
  { id: 'mbig', heads: 3, h: 1.60, price: null, over: true },
];

const GROWTH_M_PER_YEAR = 0.012;

const state = {
  size: SIZES.find((s) => s.id === 's060'),
  method: 'pickup',
  qty: 1,
  dig: false,
  formula: true,
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = (n) => '$' + n.toLocaleString('en-AU');

export const heightLabel = (s) => (s.over ? 'over 1.2 m' : s.h.toFixed(2) + ' m');
export const priceLabel = (s) => (s.price == null ? 'On request' : money(s.price));
const ageLabel = (s) =>
  s.over ? 'over 100 years' : 'about ' + Math.round(s.h / GROWTH_M_PER_YEAR) + ' years';
const headsLabel = (s) => (s.heads > 1 ? (s.over ? 'multi-head' : s.heads + ' heads') : 'single head');
const formulaTub = (s) => (s.h <= 0.4 && s.heads === 1 ? { kg: '0.8 kg', price: 15 } : { kg: '1.7 kg', price: 25 });

let tree = null;

// Seeded so the hand-stamped wobble and the spray are the same on every load.
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tag lettering is punched into the metal: each letter struck on its own,
// a dark rim where the punch bit in, a lit lower lip, and a recessed face.
function punched(text, size) {
  return `<canvas class="punch" data-text="${text}" data-size="${size}" aria-hidden="true"></canvas>`;
}

function drawPunches() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  $$("canvas.punch").forEach((c, n) => {
    const r = seeded(500 + n);
    const size = Number(c.dataset.size);
    const text = c.dataset.text;
    const g = c.getContext("2d");
    const font = `850 ${size}px Anybody`;
    g.font = font;
    if ("fontStretch" in g) g.fontStretch = "semi-condensed";
    const gap = size * 0.04;
    const widths = [...text].map((ch) => (ch === " " ? size * 0.22 : g.measureText(ch).width));
    const w = widths.reduce((a, b) => a + b + gap, 0) + 4;
    const h = size * 1.12;
    c.width = Math.ceil(w * dpr); c.height = Math.ceil(h * dpr);
    c.style.width = w + "px"; c.style.height = h + "px";
    g.scale(dpr, dpr);
    g.font = font;
    if ("fontStretch" in g) g.fontStretch = "semi-condensed";
    g.textBaseline = "alphabetic";
    let x = 2;
    [...text].forEach((ch, i) => {
      if (ch !== " ") {
        const dy = (r() - 0.5) * size * 0.07;
        const rot = (r() - 0.5) * 0.06;
        g.save();
        g.translate(x, size * 0.92 + dy);
        g.rotate(rot);
        g.fillStyle = "rgba(255,255,255,0.8)";
        g.fillText(ch, 0.9, 1.2);
        g.fillStyle = "rgba(18,20,24,0.9)";
        g.fillText(ch, -0.7, -0.9);
        g.fillStyle = "#4b5056";
        g.fillText(ch, 0, 0);
        g.restore();
      }
      x += widths[i] + gap;
    });
  });
}

function spray(r) {
  const dots = Array.from({ length: 26 }, () => {
    const a = r() * Math.PI * 2;
    const rad = 1 + (r() - 0.3) * 0.22;
    const x = 60 + Math.cos(a) * 54 * rad, y = 75 + Math.sin(a) * 68 * rad;
    return `<circle class="spray-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.5 + r() * 1.4).toFixed(1)}" opacity="${(0.35 + r() * 0.5).toFixed(2)}"/>`;
  }).join("");
  const dx = (84 + r() * 18).toFixed(1);
  return `<svg class="tag__spray" viewBox="0 0 120 150" preserveAspectRatio="none" aria-hidden="true">
        <path class="spray-line" d="M64 7C101 5 117 42 114 80c-3 42-27 64-58 63-34-1-50-30-49-69C8 34 29 6 70 10" stroke-width="5"/>
        <path class="spray-line" d="M58 11c34-3 52 30 51 66-1 40-22 59-52 60" stroke-width="2" opacity=".5"/>
        ${dots}
        <path class="spray-drip" d="M${dx} 128v${(8 + r() * 12).toFixed(1)}" stroke-width="2"/>
      </svg>`;
}

/* ---------- Size rail ---------- */

function buildRail() {
  const rail = $('[data-rail]');
  const r = seeded(2000);
  rail.innerHTML = SIZES.map(
    (s) => `
    <label class="tag">
      <input type="radio" name="size" value="${s.id}" ${s === state.size ? 'checked' : ''}
        aria-label="${heightLabel(s)} trunk, ${headsLabel(s)}, ${priceLabel(s)}">
      <span class="tag__plate" aria-hidden="true">
        <span class="tag__h">${punched((s.over ? '1.2+' : s.h.toFixed(1)) + ' M', 26)}</span>
        <span class="tag__heads">${headsLabel(s)}</span>
        <span class="tag__p">${punched(s.price == null ? 'POA' : money(s.price), 19)}</span>
      </span>
      ${spray(r)}
    </label>`
  ).join('');

  rail.addEventListener('change', (e) => {
    if (e.target.name !== 'size') return;
    setSize(e.target.value);
  });
}

function buildSelect() {
  const sel = $('[data-size-select]');
  sel.innerHTML = SIZES.map(
    (s) => `<option value="${s.id}">${heightLabel(s)}, ${headsLabel(s)} · ${priceLabel(s)}</option>`
  ).join('');
  sel.value = state.size.id;
  sel.addEventListener('change', () => setSize(sel.value));
}

function setSize(id) {
  const s = SIZES.find((x) => x.id === id);
  if (!s || s === state.size) return;
  state.size = s;
  const radio = $(`input[name="size"][value="${id}"]`);
  if (radio) radio.checked = true;
  $('[data-size-select]').value = id;
  render();
  tree?.setSize(s);
}

/* ---------- Quote ---------- */

function quote() {
  const s = state.size;
  const q = state.qty;
  const lines = [];
  let total = 0;
  let poa = false;

  const label = `${q} × ${heightLabel(s)} grass tree${q > 1 ? 's' : ''}`;
  if (s.price == null) { lines.push([label, 'On request']); poa = true; }
  else { lines.push([label, money(s.price * q)]); total += s.price * q; }

  if (state.method !== 'pickup') {
    const d = q === 1 ? 100 : 75 * q;
    lines.push([`Delivery, metro${q > 1 ? ' ($75 a tree)' : ''}`, money(d)]);
    total += d;
  }
  if (state.method === 'installed') {
    if (s.h > 1.2 || s.over) { lines.push(['Installation, feature tree', 'On request']); poa = true; }
    else {
      const per = state.dig ? 75 : 100;
      lines.push([`Installation${state.dig ? ', you dig' : ''} ($${per} a tree)`, money(per * q)]);
      total += per * q;
    }
  }
  if (state.formula) {
    const tub = formulaTub(s);
    lines.push([`Transplant Formula ${tub.kg} × ${q}`, money(tub.price * q)]);
    total += tub.price * q;
  }
  return { lines, total, poa };
}

function render() {
  const s = state.size;
  $('[data-out="height"]').textContent = heightLabel(s);
  $('[data-out="trunk-label"]').textContent = s.heads > 1 ? `Trunk · ${s.over ? 'multi' : s.heads} heads` : 'Trunk';
  $('[data-out="age"]').textContent = ageLabel(s);
  $('[data-out="price"]').textContent = priceLabel(s);
  $('[data-out="qty"]').textContent = state.qty;
  $('[data-qty="-1"]').disabled = state.qty <= 1;
  $('[data-qty="1"]').disabled = state.qty >= 20;
  $('[data-dig-wrap]').hidden = state.method !== 'installed';

  const { lines, total, poa } = quote();
  $('[data-lines]').innerHTML = lines
    .map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`)
    .join('');
  $('[data-out="total"]').textContent = poa ? (total ? `${money(total)} + quote` : 'We’ll quote') : money(total);
}

function bindDocket() {
  $$('input[name="method"]').forEach((r) =>
    r.addEventListener('change', () => { state.method = r.value; render(); })
  );
  $$('[data-qty]').forEach((b) =>
    b.addEventListener('click', () => {
      state.qty = Math.min(20, Math.max(1, state.qty + Number(b.dataset.qty)));
      render();
    })
  );
  $('[data-dig]').addEventListener('change', (e) => { state.dig = e.target.checked; render(); });
  $('[data-formula]').addEventListener('change', (e) => { state.formula = e.target.checked; render(); });

  const form = $('[data-docket]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [
      [$('#f-name'), $('#e-name')],
      [$('#f-phone'), $('#e-phone')],
    ];
    let firstBad = null;
    for (const [input, err] of fields) {
      const bad = !input.value.trim();
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby');
      err.hidden = !bad;
      if (bad && !firstBad) firstBad = input;
    }
    if (firstBad) { firstBad.focus(); return; }

    const { lines } = quote();
    const method = { pickup: 'Pick it up myself', delivered: 'Delivered', installed: 'Installed' }[state.method];
    const body = [
      `Hi Replants,`,
      ``,
      `I'd like: ${state.qty} × ${heightLabel(state.size)} grass tree (${headsLabel(state.size)})`,
      `How: ${method}`,
      ...lines.map(([k, v]) => `  ${k}: ${v}`),
      `Estimate: ${$('[data-out="total"]').textContent}`,
      ``,
      `Name: ${$('#f-name').value.trim()}`,
      `Phone: ${$('#f-phone').value.trim()}`,
      `Suburb: ${$('#f-suburb').value.trim() || '-'}`,
    ].join('\n');
    $('[data-stamp]').hidden = false;
    window.location.href =
      'mailto:sales@replants.com?subject=' + encodeURIComponent('Grass tree request') + '&body=' + encodeURIComponent(body);
  });

  for (const id of ['#f-name', '#f-phone']) {
    $(id).addEventListener('input', (e) => {
      if (e.target.value.trim()) {
        e.target.setAttribute('aria-invalid', 'false');
        $(id.replace('#f-', '#e-')).hidden = true;
      }
    });
  }
}

/* ---------- Nav ---------- */

function bindNav() {
  const nav = $('.site-nav');
  const btn = $('.site-nav__toggle');
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) { nav.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); btn.focus();
    }
  });
}

/* ---------- 3D ---------- */

async function startTree() {
  const stage = $('[data-stage]');
  const canvas = $('.hero__canvas', stage);
  try {
    const probe = document.createElement('canvas');
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('no webgl');
    const { createTreeScene } = await import('./tree.js');
    await document.fonts.ready;
    tree = await createTreeScene(canvas, state.size);
  } catch (err) {
    console.warn('3D tree unavailable, showing photo instead.', err);
    document.documentElement.classList.add('no-webgl');
  }
}

buildRail();
document.fonts.ready.then(drawPunches);
buildSelect();
bindDocket();
bindNav();
render();
startTree();
