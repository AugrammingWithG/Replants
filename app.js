// One table drives the slider, the booking summary, the chat answers and the 3D tree.
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
const SINGLE = SIZES.filter((s) => s.heads === 1);
const MULTI = SIZES.filter((s) => s.heads > 1);
const GROWTH_M_PER_YEAR = 0.012;
const PHONE = '0408 885 435';
const TEL = 'tel:+61408885435';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = (n) => '$' + n.toLocaleString('en-AU');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

const heightLabel = (s) => (s.over ? 'over 1.2 m' : s.h.toFixed(2) + ' m');
const priceLabel = (s) => (s.price == null ? 'On request' : money(s.price));
const ageLabel = (s) => (s.over ? '100+ years' : '~' + Math.round(s.h / GROWTH_M_PER_YEAR) + ' years');
const headsLabel = (s) => (s.heads > 1 ? (s.over ? 'multi-head' : s.heads + ' heads') : 'single head');
const formulaTub = (s) => (s.h <= 0.4 && s.heads === 1 ? { kg: '0.8 kg', price: 15 } : { kg: '1.7 kg', price: 25 });

const state = {
  size: SIZES.find((s) => s.id === 's060'),
  method: 'pickup',
  qty: 1,
  dig: false,
  formula: true,
  special: false,
  place: 'rockingham',
  day: null,
  time: null,
  step: 1,
};

let tree = null;

/* ---------- Small motion helpers ---------- */

