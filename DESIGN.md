---
name: replants
description: Rescued WA grass trees, marked with one strip of the pink tape a clearing site uses for the ones it saves.
colors:
  tape: "#ff2d87"
  tape-hem: "#ee2a80"
  tape-wash: "#ffe8f1"
  crown: "#8db33a"
  ground: "#f3f3f0"
  paper: "#ffffff"
  soft: "#e8e8e3"
  rule: "#dcdad3"
  ink: "#1a1917"
  ink-2: "#5b5851"
  char: "#171513"
  on-char: "#f0eee9"
  on-char-2: "#b3ac9f"
  field-error: "#a1003a"
typography:
  display:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 1.3rem + 4.3vw, 4.75rem)"
    fontWeight: 740
    lineHeight: 1
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 82"
  headline:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 1.45rem + 1.9vw, 3rem)"
    fontWeight: 720
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 84"
  title:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    fontVariation: "'wdth' 88"
  figure:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "2rem"
    fontWeight: 720
    lineHeight: 1
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 86"
  wordmark:
    fontFamily: "Anybody, Arial Narrow, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 760
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 92"
  body:
    fontFamily: "Lexend, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Lexend, Segoe UI, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Lexend, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.4
  micro:
    fontFamily: "Lexend, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  focus: "4px"
  item: "8px"
  chip: "10px"
  card: "14px"
  panel: "20px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, .4rem + 2.6vw, 3rem)"
  max: "76rem"
  band: "clamp(5rem, 10vw, 8.5rem)"
  head-gap: "clamp(2.25rem, 4.5vw, 3.5rem)"
  column-gap: "clamp(1.5rem, 3.5vw, 3.5rem)"
  grid-gap: "0.75rem"
  chip-gap: "0.5rem"
components:
  button-primary:
    backgroundColor: "{colors.char}"
    textColor: "{colors.on-char}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.35rem"
    height: "3.1rem"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 0.6rem"
    height: "3.1rem"
  button-quiet-hover:
    backgroundColor: "{colors.soft}"
  button-line:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.35rem"
    height: "3.1rem"
  call-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1rem"
  seg-toggle:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "3px"
  seg-pill:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  option-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1.1rem 1.1rem 1.2rem"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "0.55rem 0.8rem"
  chip-selected:
    backgroundColor: "{colors.char}"
    textColor: "{colors.on-char}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.chip}"
    padding: "0.55rem 0.85rem"
    height: "3rem"
  order-tag:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "2.6rem 1.4rem 1.4rem"
  reminders-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "1.4rem"
  stage-mark:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 0.3rem"
    height: "2.75rem"
  stage-mark-pressed:
    backgroundColor: "{colors.char}"
    textColor: "{colors.on-char}"
  ask-fab:
    backgroundColor: "{colors.char}"
    textColor: "{colors.on-char}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.2rem 0.75rem 1rem"
    height: "3.25rem"
  ask-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    width: "min(25rem, calc(100vw - 2rem))"
    height: "min(38rem, calc(100svh - 7rem))"
  msg-bot:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.small}"
    rounded: "{rounded.card}"
    padding: "0.65rem 0.85rem"
  msg-me:
    backgroundColor: "{colors.char}"
    textColor: "{colors.on-char}"
    typography: "{typography.small}"
    rounded: "{rounded.card}"
    padding: "0.65rem 0.85rem"
  dark-band:
    backgroundColor: "{colors.char}"
    textColor: "{colors.on-char}"
    padding: "clamp(5rem, 10vw, 8.5rem) clamp(1rem, .4rem + 2.6vw, 3rem)"
---

# Design System: replants

## Overview

**Creative North Star: "One Strip of Tape"**

On a clearing site, pink flagging tape around a trunk means "this one gets saved". The system keeps that single mark and lets everything else go quiet. The ground is near-white bleached sand, content sits on white paper panels edged with hairline rules, and ink is a warm near-black. One strip of hemmed pink tape runs behind the last word of the hero headline and on behind the 3D grass tree; after that, pink only shows up where something is chosen, focused, linked or tied on. Char black does the heavy lifting: the primary action, selected chips, and the single dark band that tells the rescue story.

