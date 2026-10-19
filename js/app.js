// Replants concept. One order you fill from anywhere on the page; one size
// that the pull-tab, the height chart, the chat and the pop-up tree all share.
import {
  PHONE, TEL, SIZES, SINGLE, MULTI, sizeById, money, heightLabel, shortHeight, priceLabel, ageLabel,
  headsLabel, treeName, SHELF, shelfById, STORY, STAGES, REMINDERS, PLACES, perthNow, openState, KB, CHIPS,
} from './data.js';
import { treeSvg, ART, LEAF } from './art.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover)').matches;
document.documentElement.classList.add('js');

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode: the order just won't persist */ } },
};

const params = new URLSearchParams(location.search);
const state = {
  size: sizeById(params.get('size')) || sizeById('s060'),
  lines: [],          // { key: 'tree:s060' | shelf id, qty }
  method: 'pickup', dig: false, place: 'rockingham', day: null, time: null,
  step: 1, shelf: params.get('shelf') || 'all',
};
const saved = store.get('replants-order');
if (saved?.lines) state.lines = saved.lines.filter((l) => itemFor(l.key));

let book = null;

function setParam(k, v) {
  const p = new URLSearchParams(location.search);
  if (v == null) p.delete(k); else p.set(k, v);
  const q = p.toString();
  history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash);
}

