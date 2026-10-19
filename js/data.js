// Everything the page sells or says, in one place. Prices are replants.com
// salvage-site prices (October 2026), to be confirmed by the client.

export const PHONE = '0408 885 435';
export const TEL = 'tel:+61408885435';
export const SMS = 'sms:+61408885435';
export const GROWTH_M_PER_YEAR = 0.012;

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
export const SINGLE = SIZES.filter((s) => s.heads === 1);
export const MULTI = SIZES.filter((s) => s.heads > 1);
export const sizeById = (id) => SIZES.find((s) => s.id === id);

export const money = (n) => '$' + n.toLocaleString('en-AU');
export const heightLabel = (s) => (s.over ? 'over 1.2 m' : s.h.toFixed(2) + ' m');
export const shortHeight = (s) => (s.over ? '1.2 m +' : s.h.toFixed(1) + ' m');
export const priceLabel = (s) => (s.price == null ? 'On request' : money(s.price));
export const ageYears = (s) => (s.over ? null : Math.round(s.h / GROWTH_M_PER_YEAR));
export const ageLabel = (s) => (s.over ? '100+ years' : 'about ' + ageYears(s) + ' years');
export const headsLabel = (s) => (s.heads > 1 ? (s.over ? 'multi-head' : s.heads + ' heads') : 'single head');
export const treeName = (s) => `${shortHeight(s)} ${s.heads > 1 ? 'multi-head' : 'grass tree'}`;

// Everything else on the shelf. kind: 'item' adds to the order at a price,
// 'service' adds a line we arrange by phone, 'ask' opens an enquiry.
export const SHELF = [
  { id: 'special', group: 'trees', kind: 'item', name: 'Trailer Special', price: 325, was: 475,
    text: 'Three pre-dug trees (one 0.4 m, two 0.2 m) and three tubs of formula. Saturdays at Rockingham.', art: 'special' },
  { id: 'multi', group: 'trees', kind: 'jump', name: 'Multi-head grass trees', from: 340,
    text: 'Two heads at 0.4 m $340, three heads at 1.2 m $750. Bigger ones we quote.', art: 'multi' },
  { id: 'f08', group: 'care', kind: 'item', name: 'Transplant Formula 0.8 kg', price: 15,
    text: 'One small tree (trunk up to 0.4 m). Needed for the 12-month warranty.', art: 'tub-s' },
  { id: 'f17', group: 'care', kind: 'item', name: 'Transplant Formula 1.7 kg', price: 25,
    text: 'One medium to large tree. Re-apply at 6 months.', art: 'tub-m' },
  { id: 'f15', group: 'care', kind: 'item', name: 'Transplant Formula 15 kg', price: 225,
    text: 'The big tub, for landscapers and whole gardens.', art: 'tub-l' },
  { id: 'prune', group: 'services', kind: 'service', name: 'Pruning', price: 75, each: 25,
    text: '$75 the first tree, $25 each after (single heads to 1.8 m). We can blacken the trunk where your shire allows.', art: 'prune' },
  { id: 'maint', group: 'services', kind: 'service', name: 'Maintenance visit', price: 75,
    text: '$75 for 1–4 trees, $100 for 5–10. Treatments up to $25 a tree.', art: 'maint' },
  { id: 'makeover', group: 'services', kind: 'ask', name: 'Native garden makeover', ask: 'mailto:sales@replants.com?subject=Garden%20consultation',
    text: 'We design and plant around rescued trees. Start with a consultation.', art: 'makeover', cta: 'Book a consultation' },
  { id: 'clearing', group: 'services', kind: 'ask', name: 'Clearing your block?', ask: TEL,
    text: 'We salvage grass trees and understorey from small lots in the Perth hills and the South West. It can cut your clearing bill.', art: 'clearing', cta: 'Call Bruce' },
  { id: 'voucher', group: 'care', kind: 'ask', name: 'Gift voucher', ask: 'mailto:mail@replants.com?subject=Gift%20voucher',
    text: 'Any amount, for any tree or service.', art: 'voucher', cta: 'Request a voucher' },
  { id: 'timber', group: 'services', kind: 'ask', name: 'Salvaged timber', ask: 'mailto:enquiries@replants.com?subject=Salvaged%20timber',
    text: 'Jarrah, marri, tuart, banksia and sheoak from cleared sites, milled for furniture and flooring.', art: 'timber', cta: 'Join the list' },
];
export const shelfById = (id) => SHELF.find((p) => p.id === id);

export const STORY = [
  [0.00, 'Once, this grass tree stood in the bulldozer’s way.'],
  [0.07, 'Then the Replants crane truck turned up.'],
  [0.40, 'Up it came, root ball and all.'],
  [0.58, 'Off to a new garden. Yours?'],
  [0.76, 'Turn the page to find your size.'],
];