This is the calm rendition of the Flagging Tape and Tree Tags world. The loud first build (drenched tape stations, aluminium tag rail, peg-orange focus, uppercase condensed display) was rejected by the user as overwhelming and is gone. Headings are sentence case Anybody at 680-760 with a moderately narrow width; every sentence a person reads is Lexend 400. Layout is a single long page of generous bands divided by space and hairlines, not by colour blocks or cards with shadows. The one object with a physical form in the UI is the order summary: a white tree tag with chamfered top corners, a punched hole, and a loop of the same pink tape through it.

The page is alive through motion and 3D interaction, never through more things on screen, and the motion follows a fixed grammar of three kinds. Arrivals play once: the headline rises word by word, then the tape ties on and the tree grows; section headings and contents settle from a short offset, already visible; rescue photos wipe open; the care timeline draws like time passing. Services and visit stay still. Living motion belongs to the 3D trees: the hero tree sways in the wind with occasional gusts, the camera leans toward the pointer, a tap rustles the crown and knocks the tag, pollen drifts, and scrolling past the hero digs the tree out of the ground with its root ball; in the care band a planted tree recovers month by month. Responses answer a hand and stop: dragging the trunk slider regrows the tree while the price counts, choice cards lean toward the pointer, the order tag swings when its total changes, readout values tick, booking steps slide in the direction of travel, and the chat panel grows out of its button. Under reduced motion, state changes stay; travel, parallax, gusts, pollen, tilt and the dig-out are dropped.

**Key Characteristics:**
- One accent, used as tape: a single hemmed band in the hero, then only selection, focus, links, and the tag's loop.
- Near-white sand ground, white paper panels, 1px hairline rules drawn as inset shadows.
- Char black is the action colour and the one dark band.
- Sentence case Anybody headings (680-760); Lexend 400 for reading.
- Alive, not busy: arrivals play once, the 3D trees breathe and answer the pointer, and every response to a hand settles and stops.

## Colors

Near-neutral warm whites and greys, one fluorescent pink, and green kept for living things.

### Primary
- **Flagging Tape Pink** (tape): the only accent. See the Tape Only Rule for where it is allowed.
- **Tape Hem** (tape-hem): the darker 3px hem along the top and bottom of the hero tape band, and the back strand of the tape looped through the order tag. Never a fill by itself.
- **Tape Wash** (tape-wash): the pale fill inside a completed booking-step number. Nothing else.

### Tertiary
- **Grass Crown Green** (crown): living things only. Used for the crown strokes in the planting section-cut diagram; the 3D crown has its own leaf ramp (see Components).

### Neutral
- **Bleached Sand** (ground): page ground, sticky header (at 86%, 94% once scrolled), the bot message bubble, the chat input, and the punched hole in the order tag.
- **Paper** (paper): every panel and control surface. Option cards, chips, fields, stepper, the order tag, the reminders card, the chat panel, the segmented toggle's sliding pill.
- **Soft Sand** (soft): the segmented toggle's track, quiet-button and stepper hover, the "when" line on the order tag, the chat close button.
- **Hairline** (rule): every 1px rule and every inset 1px panel edge; slider track; 1.5px ring on the call pill, line button and step numbers.
- **Ink** (ink): text on light grounds.
- **Bark Grey** (ink-2): secondary text, captions, notes, ticks, unselected toggle text, hover ring on panels and chips (inset 1px).
- **Char** (char): primary buttons, the Ask button, selected chips, the current step number, checked option-card ring (inset 2px), field focus ring (inset 2px), the trunk and callouts in the section-cut, and the one dark band.
- **Ash** (on-char) and **Grey Ash** (on-char-2): primary and secondary text on char. The dark band redefines `--ink-2` as Grey Ash.
- **Field Error** (field-error): the 2px inset ring on an invalid field and its message text.

### Named Rules
**The Tape Only Rule.** Pink appears only as tape or as a mark of choice. Allowed: the hero tape band behind "bulldozed.", the hero 3D tree's tape (the care tree carries none), the trunk and months slider fills, selected states (the option-card radio dot, completed step rings, the confirmation mark), every focus outline, link and nav underlines, the tape looped through the order tag, the care timeline's line and dots, the tape on the section-cut trunk, the section-cut callout under the pointer, and text selection and caret. Nowhere else: no pink backgrounds on panels, no pink headings, no pink icons, no pink bands beyond the one in the hero.

