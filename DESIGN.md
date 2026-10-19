---
name: replants
description: Rescued WA grass trees, marked the way a clearing site marks the ones it saves.
colors:
  tape: "#ff2d87"
  tape-hem: "#ee2a80"
  peg: "#ff7a1a"
  crown: "#8db33a"
  char: "#171513"
  char-2: "#221f1b"
  char-rule: "#3d3832"
  on-char: "#efece6"
  on-char-2: "#b8b1a5"
  sand: "#e2e2de"
  sand-lift: "#efefec"
  sand-deep: "#d2d1cb"
  rule: "#b2b0a8"
  ink-2: "#4a443b"
  ink-2-on-tape: "#3b0f22"
  alu-hi: "#e3e6e8"
  alu: "#cdd2d6"
  alu-lo: "#aeb4b9"
  tag-ink: "#26282c"
  field-stroke: "#8e9398"
  stamp-oxblood: "#7d002c"
typography:
  display:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(2.9rem, 1.2rem + 5vw, 5.5rem)"
    fontWeight: 880
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(2.2rem, 1.5rem + 2.8vw, 3.75rem)"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 68"
  title:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(1.35rem, 1.15rem + .7vw, 1.75rem)"
    fontWeight: 850
    lineHeight: 1.15
    fontVariation: "'wdth' 80"
  figure:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "2.4rem"
    fontWeight: 800
    lineHeight: 0.95
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 75"
  tape-print:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 700
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 112"
  body:
    fontFamily: "Lexend, Segoe UI, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Lexend, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.4
rounded:
  plate: "3px"
  panel: "4px"
  field: "10px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, .5rem + 2.5vw, 3rem)"
  max: "88rem"
  station: "clamp(4.5rem, 9vw, 8.5rem)"
  head-gap: "clamp(2.5rem, 5vw, 4rem)"
  column-gap: "clamp(2rem, 4vw, 4.5rem)"
  row: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.char}"
    textColor: "{colors.on-char}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.4rem"
    height: "3.25rem"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.char}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 0.5rem"
    height: "3.25rem"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.on-char}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.4rem"
    height: "3.25rem"
  call-pill:
    backgroundColor: "{colors.char}"
    textColor: "{colors.on-char}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1rem"
  tape-strip:
    backgroundColor: "{colors.tape}"
    textColor: "{colors.char}"
    typography: "{typography.tape-print}"
    padding: "0.55rem 3rem"
  tape-mark:
    backgroundColor: "{colors.tape}"
    textColor: "{colors.char}"
    padding: "0.02em 0.14em 0.04em"
  tape-mark-on-tape:
    backgroundColor: "{colors.char}"
    textColor: "{colors.tape}"
  size-tag:
    backgroundColor: "{colors.alu}"
    textColor: "{colors.tag-ink}"
    rounded: "{rounded.plate}"
    padding: "1.4rem 0.6rem 0.65rem"
  docket:
    backgroundColor: "{colors.alu}"
    textColor: "{colors.tag-ink}"
    rounded: "{rounded.panel}"
    padding: "3.25rem 2rem 2rem"
  field:
    backgroundColor: "{colors.sand-lift}"
    textColor: "{colors.char}"
    rounded: "{rounded.field}"
    padding: "0.5rem 0.8rem"
    height: "3rem"
  method-row-selected:
    backgroundColor: "{colors.tape}"
    textColor: "{colors.char}"
    padding: "1.5rem 1.25rem"
  warranty-panel:
    backgroundColor: "{colors.char}"
    textColor: "{colors.on-char}"
    rounded: "{rounded.panel}"
    padding: "2rem"
---

# Design System: replants

## Overview

**Creative North Star: "Flagging Tape & Tree Tags"**

On a clearing site, fluoro pink tape around a trunk means "this one gets saved". The whole system is built from that marking kit: hemmed pink flagging tape carries announcements and the one key word of each headline, stamped aluminium tags with a wire hole carry sizes and prices, and a spray-painted ring marks the selection. The ground is bleached Bassendean sand (grey-white, never cream); ink and the dark stations are char black from fire-blackened trunks. Green appears only on living things.

