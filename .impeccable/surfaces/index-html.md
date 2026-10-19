---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: replants.com concept homepage (index.html)

Mode: Persuade. One homepage that stands in for the whole site in a pitch to the owner.

Audience and job: Perth and WA homeowners choosing a grass tree. They need size, price, how it gets home, and how to keep it alive. Action: choose a size and book a pick-up, delivery or installation.

Proof: real Replants photos (salvage at Mahogany Creek, Bruce and the crane truck, Fremantle installs), real price list, real care timeline. No testimonials, no invented awards or counts. Booking, slot availability, SMS reminders and the chat helper are demos and say so on the page.

Constraints: 3D required. Large legible text for an older audience. Works without WebGL and with reduced motion. Pensioner discount percentage is contradictory on the old site: say "ask us", no number. Keep the three helpers working (pick-up slot booking, care reminders, Ask Replants chat).

Revision (user, 2026-10-20, replacement world): "i really dont like the current design… the website doesnt have life. i want a lot of animations". What was wrong: feels like a template, too plain and white, 3D isn't the star, static between moments. Motion wanted: playful and reactive (things answer the cursor and taps, 3D objects you can grab, bouncy transitions). Nothing visual carries over; content and facts only.

Revision (user, 2026-10-20, mid-build): "try to make it as interactive as this https://augrammingwithg.github.io/Plant-shop/?bed=shrubs". That reference is a working shop: a drag-to-turn 3D specimen with prev/next and Add, a tappable stock chart that filters the catalogue and keeps the filter in the URL, filter chips, a header order button with a live count and total, an order drawer with send options, a scroll-lit "how it works" track, drifting foreground leaves, and a chat helper. Match that depth in this world: a real order you build from anywhere, the size chart as tappable pop-up trees kept in the URL, a filterable shelf of everything else Replants sells, the order drawer replacing the inline booking, and the truck riding the delivery track.

## Direction contract

THESIS: The rescue told as a pop-up picture book you play with. Open it and the grass tree springs up out of the gutter, in the bulldozer's way. It refuses the nursery template (photo hero, product cards) and the quiet white page of the previous version.

OWN-WORLD: Die-cut card in flat gouache fields, white card core at every cut edge, soft cast shadows. Cobalt table #2c5fd0, sky #9cccf5, red earth #c4461f, gum green #3d7a55, crown green #8fbf3a, ochre #e8892b, char ink #1d1a16, page white #fdfcf9. Wattle yellow #ffc928 is reserved by law for booking controls. Gluten lettering for display, Andika for reading. Each section is a spread with a gutter fold. The nav is index tabs hanging from the top edge.

STORY: The tree was in the bulldozer's way. Pull the tab to grow your size while the price flips. Scroll and the crane truck lifts it out and the page turns. See every size stand up in the height chart. Book in steps while the paper truck drives the road to your place. See where trees come from in tipped-in photos. Spin the care wheel through two years and set reminders. Find the two sites on the pop-up map. Close on the back cover.

FIRST VIEWPORT: Cobalt table. An open WebGL book fills the width, its near edge cropped by the viewport. H1 "This grass tree was in the bulldozer's way." is set large in paper white on the table above the left page, like a title over the open book. Decided in build: the left page cannot hold a 4rem headline plus the picker at a legible size. The left page carries the lede, the head toggle, the paper pull-tab, the red price flap and a yellow "Add to my order" (renamed for the order you build from anywhere). On phones the pop-up takes the top 54% of the screen and the text sits on a paper panel below. The right page pops up a sky arch (coloured by Perth time, with sun), red-earth dunes, the grass tree at centre, and a bulldozer parked left with its nose at the tree. A storybook caption sits at the bottom right.

FORM: Pop-up Bush Picture Book; position 5 on the ordered list; seed key 27a8e657. Signature interaction: pull the tab and the paper tree springs to its new size with overshoot while the price flap flips. Scrolling the pinned hero acts out the rescue: the crane truck drives in, lifts the tree and leaves, the bulldozer rolls into the empty spot, and the page turns. Raises: one line of travel (the truck follows the booking steps); Perth-time sky (drag the sun); origin captions on every photo; yellow reserved for booking; damped springs on everything. Motion grammar: open, stand, slide, spin, lift and flutter. Reactive: grab and twang the tree, drag the sun, poke the bulldozer, magnetic buttons, draggable snapshots, and a height chart that leans away from the cursor. Reduced motion keeps every state change and drops the pin, springs, travel and flutter.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