**The One Dark Band Rule.** Char fills exactly one full-width band (the rescue story). Every other band is sand. Char elsewhere is limited to controls a hand presses and the selected state.

**The Living Green Rule.** If it is not alive, it is not green.

## Typography

**Display Font:** Anybody (variable, weight 100-900, width 50-150%), fallback Arial Narrow
**Body Font:** Lexend (variable, 300-700), fallback Segoe UI, system-ui

**Character:** Anybody gives the headings a slightly narrow, sturdy, sign-painted voice without shouting: sentence case, 680-760 weight, width 82-92%, tight negative tracking only at the two largest sizes. Lexend is the plain, open reading face for an older audience. Atkinson Hyperlegible was dropped because its slashed zero misreads 2000 and $200.

### Hierarchy
- **Display** (740, width 82%, clamp 2.6-4.75rem, line-height 1, -0.025em): the hero H1 only.
- **Headline** (720, width 84%, clamp 2-3rem, line-height 1.02, -0.02em): band H2s, paired with a short Bark Grey paragraph in a two-column band head.
- **Title** (680-700, width 86-90%, 1.15-1.75rem): H3s. Option names and timeline steps at 680/90%; place names, the reminders heading and the chat heading at 700-720/88%; the confirmation heading at 1.75rem.
- **Figure** (650-720, width 84-88%, tabular figures): the readout's trunk and age (1.4rem, 650), the price and order estimate (2rem, 720), the phone number in Visit (2rem, 720, width 84%).
- **Wordmark** (760, width 92%, 1.6rem, -0.03em, lowercase): the header and footer brand only.
- **Body** (Lexend 400, 1.125rem, 1.0625rem under 640px, line-height 1.6, max 62ch): all reading text. Hero lede 1.15rem at 36ch. Bold is 600; labels and summaries are 500.
- **Small** (Lexend, 0.95rem): nav links, step labels, field labels, hints, details text, timeline text, chat messages.
- **Label** (Lexend, 0.9rem): chips, toggle options, option costs and text, captions, the order lines, legend.
- **Micro** (Lexend, 0.8rem): slider ticks, step numbers, chip sub-labels, fine print, demo notes.

### Named Rules
**The Two Voices Rule.** Anybody names things and shows numbers; Lexend speaks. Any sentence, caption, answer or instruction is Lexend. The order tag's title is Lexend 600, not Anybody.

**The Sentence Case Rule.** No uppercase display, no letterspaced labels. Headings are sentence case.

**The Readable Zero Rule.** Prices, sizes and years use tabular figures in a face with a plain zero.

**The Three Small Sizes Rule.** Below body there are exactly three steps: 0.95rem, 0.9rem, 0.8rem. 0.8rem is for short labels, ticks and fine print only, never for an instruction someone must follow.

## Layout

A single long page of full-bleed bands, each padded by the band spacing and capped at a 76rem content width with a fluid gutter. Band heads are a 1:1 grid (headline left, paragraph right, bottom-aligned) with a generous gap below. A band may open on a 1px hairline instead of a colour change (services). The hero is 5:6 with the WebGL tree bleeding to the right edge; the picker sits under the lede behind a 1px top rule, capped at 31rem. Booking is 7:4 (steps left, the sticky order tag right, stuck 6.5rem from the top). Care opens with the recovery scrubber at 7:5 (the 3D stage bleeding into the left gutter, the panel right), then 6:5 (section-cut left, reminders and details right). Services and visit are three columns on hairline tops; the timeline is four.

At 1024px everything collapses to one column, the hero reorders to headline, lede, tree, picker, the order tag stops sticking, the nav becomes a menu button, timeline goes to two columns and services and visit to two, and the recovery scrubber stacks with its stage at min(52svh, 24rem) running edge to edge. At 640px body drops to 1.0625rem, the call pill and Ask button shrink to icon circles, option cards stack, and every grid is single column; the chat panel becomes a bottom sheet.

Breakpoints: 1024px (single column), 640px (phone).

## Elevation & Depth