function tweenNumber(el, to, format) {
  const from = Number(el.dataset.value ?? to);
  el.dataset.value = to;
  if (reduced || from === to) { el.textContent = format(to); return; }
  const t0 = performance.now(), dur = 420;
  const step = (now) => {
    const k = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - k, 4);
    el.textContent = format(Math.round(from + (to - from) * e));
    if (k < 1 && el.dataset.value == to) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function placePill(seg) {
  const pill = $('.seg__pill', seg);
  const on = $('input:checked', seg)?.closest('label');
  if (!pill || !on) return;
  pill.style.width = on.offsetWidth + 'px';
  pill.style.transform = `translateX(${on.offsetLeft}px)`;
}

function initSegs() {
  $$('.seg').forEach((seg) => {
    const pill = document.createElement('span');
    pill.className = 'seg__pill';
    pill.setAttribute('aria-hidden', 'true');
    seg.prepend(pill);
    seg.addEventListener('change', () => placePill(seg));
    placePill(seg);
  });
  const ro = new ResizeObserver((entries) => entries.forEach((en) => placePill(en.target)));
  $$('.seg').forEach((seg) => ro.observe(seg));
}

/* ---------- Hero picker ---------- */

const slider = $('[data-slider]');
const stops = () => (state.size.heads > 1 ? MULTI : SINGLE);

function renderTicks() {
  const list = stops();
  $('[data-ticks]').innerHTML = list
    .map((s) => `<span data-tick="${s.id}">${s.over ? '1.2+' : s.h.toFixed(1)}</span>`)
    .join('');
}

function syncSlider() {
  const list = stops();
  slider.max = list.length - 1;
  slider.value = list.indexOf(state.size);
  slider.style.setProperty('--fill', (slider.value / slider.max) * 100 + '%');
  slider.setAttribute('aria-valuetext', `${heightLabel(state.size)} trunk, ${headsLabel(state.size)}, ${priceLabel(state.size)}`);
  $$('[data-tick]').forEach((t) => t.classList.toggle('is-on', t.dataset.tick === state.size.id));
}

function setSize(s, { fromChat = false } = {}) {
  if (!s || s === state.size) return;
  const switchedHeads = (s.heads > 1) !== (state.size.heads > 1);
  state.size = s;
  if (switchedHeads || fromChat) {
    $(`input[name="heads"][value="${s.heads > 1 ? 'multi' : '1'}"]`).checked = true;
    placePill($('[data-heads]'));
    renderTicks();
  }
  syncSlider();
  renderHero();
  renderSummary();
  tree?.setSize(s);
}

function tick(el, text) {
  if (el.textContent === text) return;
  el.textContent = text;
  if (reduced) return;
  el.classList.remove('is-ticking');
  void el.offsetWidth;
  el.classList.add('is-ticking');
}

function renderHero() {
  const s = state.size;
  tick($('[data-out="height"]'), heightLabel(s));
  tick($('[data-out="age"]'), ageLabel(s));
  const price = $('[data-out="price"]');
  if (s.price == null) { price.dataset.value = ''; price.textContent = 'On request'; }
  else tweenNumber(price, s.price, money);
}

function bindPicker() {
  slider.addEventListener('input', () => setSize(stops()[Number(slider.value)]));
  $('[data-heads]').addEventListener('change', (e) => {
    const multi = e.target.value === 'multi';
    setSize(multi ? MULTI[0] : SINGLE[3]);
    renderTicks();
    syncSlider();
  });
}

/* ---------- Quote ---------- */

function quote() {
  const s = state.size, q = state.qty;
  const lines = [];
  let total = 0, poa = false;

  if (state.special) {
    lines.push(['Trailer Special: 3 pre-dug trees + 3 tubs of formula', money(325)]);
    return { lines, total: 325, poa: false };
  }
  const label = `${q} × ${heightLabel(s)} grass tree${q > 1 ? 's' : ''}`;
  if (s.price == null) { lines.push([label, 'Quote']); poa = true; }
  else { lines.push([label, money(s.price * q)]); total += s.price * q; }

  if (state.method !== 'pickup') {
    const d = q === 1 ? 100 : 75 * q;
    lines.push(['Delivery, Perth metro', money(d)]);
    total += d;
  }
  if (state.method === 'installed') {
    if (s.h > 1.2 || s.over) { lines.push(['Installation, feature tree', 'Quote']); poa = true; }
    else {
      const per = state.dig ? 75 : 100;
      lines.push([`Installation${state.dig ? ', you dig' : ''}`, money(per * q)]);
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

function renderSummary() {
  const { lines, total, poa } = quote();
  $('[data-lines]').innerHTML = lines.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('');
  const t = $('[data-out="total"]');
  const before = t.dataset.value;
  if (poa) { t.dataset.value = ''; t.textContent = total ? `${money(total)} + quote` : 'We’ll quote'; }
  else tweenNumber(t, total, money);
  // the tag swings on its tape when what's on it changes
  if (before !== undefined && before !== t.dataset.value && !reduced) {
    const hang = $('.tag-hang');
    hang.classList.remove('is-swinging');
    void hang.offsetWidth;
    hang.classList.add('is-swinging');
  }

  $('[data-out="qty"]').textContent = state.qty;
  $('[data-qty="-1"]').disabled = state.qty <= 1;
  $('[data-qty="1"]').disabled = state.qty >= 20;
  $('[data-dig-wrap]').hidden = state.method !== 'installed' || state.special;

  const when = $('[data-out="when"]');
  when.hidden = !(state.day && state.time);
  if (!when.hidden) when.textContent = whenLabel();

  $('[data-special]').textContent = state.special ? 'Remove the special' : 'Choose this instead';
}

/* ---------- Booking: days and slots ---------- */

const DAY = 86400000;
const fmtDay = (d) => d.toLocaleDateString('en-AU', { weekday: 'short' });
const fmtDate = (d) => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
const iso = (d) => d.toISOString().slice(0, 10);

function upcoming(match, count) {
  const out = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  for (let i = 1; out.length < count && i < 120; i++) {
    const day = new Date(d.getTime() + i * DAY);
    if (match(day.getDay())) out.push(day);
  }
  return out;
}

function scheduleFor() {
  if (state.method === 'pickup' && state.place === 'rockingham') {
    return { days: upcoming((w) => w === 6, 5), times: ['8:00', '8:45', '9:30', '10:15', '11:00', '11:45'] };
  }
  if (state.method === 'pickup') {
    return { days: upcoming((w) => w === 0 || w >= 3, 8), times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] };
  }
  return { days: upcoming((w) => w >= 1 && w <= 5, 8), times: ['Morning', 'Afternoon'] };
}

// Demo availability: a stable pseudo-random share of slots shows as taken.
function taken(day, time) {
  let h = 2166136261;
  for (const c of iso(day) + time + state.place + state.method) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 100) < 28;
}

function renderWhen() {
  const pickup = state.method === 'pickup';
  $('[data-when-pickup]').hidden = !pickup;
  $('[data-when-delivery]').hidden = pickup;
  if (state.special) {
    state.place = 'rockingham';
    $('input[name="place"][value="rockingham"]').checked = true;
  }
  $$('input[name="place"]').forEach((r) => (r.disabled = state.special && r.value !== 'rockingham'));
  placePill($('[data-place]'));
  $('[data-place-hint]').textContent = state.place === 'rockingham'
    ? 'Saturdays 8am–12pm. You’ll walk into the bush to choose, so wear sturdy shoes.'
    : 'Wednesday to Sunday, 10am–4pm. Bagged, nursery-hardened trees.';
  $('[data-times-label]').textContent = pickup ? 'Time' : 'Delivery window';

  const { days, times } = scheduleFor();
  if (!days.some((d) => iso(d) === state.day)) { state.day = null; state.time = null; }
  $('[data-days]').innerHTML = days
    .map((d) => `<label class="chip"><input type="radio" name="day" value="${iso(d)}" ${iso(d) === state.day ? 'checked' : ''}><span>${fmtDay(d)}<small>${fmtDate(d)}</small></span></label>`)
    .join('');
  const day = days.find((d) => iso(d) === state.day);
  $('[data-times]').innerHTML = day
    ? times.map((t) => {
        const off = taken(day, t);
        return `<label class="chip"><input type="radio" name="time" value="${t}" ${off ? 'disabled' : ''} ${t === state.time ? 'checked' : ''}><span>${t}${off ? '<small>Taken</small>' : ''}</span></label>`;
      }).join('')
    : `<p class="pane__hint">Pick a day first.</p>`;
}

function whenLabel() {
  const d = new Date(state.day + 'T12:00:00');
  const where = state.method === 'pickup' ? (state.place === 'rockingham' ? ' · Rockingham' : ' · Fremantle') : ' · delivery';
  return `${fmtDay(d)} ${fmtDate(d)}, ${state.time}${where}`;
}

/* ---------- Booking: steps ---------- */

const panes = () => $$('[data-pane]');

async function swapPane(from, to, dir) {
  const anim = (el, kf, opts) => (el.animate && !reduced ? el.animate(kf, opts).finished : Promise.resolve());
  if (from) {
    await anim(from, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-12 * dir}px)` }], { duration: 150, easing: 'ease-in' });
    from.hidden = true;
  }
  to.hidden = false;
  $$('.seg', to).forEach(placePill);
  anim(to, [{ opacity: 0, transform: `translateX(${16 * dir}px)` }, { opacity: 1, transform: 'none' }], { duration: 340, easing: 'cubic-bezier(.16,1,.3,1)' });
}

function goTo(n) {
  const dir = n >= state.step ? 1 : -1;
  const from = panes().find((p) => !p.hidden);
  const to = $(`[data-pane="${n}"]`);
  state.step = n;
  if (n === 2) renderWhen();
  if (n === 3) $('[data-address-wrap]').hidden = state.method === 'pickup';
  swapPane(from, to, dir);

  $$('[data-step-tab]').forEach((li) => {
    const i = Number(li.dataset.stepTab);
    li.toggleAttribute('aria-current', i === n);
    if (i === n) li.setAttribute('aria-current', 'step');
    li.classList.toggle('is-done', i < n);
  });
  const done = n === 4;
  $('[data-back]').hidden = n === 1 || done;
  $('[data-next]').hidden = done;
  $('[data-next]').innerHTML = n === 3
    ? 'Send request <svg class="ico"><use href="#i-arrow"/></svg>'
    : 'Continue <svg class="ico"><use href="#i-arrow"/></svg>';
  if (done) setTimeout(() => to.focus(), 50);
}

function validateWhen() {
  if (state.day && state.time) return true;
  const target = state.day ? $('[data-times]') : $('[data-days]');
  if (target.animate && !reduced) target.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 300 });
  $('[data-times-label]').textContent = state.day ? 'Pick a time' : 'Pick a day first';
  return false;
}

function validateDetails() {
  let first = null;
  for (const [id, err] of [['#f-name', '#e-name'], ['#f-phone', '#e-phone']]) {
    const input = $(id), bad = !input.value.trim();
    input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    if (bad) input.setAttribute('aria-describedby', err.slice(1)); else input.removeAttribute('aria-describedby');
    $(err).hidden = !bad;
    if (bad && !first) first = input;
  }
  if (first) first.focus();
  return !first;
}

function send() {
  const { lines } = quote();
  const method = { pickup: 'Pick up', delivered: 'Delivered', installed: 'Installed' }[state.method];
  const body = [
    'Hi Replants,', '',
    state.special ? 'I’d like the Trailer Special.' : `I’d like: ${state.qty} × ${heightLabel(state.size)} grass tree (${headsLabel(state.size)})`,
    `How: ${method}`,
    `When: ${whenLabel()}`,
    ...lines.map(([k, v]) => `  ${k}: ${v}`),
    `Estimate: ${$('[data-out="total"]').textContent}`, '',
    `Name: ${$('#f-name').value.trim()}`,
    `Mobile: ${$('#f-phone').value.trim()}`,
    state.method !== 'pickup' ? `Address: ${$('#f-address').value.trim() || '-'}` : '',
    `Notes: ${$('#f-notes').value.trim() || '-'}`,
  ].filter((l) => l !== '').join('\n');
  goTo(4);
  $('[data-done-text]').textContent = `${whenLabel()}. Your email app should open with the request filled in. We’ll call ${$('#f-phone').value.trim()} to confirm.`;
  window.location.href = 'mailto:sales@replants.com?subject=' + encodeURIComponent('Grass tree booking') + '&body=' + encodeURIComponent(body);
}

function bindBooking() {
  $$('input[name="method"]').forEach((r) => r.addEventListener('change', () => {
    state.method = r.value;
    if (state.special && r.value !== 'pickup') state.special = false;
    renderSummary();
  }));
  $$('[data-qty]').forEach((b) => b.addEventListener('click', () => {
    state.qty = Math.min(20, Math.max(1, state.qty + Number(b.dataset.qty)));
    renderSummary();
  }));
  $('[data-dig]').addEventListener('change', (e) => { state.dig = e.target.checked; renderSummary(); });
  $('[data-formula]').addEventListener('change', (e) => { state.formula = e.target.checked; renderSummary(); });
  $('[data-special]').addEventListener('click', () => {
    state.special = !state.special;
    if (state.special) { state.method = 'pickup'; $('input[name="method"][value="pickup"]').checked = true; }
    renderSummary();
  });

  $('[data-place]').addEventListener('change', (e) => { state.place = e.target.value; state.time = null; renderWhen(); renderSummary(); });
  $('[data-days]').addEventListener('change', (e) => { state.day = e.target.value; state.time = null; renderWhen(); renderSummary(); });
  $('[data-times]').addEventListener('change', (e) => { state.time = e.target.value; renderSummary(); });

  $('[data-next]').addEventListener('click', () => {
    if (state.step === 1) goTo(2);
    else if (state.step === 2 && validateWhen()) goTo(3);
    else if (state.step === 3 && validateDetails()) send();
  });
  $('[data-back]').addEventListener('click', () => goTo(state.step - 1));
  $('[data-form]').addEventListener('submit', (e) => { e.preventDefault(); if (validateDetails()) send(); });
  for (const id of ['#f-name', '#f-phone']) {
    $(id).addEventListener('input', (e) => {
      if (e.target.value.trim()) { e.target.setAttribute('aria-invalid', 'false'); $(id.replace('#f-', '#e-')).hidden = true; }
    });
  }

  $('[data-start-booking]').addEventListener('click', () => { if (state.step === 4) goTo(1); });
  $('[data-ics-booking]').addEventListener('click', () => {
    const d = new Date(state.day + 'T12:00:00');
    const [hh, mm] = /\d/.test(state.time) ? state.time.split(':').map(Number) : [state.time === 'Morning' ? 8 : 12, 0];
    d.setHours(hh, mm, 0, 0);
    const end = new Date(d.getTime() + (state.method === 'pickup' ? 45 : 240) * 60000);
    const where = state.method === 'pickup'
      ? (state.place === 'rockingham' ? 'Office Road (off Patterson Road), Rockingham WA' : '96 Wray Avenue, Fremantle WA 6160')
      : ($('#f-address').value.trim() || 'Your address');
    downloadIcs('replants-booking.ics', [{
      start: d, end, title: state.method === 'pickup' ? 'Pick up grass tree · Replants' : 'Grass tree delivery · Replants',
      where, note: `Replants ${PHONE}. Bring a container for 15 L of soil.`,
    }]);
  });
}

/* ---------- Calendar files ---------- */

const icsStamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsDate = (d) => iso(d).replace(/-/g, '');
const icsText = (s) => s.replace(/[,;\\]/g, (m) => '\\' + m).replace(/\n/g, '\\n');

function downloadIcs(name, events) {
  const now = icsStamp(new Date());
  const body = events.map((e, i) => [
    'BEGIN:VEVENT',
    `UID:replants-${now}-${i}@replants.com`,
    `DTSTAMP:${now}`,
    e.allDay ? `DTSTART;VALUE=DATE:${icsDate(e.start)}` : `DTSTART:${icsStamp(e.start)}`,
    e.allDay ? `DTEND;VALUE=DATE:${icsDate(new Date(e.start.getTime() + DAY))}` : `DTEND:${icsStamp(e.end)}`,
    `SUMMARY:${icsText(e.title)}`,
    e.where ? `LOCATION:${icsText(e.where)}` : '',
    `DESCRIPTION:${icsText(e.note || '')}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsText(e.title)}`,
    e.allDay ? 'TRIGGER:PT9H' : 'TRIGGER:-PT12H', 'END:VALARM',
    'END:VEVENT',
  ].filter(Boolean).join('\r\n')).join('\r\n');
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Replants//Concept//EN\r\nCALSCALE:GREGORIAN\r\n${body}\r\nEND:VCALENDAR\r\n`;
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ---------- Care reminders ---------- */

const REMINDERS = [
  [0, 'Planting day: fill the moat and soak it deeply.'],
  [7, 'Deep-water 2–3 times a week in summer, about 50 L each time.'],
  [30, 'Check the centre: new growth there means it’s settling in.'],
  [90, 'Pull mulch back so it’s 150 mm clear of the trunk. Watch for the first flower spike and remove it.'],
  [182, 'Re-apply Transplant Formula (a warranty condition).'],
  [365, 'One year: new roots are established. Keep deep-watering in heatwaves.'],
  [545, 'Summer check: brown outer leaves are normal; soft trunk at ground level is not.'],
  [730, 'Two years: it finds its own water now. Trim the skirt if you like.'],
];

function reminderDates() {
  const v = $('[data-r-date]').value;
  const start = v ? new Date(v + 'T12:00:00') : new Date();
  return REMINDERS.map(([days, text]) => ({ date: new Date(start.getTime() + days * DAY), text }));
}

function renderReminders() {
  $('[data-r-list]').innerHTML = reminderDates()
    .map((r, i) => `<li style="--i:${i % 4}"${i >= 4 ? ' class="is-later"' : ''}><time datetime="${iso(r.date)}">${r.date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' })}</time><span>${r.text}</span></li>`)
    .join('');
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
  $('[data-r-ics]').addEventListener('click', () => {
    downloadIcs('replants-care-reminders.ics', reminderDates().map((r) => ({
      start: r.date, allDay: true, title: 'Grass tree care · ' + r.text.split(':')[0].split('.')[0],
      note: r.text + ` Questions? Replants ${PHONE} or support@replants.com`,
    })));
  });
  $('[data-r-sms]').addEventListener('click', () => {
    const wrap = $('[data-r-sms-wrap]');
    wrap.hidden = !wrap.hidden;
    if (!wrap.hidden) $('[data-r-phone]').focus();
  });
  $('[data-reminders]').addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = $('[data-r-phone]');
    if (!phone.value.trim()) { phone.setAttribute('aria-invalid', 'true'); phone.focus(); return; }
    phone.setAttribute('aria-invalid', 'false');
    $('[data-r-sms-done]').hidden = false;
  });
}

