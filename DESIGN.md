---
name: replants
description: Rescued WA grass trees, told as a pop-up bush picture book you play with.
colors:
  table: "#2c5fd0"
  table-deep: "#234fb3"
  sky: "#9cccf5"
  earth: "#c4461f"
  earth-deep: "#9e3516"
  gum: "#3d7a55"
  gum-deep: "#2b5a3e"
  crown: "#8fbf3a"
  crown-deep: "#5f8f22"
  ochre: "#e8892b"
  sand: "#efcf98"
  wattle: "#ffc928"
  wattle-deep: "#d9a300"
  ink: "#1d1a16"
  ink-2: "#4a453d"
  paper: "#fdfcf9"
  paper-2: "#f2eee5"
  core: "#f4efe4"
  error: "#a3200f"
typography:
  display:
    fontFamily: "Gluten, Andika, Trebuchet MS, sans-serif"
    fontSize: "clamp(2.5rem, 1.1rem + 3.7vw, 4.7rem)"
    fontWeight: 760
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Gluten, Andika, Trebuchet MS, sans-serif"
    fontSize: "clamp(2.3rem, 1.3rem + 2.7vw, 4.1rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Gluten, Andika, Trebuchet MS, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 700
    lineHeight: 1.1
  figure:
    fontFamily: "Gluten, Andika, Trebuchet MS, sans-serif"
    fontSize: "clamp(2.1rem, 1.6rem + 1.5vw, 2.9rem)"
    fontWeight: 760
    lineHeight: 1
  caption:
    fontFamily: "Gluten, Andika, Trebuchet MS, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  tab:
    fontFamily: "Gluten, Andika, Trebuchet MS, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1
  body:
    fontFamily: "Andika, Segoe UI, system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: "Andika, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Andika, Segoe UI, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1.3
rounded:
  flap: "6px"
  tag: "10px"
  card: "14px"
  sheet: "16px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 0.3rem + 2.8vw, 3.5rem)"
  band: "clamp(4.5rem, 8vw, 7.5rem)"
  max: "82rem"
  fold-gap: "clamp(3rem, 8vw, 9rem)"
components:
  button-go:
    backgroundColor: "{colors.wattle}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.3rem"
    height: "3.1rem"
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.3rem"
    height: "3.1rem"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.3rem"
    height: "3.1rem"
  button-line-hover:
    backgroundColor: "{colors.paper-2}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 0.8rem"
    height: "3.1rem"
  order-pill:
    backgroundColor: "{colors.wattle}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem 0.5rem 0.85rem"
    height: "2.9rem"
  index-tab:
    textColor: "{colors.ink}"
    typography: "{typography.tab}"
    padding: "1.1rem 0.95rem 0.6rem"
  pull-tab:
    backgroundColor: "{colors.wattle}"
    textColor: "{colors.ink}"
    rounded: "8px"
    padding: "0 0.95rem 0 0.6rem"
    height: "2.9rem"
  price-flap:
    backgroundColor: "{colors.earth}"
    textColor: "{colors.paper}"
    typography: "{typography.figure}"
    rounded: "{rounded.flap}"
    padding: "0.3rem 0.6rem 0.35rem"
  seg-toggle:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "4px"
  seg-pill:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.pill}"
  filter-chip:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.6rem 1.05rem"
  filter-chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  slot-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "0.45rem 0.8rem"
    height: "3rem"
  slot-chip-selected:
    backgroundColor: "{colors.wattle}"
    textColor: "{colors.ink}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "0.6rem 0.9rem"
    height: "3rem"
  shelf-tag:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.ink}"
    padding: "1rem 1.15rem 1.15rem"
  pick-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1.4rem 1.5rem 1.2rem"
  hero-caption:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    padding: "0.6rem 1.1rem 0.7rem"
  order-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    width: "min(32rem, calc(100vw - 1.2rem))"
  care-panel:
    backgroundColor: "{colors.gum-deep}"
    textColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "1.5rem"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "12px"
    padding: "0.75rem 1.2rem"
---

# Design System: replants

## Overview

**Creative North Star: "The Pop-up Bush Picture Book"**