function toast(text) {
  const t = $('[data-toast]');
  t.textContent = text;
  t.classList.add('is-on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('is-on'), 2600);
}

function retrigger(el, cls) {
  if (reduced || !el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

/* ================= items and prices ================= */

function itemFor(key) {
  if (key.startsWith('tree:')) {
    const s = sizeById(key.slice(5));
    return s && { key, kind: 'tree', size: s, name: treeName(s), meta: `${headsLabel(s)} · ${ageLabel(s)}`, price: s.price, group: 'trees' };
  }
  const p = shelfById(key);
  return p && (p.kind === 'item' || p.kind === 'service') ? { key, kind: p.kind, name: p.name, meta: '', price: p.price, group: p.group, art: p.art } : null;
}

function lineCost(line) {
  const it = itemFor(line.key);
  if (it.key === 'prune') return 75 + 25 * (line.qty - 1);
  if (it.key === 'maint') return line.qty <= 4 ? 75 : line.qty <= 10 ? 100 : null;
  return it.price == null ? null : it.price * line.qty;
}
const treeLines = () => state.lines.filter((l) => l.key.startsWith('tree:'));
const treeCount = () => treeLines().reduce((n, l) => n + l.qty, 0);
const hasSpecial = () => state.lines.some((l) => l.key === 'special');

function quote() {
  const rows = [];
  let total = 0, poa = false;
  for (const l of state.lines) {
    const it = itemFor(l.key), c = lineCost(l);
    if (c == null) poa = true; else total += c;
    rows.push([`${l.qty} × ${it.name}`, c == null ? 'Quote' : money(c)]);
  }
  const n = treeCount();
  if (n && state.method !== 'pickup') {
    const d = n === 1 ? 100 : 75 * n;
    rows.push(['Delivery, Perth metro', money(d)]);
    total += d;
  }
  if (n && state.method === 'installed') {
    const big = treeLines().some((l) => { const s = sizeById(l.key.slice(5)); return s.over || s.h > 1.2; });
    if (big) { rows.push(['Installation, feature tree', 'Quote']); poa = true; }
    else {
      const per = state.dig ? 75 : 100;
      rows.push([`Installation${state.dig ? ', you dig' : ''}`, money(per * n)]);
      total += per * n;
    }
  }
  return { rows, total, poa };
}
const totalLabel = ({ total, poa }) => (poa ? (total ? `${money(total)} + quote` : 'We’ll quote') : money(total));

/* ================= the order ================= */

function save() { store.set('replants-order', { lines: state.lines }); }

function addToOrder(key, qty = 1, from = null) {
  const it = itemFor(key);
  if (!it) return;
  const line = state.lines.find((l) => l.key === key);
  if (line) line.qty = Math.min(20, line.qty + qty);
  else state.lines.push({ key, qty, fresh: true });
  if (key === 'special') { state.method = 'pickup'; state.place = 'rockingham'; }
  save();
  fly(from, `+ ${it.name}`);
  renderOrder();
  renderShelfButtons();
}

function setQty(key, qty) {
  const line = state.lines.find((l) => l.key === key);
  if (!line) return;
  if (qty <= 0) state.lines = state.lines.filter((l) => l !== line);
  else line.qty = Math.min(20, qty);
  save();
  renderOrder();
  renderShelfButtons();
}

function fly(from, text) {
  const pill = $('.pill--order');
  const done = () => { retrigger(pill, 'is-bump'); };
  if (!from || reduced || !from.getBoundingClientRect) { done(); toast(`Added: ${text.slice(2)}`); return; }
  const a = from.getBoundingClientRect(), b = pill.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'flyer';
  el.textContent = text;
  document.body.append(el);
  const w = el.offsetWidth;
  const x0 = a.left + a.width / 2 - w / 2, y0 = a.top;
  const x1 = b.left + b.width / 2 - w / 2, y1 = b.top + b.height / 2 - 14;
  const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 90;
  el.animate([
    { transform: `translate(${x0}px, ${y0}px) rotate(0deg) scale(1)` },
    { transform: `translate(${mx}px, ${my}px) rotate(-10deg) scale(1.08)`, offset: 0.45 },
    { transform: `translate(${x1}px, ${y1}px) rotate(6deg) scale(0.35)`, opacity: 0.3 },
  ], { duration: 820, easing: 'cubic-bezier(.5,0,.4,1)' }).finished.then(() => { el.remove(); done(); });
}

function renderPill() {
  const count = state.lines.reduce((n, l) => n + l.qty, 0);
  const q = quote();
  $('[data-order-count]').textContent = count;
  $('[data-order-total]').textContent = count ? totalLabel(q) : 'Your order';
  $('[data-order-open].pill').setAttribute('aria-label', count ? `Your order: ${count} item${count > 1 ? 's' : ''}, ${totalLabel(q)}` : 'Your order, empty');
}

function lineArt(it) {
  if (it.kind === 'tree') return treeSvg(Math.min(it.size.h, 1.2), it.size.heads).svg;
  return ART[it.art] || '';
}

function renderOrder() {
  renderPill();
  const list = $('[data-lines]');
  list.innerHTML = state.lines.map((l) => {
    const it = itemFor(l.key), c = lineCost(l);
    const color = it.group === 'care' ? 'var(--crown)' : it.group === 'services' ? 'var(--ochre)' : 'var(--sky)';
    return `<li class="line${l.fresh && !reduced ? ' is-new' : ''}" data-key="${l.key}">
      <span class="line__art" style="--c:${color}">${lineArt(it)}</span>
      <span class="line__name">${it.name}${it.meta ? `<span class="line__meta"><br>${it.meta}</span>` : ''}</span>
      <span class="line__price">${c == null ? 'Quote' : money(c)}</span>
      <span class="line__ctrls" style="grid-column: 2 / -1">
        <button type="button" data-q="-1" aria-label="${l.qty === 1 ? 'Remove' : 'One fewer'} ${it.name}"><svg class="ico"><use href="#i-${l.qty === 1 ? 'trash' : 'minus'}"/></svg></button>
        <output aria-label="Quantity">${l.qty}</output>
        <button type="button" data-q="1" aria-label="One more ${it.name}"><svg class="ico"><use href="#i-plus"/></svg></button>
      </span></li>`;
  }).join('');
  state.lines.forEach((l) => delete l.fresh);
  $('[data-empty]').hidden = state.lines.length > 0;

  // formula is a warranty condition: offer the right tub for each tree
  const nudge = $('[data-nudge]');
  const trees = treeLines();
  const hasFormula = state.lines.some((l) => /^f(08|17|15)$/.test(l.key));
  if (trees.length && !hasFormula) {
    let small = 0, big = 0;
    trees.forEach((l) => { const s = sizeById(l.key.slice(5)); if (s.heads === 1 && s.h <= 0.4) small += l.qty; else big += l.qty; });
    const label = [big && `${big} × 1.7 kg`, small && `${small} × 0.8 kg`].filter(Boolean).join(' + ');
    nudge.innerHTML = `<span>Transplant Formula is needed for the 12-month warranty.</span><button type="button" class="link" data-add-formula="${big},${small}">Add ${label}</button>`;
    nudge.hidden = false;
  } else nudge.hidden = true;

  renderSum();
  syncSteps();
}

function renderSum() {
  const q = quote();
  $('[data-sum]').innerHTML = (state.step > 1 ? q.rows.filter((r) => /^(Delivery|Installation)/.test(r[0])).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('') : '')
    + `<div class="sum__total"><dt>Estimate</dt><dd>${state.lines.length ? totalLabel(q) : '$0'}</dd></div>`
    + (state.day && state.time ? `<div><dt>When</dt><dd>${whenLabel()}</dd></div>` : '');
}

/* ----- days and slots ----- */

const DAY = 86400000;
const fmtDay = (d) => d.toLocaleDateString('en-AU', { weekday: 'short' });
const fmtDate = (d) => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function upcoming(match, count) {
  const out = [], d = new Date();
  d.setHours(12, 0, 0, 0);
  for (let i = 1; out.length < count && i < 120; i++) {
    const day = new Date(d.getTime() + i * DAY);
    if (match(day.getDay())) out.push(day);
  }
  return out;
}
function scheduleFor() {
  if (!treeCount() && !hasSpecial()) return { days: upcoming((w) => w >= 1 && w <= 5, 8), times: ['Morning', 'Afternoon'] };
  if (state.method === 'pickup' && state.place === 'rockingham') return { days: upcoming((w) => w === 6, 5), times: ['8:00', '8:45', '9:30', '10:15', '11:00', '11:45'] };
  if (state.method === 'pickup') return { days: upcoming((w) => w === 0 || w >= 3, 8), times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] };
  return { days: upcoming((w) => w >= 1 && w <= 5, 8), times: ['Morning', 'Afternoon'] };
}
// demo availability: a stable share of slots shows as taken
function taken(day, time) {
  let h = 2166136261;
  for (const c of iso(day) + time + state.place + state.method) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 100) < 28;
}
function whenLabel() {
  const d = new Date(state.day + 'T12:00:00');
  const where = !treeCount() && !hasSpecial() ? '' : state.method === 'pickup' ? (state.place === 'rockingham' ? ' · Rockingham' : ' · Fremantle') : ' · delivery';
  return `${fmtDay(d)} ${fmtDate(d)}, ${state.time}${where}`;
}

function renderWhen() {
  const trees = treeCount() > 0 || hasSpecial();
  $('[data-methods]').hidden = !trees;
  if (hasSpecial()) { state.method = 'pickup'; state.place = 'rockingham'; }
  $$('input[name="method"]').forEach((r) => { r.checked = r.value === state.method; r.disabled = hasSpecial() && r.value !== 'pickup'; });
  $('[data-dig-wrap]').hidden = !trees || state.method !== 'installed';
  const pickup = trees && state.method === 'pickup';
  $('[data-when-pickup]').hidden = !pickup;
  $('[data-when-delivery]').hidden = pickup;
  $('[data-when-delivery]').textContent = trees
    ? 'Pick a day that suits. We’ll call the day before with a time window.'
    : 'Formula and services: pick a day that suits and we’ll call to arrange it.';
  $$('input[name="place"]').forEach((r) => { r.checked = r.value === state.place; r.disabled = hasSpecial() && r.value !== 'rockingham'; });
  placePill($('[data-place]'));
  $('[data-place-hint]').textContent = PLACES[state.place].note;
  $('[data-times-label]').textContent = pickup ? 'Time' : 'Time of day';

  const { days, times } = scheduleFor();
  if (!days.some((d) => iso(d) === state.day)) { state.day = null; state.time = null; }
  $('[data-days]').innerHTML = days.map((d) =>
    `<label><input type="radio" name="day" value="${iso(d)}" ${iso(d) === state.day ? 'checked' : ''}><span>${fmtDay(d)}<small>${fmtDate(d)}</small></span></label>`).join('');
  const day = days.find((d) => iso(d) === state.day);
  $('[data-times]').innerHTML = day
    ? times.map((t) => { const off = taken(day, t); return `<label><input type="radio" name="time" value="${t}" ${off ? 'disabled' : ''} ${t === state.time ? 'checked' : ''}><span>${t}${off ? '<small>Taken</small>' : ''}</span></label>`; }).join('')
    : '<p class="hint">Pick a day first.</p>';
}

/* ----- steps ----- */

const STEP_P = { 1: '6%', 2: '38%', 3: '70%', 4: '100%' };
function syncSteps() {
  const n = state.step;
  $$('[data-step-tab]').forEach((li) => { const i = +li.dataset.stepTab; if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
  const sheet = $('[data-order]');
  sheet.style.setProperty('--p', STEP_P[n]);
  sheet.style.setProperty('--p-n', parseFloat(STEP_P[n]) / 100);
  const next = $('[data-next]');
  next.hidden = n >= 3;
  $('[data-send-wrap]').hidden = n !== 3;
  next.disabled = n === 1 && !state.lines.length;
  next.querySelector('span').textContent = n === 1 ? 'Choose how and when' : 'Your details';
  $('[data-back]').hidden = n === 1 || n === 4;
}

function goTo(n) {
  const from = $$('[data-pane]').find((p) => !p.hidden);
  const to = $(`[data-pane="${n}"]`);
  const dir = n >= state.step ? 1 : -1;
  state.step = n;
  if (n === 2) renderWhen();
  if (n === 3) $('[data-address-wrap]').hidden = !(treeCount() && state.method !== 'pickup');
  if (from !== to) {
    const swap = () => { if (from) from.hidden = true; to.hidden = false; $$('.seg', to).forEach(placePill); };
    if (reduced || !to.animate) swap();
    else {
      (from ? from.animate([{ opacity: 1 }, { opacity: 0, transform: `translateX(${-24 * dir}px) rotate(${-1.5 * dir}deg)` }], { duration: 160, easing: 'ease-in' }).finished : Promise.resolve())
        .then(() => { swap(); to.animate([{ opacity: 0, transform: `translateX(${30 * dir}px) rotate(${2 * dir}deg)` }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.34,1.4,.64,1)' }); });
    }
  }
  retrigger($('[data-trip-truck]'), 'is-driving');
  $('.sheet__body').scrollTop = 0;
  syncSteps();
  renderSum();
  if (n === 4) setTimeout(() => to.focus(), 60);
  if (n === 3) setTimeout(() => $('#f-name').focus({ preventScroll: true }), 520);
  if (n === 2) setTimeout(() => $('[data-next]').focus({ preventScroll: true }), 60);
}

function validateWhen() {
  if (state.day && state.time) return true;
  const target = state.day ? $('[data-times]') : $('[data-days]');
  retrigger(target, 'is-shake');
  $('[data-times-label]').textContent = state.day ? 'Pick a time' : 'Pick a day first';
  return false;
}
function validateDetails() {
  let first = null;
  for (const [id, err] of [['#f-name', '#e-name'], ['#f-phone', '#e-phone']]) {
    const input = $(id), bad = !input.value.trim();
    input.setAttribute('aria-invalid', String(bad));
    if (bad) input.setAttribute('aria-describedby', err.slice(1)); else input.removeAttribute('aria-describedby');
    $(err).hidden = !bad;
    if (bad && !first) first = input;
  }
  first?.focus();
  return !first;
}

function orderText() {
  const q = quote();
  const trees = treeCount() || hasSpecial();
  const how = trees ? { pickup: 'Pick up', delivered: 'Delivered', installed: 'Installed' }[state.method] : 'Arrange by phone';
  return [
    'Hi Replants,', '', 'I’d like to order:',
    ...q.rows.map(([k, v]) => `  ${k}: ${v}`),
    `Estimate: ${totalLabel(q)}`,
    `How: ${how}`,
    state.day ? `When: ${whenLabel()}` : '',
    '',
    `Name: ${$('#f-name').value.trim()}`,
    `Mobile: ${$('#f-phone').value.trim()}`,
    trees && state.method !== 'pickup' ? `Address: ${$('#f-address').value.trim() || '-'}` : '',
    `Notes: ${$('#f-notes').value.trim() || '-'}`,
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
}

function send(how) {
  if (!validateDetails()) return;
  const body = orderText();
  goTo(4);
  $('[data-done-text]').textContent = `${state.day ? whenLabel() + '. ' : ''}${how === 'sms' ? 'Your messages app should open with the order filled in.' : 'Your email app should open with the order filled in.'} We’ll call ${$('#f-phone').value.trim()} to confirm before anything is charged.`;
  location.href = how === 'sms'
    ? `sms:+61408885435?&body=${encodeURIComponent(body)}`
    : `mailto:sales@replants.com?subject=${encodeURIComponent('Grass tree order')}&body=${encodeURIComponent(body)}`;
}

/* ----- the sheet ----- */

let lastFocus = null;
function openOrder() {
  const sheet = $('[data-order]'), scrim = $('[data-scrim]');
  if (!sheet.hidden) return;
  lastFocus = document.activeElement;
  renderOrder();
  if (state.step === 4) goTo(1);
  sheet.hidden = false;
  scrim.hidden = false;
  retrigger(scrim, 'is-on');
  sheet.classList.remove('is-closing');
  retrigger(sheet, 'is-opening');
  $$('[data-order-open]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => $('[data-order-close]').focus(), 50);
}
function closeOrder() {
  const sheet = $('[data-order]'), scrim = $('[data-scrim]');
  if (sheet.hidden) return;
  sheet.classList.add('is-closing');
  $$('[data-order-open]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  document.documentElement.style.overflow = '';
  setTimeout(() => { sheet.hidden = true; scrim.hidden = true; sheet.classList.remove('is-closing'); }, reduced ? 0 : 280);
  lastFocus?.focus?.();
}

function bindOrder() {
  $$('[data-order-open]').forEach((b) => b.addEventListener('click', openOrder));
  $('[data-order-close]').addEventListener('click', closeOrder);
  $('[data-scrim]').addEventListener('click', closeOrder);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('[data-order]').hidden) closeOrder(); });
  $('[data-order]').addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const f = $$('button:not([disabled]):not([hidden]), a[href], input:not([disabled])', $('[data-order]')).filter((el) => el.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });
  $$('[data-close-go]').forEach((a) => a.addEventListener('click', () => closeOrder()));

  $('[data-lines]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    const key = b.closest('[data-key]').dataset.key;
    const line = state.lines.find((l) => l.key === key);
    const next = line.qty + Number(b.dataset.q);
    if (next <= 0 && !reduced) {
      const li = b.closest('.line');
      li.classList.add('is-gone');
      setTimeout(() => setQty(key, 0), 280);
    } else setQty(key, next);
  });
  $('[data-nudge]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-add-formula]');
    if (!b) return;
    const [big, small] = b.dataset.addFormula.split(',').map(Number);
    if (big) addToOrder('f17', big);
    if (small) addToOrder('f08', small);
  });

  $('[data-methods]').addEventListener('change', (e) => { state.method = e.target.value; renderWhen(); renderOrder(); });
  $('[data-dig]').addEventListener('change', (e) => { state.dig = e.target.checked; renderOrder(); });
  $('[data-place]').addEventListener('change', (e) => { state.place = e.target.value; state.time = null; renderWhen(); renderSum(); });
  $('[data-days]').addEventListener('change', (e) => { state.day = e.target.value; state.time = null; renderWhen(); renderSum(); });
  $('[data-times]').addEventListener('change', (e) => { state.time = e.target.value; renderSum(); });

  $('[data-next]').addEventListener('click', () => {
    if (state.step === 1 && state.lines.length) goTo(2);
    else if (state.step === 2 && validateWhen()) goTo(3);
  });
  $('[data-back]').addEventListener('click', () => goTo(state.step - 1));
  const form = $('[data-form]');
  form.addEventListener('submit', (e) => { e.preventDefault(); send(e.submitter?.value || 'email'); });
  for (const id of ['#f-name', '#f-phone']) {
    $(id).addEventListener('input', (e) => { if (e.target.value.trim()) { e.target.setAttribute('aria-invalid', 'false'); $(id.replace('#f-', '#e-')).hidden = true; } });
  }
  $('[data-copy]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(orderText()); toast('Order copied. Paste it into a message to 0408 885 435.'); }
    catch { toast('Couldn’t copy. Try Email or Text instead.'); }
  });
  $('[data-new-order]').addEventListener('click', () => { state.lines = []; save(); renderOrder(); renderShelfButtons(); goTo(1); });
  $('[data-ics-booking]').addEventListener('click', () => {
    const d = new Date(state.day + 'T12:00:00');
    const [hh, mm] = /\d/.test(state.time) ? state.time.split(':').map(Number) : [state.time === 'Morning' ? 8 : 12, 0];
    d.setHours(hh, mm, 0, 0);
    const pickup = state.method === 'pickup' && (treeCount() || hasSpecial());
    const end = new Date(d.getTime() + (pickup ? 45 : 240) * 60000);
    downloadIcs('replants-order.ics', [{
      start: d, end, title: pickup ? 'Pick up grass tree · Replants' : 'Replants visit',
      where: pickup ? PLACES[state.place].full : ($('#f-address').value.trim() || 'Your address'),
      note: `Replants ${PHONE}.`,
    }]);
  });
  renderOrder();
}

/* ================= calendar files ================= */

const icsStamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsDate = (d) => iso(d).replace(/-/g, '');
const icsText = (s) => s.replace(/[,;\\]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
function downloadIcs(name, events) {
  const now = icsStamp(new Date());
  const body = events.map((e, i) => [
    'BEGIN:VEVENT', `UID:replants-${now}-${i}@replants.com`, `DTSTAMP:${now}`,
    e.allDay ? `DTSTART;VALUE=DATE:${icsDate(e.start)}` : `DTSTART:${icsStamp(e.start)}`,
    e.allDay ? `DTEND;VALUE=DATE:${icsDate(new Date(e.start.getTime() + DAY))}` : `DTEND:${icsStamp(e.end)}`,
    `SUMMARY:${icsText(e.title)}`, e.where ? `LOCATION:${icsText(e.where)}` : '', `DESCRIPTION:${icsText(e.note || '')}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(e.title)}`, e.allDay ? 'TRIGGER:PT9H' : 'TRIGGER:-PT12H', 'END:VALARM',
    'END:VEVENT',
  ].filter(Boolean).join('\r\n')).join('\r\n');
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Replants//Concept//EN\r\nCALSCALE:GREGORIAN\r\n${body}\r\nEND:VCALENDAR\r\n`;
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ================= segmented toggles ================= */

function placePill(seg) {
  const pill = $('.seg__pill', seg);
  const on = $('input:checked', seg)?.closest('label');
  if (!pill || !on) return;
  pill.style.width = on.offsetWidth + 'px';
  pill.style.transform = `translateX(${on.offsetLeft - 4}px)`;
}
function initSegs() {
  const ro = new ResizeObserver((en) => en.forEach((e) => placePill(e.target)));
  $$('.seg').forEach((seg) => {
    const pill = document.createElement('span');
    pill.className = 'seg__pill';
    pill.style.left = '4px';
    seg.prepend(pill);
    seg.addEventListener('change', () => placePill(seg));
    placePill(seg);
    ro.observe(seg);
  });
}

/* ================= size: pull-tab, readout, chart ================= */

const stops = () => (state.size.heads > 1 ? MULTI : SINGLE);

function setSize(s, { from = 'tab' } = {}) {
  if (!s) return;
  const changed = s !== state.size;
  const groupChanged = (s.heads > 1) !== (state.size.heads > 1);
  state.size = s;
  if (groupChanged || from !== 'tab') {
    $$('input[name="heads"]').forEach((r) => (r.checked = (r.value === 'multi') === (s.heads > 1)));
    $$('input[name="chart-heads"]').forEach((r) => (r.checked = (r.value === 'multi') === (s.heads > 1)));
    $$('.seg').forEach(placePill);
    renderTicks();
    renderChart();
  }
  placeTab(false);
  renderReadout(changed);
  renderPick(changed);
  markChart();
  setParam('size', s.id === 's060' ? null : s.id);
  if (changed) book?.setSize(s);
}

function renderTicks() {
  const list = stops();
  $('[data-ticks]').innerHTML = list.map((s, i) =>
    `<i style="left:${(i / (list.length - 1)) * 100}%" data-tick="${s.id}">${s.over ? '1.2+' : s.h.toFixed(1)}</i>`).join('');
  const tab = $('[data-tab]');
  tab.setAttribute('aria-valuemax', String(list.length - 1));
}

function tabGeometry() {
  const wrap = $('[data-pulltab]'), tab = $('[data-tab]');
  const pad = 17.6; // ticks inset (1.1rem)
  return { width: wrap.clientWidth - tab.offsetWidth, ticksW: wrap.clientWidth - pad * 2, pad, tabW: tab.offsetWidth };
}
// The tab's centre sits over the tick for the current size.
function tabXFor(index) {
  const list = stops(), g = tabGeometry();
  const cx = g.pad + (index / (list.length - 1)) * g.ticksW;
  return Math.max(0, Math.min(g.width, cx - g.tabW / 2));
}
const tabSpring = { x: 0, v: 0, to: 0, raf: 0 };
function placeTab(animate = true) {
  const list = stops(), i = list.indexOf(state.size), tab = $('[data-tab]');
  tab.setAttribute('aria-valuenow', String(i));
  tab.setAttribute('aria-valuetext', `${heightLabel(state.size)} trunk, ${headsLabel(state.size)}, ${priceLabel(state.size)}`);
  $('[data-out="tab"]').textContent = shortHeight(state.size);
  $$('[data-tick]').forEach((t) => t.classList.toggle('is-on', t.dataset.tick === state.size.id));
  tabSpring.to = tabXFor(i);
  if (!animate || reduced) { tabSpring.x = tabSpring.to; tabSpring.v = 0; drawTab(); return; }
  runTabSpring();
}
function drawTab() {
  const tab = $('[data-tab]');
  tab.style.setProperty('--tx', tabSpring.x.toFixed(1) + 'px');
  tab.style.setProperty('--tilt', Math.max(-8, Math.min(8, tabSpring.v * 0.01)).toFixed(2) + 'deg');
}
function runTabSpring() {
  cancelAnimationFrame(tabSpring.raf);
  let last = performance.now();
  const step = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    tabSpring.v += (-(tabSpring.x - tabSpring.to) * 260 - tabSpring.v * 18) * dt;
    tabSpring.x += tabSpring.v * dt;
    drawTab();
    if (Math.abs(tabSpring.v) > 2 || Math.abs(tabSpring.x - tabSpring.to) > 0.3) tabSpring.raf = requestAnimationFrame(step);
    else { tabSpring.x = tabSpring.to; tabSpring.v = 0; drawTab(); }
  };
  tabSpring.raf = requestAnimationFrame(step);
}

function bindPullTab() {
  const wrap = $('[data-pulltab]'), tab = $('[data-tab]');
  let drag = null;
  const nearest = (x) => {
    const list = stops(), g = tabGeometry();
    const k = Math.round(((x + g.tabW / 2 - g.pad) / g.ticksW) * (list.length - 1));
    return list[Math.max(0, Math.min(list.length - 1, k))];
  };
  const down = (e) => {
    if (e.button > 0) return;
    const r = wrap.getBoundingClientRect();
    drag = { off: e.target.closest('[data-tab]') ? e.clientX - r.left - tabSpring.x : $('[data-tab]').offsetWidth / 2, last: e.clientX, t: performance.now() };
    wrap.classList.add('is-dragging');
    wrap.setPointerCapture(e.pointerId);
    cancelAnimationFrame(tabSpring.raf);
    move(e);
  };
  const move = (e) => {
    if (!drag) return;
    const r = wrap.getBoundingClientRect(), g = tabGeometry();
    const x = Math.max(-12, Math.min(g.width + 12, e.clientX - r.left - drag.off));
    const now = performance.now();
    tabSpring.v = ((e.clientX - drag.last) / Math.max(8, now - drag.t)) * 1000;
    drag.last = e.clientX; drag.t = now;
    tabSpring.x = x;
    drawTab();
    const s = nearest(x);
    if (s !== state.size) { setSizeFromTab(s); }
  };
  const up = () => {
    if (!drag) return;
    drag = null;
    wrap.classList.remove('is-dragging');
    tabSpring.to = tabXFor(stops().indexOf(state.size));
    runTabSpring();
  };
  const setSizeFromTab = (s) => {
    state.size = s;
    $$('[data-tick]').forEach((t) => t.classList.toggle('is-on', t.dataset.tick === s.id));
    $('[data-out="tab"]').textContent = shortHeight(s);
    tab.setAttribute('aria-valuenow', String(stops().indexOf(s)));
    renderReadout(true);
    renderPick(true);
    markChart();
    setParam('size', s.id === 's060' ? null : s.id);
    book?.setSize(s);
  };
  wrap.addEventListener('pointerdown', down);
  wrap.addEventListener('pointermove', move);
  wrap.addEventListener('pointerup', up);
  wrap.addEventListener('pointercancel', up);
  tab.addEventListener('keydown', (e) => {
    const list = stops(), i = list.indexOf(state.size);
    const to = { ArrowRight: i + 1, ArrowUp: i + 1, ArrowLeft: i - 1, ArrowDown: i - 1, Home: 0, End: list.length - 1 }[e.key];
    if (to == null) return;
    e.preventDefault();
    setSize(list[Math.max(0, Math.min(list.length - 1, to))]);
    placeTab(true);
  });
  $$('[data-step]').forEach((b) => b.addEventListener('click', () => {
    const list = stops(), i = list.indexOf(state.size) + Number(b.dataset.step);
    setSize(list[Math.max(0, Math.min(list.length - 1, i))]);
    placeTab(true);
  }));
  $('[data-heads]').addEventListener('change', (e) => setSize(e.target.value === 'multi' ? MULTI[0] : SINGLE[3], { from: 'heads' }));
  new ResizeObserver(() => placeTab(false)).observe(wrap);
}

function renderReadout(animate) {
  const s = state.size;
  const swap = (el, text) => {
    if (el.textContent === text) return;
    el.textContent = text;
    if (animate) retrigger(el, 'is-tick');
  };
  swap($('[data-out="height"]'), heightLabel(s));
  swap($('[data-out="age"]'), ageLabel(s));
  const price = $('[data-out="price"]');
  if (price.textContent !== priceLabel(s)) {
    price.textContent = priceLabel(s);
    if (animate) retrigger(price, 'is-flip');
  }
}

function renderPick(animate) {
  const s = state.size;
  $('[data-pick-name]').textContent = `${shortHeight(s)} ${s.heads > 1 ? (s.over ? 'multi-head' : s.heads + '-head') : 'grass tree'}`;
  $('[data-pick-price]').textContent = priceLabel(s);
  $('[data-pick-meta]').textContent = s.over
    ? 'Feature specimen · 100+ years old · we quote each one'
    : `${s.heads > 1 ? s.heads + ' heads' : 'Single head'} · ${ageLabel(s)} old · fills ${s.heads > 1 ? '1.5–2.5' : '1–1.5'} m across`;
  if (animate) retrigger($('[data-pick]'), 'is-new');
  $$('[data-add-current]').forEach((b) => (b.querySelector('span').textContent = s.price == null ? 'Ask for a quote' : 'Add to my order'));
}

/* ----- the height chart ----- */

const CHART_MAX = 1.6 * 200 + 58 + 26;
function renderChart() {
  const list = stops();
  const row = $('[data-chart-row]');
  row.innerHTML = list.map((s, i) => {
    const t = treeSvg(Math.min(s.h, 1.6), s.heads, { seed: 4 + i });
    return `<li><button type="button" class="col${chartFolded ? ' is-folded' : ''}" data-col="${s.id}" aria-pressed="false" style="--tall:${(t.height / CHART_MAX) * 100}%; --d:${i * 70}ms" aria-label="${heightLabel(s)} trunk, ${headsLabel(s)}, ${priceLabel(s)}">
      ${t.svg}<span class="col__label"><span class="col__h">${shortHeight(s)}</span><span class="col__p">${s.price == null ? 'Quote' : money(s.price)}</span></span></button></li>`;
  }).join('');
  const ruler = $('[data-ruler]');
  ruler.innerHTML = [0.5, 1.0, 1.5].map((m) => `<i style="bottom:${((m * 200) / CHART_MAX) * 100}%">${m.toFixed(1)} m</i>`).join('');
  markChart();
}
let chartFolded = !reduced;
function markChart() {
  $$('[data-col]').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.col === state.size.id)));
}
function bindChart() {
  const chart = $('[data-chart]');
  chart.addEventListener('click', (e) => {
    const c = e.target.closest('[data-col]');
    if (!c) return;
    setSize(sizeById(c.dataset.col), { from: 'chart' });
    if (!reduced) { c.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-14px)' }, { transform: 'translateY(0)' }], { duration: 500, easing: 'cubic-bezier(.34,1.56,.64,1)' }); }
  });
  $('[data-chart-heads]').addEventListener('change', (e) => setSize(e.target.value === 'multi' ? MULTI[0] : SINGLE[3], { from: 'chart' }));
  // the trees lean away from the cursor, like a breeze following it
  if (canHover && !reduced) {
    chart.addEventListener('pointermove', (e) => {
      $$('[data-col]', chart).forEach((c) => {
        const r = c.getBoundingClientRect();
        const dx = (r.left + r.width / 2 - e.clientX) / r.width;
        const near = Math.max(0, 1 - Math.abs(dx) / 2.5);
        c.style.setProperty('--lean', (Math.sign(dx) * near * 7).toFixed(2) + 'deg');
      });
    });
    chart.addEventListener('pointerleave', () => $$('[data-col]', chart).forEach((c) => c.style.setProperty('--lean', '0deg')));
  }
  $('[data-see-hero]').addEventListener('click', () => $('#top').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }));
  new IntersectionObserver(([en], obs) => {
    if (!en.isIntersecting) return;
    obs.disconnect();
    chartFolded = false;
    $$('[data-col]').forEach((c) => c.classList.remove('is-folded'));
    setTimeout(() => $$('[data-col]').forEach((c) => c.style.setProperty('--d', '0ms')), 1500);
  }, { threshold: 0.35 }).observe(chart);
}