/* ---------- Ask Replants ---------- */

const KB = [
  { k: ['price', 'cost', 'how much', 'cheap', 'expensive', 'prices', 'dollar'], a: () =>
      `<p>Single-head grass trees run from <b>$50</b> (0.1 m trunk) to <b>$350</b> (1.2 m). Two-head trees from $340, three heads at 1.2 m $750; bigger ones we quote.</p><p>Bagged trees from the Fremantle nursery are about 20% more.</p>`,
    act: [{ label: 'Try sizes', go: '#top' }, { label: 'Book', go: '#get-it-home' }] },
  { k: ['deliver', 'delivery', 'truck', 'crane', 'bring it'], a: () =>
      `<p>Delivery in Perth metro is <b>$100</b> for one tree, or <b>$75 a tree</b> for two or more. Outside metro add $110 an hour travel. Dig a hole 1 m wide and 0.5 m deep and our crane truck drops it in.</p>`,
    act: [{ label: 'Book delivery', go: '#get-it-home', method: 'delivered' }] },
  { k: ['install', 'plant it for me', 'plant for me', 'dig', 'installation'], a: () =>
      `<p>We’ll deliver, dig and plant it: <b>$100 a tree</b> on top of delivery, or $75 if you’ve dug the hole. Trunks over 1.2 m are priced on request.</p>`,
    act: [{ label: 'Book installation', go: '#get-it-home', method: 'installed' }] },
  { k: ['open', 'hours', 'where', 'address', 'fremantle', 'rockingham', 'visit', 'location', 'saturday'], a: () =>
      `<p><b>Fremantle nursery</b>, 96 Wray Avenue: Wednesday to Sunday, 10am–4pm.</p><p><b>Rockingham salvage site</b>, Office Road off Patterson Road: Saturdays 8am–12pm, by booking. Wear sturdy shoes.</p>`,
    act: [{ label: 'Directions', go: '#visit' }, { label: 'Book a time', go: '#get-it-home' }] },
  { k: ['water', 'watering', 'drip', 'sprinkler', 'how often', 'litres', 'rain'], a: () =>
      `<p>In hot months, water <b>2–3 times a week, about 50 L each time</b>, into the moat by dripper or bubbler. Once or twice a week when it’s cooler, and not at all in heavy rain.</p><p>Never let sprinklers wet the leaves.</p>`,
    act: [{ label: 'Set reminders', go: '#reminders' }] },
  { k: ['brown', 'yellow', 'dying', 'sick', 'stressed', 'dead', 'unhealthy', 'wilting', 'droop'], a: () =>
      `<p>Brown tips in the first 6 months are normal. Check the <b>centre</b>: if the new growth there is healthy, it’s just the heat.</p><p>If the centre looks poor, apply Seasol or Ecovital monthly, check the black trunk at ground level is dry and firm, and pull mulch back.</p><p>Still worried? Email a photo to support@replants.com.</p>`,
    act: [{ label: 'Email a photo', href: 'mailto:support@replants.com?subject=Grass%20tree%20health' }, { label: 'Call us', href: TEL }] },
  { k: ['bug', 'bugs', 'mildew', 'scale', 'mealy', 'rust', 'slater', 'powder', 'white', 'insect', 'pest', 'fungus'], a: () =>
      `<p><b>White powder</b> is mildew: wettable sulphur or Mancozeb, and thin the foliage. <b>Small grey-white bugs</b> are mealybugs: white oil, not in hot weather. <b>Scale</b>: pyrethrin or neem oil. <b>Slaters</b>: keep mulch 100 mm from the trunk.</p>` },
  { k: ['warranty', 'guarantee', 'replace', 'refund', 'dies', 'died'], a: () =>
      `<p>12 months, when you plant with our Transplant Formula and follow the care guide. If it doesn’t make it, we replace it for 25% of the original price, plus delivery and install if needed.</p>`,
    act: [{ label: 'Warranty conditions', go: '#care' }] },
  { k: ['formula', 'fertiliser', 'fertilizer', 'seasol', 'feed', 'tub'], a: () =>
      `<p>Replants Transplant Formula: 0.8 kg <b>$15</b> (small trees), 1.7 kg <b>$25</b> (medium to large), 15 kg <b>$225</b>. Re-apply at 6 months. It’s needed for the warranty.</p>` },
  { k: ['prune', 'pruning', 'trim', 'burn', 'black', 'skirt', 'tidy'], a: () =>
      `<p>Pruning is <b>$75</b> for the first tree and <b>$25</b> each after (single heads up to 1.8 m). We can also blacken the trunk afterwards, where your shire allows it.</p>`,
    act: [{ label: 'Call to book', href: TEL }] },
  { k: ['clear', 'clearing', 'block', 'land', 'developer', 'bulldoz', 'salvage', 'remove my'], a: () =>
      `<p>Clearing a block for a house or shed? We salvage grass trees and understorey from small lots in the Perth hills and the South West, and it can cut your clearing and mulching bill.</p>`,
    act: [{ label: 'Call Bruce', href: TEL }, { label: 'Email Bruce', href: 'mailto:bruce@replants.com' }] },
  { k: ['pensioner', 'discount', 'concession', 'senior', 'cheaper'], a: () =>
      `<p>Yes, we offer pensioners a discount on trees (not on delivery or installation). Mention it when you book and we’ll confirm the amount.</p>` },
  { k: ['pay', 'payment', 'eftpos', 'cash', 'card', 'cheque'], a: () =>
      `<p>EFTPOS at both sites, cash, or cheque if you’re up for a retro ride. Delivered and installed trees are paid in full upfront.</p>` },
  { k: ['country', 'regional', 'freight', 'bunbury', 'busselton', 'geraldton', 'albany', 'kalgoorlie', 'south west'], a: () =>
      `<p>We supply regional WA. Small orders go by freight; big trees our crew delivers and plants.</p>`,
    act: [{ label: 'Ask about your area', href: 'mailto:enquiries@replants.com?subject=Country%20order' }] },
  { k: ['size', 'big', 'small', 'space', 'tall', 'grow', 'growth', 'age', 'old', 'fast', 'choose', 'which'], a: () =>
      `<p>Grass trees grow only about <b>12 mm of trunk a year</b>, so pick one that suits the space now. A 0.6 m trunk is roughly 50 years old. A single head fills 1–1.5 m across.</p><p>Not sure? Bring a photo of the spot when you visit.</p>`,
    act: [{ label: 'Compare sizes', go: '#top' }] },
  { k: ['gift', 'voucher', 'present'], a: () => `<p>Gift vouchers come in any amount.</p>`,
    act: [{ label: 'Request a voucher', href: 'mailto:mail@replants.com?subject=Gift%20voucher' }] },
  { k: ['timber', 'wood', 'jarrah', 'marri', 'tuart', 'sheoak'], a: () =>
      `<p>We salvage jarrah, marri, tuart, banksia and sheoak from cleared sites and mill it for furniture, craft and flooring.</p>`,
    act: [{ label: 'Join the list', href: 'mailto:enquiries@replants.com?subject=Salvaged%20timber' }] },
  { k: ['special', 'trailer', 'deal', 'package', 'bundle'], a: () =>
      `<p>Trailer Special: <b>3 pre-dug trees</b> (one 0.4 m, two 0.2 m) and <b>3 tubs of formula</b> for <b>$325</b>, usually $475. Saturdays at Rockingham.</p>`,
    act: [{ label: 'Book the special', go: '#get-it-home', special: true }] },
  { k: ['hi', 'hello', 'hey', 'g\'day', 'gday'], a: () => `<p>G’day! Ask me about prices, sizes, delivery, watering or a tree that looks unwell.</p>` },
  { k: ['thanks', 'thank you', 'cheers', 'ta'], a: () => `<p>No worries. Anything else, just ask, or call ${PHONE}.</p>` },
];

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
    return { a: `<p>Over 1.2 m of trunk we price each tree individually, as they’re feature specimens. Call ${PHONE} or visit the Rockingham site to see what’s there.</p>`,
      act: [{ label: 'Call us', href: TEL }] };
  }
  return {
    a: `<p>A <b>${heightLabel(best)}</b> ${headsLabel(best)} grass tree is <b>${priceLabel(best)}</b> from the salvage site, and it’s ${ageLabel(best).replace('~', 'roughly ')} old.</p>`,
    act: [{ label: 'Show me', size: best.id }, { label: 'Book it', go: '#get-it-home', size: best.id }],
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
  return {
    a: `<p>I’m not sure about that one. The team can help: call <b>${PHONE}</b> or email enquiries@replants.com.</p>`,
    act: [{ label: 'Call', href: TEL }, { label: 'Email', href: 'mailto:enquiries@replants.com' }],
  };
}