The page is a sequence of full-bleed stations, alternating sand, char and one drenched tape station, each opening with a huge condensed uppercase Anybody headline beside a short Lexend paragraph. Content sits on rules and ledgers rather than in cards: a 2px char top rule opens a list, 1px rules divide its rows. Metal is reserved for things a yard would actually stamp: the size tags and the quote docket. The 3D grass tree in the hero is the same world in material form: charred bark, needle crown, the same pink tape tied round the trunk and a stamped tag on a wire.

Motion is sparse and physical. Tape ties on once (a clip reveal), the tree grows once at load and regrows when a size is picked, the crown and tape tail sway in wind; tags swing on hover and the docket's confirmation stamps down. Everything else is still, and all of it stops under reduced motion. Type is large throughout for an older audience.

**Key Characteristics:**
- Fluoro tape pink is the committed colour and owns full-width bands, not accents.
- Condensed heavy Anybody on tape and metal; Lexend 400 for every sentence a person reads.
- Sand, char and tape stations, separated by colour, never by cards or shadows.
- Stamped aluminium is a material with a texture, a wire hole and punched lettering, used only for tags and the docket.
- Selection is marked by hand: a sprayed ring, a tape-filled row, a stamped confirmation.

## Colors

Three marking colours on bleached sand and char, with brushed aluminium as the one material neutral.

### Primary
- **Flagging Tape Pink** (tape): the committed colour. Full-width announcement strip, the tape band behind the hero's last word, the tape marks on headline keywords, the drenched care station, the selected delivery method row, the spray ring on the chosen size tag, the 3D tape on the tree, link underlines, text selection and caret, and short emphasis text on char. Text on it is always char.
- **Tape Hem** (tape-hem): the 3-4px darker hem printed along the top and bottom edge of every tape band; also the dimension lines in the planting cross-section. Never used as a fill on its own.

### Secondary
- **Survey Peg Orange** (peg): the second marker. Every keyboard focus ring (3px solid, 3px offset) and the sprayed circle on the ground around the 3D tree. Never a fill, never text.

### Tertiary
- **Grass Crown Green** (crown): living things only. The crown strokes in the planting cross-section; the 3D crown carries its own leaf ramp (see Components). No UI element is green.

### Neutral
- **Bleached Bassendean Sand** (sand): page ground and sand stations; also the colour of punched holes, which show the ground through the metal.
- **Sand Lift** (sand-lift): hover wash on method rows, field and stepper backgrounds, the open mobile menu.
- **Sand Deep** (sand-deep): stepper and menu hover, scrollbar track.
- **Survey Rule** (rule): 1px row dividers on sand.
- **Fire-Blackened Char** (char): all ink on sand and tape, primary buttons, the call pill, char stations, 2px list-opening rules.
- **Char Two** (char-2): the footer, one step lifted from char.
- **Char Rule** (char-rule): 1px dividers on char.
- **Ash** (on-char) and **Grey Ash** (on-char-2): primary and secondary text on char.
- **Bark Grey** (ink-2): secondary text on sand. On tape it is swapped for **Tape Shadow** (ink-2-on-tape); on char for Grey Ash. Stations redefine `--ink-2` rather than introducing new classes.
- **Aluminium** (alu-hi, alu, alu-lo): the tag and docket metal, always under the brushed texture image, never as a flat fill alone.
- **Stamp Ink** (tag-ink): text on aluminium.
- **Field Steel** (field-stroke): 2px strokes on fields, selects and the stepper; dashed rules in the docket ledger.
- **Stamp Oxblood** (stamp-oxblood): the docket's rubber-stamped confirmation and field errors (with a pale pink fill `#fff3f7` on the invalid field).