function bindAddCurrent() {
  $$('[data-add-current]').forEach((b) => b.addEventListener('click', () => {
    const s = state.size;
    if (s.price == null) { openAsk(); askReply(`How much is a ${heightLabel(s)} multi-head tree?`); return; }
    addToOrder('tree:' + s.id, 1, b);
    book?.grab?.();
  }));
}

/* ================= the shelf ================= */

function renderShelf() {
  const ul = $('[data-shelf]');
  ul.innerHTML = SHELF.map((p, i) => {
    const price = p.kind === 'ask' ? '' : p.kind === 'jump' ? `<span class="tag__price"><small>from</small> ${money(p.from)}</span>`
      : `<span class="tag__price">${money(p.price)}${p.was ? `<s>${money(p.was)}</s>` : ''}${p.kind === 'service' ? ' <small>first</small>' : ''}</span>`;
    const action = p.kind === 'ask'
      ? `<a class="btn btn--line" href="${p.ask}">${p.cta}</a>`
      : p.kind === 'jump' ? `<button type="button" class="btn btn--line" data-jump-multi>Compare sizes</button>`
      : `<span data-buy="${p.id}"></span>`;
    const tilt = (((i * 37) % 7) - 3) * 0.7;
    return `<li class="tag${p.id === 'special' ? ' tag--wide' : ''}" data-group="${p.group}" data-stand style="view-transition-name: tag-${p.id}; --tilt: ${tilt}deg">
      <div class="tag__cut"><span class="tag__hole" aria-hidden="true"></span><div class="tag__art">${ART[p.art] || ''}</div>
      <div class="tag__body"><h3 class="tag__name">${p.name}</h3><p class="tag__text">${p.text}</p>
      <div class="tag__foot">${price}${action}</div></div></div></li>`;
  }).join('');
  ['all', 'trees', 'care', 'services'].forEach((g) => { $(`[data-count="${g}"]`).textContent = g === 'all' ? SHELF.length : SHELF.filter((p) => p.group === g).length; });
  renderShelfButtons();
  filterShelf(false);
}