const CHIPS = ['How much is a 1 m tree?', 'Delivery cost', 'Watering in summer', 'Brown leaves'];

function bindAsk() {
  const btn = $('[data-ask-open]'), panel = $('[data-ask]'), log = $('[data-ask-log]');
  const input = $('[data-ask-input]');
  let greeted = false;

  const scroll = () => log.scrollTo({ top: log.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
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
        el.textContent = x.label;
        el.addEventListener('click', () => runAction(x));
        row.append(el);
      });
      m.append(row);
    }
    log.append(m);
    // a new answer is read from its first line, not its last
    if (who === 'bot') log.scrollTo({ top: m.offsetTop - 12, behavior: reduced ? 'auto' : 'smooth' });
    else scroll();
  };

  const reply = (text) => {
    $('[data-ask-chips]').hidden = true;
    say(text, 'me');
    const typing = document.createElement('div');
    typing.className = 'msg msg--bot typing';
    typing.innerHTML = '<i></i><i></i><i></i>';
    typing.setAttribute('aria-label', 'Replants is typing');
    log.append(typing);
    scroll();
    const { a, act } = answer(text);
    setTimeout(() => { typing.remove(); say(a, 'bot', act); }, reduced ? 150 : 550 + Math.min(600, a.length * 2));
  };

  const open = () => {
    panel.hidden = false;
    panel.classList.remove('is-closing');
    panel.classList.add('is-opening');
    btn.setAttribute('aria-expanded', 'true');
    if (!greeted) {
      greeted = true;
      say(`<p>Hi, I’m the Replants helper. Ask about prices, sizes, delivery, care, or a tree that looks unwell.</p>`, 'bot');
      $('[data-ask-chips]').innerHTML = CHIPS.map((c) => `<button type="button">${c}</button>`).join('');
    }
    setTimeout(() => input.focus(), 60);
  };
  const close = () => {
    panel.classList.remove('is-opening');
    panel.classList.add('is-closing');
    btn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { panel.hidden = true; panel.classList.remove('is-closing'); }, reduced ? 0 : 190);
    btn.focus();
  };

  btn.addEventListener('click', open);
  $('[data-ask-close]').addEventListener('click', close);
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  $('[data-ask-chips]').addEventListener('click', (e) => { if (e.target.matches('button')) reply(e.target.textContent); });
  $('[data-ask-form]').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    reply(v);
  });
}