### Named Rules
**The Tape Owns Bands Rule.** Pink is applied as tape: a hemmed band, a skewed mark behind a word, a drenched station, a filled row. It is never a decorative accent line or gradient; the only line uses are link and nav-hover underlines and the 3px top rule on each visit card. On char, pink may also set short text (the warranty title, opening hours, the phone number on hover).

**The Living Green Rule.** Green appears only on the tree and the plant in the cross-section. If it is not alive, it is not green.

**The Peg Means Focus Rule.** Peg orange is the keyboard focus colour everywhere, including on aluminium. On the tape station the focus ring switches to char, since orange on pink fails.

## Typography

**Display Font:** Anybody (variable, weight 100-900, width 50-150%), fallback Arial Narrow
**Body Font:** Lexend (variable, 300-700), fallback Segoe UI, system-ui

**Character:** Anybody is the tape printer and the metal punch: heavy, uppercase, its width axis pulled narrow (62-85%) for headlines and pushed wide (105-120%) for tape print and stamps. Lexend is the plain, open reading face. Lexend at 400 replaced the contract's first pick, Atkinson Hyperlegible, because Atkinson's slashed zero misread years and prices (2000, $200); this is a recorded deviation from the direction contract.

### Hierarchy
- **Display** (880, width 62%, clamp 2.9-5.5rem, line-height 0.9, uppercase): the hero H1 only; the phone number in Visit uses the same weight at width 70%.
- **Headline** (850, width 68%, clamp 2.2-3.75rem, line-height 0.95, uppercase): station H2s, each with one keyword on a tape mark.
- **Title** (850, width 75-80%, clamp 1.35-1.75rem, uppercase): H3s, delivery method names, docket title, place names.
- **Figure** (800-850, width 75-85%, tabular figures): readout values and the price (2.4rem), docket total (2.2rem), ledger service names (1.3rem, uppercase).
- **Tape print** (700-900, width 112%, 0.88rem, 0.02em tracking, uppercase): the announcement strip only.
- **Body** (Lexend 400, 1.1875rem, 1.125rem under 640px, line-height 1.55, max 68ch): all reading text. Bold is 650-700.
- **Label** (Lexend 700, 1rem): nav links, field labels, summaries, method costs, legends' secondary lines at 400.

### Named Rules
**The Two Voices Rule.** Anybody prints and stamps; Lexend speaks. Any full sentence, caption, answer or instruction is Lexend. Anybody never sets running text.

**The Readable Zero Rule.** Years, prices and sizes must read unambiguously. Never use a reading face with a slashed or dotted zero; all figures use tabular numerals.

**The Big Type Rule.** Body never drops below 1.125rem and secondary sentences (fine print, captions, field errors) never below 0.92rem. Only short printed labels on tape, tags and badges go smaller (0.78-0.9rem).

## Layout

A single long page of full-bleed stations, each padded by the station spacing and capped at an 88rem content width with a fluid gutter. Station heads are a 7:5 grid (headline left, paragraph right, aligned to the bottom). Content inside stations uses asymmetric two-column grids (7:5, 8:4, 4:8) with the column gap; everything collapses to one column at 1024px. The hero is 5:7 with the WebGL tree breaking out to the right edge and the tag rail spanning the full width beneath; at 1024px and below it reorders to headline, lede, tree, readout, rail. Lists open with a 2px char rule and divide rows with 1px rules; the care timeline sits on a 3px char rule with a 30-tick measuring scale.

Breakpoints: 1180px (nav tightens), 1024px (single column, nav becomes a menu), 640px (phone type sizes, tape strip trims to essentials).

## Elevation & Depth

Flat by default. Depth comes from station colour changes and from physical objects: aluminium carries its own bevel (inset 1px dark edge, inset 1px light top), punched holes are inset-shadowed into the ground colour, and hanging tags cast a small drop shadow that deepens when selected. Only two things float: the primary button and the open mobile menu.