Flat by default, with hairlines doing the work. Panel edges are inset 1px shadows in Hairline, not borders, so hover and selection can thicken them without layout shift. Real shadows are kept for things that lift or float: the primary button on hover, the sliding toggle pill, the slider thumb, the hung order tag, the Ask button, the chat panel and the mobile menu.

### Shadow Vocabulary
- **Hairline edge** (`box-shadow: inset 0 0 0 1px var(--rule)`; hover `var(--ink-2)`; selected `inset 0 0 0 2px var(--char)`): option cards, chips, fields, stepper, downloads, special offer, reminders card, chat chips.
- **Toggle pill** (`0 1px 3px rgb(0 0 0 / .12)`): the sliding pill in the segmented toggle.
- **Slider thumb** (`0 2px 6px rgb(0 0 0 / .2)`): the trunk slider's thumb.
- **Primary lift** (`0 8px 18px -10px rgb(23 21 19 / .6)`): the char button on hover only, with a 1px rise.
- **Hung tag** (`filter: drop-shadow(0 0 .5px rgb(23 21 19 / .45)) drop-shadow(0 12px 18px rgb(23 21 19 / .12))`): the order tag, drawn as a filter so it follows the clipped silhouette.
- **Ask float** (`0 10px 24px -12px rgb(23 21 19 / .7)`; hover `0 14px 28px -12px`): the floating Ask button.
- **Panel float** (`0 24px 60px -20px rgb(23 21 19 / .45), 0 0 0 1px rgb(23 21 19 / .06)`): the chat panel.
- **Menu drop** (`0 18px 40px -16px rgb(0 0 0 / .3), 0 0 0 1px var(--rule)`): the mobile nav menu.

### Named Rules
**The Lift Means Float Rule.** Only things that move or hover over the page cast a shadow. Content panels stay flat on a hairline.

**The Lean Exception.** The choice cards are the one content panel that moves in 3D, because the user asked for 3D interaction: on hover devices they tilt up to 6deg toward the pointer (perspective 700px) and ease back over 0.6s when it leaves. They still cast no shadow; the hairline edge and the checked ring carry them. Nothing else on the page tilts.

## Shapes

Soft, consistent corners in a small set. Anything a hand presses as a single action is a pill (buttons, call link, downloads, segmented toggle, stepper, chat chips, chat input). Selectable small items and fields are 10px. Content panels and option cards are 14px. The floating chat panel is 20px (top corners only as a phone bottom sheet). Chat bubbles are 14px with a 4px tail corner on the speaker's side. Circles are for step numbers, radio dots, slider thumbs, icon buttons, timeline dots and numbered callouts. The one non-rounded silhouette is the order tag: square bottom, top corners chamfered 1.6rem by clip-path, a 0.9rem punched hole centred near the top. The hero tape band is the one rotated element (-2deg).

## Components

### Buttons
Quiet, rounded, and clear about which one matters.
- **Shape:** pill (999px), minimum 3.1rem tall, Lexend 500 at 1rem.
- **Primary:** char fill, Ash text, trailing arrow icon. Hover rises 1px with the primary lift and nudges the arrow 3px right; active presses to 98%.
- **Quiet:** transparent, ink text, tight padding; Soft Sand wash on hover. Used for Back.
- **Line:** paper fill with a 1.5px Hairline inset ring that darkens to ink on hover. Used for secondary actions after booking.
- **Text link button:** inherits text, 1.5px pink underline offset 0.2em.
- **Disabled:** 45% opacity, no motion, no shadow.
- **Focus:** 2.5px pink outline, 3px offset.

### Size Picker
The hero's one control group, under a hairline.
- **Segmented toggle:** Soft Sand pill track with 3px padding; options are 0.9rem Bark Grey, the checked one turns ink. A white sliding pill (toggle-pill shadow) moves under the checked option over 0.4s. Focus outlines the option's label in pink.
- **Trunk slider:** a 4px track filled in pink up to the value and Hairline beyond; a 1.6rem white thumb with a 2px char ring and the thumb shadow, scaling to 112% while held. Tick labels sit beneath in 0.8rem tabular Bark Grey; the current tick turns ink 600.
- **Readout:** three figures (trunk, age, price) with 0.9rem labels above; the price is right-aligned and larger. When the slider moves, the price counts to its new value (420ms, quartic ease-out), each changed figure ticks in (0.4s from 30% opacity and 5px below), and the 3D tree regrows.