function runAction(x) {
  if (x.size) setSize(SIZES.find((s) => s.id === x.size), { fromChat: true });
  if (x.method) { state.method = x.method; $(`input[name="method"][value="${x.method}"]`).checked = true; state.special = false; }
  if (x.special) { state.special = true; state.method = 'pickup'; $('input[name="method"][value="pickup"]').checked = true; }
  if (x.size || x.method || x.special) renderSummary();
  if (x.go) {
    if (x.go === '#get-it-home' && state.step !== 1) goTo(1);
    $(x.go).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }
}

/* ---------- Page chrome ---------- */

function bindChrome() {
  const head = $('.site-head');
  const ask = $('[data-ask-open]');
  const onScroll = () => {
    head.classList.toggle('is-scrolled', scrollY > 8);
    // the helper waits until the visitor starts exploring, so the first view stays calm
    if (scrollY > 320) ask.classList.add('is-shown');
  };
  addEventListener('scroll', onScroll, { passive: true });
  const covering = new Set();
  const tuck = new IntersectionObserver((entries) => {
    entries.forEach((en) => (en.isIntersecting ? covering.add(en.target) : covering.delete(en.target)));
    // on wide screens the order panel is sticky beside the steps, clear of the button
    const inline = matchMedia('(max-width: 1024px)').matches;
    ask.classList.toggle('is-tucked', [...covering].some((el) => inline || el.matches('.site-foot')));
  }, { rootMargin: '0px 0px -0px 0px', threshold: 0 });
  [$('.summary'), $('.grow__panel'), $('.site-foot')].forEach((el) => tuck.observe(el));
  onScroll();

  const nav = $('.site-nav'), toggle = $('.site-nav__toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
    }
  });

  // which section is on screen, for the nav underline
  const links = new Map($$('.site-nav a').map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      links.get(en.target.id)?.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });

}