### Shadow Vocabulary
- **Metal bevel** (`box-shadow: inset 0 0 0 1px rgb(0 0 0 / .14), inset 0 1px 0 rgb(255 255 255 / .55)`): every aluminium surface.
- **Hanging tag** (`0 3px 4px -2px rgb(0 0 0 / .4)`; selected `0 8px 10px -6px rgb(0 0 0 / .45)`): size tags on the wire.
- **Punched hole** (`inset 0 1px 2px rgb(0 0 0 / .5)`; docket `inset 0 2px 3px`): holes through metal.
- **Primary lift** (`0 6px 16px -6px rgb(23 21 19 / .55)`; hover `0 10px 22px -8px rgb(23 21 19 / .6)`): the char button.
- **Menu drop** (`0 18px 30px -16px rgb(0 0 0 / .4)`): the mobile nav panel and the no-WebGL fallback photo.

### Named Rules
**The Objects Cast, Panels Don't Rule.** Shadows belong to things that hang or lift (tags, the primary button, the menu). Content blocks, stations and ledgers never carry a shadow.

## Shapes

Hard-edged and slightly crooked. Metal is cut square with barely-softened corners (3-4px); tape is square-ended and laid at a small skew (-1.5deg to -2.2deg); tags hang at alternating tilts (-1.5deg, 1.8deg, -0.6deg) and straighten when chosen. Controls a hand presses are pills (999px): buttons, the call link, download links, the stepper, the menu toggle. Fields and selects are 10px. Circles are reserved for holes, radio dots and numbered callouts. Small diamonds (rotated squares) separate items on the tape strip.

## Components

### Buttons
Pill-shaped, heavy and blunt.
- **Shape:** full pill (999px), minimum 3.25rem tall.
- **Primary:** char fill, ash text, Anybody 800 at 1.1rem width 105%, pink arrow icon. Hover lifts 2px and nudges the arrow 3px right; active returns to rest.
- **Quiet:** transparent, char text with a 3px pink underline offset 0.3em.
- **Line (on char):** transparent with a 2px Grey Ash inset ring; ring turns pink on hover.
- **Disabled:** 50% opacity, no motion.
- **Call pill:** char pill in the header with the phone number in tabular Anybody 800 and a pink phone icon.

### Flagging Tape
- **Strip:** full-width hemmed tape band above the header carrying the current special in uppercase tape print, items separated by char diamonds.
- **Word band:** the hero's last word sits on a tape band that runs from the word to the right edge of the viewport behind the tree, rotated -2.2deg with 4px hems, tied on once with a clip reveal (1.1s).
- **Mark:** one keyword per station headline on a hemmed tape patch, rotated -1.6deg. On the tape station the mark inverts to char with pink text.
- **Caption tag:** a small tape label naming the place at the start of a photo caption.

### Stamped Aluminium Size Tags
The working size picker. Each tag is a radio hung on a wire by a 2px wire loop, with a punched hole showing the sand through it, brushed aluminium texture (256px), the metal bevel and a hanging shadow. Trunk height and price are punched letter by letter onto a canvas: a lit lower lip, a dark rim where the punch bit, a recessed grey face, and seeded per-letter wobble so each stamp is identical on every load. The head count is set plainly beneath. Hover swings the tag the other way; the checked tag straightens, rises 3px and is circled by a sprayed tape-pink ring (turbulence-displaced stroke, overspray dots and one drip). Focus is a peg ring offset 4px.

### Docket Plate
The quote builder is one large aluminium plate (4px corners, 512px texture with a pale wash), a punched hole at the top with a tape tag tied through it. Inside: Lexend labels, pill stepper, 10px fields and selects, a ledger with dashed steel dividers and a 2px char rule above a large Anybody total. Sending shows an oxblood rubber stamp, rotated -1.5deg, that stamps down from 125% scale.

### Stations
Full-bleed sections in three grounds: **sand** (default), **char** (rescue story, visit), and **tape** (care, used once). Each redefines secondary text colour for its ground. Headings are always uppercase condensed Anybody with one tape mark.

