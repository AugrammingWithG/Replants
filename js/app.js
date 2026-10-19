// Replants concept. One order you fill from anywhere on the page; one size
// shared by the slider, the chart, the chat and the 3D tree.
import {
  PHONE, TEL, SINGLE, MULTI, sizeById, money, heightLabel, shortHeight, priceLabel, ageLabel,
  headsLabel, treeName, SHELF, shelfById, STAGES, REMINDERS, PLACES, openState, KB, CHIPS,
} from './data.js';
import { treeSvg, ART } from './art.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => matchMedia('(max-width: 860px)').matches;
document.documentElement.classList.add('js');

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode: the order just won't persist */ } },
};

const params = new URLSearchParams(location.search);
const state = {
  size: sizeById(params.get('size')) || sizeById('s060'),
  lines: [], method: 'pickup', dig: false, place: 'rockingham', day: null, time: null, step: 1,
  shelf: params.get('shelf') || 'all',
};
const saved = store.get('replants-order');
if (saved?.lines) state.lines = saved.lines.filter((l) => itemFor(l.key));

let hero = null, care = null;

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

function save() { store.set('replants-order', { lines: state.lines.map(({ key, qty }) => ({ key, qty })) }); }

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
  const done = () => retrigger(pill, 'is-bump');
  $('[data-bar]').classList.add('is-on');
  if (!from || reduced) { done(); toast(`Added: ${text.slice(2)}`); return; }
  const a = from.getBoundingClientRect(), b = pill.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'flyer';
  el.textContent = text;
  document.body.append(el);
  const w = el.offsetWidth;
  const x0 = a.left + a.width / 2 - w / 2, y0 = a.top;
  const x1 = b.left + b.width / 2 - w / 2, y1 = b.top + b.height / 2 - 14;
  el.animate([
    { transform: `translate(${x0}px, ${y0}px) scale(1)` },
    { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 70}px) scale(1.04)`, offset: 0.45 },
    { transform: `translate(${x1}px, ${y1}px) scale(0.4)`, opacity: 0.2 },
  ], { duration: 760, easing: 'cubic-bezier(.5,0,.4,1)' }).finished.then(() => { el.remove(); done(); });
}

function renderPill() {
  const count = state.lines.reduce((n, l) => n + l.qty, 0);
  const q = quote();
  $('[data-order-count]').textContent = count;
  $('[data-order-total]').textContent = count ? totalLabel(q) : 'Your order';
  $('.pill--order').setAttribute('aria-label', count ? `Your order: ${count} item${count > 1 ? 's' : ''}, ${totalLabel(q)}` : 'Your order, empty');
}
const lineArt = (it) => (it.kind === 'tree' ? treeSvg(Math.min(it.size.h, 1.2), it.size.heads).svg : ART[it.art] || '');

function renderOrder() {
  renderPill();
  $('[data-lines]').innerHTML = state.lines.map((l) => {
    const it = itemFor(l.key), c = lineCost(l);
    return `<li class="line${l.fresh && !reduced ? ' is-new' : ''}" data-key="${l.key}">
      <span class="line__art">${lineArt(it)}</span>
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
  for (let i = 1; out.length < count && i < 120; i++) { const day = new Date(d.getTime() + i * DAY); if (match(day.getDay())) out.push(day); }
  return out;
}
function scheduleFor() {
  if (!treeCount() && !hasSpecial()) return { days: upcoming((w) => w >= 1 && w <= 5, 8), times: ['Morning', 'Afternoon'] };
  if (state.method === 'pickup' && state.place === 'rockingham') return { days: upcoming((w) => w === 6, 5), times: ['8:00', '8:45', '9:30', '10:15', '11:00', '11:45'] };
  if (state.method === 'pickup') return { days: upcoming((w) => w === 0 || w >= 3, 8), times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] };
  return { days: upcoming((w) => w >= 1 && w <= 5, 8), times: ['Morning', 'Afternoon'] };
}
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
  $('[data-when-delivery]').textContent = trees ? 'Pick a day that suits. We’ll call the day before with a time window.' : 'Formula and services: pick a day that suits and we’ll call to arrange it.';
  $$('input[name="place"]').forEach((r) => { r.checked = r.value === state.place; r.disabled = hasSpecial() && r.value !== 'rockingham'; });
  placePill($('[data-place]'));
  $('[data-place-hint]').textContent = PLACES[state.place].note;
  $('[data-times-label]').textContent = pickup ? 'Time' : 'Time of day';
  const { days, times } = scheduleFor();
  if (!days.some((d) => iso(d) === state.day)) { state.day = null; state.time = null; }
  $('[data-days]').innerHTML = days.map((d) => `<label><input type="radio" name="day" value="${iso(d)}" ${iso(d) === state.day ? 'checked' : ''}><span>${fmtDay(d)}<small>${fmtDate(d)}</small></span></label>`).join('');
  const day = days.find((d) => iso(d) === state.day);
  $('[data-times]').innerHTML = day
    ? times.map((t) => { const off = taken(day, t); return `<label><input type="radio" name="time" value="${t}" ${off ? 'disabled' : ''} ${t === state.time ? 'checked' : ''}><span>${t}${off ? '<small>Taken</small>' : ''}</span></label>`; }).join('')
    : '<p class="hint">Pick a day first.</p>';
}