function renderShelfButtons() {
  $$('[data-buy]').forEach((slot) => {
    const id = slot.dataset.buy, line = state.lines.find((l) => l.key === id), p = shelfById(id);
    slot.innerHTML = line
      ? `<span class="stepper"><button type="button" data-shelf-q="-1" aria-label="One fewer ${p.name}"><svg class="ico"><use href="#i-minus"/></svg></button><output aria-live="polite">${line.qty}</output><button type="button" data-shelf-q="1" aria-label="One more ${p.name}"><svg class="ico"><use href="#i-plus"/></svg></button></span>`
      : `<button type="button" class="btn btn--go" data-shelf-add><svg class="ico"><use href="#i-plus"/></svg> <span>Add</span></button>`;
  });
}

function filterShelf(animate = true) {
  const apply = () => $$('.tag').forEach((t) => (t.hidden = state.shelf !== 'all' && t.dataset.group !== state.shelf));
  if (animate && !reduced && document.startViewTransition) document.startViewTransition(apply);
  else apply();
  const r = $(`input[name="shelf"][value="${state.shelf}"]`);
  if (r) r.checked = true;
}

function bindShelf() {
  $('[data-filters]').addEventListener('change', (e) => {
    state.shelf = e.target.value;
    setParam('shelf', state.shelf === 'all' ? null : state.shelf);
    filterShelf(true);
  });
  $('[data-shelf]').addEventListener('click', (e) => {
    const slot = e.target.closest('[data-buy]');
    if (e.target.closest('[data-jump-multi]')) {
      setSize(MULTI[0], { from: 'chart' });
      $('#sizes').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      return;
    }
    if (!slot) return;
    const id = slot.dataset.buy;
    if (e.target.closest('[data-shelf-add]')) addToOrder(id, 1, e.target.closest('button'));
    const q = e.target.closest('[data-shelf-q]');
    if (q) { const line = state.lines.find((l) => l.key === id); setQty(id, line.qty + Number(q.dataset.shelfQ)); }
  });
}