export const STAGES = [
  [0, 'Settling in', 'Roots grow fast. Leaf tips, and sometimes the outer leaves, go brown. Don’t worry.', 'Fill the moat and soak it. Then deep-water 2–3 times a week in summer.'],
  [6, 'Establishing', 'New roots chase deep water. Yellow shoots appear in the centre and turn green in the sun.', 'Re-apply Transplant Formula at 6 months. Snip the first flower spike.'],
  [12, 'Established', 'New foliage takes over and the old leaves start a dry skirt.', 'Keep deep-watering in heatwaves. Mulch stays 150 mm clear of the trunk.'],
  [24, 'Self-reliant', 'It finds its own water now.', 'Trim the skirt if you like, to show the black trunk again.'],
];

export const REMINDERS = [
  [0, 'Planting day: fill the moat and soak it deeply.'],
  [7, 'Deep-water 2–3 times a week in summer, about 50 L each time.'],
  [30, 'Check the centre: new growth there means it’s settling in.'],
  [90, 'Pull mulch back so it’s 150 mm clear of the trunk. Watch for the first flower spike and remove it.'],
  [182, 'Re-apply Transplant Formula (a warranty condition).'],
  [365, 'One year: new roots are established. Keep deep-watering in heatwaves.'],
  [545, 'Summer check: brown outer leaves are normal; soft trunk at ground level is not.'],
  [730, 'Two years: it finds its own water now. Trim the skirt if you like.'],
];

export const PLACES = {
  fremantle: { name: 'Fremantle nursery', addr: '96 Wray Avenue, Fremantle', full: '96 Wray Avenue, Fremantle WA 6160',
    hours: 'Wed–Sun, 10am–4pm', days: [0, 3, 4, 5, 6], open: 10, close: 16,
    map: 'https://maps.google.com/?q=96+Wray+Avenue+Fremantle+WA+6160',
    note: 'Bagged, nursery-hardened trees, about 20% dearer than the salvage site. Call before visiting.' },
  rockingham: { name: 'Rockingham salvage site', addr: 'Office Road, off Patterson Road', full: 'Office Road (off Patterson Road), Rockingham WA',
    hours: 'Saturdays 8am–12pm, by booking', days: [6], open: 8, close: 12,
    map: 'https://maps.google.com/?q=29+Office+Road+Rockingham+WA',
    note: 'Walk into the bush and choose your tree. We dig it and load your trailer or ute. Wear sturdy shoes.' },
};

// Perth has no daylight saving: UTC+8 all year.
export function perthNow() {
  const d = new Date(Date.now() + (new Date().getTimezoneOffset() + 480) * 60000);
  return { day: d.getDay(), hour: d.getHours() + d.getMinutes() / 60 };
}

export function openState(place) {
  const p = PLACES[place];
  const { day, hour } = perthNow();
  const openToday = p.days.includes(day);
  if (openToday && hour >= p.open && hour < p.close) {
    return { open: true, text: `Open now, until ${fmtHour(p.close)}` };
  }
  for (let i = openToday && hour < p.open ? 0 : 1; i < 8; i++) {
    const d = (day + i) % 7;
    if (p.days.includes(d)) {
      const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d];
      return { open: false, text: `Closed now. Opens ${when} at ${fmtHour(p.open)}` };
    }
  }
  return { open: false, text: p.hours };
}
const fmtHour = (h) => (h === 12 ? '12pm' : h > 12 ? h - 12 + 'pm' : h + 'am');