The site is a children's pop-up book lying open on a cobalt table. Every chapter is a full-bleed spread of flat gouache colour with a fold down the middle; everything that stands on it is die-cut card, coloured on the face, showing a white core at every cut edge, casting a soft shadow onto the page. The hero is a real WebGL pop-up book whose right page springs a cut-paper grass tree up out of the gutter, in the bulldozer's way. Illustrations are cut paper (SVG shapes and extruded 3D cards), never icons pasted on; photos are tipped in as snapshots with tape.

The book is meant to be played with. Things answer a hand: the pull-tab grows the tree, the price flap flips, the height chart stands up and leans from the cursor, snapshots can be picked up, the care wheel spins, map flags fold up. Every movement uses one damped spring that overshoots and settles. Colour is loud and saturated but held in fields: one field per spread, one colour per card. One yellow is kept back for ordering, so the eye always finds the way to buy.

The previous "Flagging Tape and Tree Tags" world (white sand ground, pink tape, hairline panels, Anybody and Lexend) was rejected and nothing visual carries over from it.

**Key Characteristics:**
- Full-bleed gouache spreads with a gutter fold, on a cobalt table.
- Die-cut card everywhere: coloured face, white core rim, soft cast shadow.
- Wattle yellow belongs to ordering and nothing else.
- Gluten for titles, figures, tabs and the book's own captions; Andika for every sentence a person reads.
- Spring overshoot on everything, in a fixed grammar: open, stand, slide, spin, lift, flutter.
- Works fully without WebGL and with reduced motion.

## Colors

Saturated poster-paint fields from the WA bush (sky, red earth, gum, grass crown, ochre) on a cobalt table, with one warm white for card and one near-black for ink.

### Primary
- **Cobalt Table** (table): the table the book lies on. Page background behind the hero, the "How it gets home" spread, the sea on the map. Table Deep (table-deep) is its shade.
- **Wattle Yellow** (wattle): the ordering colour. See the Wattle Law Rule. Wattle Deep (wattle-deep) is only the 3px ring on a chosen order method.

### Secondary
- **Bush Sky** (sky): the sizes spread, the hero sky arch, tree-group shelf tags, the second "way" card, visitor chat bubbles and chat suggestions, text selection.
- **Red Earth** (earth): the rescue spread, the hero dunes, the price flap, map flags, the chart ground, the truck boom. Earth Deep (earth-deep) is the back cover's cloth board.
- **Gum Green** (gum): the care spread. Gum Deep (gum-deep) fills the reminders and warranty panels inside it.

### Tertiary
- **Grass Crown** (crown): the visit spread, care-group shelf tags, the third "way" card, the grass tree's crown. Crown Deep (crown-deep) is the "open now" dot.
- **Ochre** (ochre): the first "way" card and the "Get it home" index tab.
- **Coast Sand** (sand): the land on the pop-up map and sand in the 3D book.