/* ================= how it gets home: the truck on the road ================= */

function initRoad() {
  const road = $('[data-road]'), rider = $('[data-rider]'), path = $('[data-road-path]'), steps = $$('[data-road-step]');
  const len = path.getTotalLength();
  return () => {
    const r = road.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < -200 || r.top > vh + 200) return;
    const p = reduced ? 1 : Math.max(0, Math.min(1, (vh * 0.8 - r.top) / (vh * 0.55)));
    const svg = path.ownerSVGElement.getBoundingClientRect();
    const sx = svg.width / 1000, sy = svg.height / 120;
    const a = path.getPointAtLength(p * len), b = path.getPointAtLength(Math.min(len, p * len + 4));
    rider.style.setProperty('--rx', (a.x * sx).toFixed(1) + 'px');
    rider.style.setProperty('--ry', (a.y * sy).toFixed(1) + 'px');
    rider.style.setProperty('--rr', (Math.atan2((b.y - a.y) * sy, (b.x - a.x) * sx) * 180 / Math.PI).toFixed(1) + 'deg');
    steps.forEach((s, i) => s.classList.toggle('is-lit', p >= (i + 0.35) / 4));
  };
}

/* ================= rescue: photos you can push around ================= */

function initSnaps() {
  const box = $('[data-snaps]');
  let z = 5;
  $$('[data-snap]', box).forEach((snap) => {
    const st = { x: 0, y: 0, r: 0, vx: 0, vy: 0, raf: 0 };
    const draw = () => {
      snap.style.setProperty('--dx', st.x.toFixed(1) + 'px');
      snap.style.setProperty('--dy', st.y.toFixed(1) + 'px');
      snap.style.setProperty('--dr', st.r.toFixed(2) + 'deg');
    };
    let drag = null;
    snap.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      cancelAnimationFrame(st.raf);
      drag = { x: e.clientX, y: e.clientY, t: performance.now() };
      snap.style.zIndex = ++z;
      snap.classList.add('is-held');
      snap.setPointerCapture(e.pointerId);
    });
    snap.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const now = performance.now(), dt = Math.max(8, now - drag.t);
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      st.x += dx; st.y += dy;
      st.vx = (dx / dt) * 16; st.vy = (dy / dt) * 16;
      st.r = Math.max(-14, Math.min(14, st.r * 0.85 + dx * 0.25));
      drag = { x: e.clientX, y: e.clientY, t: now };
      draw();
    });
    const release = () => {
      if (!drag) return;
      drag = null;
      snap.classList.remove('is-held');
      if (reduced) return;
      // a little throw, then it settles flat on the page
      const bounds = box.getBoundingClientRect();
      const glide = () => {
        st.x += st.vx; st.y += st.vy;
        st.vx *= 0.9; st.vy *= 0.9; st.r *= 0.92;
        const r = snap.getBoundingClientRect();
        if (r.left < bounds.left - r.width * 0.3 || r.right > bounds.right + r.width * 0.3) st.vx *= -0.5;
        if (r.top < bounds.top - r.height * 0.3 || r.bottom > bounds.bottom + r.height * 0.3) st.vy *= -0.5;
        draw();
        if (Math.abs(st.vx) + Math.abs(st.vy) + Math.abs(st.r) > 0.1) st.raf = requestAnimationFrame(glide);
      };
      st.raf = requestAnimationFrame(glide);
    };
    snap.addEventListener('pointerup', release);
    snap.addEventListener('pointercancel', release);
    snap._tidy = () => {
      cancelAnimationFrame(st.raf);
      Object.assign(st, { x: 0, y: 0, r: 0, vx: 0, vy: 0 });
      snap.style.transition = reduced ? '' : 'transform .8s cubic-bezier(.34,1.56,.64,1)';
      draw();
      setTimeout(() => (snap.style.transition = ''), 820);
    };
  });
  $('[data-tidy]').addEventListener('click', () => $$('[data-snap]').forEach((s, i) => setTimeout(() => s._tidy(), i * 80)));
}