export const KB = [
  { k: ['price', 'cost', 'how much', 'cheap', 'expensive', 'prices', 'dollar'], a: () =>
      `<p>Single-head grass trees run from <b>$50</b> (0.1 m trunk) to <b>$350</b> (1.2 m). Two heads at 0.4 m $340, three heads at 1.2 m $750; bigger ones we quote.</p><p>Bagged trees from the Fremantle nursery are about 20% more.</p>`,
    act: [{ label: 'See every size', go: '#sizes' }] },
  { k: ['deliver', 'delivery', 'truck', 'crane', 'bring it'], a: () =>
      `<p>Delivery in Perth metro is <b>$100</b> for one tree, or <b>$75 a tree</b> for two or more. Outside metro add $110 an hour travel. Dig a hole 1 m wide and 0.5 m deep and our crane truck drops it in.</p>`,
    act: [{ label: 'How it gets home', go: '#home' }] },
  { k: ['install', 'plant it for me', 'plant for me', 'dig', 'installation'], a: () =>
      `<p>We’ll deliver, dig and plant it: <b>$100 a tree</b> on top of delivery, or $75 if you’ve dug the hole. Trunks over 1.2 m are priced on request.</p>`,
    act: [{ label: 'How it gets home', go: '#home' }] },
  { k: ['open', 'hours', 'where', 'address', 'fremantle', 'rockingham', 'visit', 'location', 'saturday'], a: () =>
      `<p><b>Fremantle nursery</b>, 96 Wray Avenue: Wednesday to Sunday, 10am–4pm.</p><p><b>Rockingham salvage site</b>, Office Road off Patterson Road: Saturdays 8am–12pm, by booking. Wear sturdy shoes.</p>`,
    act: [{ label: 'Map and hours', go: '#visit' }] },
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
    act: [{ label: 'Care guide', go: '#care' }] },
  { k: ['formula', 'fertiliser', 'fertilizer', 'seasol', 'feed', 'tub'], a: () =>
      `<p>Replants Transplant Formula: 0.8 kg <b>$15</b> (small trees), 1.7 kg <b>$25</b> (medium to large), 15 kg <b>$225</b>. Re-apply at 6 months. It’s needed for the warranty.</p>`,
    act: [{ label: 'Add 1.7 kg', add: 'f17' }, { label: 'Add 0.8 kg', add: 'f08' }] },
  { k: ['prune', 'pruning', 'trim', 'burn', 'black', 'skirt', 'tidy'], a: () =>
      `<p>Pruning is <b>$75</b> for the first tree and <b>$25</b> each after (single heads up to 1.8 m). We can also blacken the trunk afterwards, where your shire allows it.</p>`,
    act: [{ label: 'Add pruning', add: 'prune' }, { label: 'Call to book', href: TEL }] },
  { k: ['clear', 'clearing', 'block', 'land', 'developer', 'bulldoz', 'salvage', 'remove my'], a: () =>
      `<p>Clearing a block for a house or shed? We salvage grass trees and understorey from small lots in the Perth hills and the South West, and it can cut your clearing and mulching bill.</p>`,
    act: [{ label: 'Call Bruce', href: TEL }, { label: 'Email Bruce', href: 'mailto:bruce@replants.com' }] },
  { k: ['pensioner', 'discount', 'concession', 'senior', 'cheaper'], a: () =>
      `<p>Yes, we offer pensioners a discount on trees (not on delivery or installation). Mention it when you order and we’ll confirm the amount.</p>` },
  { k: ['pay', 'payment', 'eftpos', 'cash', 'card', 'cheque'], a: () =>
      `<p>EFTPOS at both sites, cash, or cheque if you’re up for a retro ride. Delivered and installed trees are paid in full upfront.</p>` },
  { k: ['country', 'regional', 'freight', 'bunbury', 'busselton', 'geraldton', 'albany', 'kalgoorlie', 'south west'], a: () =>
      `<p>We supply regional WA. Small orders go by freight; big trees our crew delivers and plants.</p>`,
    act: [{ label: 'Ask about your area', href: 'mailto:enquiries@replants.com?subject=Country%20order' }] },
  { k: ['size', 'big', 'small', 'space', 'tall', 'grow', 'growth', 'age', 'old', 'fast', 'choose', 'which'], a: () =>
      `<p>Grass trees grow only about <b>12 mm of trunk a year</b>, so pick one that suits the space now. A 0.6 m trunk is roughly 50 years old. A single head fills 1–1.5 m across.</p><p>Not sure? Bring a photo of the spot when you visit.</p>`,
    act: [{ label: 'Compare sizes', go: '#sizes' }] },
  { k: ['gift', 'voucher', 'present'], a: () => `<p>Gift vouchers come in any amount.</p>`,
    act: [{ label: 'Request a voucher', href: 'mailto:mail@replants.com?subject=Gift%20voucher' }] },
  { k: ['timber', 'wood', 'jarrah', 'marri', 'tuart', 'sheoak'], a: () =>
      `<p>We salvage jarrah, marri, tuart, banksia and sheoak from cleared sites and mill it for furniture, craft and flooring.</p>`,
    act: [{ label: 'Join the list', href: 'mailto:enquiries@replants.com?subject=Salvaged%20timber' }] },
  { k: ['special', 'trailer', 'deal', 'package', 'bundle'], a: () =>
      `<p>Trailer Special: <b>3 pre-dug trees</b> (one 0.4 m, two 0.2 m) and <b>3 tubs of formula</b> for <b>$325</b>, usually $475. Saturdays at Rockingham.</p>`,
    act: [{ label: 'Add the special', add: 'special' }] },
  { k: ['order', 'cart', 'buy', 'checkout', 'send'], a: () =>
      `<p>Add trees and extras from anywhere on the page, then open <b>Your order</b> at the top. Choose pick-up, delivery or installation and a time, and send it. We call to confirm before anything is charged.</p>`,
    act: [{ label: 'Open my order', open: true }] },
  { k: ['hi', 'hello', 'hey', 'g\'day', 'gday'], a: () => `<p>G’day! Ask me about prices, sizes, delivery, watering or a tree that looks unwell.</p>` },
  { k: ['thanks', 'thank you', 'cheers', 'ta'], a: () => `<p>No worries. Anything else, just ask, or call ${PHONE}.</p>` },
];

export const CHIPS = ['How much is a 1 m tree?', 'Delivery cost', 'Watering in summer', 'Brown leaves'];