### Booking Steps
- **Step tabs:** numbered circles (1.75rem, 1.5px Hairline ring) with Small labels. Current: char fill, Ash number, ink label. Done: Tape Wash fill with a pink ring.
- **Panes:** swap with a direction-aware slide: the outgoing pane fades and moves 12px against travel (150ms ease-in), the incoming fades in from 16px in the direction of travel (340ms, ease-out). A missing day or time shakes the relevant row once.
- **Confirmation:** a 3.25rem pink circle with a char check that pops in, a 1.75rem title, and line buttons for calendar and reminders.

### Option Cards
Three paper cards in a row, 14px corners, hairline edge. Anybody 680 name, Lexend 500 cost, Bark Grey description. An empty radio ring sits top right. Hover darkens the edge to Bark Grey; checked draws a 2px char edge and fills the radio dot pink inside a white gap. On hover devices the card leans toward the pointer (see the Lean Exception); under reduced motion it stays flat.

### Chips (Day and Time)
- **Style:** paper, 10px corners, hairline edge, 0.9rem tabular text with an optional 0.8rem sub-label, minimum 4.4rem wide.
- **Selected:** char fill, Ash text, no edge.
- **Taken:** transparent, muted grey text, struck through, not clickable.
- **Focus:** pink outline, 2px offset.

### Inputs / Fields
- **Style:** paper, 10px corners, hairline edge, 3rem minimum height, body-size Lexend; Small 500 label above with optional hints in Bark Grey 400.
- **Focus:** the edge becomes a 2px char inset ring (no outline). The chat input uses a 2px char outline.
- **Error:** 2px Field Error inset ring and a 0.9rem Field Error message below.
- **Stepper and checkbox:** a paper pill with round icon buttons and a bold tabular count; checkboxes use the char accent colour.

### Order Tag (signature)
The order summary is a hung tree tag: paper, chamfered top corners, a punched hole showing the sand through it, and a loop of pink tape (front strand tape, back strand Tape Hem, 8px stroke) threaded through the hole. It casts the hung-tag drop shadow. Inside: Lexend 600 title, a tabular order table in 0.9rem with a hairline above the Anybody 720 estimate, an optional Soft Sand "when" line, Back and Continue, and 0.8rem fine print. It sticks beside the steps on desktop and sits inline on narrow screens. When its total changes it swings on its tape from the punched hole (1.1s, a decaying swing from 2.6deg); under reduced motion it holds still.

### Care
- **Recovery scrubber:** the care band's 3D moment. A 7:5 grid: the care-mode tree on the left (drag to turn), a panel on the right with the month as a large Anybody figure (740, width 82%, clamp 3-4.25rem, below the hero headline, tabular) beside a Small Bark Grey unit, a 1.75rem stage title and a Bark Grey stage text that dim to 20% while they swap (0.25s), a 0-30 month slider in the trunk slider's style, four stage buttons, and a line button that toggles Play the two years / Pause. Stage buttons are pills at least 2.75rem tall with a Hairline inset ring in Small Bark Grey; hover darkens the ring, the current stage fills char with Ash text. A stage button glides the months to its stage (700ms, quartic ease-out); Play runs the remaining months at 230ms a month. The scene plays once, 0.5s after half the band is in view, unless the visitor has already touched it, and pauses whenever the band leaves view. Under reduced motion it never autoplays and stage buttons jump.
- **Timeline:** four stages on a 2px pink line that draws once from left to right (1.4s) when it enters view; each 12px dot fills pink in turn (0.3s apart).
- **Section-cut diagram:** an illustrated planting cross-section in 14px corners: sand, soil and mulch in earth tones, char trunk with its pink tape, green crown strokes, ink dimension lines, and numbered char callouts that match a two-column numbered legend. Pointing at a callout or its legend line lights the pair: the callout grows to 118% and fills pink with a char number, the legend number turns pink and its line turns ink. This works under reduced motion too.
- **Reminders card:** a paper panel with a hairline edge, an icon heading, a short Bark Grey intro, a field, line actions, and a reminder list on hairline rows that rises in with a 45ms stagger.
- **Details:** questions on hairline rules, Lexend 500 summaries, a chevron that turns 180deg on open; answers in Small Bark Grey.
- **Downloads:** paper pills with a hairline edge and a 0.8rem file note.