/* ================= care: the wheel ================= */

const DEG_PER_MONTH = 13.5;
function buildWheel() {
  const svg = $('[data-wheel-svg]');
  const C = 200, R = 173;
  const pt = (m, r) => {
    const a = (m * DEG_PER_MONTH - 90) * Math.PI / 180;
    return [C + Math.cos(a) * r, C + Math.sin(a) * r];
  };
  const arc = (m0, m1, r) => {
    const [x0, y0] = pt(m0, r), [x1, y1] = pt(m1, r);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${(m1 - m0) * DEG_PER_MONTH > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  const sectors = [[0, 6, '#e8892b', 'Settling in'], [6, 12, '#8fbf3a', 'Establishing'], [12, 24, '#9cccf5', 'Established'], [24, 26.66, '#f4efe4', 'On its own']];
  let out = '<defs>';
  sectors.forEach(([a, b], i) => { out += `<path id="wl${i}" d="${arc(a + 0.25, b - 0.1, R - 5)}"/>`; });
  out += '</defs>';
  sectors.forEach(([a, b, c]) => { out += `<path class="wheel-ring" d="${arc(a, b, R)}" stroke="${c}"/>`; });
  sectors.forEach(([, , , label], i) => { out += `<text class="wheel-stage"><textPath href="#wl${i}">${label}</textPath></text>`; });
  for (let m = 0; m <= 24; m++) {
    const [x0, y0] = pt(m, 150), [x1, y1] = pt(m, m % 3 ? 144 : 138);
    out += `<line class="wheel-tick" x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}"/>`;
    if (m % 3 === 0) { const [tx, ty] = pt(m, 126); out += `<text class="wheel-num" x="${tx.toFixed(1)}" y="${ty.toFixed(1)}">${m}</text>`; }
  }
  svg.innerHTML = out;
}

let careScene = null;
function initWheel() {
  buildWheel();
  const disc = $('[data-wheel-disc]'), svg = $('[data-wheel-svg]');
  const w = { m: 0, v: 0, raf: 0, stage: -1 };
  const show = () => {
    const m = Math.max(0, Math.min(24, w.m));
    svg.style.setProperty('--turn', (-w.m * DEG_PER_MONTH).toFixed(2) + 'deg');
    const whole = Math.round(m);
    $('[data-stage-month]').textContent = whole;
    $('[data-stage-unit]').textContent = whole === 1 ? 'month after planting' : 'months after planting';
    disc.setAttribute('aria-valuenow', String(whole));
    const idx = STAGES.findLastIndex((s) => m >= s[0] - 0.01);
    disc.setAttribute('aria-valuetext', `${whole} months: ${STAGES[idx][1]}`);
    if (idx !== w.stage) {
      w.stage = idx;
      $('[data-stage-title]').textContent = STAGES[idx][1];
      $('[data-stage-text]').textContent = STAGES[idx][2];
      $('[data-stage-do]').textContent = STAGES[idx][3];
      retrigger($('.stage'), 'is-turning');
      $$('[data-stage-marks] button').forEach((b, n) => b.setAttribute('aria-pressed', String(n === idx)));
    }
    careScene?.setMonths(m);
  };
  const settle = (target) => {
    cancelAnimationFrame(w.raf);
    if (reduced) { w.m = target ?? Math.round(w.m); w.v = 0; show(); return; }
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (target == null) {
        // coast, then click into the nearest month
        w.m += w.v * dt; w.v *= Math.exp(-3 * dt);
        if (w.m < 0 || w.m > 24) w.v *= 0.5;
        if (Math.abs(w.v) < 1.5) target = Math.max(0, Math.min(24, Math.round(w.m)));
      } else {
        w.v += (-(w.m - target) * 90 - w.v * 11) * dt;
        w.m += w.v * dt;
        if (Math.abs(w.v) < 0.02 && Math.abs(w.m - target) < 0.005) { w.m = target; show(); return; }
      }
      w.m = Math.max(-1.2, Math.min(25.2, w.m));
      show();
      w.raf = requestAnimationFrame(step);
    };
    w.raf = requestAnimationFrame(step);
  };
  let drag = null;
  const angle = (e) => {
    const r = disc.getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
  };
  disc.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    cancelAnimationFrame(w.raf);
    drag = { a: angle(e), t: performance.now() };
    disc.setPointerCapture(e.pointerId);
  });
  disc.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const a = angle(e);
    let d = a - drag.a;
    if (d > 180) d -= 360; if (d < -180) d += 360;
    const now = performance.now(), dt = Math.max(8, now - drag.t) / 1000;
    // turning the disc anticlockwise brings later months to the pointer
    const dm = -d / DEG_PER_MONTH;
    w.m = Math.max(-1, Math.min(25, w.m + dm));
    w.v = dm / dt;
    drag = { a, t: now };
    show();
  });
  const up = () => { if (!drag) return; drag = null; settle(null); };
  disc.addEventListener('pointerup', up);
  disc.addEventListener('pointercancel', up);
  disc.addEventListener('keydown', (e) => {
    const to = { ArrowRight: w.m + 1, ArrowUp: w.m + 1, ArrowLeft: w.m - 1, ArrowDown: w.m - 1, PageUp: w.m + 6, PageDown: w.m - 6, Home: 0, End: 24 }[e.key];
    if (to == null) return;
    e.preventDefault();
    settle(Math.max(0, Math.min(24, Math.round(to))));
  });
  $$('[data-stage-marks] button').forEach((b) => b.addEventListener('click', () => settle(Number(b.dataset.month))));
  show();

  // the paper tree in the window, built when the chapter comes near
  new IntersectionObserver(async ([en], obs) => {
    if (!en.isIntersecting) return;
    obs.disconnect();
    try {
      await webgl();
      const { createCare } = await import('./care.js');
      careScene = createCare($('[data-care-canvas]'), { reduced });
      careScene.setMonths(w.m);
      new IntersectionObserver(([e2]) => careScene.setActive(e2.isIntersecting)).observe($('[data-wheel]'));
      // give it one turn on arrival so it's obvious it moves
      if (!reduced) new IntersectionObserver(([e3], o3) => { if (e3.isIntersecting) { o3.disconnect(); setTimeout(() => { if (!drag && w.m === 0) { w.v = 0; settle(6); } }, 700); } }, { threshold: 0.6 }).observe($('[data-wheel]'));
    } catch { /* the wheel still works without the 3D tree */ }
  }, { rootMargin: '500px 0px' }).observe($('[data-wheel]'));
}