### Delivery Method Rows
A radio list on rules. Each row has a hollow 2px char ring, an uppercase title, a cost aligned right and a description. Hover washes the row in sand-lift; the checked row fills entirely with tape and the ring fills char with a pink centre.

### Details / Accordion
Questions on 2px char rules, Lexend 700 summaries, a stroked chevron that turns 180deg on open. On the char warranty panel the rules switch to char-rule.

### Ledgers
Definition lists for services and steps: 2px char top rule, 1px row rules, uppercase condensed Anybody names, Lexend descriptions, right-aligned tabular prices. No cards, no backgrounds.

### Inputs / Fields
- **Style:** sand-lift fill, 2px field-steel stroke, 10px radius, 3rem minimum height, Lexend at body size.
- **Hover:** stroke turns char. **Focus:** peg ring offset 1px.
- **Error:** oxblood stroke, pale pink fill, bold oxblood message below.

### Navigation
Sticky sand header at 94% opacity with a 6px blur and a 1px rule beneath: the hand-drawn grass tree mark beside a lowercase Anybody 850 wordmark, Lexend 700 links that gain a 3px tape underline on hover, and the call pill. At 1024px the links collapse into a pill Menu toggle opening a sand-lift panel with a 2px char border and 12px corners.

### The 3D Grass Tree
A WebGL grass tree with a CSS photo fallback. Material rules as shipped:
- **Bark:** procedurally painted char leaf-base scales (`#100e0c` ground) with black sheen streaks, bump mapped, roughness 0.92.
- **Crown:** tapered needle ribbons with vertex colours from dark base `#283f10`/`#3b5716` to tip `#9fbc3a`, a vertical tuft of new growth `#cddc58`, and a dry skirt `#4a3823` to `#9c8150`; roughness 0.7.
- **Tape:** unlit, untonemapped tape pink so it matches the CSS tape exactly; the loop is tied tight, tails flutter.
- **Tag:** canvas-painted brushed aluminium (`#eceff1` to `#a9b0b6`) stamped in Anybody 900 with live size, head count and price, punched hole, metalness 0.55, roughness 0.38, on a steel wire.
- **Ground:** a soft warm shadow catcher, a low sand mound, a peg-orange sprayed circle, and a wooden 1.6m height staff with painted ticks for honest scale (small trees hang their tag from the staff).
- **Light:** warm sun with soft shadows, warm hemisphere fill, a faint pink rim; ACES filmic tone mapping.
- **Motion:** grows over 1.4s, wind sway on crown and tape tails, slow auto-turn until the user drags; all of it disabled under reduced motion.

## Do's and Don'ts

### Do:
- **Do** put one headline keyword per station on a hemmed tape mark, rotated about -1.6deg.
- **Do** set every price, size and year in tabular figures, and every reading sentence in Lexend 400 at 1.1875rem or larger.
- **Do** use stamped aluminium (texture, bevel, punched hole) only for tags, the docket and other objects a yard would physically stamp.
- **Do** mark selection physically: a sprayed ring, a tape-filled row, a straightened tag, a stamp.
- **Do** separate content with rules (2px char to open, 1px to divide) and with station colour changes.
- **Do** use peg orange for focus, switching to char on the tape station.
- **Do** keep the tree's tape unlit so 3D pink and CSS pink are the same colour.

### Don't:
- **Don't** use pink as a decorative accent line or gradient; it is tape, laid in bands (underlines and the visit-card rule are the only line uses).
- **Don't** colour anything green that is not alive.
- **Don't** use a cream or warm-beige ground; the sand is grey-white.
- **Don't** set running text or captions in Anybody, or use a reading face with a slashed zero.
- **Don't** put content in shadowed cards; panels are flat, only hanging or lifted objects cast.
- **Don't** add motion beyond tie-on, grow, wind sway, tag swing and the stamp; everything else is still, and all of it stops under reduced motion.