/* ---------- Motion ---------- */

function initMotion() {
  // diagram numbers and legend lines point at each other (works without motion too)
  const cut = $('[data-cut]');
  const legend = $$('.cut-legend li');
  const light = (n) => {
    $$('g[data-n]', cut).forEach((g) => g.classList.toggle('is-on', g.dataset.n === n));
    legend.forEach((li) => li.classList.toggle('is-on', li.dataset.n === n));
  };
  [...$$('g[data-n]', cut), ...legend].forEach((el) => {
    el.addEventListener('pointerenter', () => light(el.dataset.n));
    el.addEventListener('pointerleave', () => light(null));
  });

  if (reduced) return;
  document.documentElement.classList.add('motion');

  // hero headline, word by word
  const title = $('.hero__title');
  let i = 0;
  [...title.childNodes].forEach((node) => {
    if (node.nodeType === 3) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(part); return; }
        const w = document.createElement('span');
        w.className = 'w';
        w.innerHTML = `<span style="--i:${i++}">${part}</span>`;
        frag.append(w);
      });
      node.replaceWith(frag);
    } else if (node.matches?.('.tape-word')) {
      $('.w > span', node).style.setProperty('--i', i++);
    }
  });

  // sections arrive once
  $$('.band__head h2').forEach((h) => {
    h.innerHTML = `<span class="reveal-mask"><span>${h.innerHTML}</span></span>`;
  });
  const groups = [
    ['.band__head', (el) => [...el.children]],
    ['.book', (el) => [$('.steps', el), $('.book__panes', el), $('.tag-hang', el)]],
    ['.rescue', (el) => $$('figure', el)],
    ['.grow', (el) => [...el.children]],
    ['.care', (el) => [$('.section-cut', el), ...$('.care__side', el).children]],
  ];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  groups.forEach(([sel, kids]) => $$(sel).forEach((group) => {
    kids(group).filter(Boolean).forEach((el, n) => {
      if (el.matches('h2')) { el.style.setProperty('--d', '0s'); io.observe(el); return; }
      el.dataset.reveal = '';
      el.style.setProperty('--d', `${Math.min(n, 6) * 0.09}s`);
      io.observe(el);
    });
  }));

  // choice cards lean toward the pointer
  if (matchMedia('(hover: hover)').matches) {
    $$('.option').forEach((opt) => {
      const body = $('.option__body', opt);
      opt.addEventListener('pointermove', (e) => {
        const r = body.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        opt.classList.add('is-tilting');
        body.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
        body.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
      });
      opt.addEventListener('pointerleave', () => {
        opt.classList.remove('is-tilting');
        body.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1), box-shadow .25s';
        body.style.setProperty('--ry', '0deg');
        body.style.setProperty('--rx', '0deg');
        setTimeout(() => (body.style.transition = ''), 600);
      });
    });
  }
}