function bindLifts() {
  $$('[data-lift]').forEach((b) => b.addEventListener('click', () => {
    const li = b.closest('.lift'), open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    li.classList.toggle('is-open', open);
    $('.lift__a', li).hidden = !open;
    $('.lift__peek', li).textContent = open ? 'Close' : 'Lift';
  }));
}

/* ================= reminders ================= */

function reminderDates() {
  const v = $('[data-r-date]').value;
  const start = v ? new Date(v + 'T12:00:00') : new Date();
  return REMINDERS.map(([days, text]) => ({ date: new Date(start.getTime() + days * DAY), text }));
}
function renderReminders() {
  $('[data-r-list]').innerHTML = reminderDates().map((r, i) =>
    `<li style="--i:${i % 4}"${i >= 4 ? ' class="is-later"' : ''}><time datetime="${iso(r.date)}">${r.date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' })}</time><span>${r.text}</span></li>`).join('');
}
function bindReminders() {
  const input = $('[data-r-date]');
  input.value = iso(new Date());
  input.addEventListener('change', renderReminders);
  $('[data-r-more]').addEventListener('click', (e) => {
    const all = $('[data-r-list]').classList.toggle('is-all');
    e.currentTarget.setAttribute('aria-expanded', String(all));
    e.currentTarget.textContent = all ? 'Show fewer' : 'Show all 8 reminders';
  });
  renderReminders();
  $('[data-r-ics]').addEventListener('click', () => downloadIcs('replants-care-reminders.ics', reminderDates().map((r) => ({
    start: r.date, allDay: true, title: 'Grass tree care · ' + r.text.split(':')[0].split('.')[0], note: r.text + ` Questions? Replants ${PHONE} or support@replants.com`,
  }))));
  $('[data-r-sms]').addEventListener('click', () => {
    const wrap = $('[data-r-sms-wrap]');
    wrap.hidden = !wrap.hidden;
    if (!wrap.hidden) $('[data-r-phone]').focus();
  });
  $('[data-reminders]').addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = $('[data-r-phone]'), bad = !phone.value.trim();
    phone.setAttribute('aria-invalid', String(bad));
    $('[data-r-err]').hidden = !bad;
    if (bad) { phone.focus(); return; }
    $('[data-r-sms-done]').hidden = false;
  });
}

/* ================= visit ================= */

function initVisit() {
  const paint = () => Object.keys(PLACES).forEach((k) => {
    const s = openState(k), el = $(`[data-open="${k}"]`);
    el.textContent = s.text;
    el.classList.toggle('is-open', s.open);
  });
  paint();
  setInterval(paint, 60000);
  const pick = (k) => {
    $$('[data-pin-place]').forEach((p) => p.classList.toggle('is-picked', p.dataset.pinPlace === k));
    $$('[data-place-card]').forEach((c) => c.classList.toggle('is-picked', c.dataset.placeCard === k));
  };
  $$('[data-pin-place]').forEach((p) => {
    p.addEventListener('click', () => pick(p.dataset.pinPlace));
    p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p.dataset.pinPlace); } });
    p.addEventListener('pointerenter', () => pick(p.dataset.pinPlace));
  });
  $$('[data-place-card]').forEach((c) => c.addEventListener('pointerenter', () => pick(c.dataset.placeCard)));
}

/* ================= Ask Replants ================= */

function heightQuestion(q) {
  const m = q.match(/(\d+(?:\.\d+)?)\s*(cm|mm|m\b|metre|meter|met)?/);
  if (!m || !/(price|cost|how much|\$|tree|trunk|metre|meter|\bm\b)/.test(q)) return null;
  let h = parseFloat(m[1]);
  if (m[2] === 'cm') h /= 100; else if (m[2] === 'mm') h /= 1000;
  if (!(h > 0 && h <= 5)) return null;
  const multi = /(multi|two|three|2|3)[ -]?head/.test(q);
  const pool = multi ? MULTI : SINGLE;
  const best = pool.reduce((a, s) => (Math.abs(s.h - h) < Math.abs(a.h - h) ? s : a));
  if (h > 1.25 && !multi) {
    return { a: `<p>Over 1.2 m of trunk we price each tree individually, as they’re feature specimens. Call ${PHONE} or visit the Rockingham site to see what’s there.</p>`, act: [{ label: 'Call us', href: TEL }] };
  }
  return {
    a: `<p>A <b>${heightLabel(best)}</b> ${headsLabel(best)} grass tree is <b>${priceLabel(best)}</b> from the salvage site, and it’s ${ageLabel(best)} old.</p>`,
    act: best.price == null ? [{ label: 'Show me', size: best.id }] : [{ label: 'Show me', size: best.id }, { label: 'Add it to my order', addTree: best.id }],
  };
}
function answer(raw) {
  const q = ' ' + raw.toLowerCase().replace(/[’']/g, "'") + ' ';
  const h = heightQuestion(q);
  if (h) return h;
  let best = null, score = 0;
  for (const item of KB) {
    const s = item.k.reduce((n, k) => n + (q.includes(k.length <= 3 ? ` ${k} ` : k) ? 1 : 0), 0);
    if (s > score) { score = s; best = item; }
  }
  if (best) return { a: best.a(), act: best.act };
  return { a: `<p>I’m not sure about that one. The team can help: call <b>${PHONE}</b> or email enquiries@replants.com.</p>`, act: [{ label: 'Call', href: TEL }, { label: 'Email', href: 'mailto:enquiries@replants.com' }] };
}

let askReply = () => {}, openAsk = () => {};
function bindAsk() {
  const btn = $('[data-ask-open]'), panel = $('[data-ask]'), log = $('[data-ask-log]'), input = $('[data-ask-input]');
  let greeted = false;
  const say = (html, who, act) => {
    const m = document.createElement('div');
    m.className = `msg msg--${who}`;
    if (who === 'me') m.textContent = html; else m.innerHTML = html;
    if (act?.length) {
      const row = document.createElement('div');
      row.className = 'msg__actions';
      act.forEach((x) => {
        const el = x.href ? Object.assign(document.createElement('a'), { href: x.href }) : document.createElement('button');
        if (!x.href) el.type = 'button';
        if (x.add || x.addTree) el.dataset.add = '';
        el.textContent = x.label;
        el.addEventListener('click', () => runAction(x, el));
        row.append(el);
      });
      m.append(row);
    }
    log.append(m);
    log.scrollTo({ top: who === 'bot' ? m.offsetTop - 12 : log.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  };
  askReply = (text) => {
    $('[data-ask-chips]').hidden = true;
    say(text, 'me');
    const typing = document.createElement('div');
    typing.className = 'msg msg--bot typing';
    typing.innerHTML = '<i></i><i></i><i></i>';
    typing.setAttribute('aria-label', 'Replants is typing');
    log.append(typing);
    log.scrollTo({ top: log.scrollHeight });
    const { a, act } = answer(text);
    setTimeout(() => { typing.remove(); say(a, 'bot', act); }, reduced ? 150 : 550 + Math.min(600, a.length * 2));
  };
  openAsk = () => {
    if (!panel.hidden) return;
    panel.hidden = false;
    panel.classList.remove('is-closing');
    retrigger(panel, 'is-opening');
    btn.setAttribute('aria-expanded', 'true');
    if (!greeted) {
      greeted = true;
      say('<p>G’day, I’m the Replants helper. Ask about prices, sizes, delivery, care, or a tree that looks unwell.</p>', 'bot');
      $('[data-ask-chips]').innerHTML = CHIPS.map((c) => `<button type="button">${c}</button>`).join('');
    }
    setTimeout(() => input.focus(), 60);
  };
  const close = () => {
    panel.classList.add('is-closing');
    btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { panel.hidden = true; panel.classList.remove('is-closing'); }, reduced ? 0 : 200);
    btn.focus();
  };
  btn.addEventListener('click', () => (panel.hidden ? openAsk() : close()));
  $('[data-ask-close]').addEventListener('click', close);
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  $('[data-ask-chips]').addEventListener('click', (e) => { if (e.target.matches('button')) askReply(e.target.textContent); });
  $('[data-ask-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    askReply(v);
  });
}
function runAction(x, el) {
  if (x.size) { setSize(sizeById(x.size), { from: 'chat' }); $('#sizes').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
  if (x.addTree) { setSize(sizeById(x.addTree), { from: 'chat' }); addToOrder('tree:' + x.addTree, 1, el); }
  if (x.add) addToOrder(x.add, 1, el);
  if (x.open) openOrder();
  if (x.go) $(x.go).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}

/* ================= header ================= */

function bindTop() {
  const nav = $('.tabs'), toggle = $('.tabs__toggle');
  toggle.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); } });
  const links = new Map($$('.tabs a').map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    const a = links.get(en.target.id);
    if (en.isIntersecting) { links.forEach((l) => l.removeAttribute('aria-current')); a?.setAttribute('aria-current', 'true'); }
    else if (a?.hasAttribute('aria-current') && en.target.id === 'sizes' && en.boundingClientRect.top > 0) a.removeAttribute('aria-current');
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
}