/* ----- steps ----- */

const STEP_P = { 1: 0.06, 2: 0.38, 3: 0.7, 4: 1 };
function syncSteps() {
  const n = state.step;
  $$('[data-step-tab]').forEach((li) => { if (+li.dataset.stepTab === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
  $('[data-order]').style.setProperty('--p', STEP_P[n]);
  const next = $('[data-next]');
  next.hidden = n >= 3;
  next.disabled = n === 1 && !state.lines.length;
  next.querySelector('span').textContent = n === 1 ? 'Choose how and when' : 'Your details';
  $('[data-send-wrap]').hidden = n !== 3;
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
    else (from ? from.animate([{ opacity: 1 }, { opacity: 0, transform: `translateX(${-16 * dir}px)` }], { duration: 140, easing: 'ease-in' }).finished : Promise.resolve())
      .then(() => { swap(); to.animate([{ opacity: 0, transform: `translateX(${20 * dir}px)` }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' }); });
  }
  $('.drawer__body').scrollTop = 0;
  syncSteps();
  renderSum();
  if (n === 4) setTimeout(() => to.focus(), 60);
  if (n === 3) setTimeout(() => $('#f-name').focus({ preventScroll: true }), 480);
  if (n === 2) setTimeout(() => $('[data-next]').focus({ preventScroll: true }), 60);
}
function validateWhen() {
  if (state.day && state.time) return true;
  retrigger(state.day ? $('[data-times]') : $('[data-days]'), 'is-shake');
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
    'Hi Replants,', '', 'I’d like to order:', ...q.rows.map(([k, v]) => `  ${k}: ${v}`), `Estimate: ${totalLabel(q)}`, `How: ${how}`,
    state.day ? `When: ${whenLabel()}` : '', '',
    `Name: ${$('#f-name').value.trim()}`, `Mobile: ${$('#f-phone').value.trim()}`,
    trees && state.method !== 'pickup' ? `Address: ${$('#f-address').value.trim() || '-'}` : '',
    `Notes: ${$('#f-notes').value.trim() || '-'}`,
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
}
function send(how) {
  if (!validateDetails()) return;
  const body = orderText();
  goTo(4);
  $('[data-done-text]').textContent = `${state.day ? whenLabel() + '. ' : ''}${how === 'sms' ? 'Your messages app should open with the order filled in.' : 'Your email app should open with the order filled in.'} We’ll call ${$('#f-phone').value.trim()} to confirm before anything is charged.`;
  location.href = how === 'sms' ? `sms:+61408885435?&body=${encodeURIComponent(body)}` : `mailto:sales@replants.com?subject=${encodeURIComponent('Grass tree order')}&body=${encodeURIComponent(body)}`;
}

let lastFocus = null;
function openOrder() {
  const d = $('[data-order]'), scrim = $('[data-scrim]');
  if (!d.hidden) return;
  lastFocus = document.activeElement;
  renderOrder();
  if (state.step === 4) goTo(1);
  d.hidden = false; scrim.hidden = false;
  d.classList.remove('is-closing');
  retrigger(d, 'is-opening');
  $$('[data-order-open]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => $('[data-order-close]').focus(), 50);
}
function closeOrder() {
  const d = $('[data-order]'), scrim = $('[data-scrim]');
  if (d.hidden) return;
  d.classList.add('is-closing');
  $$('[data-order-open]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
  document.documentElement.style.overflow = '';
  setTimeout(() => { d.hidden = true; scrim.hidden = true; d.classList.remove('is-closing'); }, reduced ? 0 : 240);
  lastFocus?.focus?.();
}
function bindOrder() {
  $$('[data-order-open]').forEach((b) => b.addEventListener('click', openOrder));
  $('[data-order-close]').addEventListener('click', closeOrder);
  $('[data-scrim]').addEventListener('click', closeOrder);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('[data-order]').hidden) closeOrder(); });
  $('[data-order]').addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = $$('button:not([disabled]), a[href], input:not([disabled])', $('[data-order]')).filter((el) => el.offsetParent);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
  });
  $$('[data-close-go]').forEach((a) => a.addEventListener('click', closeOrder));
  $('[data-lines]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    const key = b.closest('[data-key]').dataset.key;
    const line = state.lines.find((l) => l.key === key);
    setQty(key, line.qty + Number(b.dataset.q));
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
  $('[data-form]').addEventListener('submit', (e) => { e.preventDefault(); send(e.submitter?.value || 'email'); });
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
    downloadIcs('replants-order.ics', [{
      start: d, end: new Date(d.getTime() + (pickup ? 45 : 240) * 60000), title: pickup ? 'Pick up grass tree · Replants' : 'Replants visit',
      where: pickup ? PLACES[state.place].full : ($('#f-address').value.trim() || 'Your address'), note: `Replants ${PHONE}.`,
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
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(e.title)}`, e.allDay ? 'TRIGGER:PT9H' : 'TRIGGER:-PT12H', 'END:VALARM', 'END:VEVENT',
  ].filter(Boolean).join('\r\n')).join('\r\n');
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Replants//Concept//EN\r\nCALSCALE:GREGORIAN\r\n${body}\r\nEND:VCALENDAR\r\n`;
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ================= segmented toggles ================= */

function placePill(seg) {
  const pill = $('.seg__pill', seg), on = $('input:checked', seg)?.closest('label');
  if (!pill || !on) return;
  pill.style.width = on.offsetWidth + 'px';
  pill.style.transform = `translateX(${on.offsetLeft - 4}px)`;
}
function initSegs() {
  const ro = new ResizeObserver((en) => en.forEach((e) => placePill(e.target)));
  $$('.seg').forEach((seg) => {
    const pill = document.createElement('span');
    pill.className = 'seg__pill';
    seg.prepend(pill);
    seg.addEventListener('change', () => placePill(seg));
    placePill(seg);
    ro.observe(seg);
  });
}

/* ================= size: slider, readout, chart ================= */

const stops = () => (state.size.heads > 1 ? MULTI : SINGLE);
function setSize(s, { from = 'range' } = {}) {
  if (!s) return;
  const changed = s !== state.size;
  const group = (s.heads > 1) !== (state.size.heads > 1);
  state.size = s;
  if (group || from !== 'range') {
    $$('input[name="heads"]').forEach((r) => (r.checked = (r.value === 'multi') === (s.heads > 1)));
    placePill($('[data-heads]'));
    renderTicks();
    renderChart();
  }
  syncRange();
  renderReadout(changed);
  markChart();
  setParam('size', s.id === 's060' ? null : s.id);
  if (changed) hero?.setSize(s);
}
function renderTicks() {
  const list = stops();
  $('[data-ticks]').innerHTML = list.map((s, i) => `<i style="left:${(i / (list.length - 1)) * 100}%" data-tick="${s.id}">${s.over ? '1.2+' : s.h.toFixed(1)}</i>`).join('');
}
function syncRange() {
  const list = stops(), r = $('[data-range]'), i = list.indexOf(state.size);
  r.max = list.length - 1;
  r.value = i;
  r.style.setProperty('--fill', (i / (list.length - 1)) * 100 + '%');
  r.setAttribute('aria-valuetext', `${heightLabel(state.size)} trunk, ${headsLabel(state.size)}, ${priceLabel(state.size)}`);
  $$('[data-tick]').forEach((t) => t.classList.toggle('is-on', t.dataset.tick === state.size.id));
}
function renderReadout(animate) {
  const s = state.size;
  const swap = (el, text) => { if (el.textContent === text) return; el.textContent = text; if (animate) retrigger(el, 'is-tick'); };
  swap($('[data-out="height"]'), heightLabel(s));
  swap($('[data-out="age"]'), ageLabel(s));
  swap($('[data-out="price"]'), priceLabel(s));
  $$('[data-add-current] span').forEach((sp) => (sp.textContent = s.price == null ? 'Ask for a quote' : 'Add to my order'));
}
const CHART_MAX = 1.6 * 200 + 58 + 26;
function renderChart() {
  const list = stops();
  $('[data-chart-row]').innerHTML = list.map((s, i) => {
    const t = treeSvg(Math.min(s.h, 1.6), s.heads, { seed: 4 + i });
    return `<li><button type="button" class="col" data-col="${s.id}" aria-pressed="false" style="--tall:${(t.height / CHART_MAX) * 100}%" aria-label="${heightLabel(s)} trunk, ${headsLabel(s)}, ${priceLabel(s)}">
      ${t.svg}<span class="col__label"><span class="col__h">${shortHeight(s)}</span><span class="col__p">${s.price == null ? 'Quote' : money(s.price)}</span></span></button></li>`;
  }).join('');
  $('[data-ruler]').innerHTML = [0.5, 1.0, 1.5].map((m) => `<i style="bottom:${((m * 200) / CHART_MAX) * 100}%">${m.toFixed(1)} m</i>`).join('');
  markChart();
}
function markChart() { $$('[data-col]').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.col === state.size.id))); }
function bindSize() {
  $('[data-range]').addEventListener('input', (e) => setSize(stops()[Number(e.target.value)]));
  $('[data-heads]').addEventListener('change', (e) => setSize(e.target.value === 'multi' ? MULTI[0] : SINGLE[3], { from: 'heads' }));
  $('[data-chart]').addEventListener('click', (e) => { const c = e.target.closest('[data-col]'); if (c) setSize(sizeById(c.dataset.col), { from: 'chart' }); });
  $$('[data-add-current]').forEach((b) => b.addEventListener('click', () => {
    const s = state.size;
    if (s.price == null) { openAsk(); askReply(`How much is a ${heightLabel(s)} multi-head tree?`); return; }
    addToOrder('tree:' + s.id, 1, b);
    hero?.rustle();
  }));
}

/* ================= shop ================= */

function renderShelf() {
  $('[data-shelf]').innerHTML = SHELF.map((p) => {
    const price = p.kind === 'ask' ? '' : p.kind === 'jump' ? `<span class="tag__price"><small>from</small> ${money(p.from)}</span>`
      : `<span class="tag__price">${money(p.price)}${p.was ? `<s>${money(p.was)}</s>` : ''}${p.kind === 'service' ? ' <small>first</small>' : ''}</span>`;
    const action = p.kind === 'ask' ? `<a class="btn btn--line" href="${p.ask}">${p.cta}</a>`
      : p.kind === 'jump' ? `<button type="button" class="btn btn--line" data-jump-multi>Compare sizes</button>`
      : `<span data-buy="${p.id}"></span>`;
    return `<li class="tag${p.id === 'special' ? ' tag--wide' : ''}" data-group="${p.group}" style="view-transition-name: tag-${p.id}">
      <div class="tag__art">${ART[p.art] || ''}</div>
      <div class="tag__body"><h3 class="tag__name">${p.name}</h3><p class="tag__text">${p.text}</p><div class="tag__foot">${price}${action}</div></div></li>`;
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
      : `<button type="button" class="btn btn--forest" data-shelf-add><svg class="ico"><use href="#i-plus"/></svg> <span>Add</span></button>`;
  });
}
function filterShelf(animate = true) {
  const apply = () => $$('.tag').forEach((t) => (t.hidden = state.shelf !== 'all' && t.dataset.group !== state.shelf));
  if (animate && !reduced && document.startViewTransition) document.startViewTransition(apply); else apply();
  const r = $(`input[name="shelf"][value="${state.shelf}"]`);
  if (r) r.checked = true;
}
function bindShelf() {
  $('[data-filters]').addEventListener('change', (e) => { state.shelf = e.target.value; setParam('shelf', state.shelf === 'all' ? null : state.shelf); filterShelf(true); });
  $('[data-shelf]').addEventListener('click', (e) => {
    if (e.target.closest('[data-jump-multi]')) { setSize(MULTI[0], { from: 'chart' }); $('#sizes').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); return; }
    const slot = e.target.closest('[data-buy]');
    if (!slot) return;
    const id = slot.dataset.buy;
    if (e.target.closest('[data-shelf-add]')) addToOrder(id, 1, e.target.closest('button'));
    const q = e.target.closest('[data-shelf-q]');
    if (q) { const line = state.lines.find((l) => l.key === id); setQty(id, line.qty + Number(q.dataset.shelfQ)); }
  });
}

/* ================= care ================= */

function initCare() {
  const range = $('[data-months]');
  let stage = -1, months = 0, raf = 0;
  const show = (m) => {
    months = m;
    const whole = Math.round(m);
    range.value = whole;
    range.style.setProperty('--fill', (m / 24) * 100 + '%');
    $('[data-stage-month]').textContent = whole;
    $('[data-stage-unit]').textContent = whole === 1 ? 'month after planting' : 'months after planting';
    const idx = STAGES.findLastIndex((s) => m >= s[0] - 0.01);
    range.setAttribute('aria-valuetext', `${whole} months: ${STAGES[idx][1]}`);
    if (idx !== stage) {
      stage = idx;
      $('[data-stage-title]').textContent = STAGES[idx][1];
      $('[data-stage-text]').textContent = STAGES[idx][2];
      $('[data-stage-do]').textContent = STAGES[idx][3];
      retrigger($('.stage'), 'is-turning');
      $$('[data-marks] button').forEach((b, n) => b.setAttribute('aria-pressed', String(n === idx)));
    }
    care?.setMonths(m);
  };
  const ease = (to) => {
    cancelAnimationFrame(raf);
    if (reduced) { show(to); return; }
    const from = months, t0 = performance.now();
    const step = (now) => { const k = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - k, 4); show(from + (to - from) * e); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  };
  range.addEventListener('input', () => { cancelAnimationFrame(raf); show(Number(range.value)); });
  $$('[data-marks] button').forEach((b) => b.addEventListener('click', () => ease(Number(b.dataset.month))));
  show(0);
  new IntersectionObserver(async ([en], obs) => {
    if (!en.isIntersecting) return;
    obs.disconnect();
    try {
      await webgl();
      const { createCare } = await import('./care.js');
      care = createCare($('[data-care-canvas]'), { reduced });
      care.setMonths(months);
      new IntersectionObserver(([e2]) => care.setActive(e2.isIntersecting)).observe($('.care__view'));
    } catch { /* the slider still works without the 3D tree */ }
  }, { rootMargin: '500px 0px' }).observe($('.care__view'));
}

/* ================= reminders ================= */

function reminderDates() {
  const v = $('[data-r-date]').value;
  const start = v ? new Date(v + 'T12:00:00') : new Date();
  return REMINDERS.map(([days, text]) => ({ date: new Date(start.getTime() + days * DAY), text }));
}
function renderReminders() {
  $('[data-r-list]').innerHTML = reminderDates().map((r, i) =>
    `<li${i >= 4 ? ' class="is-later"' : ''}><time datetime="${iso(r.date)}">${r.date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' })}</time><span>${r.text}</span></li>`).join('');
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
  $('[data-r-sms]').addEventListener('click', () => { const w = $('[data-r-sms-wrap]'); w.hidden = !w.hidden; if (!w.hidden) $('[data-r-phone]').focus(); });
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
  const paint = () => Object.keys(PLACES).forEach((k) => { const s = openState(k), el = $(`[data-open="${k}"]`); el.textContent = s.text; el.classList.toggle('is-open', s.open); });
  paint();
  setInterval(paint, 60000);
}

/* ================= Ask Replants ================= */

function heightQuestion(q) {
  const m = q.match(/(\d+(?:\.\d+)?)\s*(cm|mm|m\b|metre|meter|met)?/);
  if (!m || !/(price|cost|how much|\$|tree|trunk|metre|meter|\bm\b)/.test(q)) return null;
  let h = parseFloat(m[1]);
  if (m[2] === 'cm') h /= 100; else if (m[2] === 'mm') h /= 1000;
  if (!(h > 0 && h <= 5)) return null;
  const multi = /(multi|two|three|2|3)[ -]?head/.test(q);
  const best = (multi ? MULTI : SINGLE).reduce((a, s) => (Math.abs(s.h - h) < Math.abs(a.h - h) ? s : a));
  if (h > 1.25 && !multi) return { a: `<p>Over 1.2 m of trunk we price each tree individually, as they’re feature specimens. Call ${PHONE} or visit the Rockingham site to see what’s there.</p>`, act: [{ label: 'Call us', href: TEL }] };
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
  const panel = $('[data-ask]'), log = $('[data-ask-log]'), input = $('[data-ask-input]');
  let greeted = false, opener = null;
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
    setTimeout(() => { typing.remove(); say(a, 'bot', act); }, reduced ? 150 : 500 + Math.min(600, a.length * 2));
  };
  openAsk = (btn) => {
    opener = btn || opener;
    if (!panel.hidden) return;
    panel.hidden = false;
    panel.classList.remove('is-closing');
    retrigger(panel, 'is-opening');
    $$('[data-ask-open]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    if (!greeted) {
      greeted = true;
      say('<p>G’day, I’m the Replants helper. Ask about prices, sizes, delivery, care, or a tree that looks unwell.</p>', 'bot');
      $('[data-ask-chips]').innerHTML = CHIPS.map((c) => `<button type="button">${c}</button>`).join('');
    }
    setTimeout(() => input.focus(), 60);
  };
  const close = () => {
    panel.classList.add('is-closing');
    $$('[data-ask-open]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    setTimeout(() => { panel.hidden = true; panel.classList.remove('is-closing'); }, reduced ? 0 : 200);
    opener?.focus();
  };
  $$('[data-ask-open]').forEach((b) => b.addEventListener('click', () => (panel.hidden ? openAsk(b) : close())));
  $('[data-ask-close]').addEventListener('click', close);
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  $('[data-ask-chips]').addEventListener('click', (e) => { if (e.target.matches('button')) askReply(e.target.textContent); });
  $('[data-ask-form]').addEventListener('submit', (e) => { e.preventDefault(); const v = input.value.trim(); if (!v) return; input.value = ''; askReply(v); });
}
function runAction(x, el) {
  if (x.size) { setSize(sizeById(x.size), { from: 'chat' }); $('#sizes').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
  if (x.addTree) { setSize(sizeById(x.addTree), { from: 'chat' }); addToOrder('tree:' + x.addTree, 1, el); }
  if (x.add) addToOrder(x.add, 1, el);
  if (x.open) openOrder();
  if (x.go) $(x.go)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}

/* ================= navigation and motion ================= */

function bindNav() {
  const menu = $('[data-menu]'), btn = $('[data-menu-open]');
  const set = (open) => { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
  btn.addEventListener('click', () => set(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
  const links = $$('.bar__nav a');
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    links.forEach((a) => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['sizes', 'rescue', 'shelf', 'home', 'care', 'visit'].forEach((id) => io.observe(document.getElementById(id)));
  // the bar arrives once the hero has mostly scrolled away
  new IntersectionObserver(([en]) => $('[data-bar]').classList.toggle('is-on', !en.isIntersecting), { threshold: 0, rootMargin: '-55% 0px 0px 0px' }).observe($('[data-hero]'));
}
function initMotion() {
  window.__ready = true;
  if (reduced) { document.documentElement.classList.remove('motion'); return; }
  requestAnimationFrame(() => $('[data-hero]').classList.add('is-in'));
  $$('[data-reveal]').forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
    el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 4) * 0.08}s`);
  });
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in');
    io.unobserve(en.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal], [data-slices], .hl').forEach((el) => io.observe(el));
  if (matchMedia('(hover: hover)').matches) {
    $$('[data-magnetic]').forEach((b) => {
      b.style.transition = 'translate .5s cubic-bezier(.16,1,.3,1), transform .4s cubic-bezier(.16,1,.3,1), background-color .2s';
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1)}px`; });
      b.addEventListener('pointerleave', () => (b.style.translate = '0 0'));
    });
  }
}

async function webgl() {
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('no webgl');
}
async function startHero() {
  const section = $('[data-hero]');
  try {
    await webgl();
    const { createHero } = await import('./hero.js');
    hero = createHero($('[data-hero-canvas]'), { size: state.size, reduced, mobile: isMobile });
    new IntersectionObserver(([en]) => hero.setActive(en.isIntersecting)).observe(section);
    const onScroll = () => { const r = section.getBoundingClientRect(); hero.setScroll(Math.max(0, -r.top / r.height)); };
    addEventListener('scroll', onScroll, { passive: true });
  } catch (err) {
    console.warn('3D tree unavailable, showing a photo instead.', err);
    document.documentElement.classList.add('no-webgl');
  }
}

/* ================= start ================= */

renderTicks();
initSegs();
renderChart();
bindSize();
setSize(state.size, { from: 'init' });
renderReadout(false);
renderShelf();
bindShelf();
bindOrder();
initCare();
bindReminders();
initVisit();
bindAsk();
bindNav();
initMotion();
startHero();