/* ---------- 3D ---------- */

let createTreeScene = null;
async function loadThree() {
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('no webgl');
  if (!createTreeScene) ({ createTreeScene } = await import('./tree.js'));
  await document.fonts.ready;
  return createTreeScene;
}

async function startTree() {
  const canvas = $('.hero__canvas');
  try {
    const create = await loadThree();
    tree = await create(canvas, state.size, { mode: 'hero' });
    if (!reduced) $('[data-hint]').textContent = 'Drag to turn · tap to rustle';
    // scrolling past the hero digs the tree out of the ground
    const hero = $('.hero');
    const onScroll = () => {
      const r = hero.getBoundingClientRect();
      tree.setLift(-r.top / (r.height * 0.42));
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  } catch (err) {
    console.warn('3D tree unavailable, showing photo instead.', err);
    document.documentElement.classList.add('no-webgl');
  }
}

/* ---------- The first two years ---------- */

const STAGES = [
  [0, 'Settling in', 'Roots grow fast. Leaf tips, and sometimes the outer leaves, go brown. Don’t worry.'],
  [6, 'Establishing', 'New roots chase deep water. Yellow shoots appear in the centre and turn green in the sun.'],
  [12, 'Established', 'New foliage takes over and the old leaves start a dry skirt. Keep deep-watering in heat.'],
  [24, 'Self-reliant', 'It finds its own water now. Trim the skirt if you like, to show the black trunk again.'],
];

function initGrow() {
  const wrap = $('[data-grow]');
  const slider = $('[data-grow-slider]');
  const playBtn = $('[data-grow-play]');
  let care = null, months = 0, stage = -1, playing = null, played = false, touched = false;

  const show = (m) => {
    months = m;
    slider.value = m;
    slider.style.setProperty('--fill', (m / 30) * 100 + '%');
    $('[data-grow-month]').textContent = Math.floor(m);
    $('[data-grow-unit]').textContent = Math.floor(m) === 1 ? 'month after planting' : 'months after planting';
    slider.setAttribute('aria-valuetext', `${Math.floor(m)} months: ${STAGES[STAGES.findLastIndex((s) => m >= s[0])][1]}`);
    const idx = STAGES.findLastIndex((s) => m >= s[0]);
    if (idx !== stage) {
      stage = idx;
      const swap = () => {
        $('[data-grow-title]').textContent = STAGES[idx][1];
        $('[data-grow-text]').textContent = STAGES[idx][2];
        wrap.classList.remove('is-swapping');
      };
      if (reduced) swap(); else { wrap.classList.add('is-swapping'); setTimeout(swap, 180); }
      $$('[data-grow-marks] button').forEach((b, n) => b.setAttribute('aria-pressed', String(n === idx)));
    }
    care?.setAge(m);
  };

  const stop = () => {
    if (playing) cancelAnimationFrame(playing);
    playing = null;
    playBtn.innerHTML = '<svg class="ico"><use href="#i-play"/></svg> <span>Play the two years</span>';
  };
  const play = () => {
    if (playing) { stop(); return; }
    const from = months >= 29.5 ? 0 : months, t0 = performance.now(), dur = (30 - from) * 230;
    playBtn.innerHTML = '<svg class="ico"><use href="#i-pause"/></svg> <span>Pause</span>';
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      show(from + (30 - from) * k);
      playing = k < 1 ? requestAnimationFrame(step) : (stop(), null);
    };
    playing = requestAnimationFrame(step);
  };

  slider.addEventListener('input', () => { stop(); played = touched = true; show(Number(slider.value)); });
  playBtn.addEventListener('click', () => { played = touched = true; play(); });
  $$('[data-grow-marks] button').forEach((b) => b.addEventListener('click', () => {
    stop(); played = touched = true;
    const to = Number(b.dataset.month), from = months, t0 = performance.now();
    if (reduced) { show(to); return; }
    const step = (now) => {
      const k = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - k, 4);
      show(from + (to - from) * e);
      playing = k < 1 ? requestAnimationFrame(step) : null;
    };
    playing = requestAnimationFrame(step);
  }));
  show(0);
  // never paint offscreen: autoplay pauses when the section leaves view
  new IntersectionObserver(([en]) => { if (!en.isIntersecting && playing) stop(); }).observe(wrap);

  // build the second scene only when the section comes near, then play it once
  new IntersectionObserver(async ([en], obs) => {
    if (!en.isIntersecting) return;
    obs.disconnect();
    try {
      const create = await loadThree();
      care = await create($('.grow__canvas'), SIZES.find((s) => s.id === 's060'), { mode: 'care' });
      care.setAge(months);
      if (!reduced) {
        new IntersectionObserver(([e2], o2) => {
          if (e2.isIntersecting && !played) { played = true; setTimeout(() => { if (!touched) play(); }, 500); o2.disconnect(); }
        }, { threshold: 0.55 }).observe(wrap);
      }
    } catch { /* the panel still works without the 3D tree */ }
  }, { rootMargin: '400px 0px' }).observe(wrap);
}

renderTicks();
syncSlider();
renderHero();
initSegs();
bindPicker();
bindBooking();
renderSummary();
bindReminders();
bindAsk();
bindChrome();
initMotion();
initGrow();
startTree();