### Services and Visit
Definition lists and place columns on 1px hairline tops, no cards: a 500-weight name and Small Bark Grey details. Visit places use 700 Anybody titles; the phone is set as a 2rem Anybody figure. Their contents stay still; only the band head settles in.

### The Dark Band
The rescue story is the single char band: Ash headline, Grey Ash paragraph and captions, a lead photo spanning two rows beside two smaller photos, all with 10px corners. Each photo wipes open from the bottom (clip-path, 1.2s) while settling from 112% scale (1.6s), staggered 90ms.

### Arrival Motion
- **Hero headline:** on load each word rises out of its own clipped line box (from 108% below, 0.95s, 65ms per word, starting at 0.1s); the tape then ties on behind "bulldozed." (clip-path wipe left to right, 1.2s from 0.75s). The lede (0.55s) and picker (0.7s) fade up 18px; the 3D stage fades in over 1.4s.
- **Section settle:** each band head and the booking, rescue, recovery and care groups settle once when 12% of them is in view. Headings rise 0.45em (1.05s); contents rise 26px (1.1s), staggered 90ms up to six items. Nothing starts invisible: the offset is the only change, so a missed observer never hides content.
- **Reduced motion:** the headline is not split, nothing settles, photos show without the wipe.

### Navigation
Sticky translucent sand header with a 10px backdrop blur; a hairline appears beneath once the page scrolls. The hand-drawn grass tree mark sits beside the lowercase wordmark. Links are Small Bark Grey, turning ink with a 2px pink underline that grows from the left on hover and on the current section. The phone number is a hairline-ringed pill. At 1024px the links collapse into a pill Menu button opening a white 14px menu with the menu-drop shadow; at 640px the menu button and call pill become icon circles.

### Ask Replants
- **Button:** a char pill with a chat icon, fixed bottom right. It waits off-screen until the visitor scrolls past the hero, then rises in. It tucks away (fades down) while the footer is in view, and on narrow screens while the inline order tag is in view. At 640px it becomes an icon circle.
- **Panel:** a 20px white panel that grows out of the button's corner (0.38s, scale from 94%) and shrinks back on close. Header with Anybody title and close circle, a scrolling log of bubbles (bot on sand, visitor on char, each rising 6px as it arrives, a three-dot typing indicator), suggestion pills, a pill input with a round char send button, and 0.8rem demo fine print. On phones it is a full-width bottom sheet.