/* ================= motion ================= */

function splitWords(el) {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.textContent = part;
          w.style.setProperty('--i', i++);
          w.style.setProperty('--wr', ((i * 37) % 11 - 5) + 'deg');
          frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el);
}

function initMotion() {
  window.__ready = true;
  if (reduced) { document.documentElement.classList.remove('motion'); return; }
  $$('[data-split]').forEach(splitWords);
  $$('.way, .place, .pick, .reminders, .warranty, .flaps').forEach((el, i) => { el.dataset.stand = ''; el.style.setProperty('--d', `${(i % 3) * 90}ms`); });
  $$('.spread__page--r').forEach((p) => (p.dataset.open = ''));
  $$('.snap').forEach((s, i) => s.style.setProperty('--d', `${i * 120}ms`));
  $$('.tag').forEach((t, i) => t.style.setProperty('--d', `${(i % 4) * 70}ms`));
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in');
    io.unobserve(en.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('.marker').forEach((m, i) => m.style.setProperty('--d', `${200 + i * 220}ms`));
  $$('[data-split], [data-stand], [data-open], .snap, .marker').forEach((el) => io.observe(el));

  // cards lean toward the pointer
  if (canHover) {
    $$('.tag, .way').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 8).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
    // magnetic buttons
    $$('[data-magnetic]').forEach((b) => {
      b.style.transition = 'translate .5s cubic-bezier(.34,1.56,.64,1), transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .25s';
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px`;
      });
      b.addEventListener('pointerleave', () => (b.style.translate = '0 0'));
    });
  }
}

// paper leaves drifting at the edges of each chapter, on scroll and pointer
const leaves = [];
function initLeaves() {
  const spots = [
    ['#sizes', '#3d7a55', [['-2%', '12%', 6, -24], ['-1.5%', '74%', 4, -36]]],
    ['#shelf', '#8fbf3a', [['95%', '6%', 5, 20]]],
    ['#rescue', '#e8892b', [['-1.5%', '70%', 5.5, -16], ['96%', '8%', 4, 40]]],
    ['#care', '#8fbf3a', [['94%', '4%', 6, 24], ['-2%', '56%', 4.5, -30]]],
    ['#visit', '#3d7a55', [['46%', '-3%', 4, 70]]],
  ];
  if (innerWidth < 700) return;
  spots.forEach(([sel, color, list]) => list.forEach(([x, y, w, r], i) => {
    const el = document.createElement('div');
    el.className = 'leaf';
    el.innerHTML = LEAF(color);
    Object.assign(el.style, { left: x, top: y, '--w': w + 'rem', '--lr': r + 'deg' });
    el.firstChild.style.animationDelay = `${-i * 2.3}s`;
    $(sel).append(el);
    leaves.push({ el, speed: 0.08 + (i % 2) * 0.06, sec: $(sel) });
  }));
  if (canHover && !reduced) {
    addEventListener('pointermove', (e) => {
      const px = (e.clientX / innerWidth - 0.5) * 18, py = (e.clientY / innerHeight - 0.5) * 12;
      leaves.forEach((l, i) => l.el.style.setProperty('--px', (px * (1 + (i % 3) * 0.4)).toFixed(1) + 'px'));
      pointerY = py;
    }, { passive: true });
  }
}
let pointerY = 0;

/* ================= the hero and the scroll loop ================= */

async function webgl() {
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('no webgl');
}

function heroStory(hero) {
  const r = hero.getBoundingClientRect();
  return Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight)));
}

let captionIdx = 0;
function onScrollFrame() {
  const hero = $('[data-hero]');
  if (book && hero.classList.contains('is-story')) {
    const s = heroStory(hero);
    book.setStory(s);
    const idx = STORY.findLastIndex(([at]) => s >= at);
    if (idx !== captionIdx) {
      captionIdx = idx;
      const cap = $('[data-caption]');
      cap.textContent = STORY[idx][1];
      retrigger(cap, 'is-new');
    }
    hero.classList.toggle('is-playing', s > 0.04);
    $('[data-hero-ctrls]').style.opacity = s > 0.05 ? '0' : '';
    $('[data-hero-ctrls]').style.pointerEvents = s > 0.05 ? 'none' : '';
    // the turning page covers what's printed on the left
    const fade = Math.max(0, Math.min(1, (s - 0.86) / 0.1));
    $('.hero__page').style.opacity = 1 - fade;
    $('.hero__title').style.opacity = 1 - fade * 0.6;
    $('.hero__cue').style.opacity = s > 0.02 ? '0' : '';
  }
  road?.();
  leaves.forEach((l) => {
    const r = l.sec.getBoundingClientRect();
    const off = (r.top + r.height / 2 - innerHeight / 2) * -l.speed;
    l.el.style.setProperty('--py', (off + pointerY).toFixed(1) + 'px');
  });
}
let road = null, ticking = false;
function requestFrame() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; onScrollFrame(); });
}

async function startBook() {
  const canvas = $('[data-hero-canvas]'), hero = $('[data-hero]');
  try {
    await webgl();
    const { createBook } = await import('./book.js');
    await document.fonts.ready;
    const { hour } = perthNow();
    book = createBook(canvas, {
      size: state.size, reduced, perthHour: hour,
      onLayout: (r) => {
        if (!r) { ['--lp-l', '--lp-t', '--lp-w', '--lp-pop'].forEach((v) => hero.style.removeProperty(v)); return; }
        hero.style.setProperty('--lp-l', Math.round(r.left + 8) + 'px');
        hero.style.setProperty('--lp-t', Math.round(r.top + 6) + 'px');
        hero.style.setProperty('--lp-w', Math.round(r.right - r.left - 16) + 'px');
        hero.style.setProperty('--lp-pop', Math.round(r.pop) + 'px');
      },
      onHint: (kind) => {
        const hint = $('[data-hint]');
        hint.textContent = { tap: 'Rustled! Now drag the sun across the sky', sun: 'Perth time, your call. Try poking the bulldozer', dozer: 'Brrrm. Pull the yellow tab to change the size', turn: 'Round it goes. Tap it to rustle the leaves' }[kind] || hint.textContent;
      },
    });
    if (!reduced) hero.classList.add('is-story');
    new IntersectionObserver(([en]) => book.setActive(en.isIntersecting)).observe(hero);
    requestFrame();
  } catch (err) {
    console.warn('3D pop-up unavailable, showing a photo instead.', err);
    document.documentElement.classList.add('no-webgl');
  }
}

/* ================= start ================= */

renderTicks();
initSegs();
renderChart();
bindChart();
bindPullTab();
setSize(state.size, { from: 'init' });
renderReadout(false);
renderPick(false);
bindAddCurrent();
renderShelf();
bindShelf();
bindOrder();
initSnaps();
initWheel();
bindLifts();
bindReminders();
initVisit();
bindAsk();
bindTop();
initMotion();
initLeaves();
road = initRoad();
addEventListener('scroll', requestFrame, { passive: true });
addEventListener('resize', requestFrame);
requestFrame();
startBook();