### Neutral
- **Page White** (paper): card faces, the hero caption, buttons, fields, the order sheet, the chat panel, the mobile hero panel, snapshot borders.
- **Paper Shade** (paper-2): the segmented toggle track, unselected filter chips, bot chat bubbles, quiet and line hover washes, the order progress track.
- **Card Core** (core): the white core at every die-cut edge, in the `#cut` filter, the 3D `card()` edge material, and as the 3px rim around the price flap and map flags.
- **Char Ink** (ink): all text on light fields, line-button rings, selected filter chips, the order count bubble, the toast, focus outlines on light fields.
- **Pencil** (ink-2): secondary text, notes, ticks and labels on light fields. On coloured spreads secondary text uses a per-spread tint instead (`--fg-2`).
- **Field Error** (error): invalid field border and message on light grounds; on the gum spread errors use a pale tint (#ffd8cc).

### Named Rules
**The Wattle Law Rule.** Wattle yellow is reserved for ordering controls: the "Add to my order" buttons, the header order pill, the size pull-tab that sets what you add, shelf steppers, chosen day and time chips, the chosen send method, the order progress fill, chat "add" actions, and the label that flies into the order. Nothing decorative, informational or navigational is ever yellow. If it does not build or send an order, it is not yellow.

**The One Field Rule.** Each spread is one flat colour field; each card is one flat colour. No gradients between palette colours; texture comes from the shared paper grain, not from colour mixing.

## Typography

**Display Font:** Gluten (variable 100-900, self-hosted), fallback Andika, Trebuchet MS
**Body Font:** Andika (400 and 700, self-hosted), fallback Segoe UI, system-ui

**Character:** Gluten is round, hand-lettered and picture-book warm; it names things, shows prices and narrates. Andika is a plain, open reading face built for legibility, set large for an older audience.

### Hierarchy
- **Display** (Gluten 760, clamp 2.5-4.7rem, line-height 0.98): the hero H1 only, in Page White on the cobalt table. On phones it drops to clamp 1.6-2.4rem in ink on the paper panel.
- **Headline** (Gluten 700, clamp 2.3-4.1rem, line-height 0.98): spread H2s and the back cover's closing line (at 760).
- **Title** (Gluten 700, 1.35-1.7rem): card names, way names, place names, lift-the-flap questions, sheet and chat headings.
- **Figure** (Gluten 760, clamp 2.1-2.9rem, line-height 1): prices on the flap and the pick card; shelf prices at 1.6rem; the care month at clamp 3.4-5rem.
- **Caption** (Gluten 600, 1.25rem): the hero's storybook caption, the book's own narrating voice.
- **Tab** (Gluten 700, 1.05rem): index tabs, the wordmark at 800/1.65rem.
- **Body** (Andika 400, 1.15rem, line-height 1.55): all reading text; spread ledes at 1.2rem, max 40ch.
- **Small** (Andika, 1rem): notes, card text, meta lines.
- **Label** (Andika 700, 0.95rem): field labels, readout labels, buttons at 1.05rem, chips. Ticks and fine print go no lower than 0.82rem.

### Named Rules
**The Two Voices Rule.** Gluten names, counts and narrates; Andika instructs and explains. Any instruction, answer, form label or paragraph is Andika.

**The Big Print Rule.** Body is 1.15rem. Nothing a person must act on sits below 0.95rem.

## Layout

**The Spread Rule.** Every chapter is a full-bleed gouache field spread: one palette colour edge to edge, the shared paper grain over it, a 22px shade at the top where the next page's edge lies, and a 140px gutter fold shading down the centre line. Content sits on two pages either side of the fold (1fr 1fr with a clamp 3-9rem gap; the left page right-aligned, max 36rem) or runs across both pages capped at 82rem. Spreads are padded by the band (clamp 4.5-7.5rem) and the fluid gutter. The sequence is fixed by the story: cobalt hero, sky sizes, paper shelf, cobalt home, earth rescue, gum care, crown visit, earth-deep back cover.

**The Title Over the Book Rule.** The hero H1 sits on the cobalt table above the open book's left page, like a title over the book, never on the page. The left page cannot hold a 4rem-plus headline and the size picker at a legible size, so the page carries the lede, head toggle, pull-tab, price flap and order button, and the headline is sized to the table space above it. On phones and narrow aspect ratios (900px or below 23:20) the pop-up takes the top 54svh and the headline and picker sit on a paper panel below it.

The header is not a bar: the wordmark and index tabs hang from the top edge of the viewport, and ordering and chat pills float at the right. At 900px the fold disappears, two-page spreads stack, the band drops to 4.2rem, and the tabs collapse into a menu button that drops a paper card. At 440px the call pill moves into the menu.

Breakpoints: 1100px (tighter tabs, care grid 2-up), 900px (single page), 440px (phone).

## Elevation & Depth

Depth is physical: card stands on paper, paper lies on the table. Everything lifted casts a soft, blurred, warm-brown shadow down onto what is beneath it, and die-cut shapes carry a white core rim around their silhouette.

### Shadow Vocabulary
- **Lift** (`--lift: 0 1px 2px rgba(29,26,22,.16), 0 10px 22px -10px rgba(20,12,4,.42)`): buttons, tabs, pills, the caption, the seg pill, small floating cards.
- **High lift** (`--lift-hi: 0 2px 3px rgba(29,26,22,.16), 0 22px 38px -14px rgba(20,12,4,.5)`): the pick card, the mobile hero panel, the menu, the toast, the flying order label.
- **Wattle lift** (`--card-go: 0 1px 2px rgba(110,72,0,.45), 0 12px 22px -10px rgba(40,24,0,.55)`): every wattle ordering control; deepens on hover and while dragging, flattens on press.
- **Die-cut** (SVG filter `#cut`: alpha dilated 2.4px and filled with Card Core, blurred 3.2px, offset 4px down at 30% `#140c04`): every cut-paper illustration, shelf tag, way card, place card and truck. Clipped cards add `drop-shadow(0 10px 12px ...)` tinted to their spread.
- **Rimmed flap** (`0 0 0 3px core` plus a soft drop): the price flap and map flags.
- **Floating sheet** (`0 30px 80px -20px rgba(0,10,40,.6)`): the order sheet and chat panel.
- **Pressed impression** (inset groove and highlight): the pull-tab slot and the back cover's pressed frame line. This is debossing into the board, not a shadow cast onto a ledge.

### Named Rules
**The Die-Cut Rule.** Anything cut from card shows its white core and casts a soft shadow. In SVG that is the `#cut` filter; in 3D it is `card()`, a shape extruded to 0.007 card thickness with the face in its colour and the extruded edge in Card Core, casting and receiving shadows. A coloured shape with no core rim is a sticker, not card.

**The Soft Shadow Rule.** No zero-blur ledge shadows. Every cast shadow has blur and falls down and away from the light; no hard offset blocks under text, buttons or cards. Pressed impressions into the board are the only zero-blur edges.

## Shapes

Corners are cut, not machined. Buttons, pills, chips, toggles and steppers are fully round (999px). Fields and slot chips are 10px; pick cards, panels and the no-WebGL hero page are 14px; the order sheet and chat panel are 16px; flaps and flags are 6px. Index tabs and the wordmark are rounded only on their bottom corners (12-14px), because they hang from the top edge. Shelf tags, way cards and place cards are clipped polygons with chamfered corners (1.4-1.5rem), and shelf tags hang on a string with a punched hole. The hero caption is a speech card with one sharp corner (10px 10px 10px 2px). Snapshots are square-cornered prints with a taped top.

## Components

### Buttons
Round, chunky, and they bounce.
- **Shape:** full pill, minimum 3.1rem tall, Andika 700 at 1.05rem.
- **Go (ordering):** wattle with the wattle lift. Hover deepens the shadow; active presses 2px down to 98%.
- **Paper:** paper with lift. **Line:** transparent with a 2px ink ring, Paper Shade on hover. **Quiet:** transparent, Paper Shade on hover.
- **Round icon buttons:** 2.9rem paper circles with lift; hover rises and tilts -6deg, press scales to 90%.
- **Magnetic:** on hover devices, buttons lean toward the pointer.
- **Focus:** 3px ink outline, 3px offset; Page White on cobalt, earth and gum fields.

### Index Tabs (navigation)
Card tabs hanging from the top edge, each in its spread's colour (sky, paper, ochre, earth, gum, crown), Gluten 700, bottom corners rounded, lift shadow. At rest they ride 0.45rem up; hover drops them to the edge; the current section hangs 0.35rem lower. Below 900px they become a paper menu card.

### Order Controls
- **Order pill:** wattle pill in the header with an ink count bubble (tabular) and a running total; bumps with a spring when something is added.
- **Pull-tab:** a wattle card tab in a grooved slot, dragged along size ticks with spring follow and tilt; drives the 3D tree and the price flap.
- **Price flap:** a red earth flip card with a 3px core rim and a split line; it flips on change (rotateX from -95deg, spring).
- **Order sheet:** a paper sheet that swings in from the right like a page (perspective rotateY), with a wattle trip line and a paper truck that drives to each step. Lines drop in with a tilt and slide out when removed. Chosen send method gets a pale wattle wash and a wattle-deep ring.

### Chips
- **Filter chips:** Paper Shade pills with a tabular count; selected turns ink with paper text and tilts -2deg up.
- **Slot chips (day and time):** paper, 10px, 2px inset ink-15% ring; selected turns wattle with the wattle lift and tilts; taken is struck through at 40%; a missing choice shakes the row.
- **Segmented toggle:** Paper Shade track with a paper pill that springs under the chosen option.

### Cards / Containers
- **Shelf tags:** chamfered die-cut tags in their group colour (sky trees, crown care), hanging on a string from a punched hole, cut-paper art at the top, Gluten name and price. They tilt in 3D toward the pointer and swing on hover.
- **Pick card:** paper, 14px, high lift; stands up from rotateX -55deg when the chosen size changes.
- **Way cards:** chamfered gouache cards (ochre, sky, crown) with die-cut shadow, tilting toward the pointer.
- **Care panels:** gum-deep fills with a faint inner ring on the gum spread.
- **Snapshots:** taped photo prints with paper borders, scattered at angles; draggable, lift and scale 105% while held. Every photo carries an origin caption.

### Inputs / Fields
- **Style:** paper, 10px, 2px border at ink 25%, 3rem tall, Andika label above in 0.95rem 700.
- **Focus:** border turns ink with a 3px ink-15% halo.
- **Error:** Field Error border and a 0.95rem bold message.

### Height Chart (signature)
Every size as a cut-paper tree standing on a red earth ground strip with a ruler. Columns fold flat (-88deg) and stand up in sequence with spring overshoot when the chart enters; they lean away from the cursor; the chosen one gets an ink underline and the choice is kept in the URL.

### Care Wheel (signature)
A paper disc ringed with month stages, spun by drag or by stage buttons, with an ink pointer at the top and a sky window into a 3D planted tree that recovers month by month. The stage text turns like a page.

### Pop-up Map
A cut-paper coast (cobalt sea, sand land, dotted paper coastline) with earth flags on ink stems that fold up from -82deg in sequence; the picked flag turns ink.

### Hero Pop-up Book (signature)
A WebGL open book on the cobalt table. The right page pops up a sky arch coloured by Perth time (drag the sun), red earth dunes, the paper grass tree in the gutter and a bulldozer nosed at it; a storybook caption sits bottom right. Pulling the tab springs the tree to its new size with overshoot. The pinned scroll acts out the rescue: the crane truck drives in, lifts the tree, leaves, the bulldozer rolls into the gap, and the page turns. The tree can be grabbed and twanged; the bulldozer can be poked.
- **No WebGL:** the canvas, controls and caption are removed; the Fremantle install photo is shown as a paper-bordered print tilted 2deg with high lift, and the left page becomes a paper card.

### Motion
**The Spring Rule.** One spring for everything: `cubic-bezier(0.34, 1.56, 0.64, 1)` in CSS, damped springs in JS and WebGL. Exits and page swings use `cubic-bezier(0.16, 1, 0.3, 1)`. The grammar is fixed: **open** (pages and sheets swing on a hinge), **stand** (cards and chart trees rise from folded flat), **slide** (tabs, trucks, chips), **spin** (care wheel, wheel stages), **lift** (snapshots, flaps, the crane), **flutter** (paper leaves and the crown in a gust). Headings arrive word by word with a small tilt.

**The Already There Rule.** Entrances start from visible: an element waiting for its entrance is offset, folded or tilted, never hidden, so a missed observer never hides content.

**The Still Book Rule.** Under reduced motion every state change stays (sizes, prices, steps, stages), and the scroll pin, springs, travel and flutter are dropped; springs jump to their targets and the 3D scene renders only on change.

## Do's and Don'ts

### Do:
- **Do** make every chapter a full-bleed gouache spread with a gutter fold, in the fixed story order.
- **Do** keep wattle yellow (#ffc928) for ordering controls only.
- **Do** give every cut shape a Card Core rim and a soft cast shadow: the `#cut` filter in SVG, `card()` in 3D.
- **Do** move everything on the spring (cubic-bezier(0.34, 1.56, 0.64, 1)) within the open / stand / slide / spin / lift / flutter grammar.
- **Do** start entrances from visible: offset, folded or tilted, never at zero opacity.
- **Do** set the hero H1 on the cobalt table above the left page, not on the page.
- **Do** caption every photo with where it came from.
- **Do** keep reduced motion fully working: keep state changes, drop the scroll pin, springs and flutter.
- **Do** fall back to the Fremantle photo when WebGL is missing.

### Don't:
- **Don't** use wattle yellow for decoration, highlights, navigation, status or headings.
- **Don't** use zero-blur ledge shadows or hard offset blocks under text, buttons or cards.
- **Don't** draw cut-paper shapes without their white core rim.
- **Don't** blend palette colours in gradients; one field per spread, one colour per card.
- **Don't** set instructions, answers or labels in Gluten, or anything actionable below 0.95rem.
- **Don't** bring back the rejected tape world: no pink tape, white sand ground, hairline panels, Anybody or Lexend.