### The 3D Grass Tree
WebGL scene with a static photo fallback when WebGL is missing (the recovery scrubber's stage is simply removed). One scene builder, two modes: hero (the rescued tree on the clearing site) and care (the same 0.6m tree planted at home). Material rules as shipped:
- **Bark:** procedurally painted char leaf-base scales on a `#100e0c` ground with dark sheen streaks, bump mapped (2.2), roughness 0.92.
- **Crown:** needle ribbons with vertex colours from dark base `#283f10`/`#3b5716` to tip `#9fbc3a`, a tuft of new growth `#cddc58`, and a dry skirt `#4a3823` to `#9c8150`; roughness 0.7.
- **Tape:** hero only. Unlit and not tone mapped, in exact tape pink, so the 3D tape matches the CSS tape; a loop and two tails on the trunk and a loop on the staff.
- **Tag:** hero only. A canvas-painted brushed aluminium tag (`#eceff1` to `#a9b0b6`) stamped in Anybody 900 with live size and price; metalness 0.55, roughness 0.38, on a `#9aa0a6` wire (metalness 0.9). It hangs from the trunk's tape, or from the staff when the trunk is under 0.6m. Aluminium lives only here, on the 3D tag.
- **Hero ground:** a warm shadow catcher (`#5b4630` at 30%), a sand mound and moat (`#cfc8b7`), a sprayed peg-orange ring (unlit), and a wooden height staff (`#c99a62` with `#1a1714` ticks) for scale. Peg orange appears only here, under the hero tree.
- **Care ground:** the same shadow catcher under a wood-chip mulch disc (chips `#4a3220` to `#b08a5c`) that thins to nothing at its edge, around a dark soil moat (`#5a3e27`). No tape, no spray ring, no staff, no tag: nothing from the clearing site.
- **Root ball:** a crumbly soil ball (`#5b3f26`, bump 3) with hanging roots (`#3b2a1b`), clipped at the ground line so it only shows once the tree is lifted; soil specks (`#5b3f26`) fall from it and a dark hole (`#2a1f15`) opens beneath.
- **Pollen:** soft motes (`#d8c27c`, 75%) drifting up through the light and carried by gusts: 110 in the hero, 60 in care.
- **Light:** warm hemisphere (`#fff6e6`/`#8f7552`, 0.55), warm sun (`#fff1dc`, 2.6) with soft shadows, a faint pink rim (`#ffd6ea`, 0.6); ACES filmic tone mapping at exposure 1.05.
- **Shared motion:** grows once over 1.4s and regrows on size change (380ms leave); wind sway weighted to leaf and tape tips; a natural gust every 5-11s; slow auto-turn until the visitor drags; a tap without a drag sends a strong gust through the crown. Rendering pauses whenever the canvas is offscreen or the tab is hidden.
- **Hero motion:** the camera leans toward the pointer (hover devices only), and fast pointer movement stirs extra gusts in its direction. The tag is a damped spring: a tap knocks it, a size change swings it, gusts nudge it. Scrolling past the hero scrubs the dig-out: the tree rises with its root ball and a slight rock, soil specks fall, the hole darkens and the sand mound darkens to dug soil (`#8a6440`).
- **Care motion:** the crown is recoloured for each month: transplant-stress browning on the outer leaf tips (`#9a7a45`) fades over the first 12 months, new centre shoots grow in (3-13 months) and ripen from yellow (`#f2e64e`) to green (6-16), and the lowest leaves dry into a growing skirt (8-26).
- **Reduced motion:** growth is instant; wind, gusts, pollen, auto-turn, pointer lean, the tag's spring and the dig-out are off; the scene only renders on interaction. Drag-to-turn and the care recolouring still work.

## Do's and Don'ts

### Do:
- **Do** keep pink to the Tape Only Rule list: one hero tape band, the 3D tape, slider fill, selected states, focus, link and nav underlines, the order tag's tape, the care timeline, the section-cut tape.
- **Do** set headings in sentence case Anybody at 680-760 and every sentence in Lexend 400.
- **Do** draw panel edges as inset 1px Hairline shadows that darken on hover and become 2px char when selected.
- **Do** use char for the primary action and selected chips, and fill exactly one band with it.
- **Do** set prices, sizes and years in tabular figures.
- **Do** keep motion to its three kinds: arrivals play once (word rise, tie-on, grow, settle, wipe, draw); living motion stays inside the 3D trees (wind, gusts, pollen, lean, dig-out, recovery); responses answer a hand and stop (regrow, count, tick, swing, tilt, slide, grow-from-button). Under reduced motion keep the state change and drop travel, parallax, gusts, pollen, tilt and the dig-out.
- **Do** keep the 3D tape unlit so 3D pink and CSS pink are the same colour.
- **Do** keep content visible while it settles: section arrivals move by a short offset and never start from zero opacity.

### Don't:
- **Don't** bring back the loud rendition: no drenched pink bands or stations, no aluminium UI plates or tag rails, no peg-orange focus, no uppercase condensed display.
- **Don't** use pink as a panel fill, heading colour or icon colour.
- **Don't** add a second dark band.
- **Don't** colour anything green that is not alive.
- **Don't** put shadows on content panels; only floating or lifted things cast.
- **Don't** set instructions or answers below 0.9rem, or use any size between body and 0.8rem outside the three small steps.
- **Don't** add life by adding things to the screen; it comes from motion and 3D interaction, and ongoing ambient motion stays inside the 3D scenes.
- **Don't** tilt anything but the choice cards, tilt them past 6deg, or tilt on touch.
- **Don't** use peg orange anywhere but the spray ring under the hero tree; the care tree carries no clearing-site marks.
