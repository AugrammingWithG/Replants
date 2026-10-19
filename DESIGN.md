---
name: replants
description: One rescued WA grass tree, presented like a specimen on a light bone sheet.
colors:
  forest: "#0f2b1d"
  forest-2: "#183d2a"
  leaf: "#3b8a4c"
  lime: "#cdeb73"
  lime-2: "#e6f5b8"
  bone: "#f4f5ef"
  bone-2: "#eceee5"
  paper: "#ffffff"
  sand: "#e8e3d4"
  ink: "#131a15"
  ink-2: "#4e564f"
  rule: "#dfe2d8"
  on-forest: "#eef3ea"
  on-forest-2: "#b9c9bc"
  error: "#a3200f"
typography:
  display:
    fontFamily: "Onest, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 1.2rem + 3.7vw, 4.8rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Onest, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.3rem + 2.8vw, 4rem)"
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  figure:
    fontFamily: "Onest, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 1.6rem + 1.8vw, 3.2rem)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Onest, Segoe UI, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Onest, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  lede:
    fontFamily: "Onest, Segoe UI, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Onest, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Onest, Segoe UI, system-ui, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 500
    lineHeight: 1.1
rounded:
  field: "14px"
  sm: "18px"
  slice: "22px"
  sheet: "28px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 0.4rem + 2.6vw, 3rem)"
  band: "clamp(5rem, 9vw, 8.5rem)"
  max: "80rem"
  frame: "12px"
  card-gap: "1.2rem"
components:
  button-forest:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.on-forest}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.4rem"
    height: "3.1rem"
  button-forest-hover:
    backgroundColor: "{colors.forest-2}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.4rem"
    height: "3.1rem"
  button-lime-on-forest:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.forest}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.4rem"
    height: "3.1rem"
  pill:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 1rem"
    height: "2.8rem"
  pill-order:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.on-forest}"
    rounded: "{rounded.pill}"
    padding: "0.45rem 1rem"
    height: "2.8rem"
  pill-count:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.forest}"
    rounded: "{rounded.pill}"
    height: "1.5rem"
  filter-chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1.05rem"
  filter-chip-selected:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.on-forest}"
  nav-link-active:
    backgroundColor: "{colors.lime-2}"
    textColor: "{colors.forest}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 0.85rem"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "1.6rem"
  card-dark:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.on-forest}"
    rounded: "{rounded.sheet}"
    padding: "1.8rem"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.6rem 1rem"
    height: "3rem"
---

# Design System: replants

## Overview

**Creative North Star: "The Specimen Sheet"**

One rescued grass tree is shown the way a botanist pins a specimen: alone, centred, lit, on a calm light sheet with a few small handwritten-feeling notes around it. Everything else steps back. The page is a stack of rounded sheets laid on a bone table, each one quiet and light, so that the tree in the hero and the one dark rescue chapter carry the story.

The voice is calm, light and premium rather than busy or folksy. One typeface does all the work, with very light large headlines and plain readable body text sized for an older audience. Colour is held almost entirely in the greens and bones; lime appears only as a pill behind a word or as the mark of something chosen. Photos are not shown as rectangles: they are cut across rounded columns or staggered pills that slide into place.

Motion is soft and reactive, never bouncy: content rises a short distance from an already visible state, highlights wipe in behind words, photo slices settle into their positions, and the 3D tree turns under the hand. The previous pop-up bush picture book world (cobalt table, red earth, wattle yellow, Gluten display face) is retired and nothing from it carries over.

**Key Characteristics:**
- Bone ground with every section as a rounded 28px sheet inside a 12px frame.
- One typeface, Onest, light 300 for display and headlines.
- Lime only as a highlight or active state; forest for primary actions and the one dark chapter.
- Pills for nav, buttons, chips, filters, counts and photo slices.
- Four-point sparkles as the only ornament.
- A WebGL grass tree on a floating soil-and-grass island as the hero object, with a photo fallback.

## Colors

A quiet forest-and-bone palette with a single acid-lime accent that is spent only on emphasis.

### Primary
- **Rescue Forest** (forest): Primary buttons, the order pill, selected filters, chips and months, the rescue chapter, the "Talk to us" card, the footer, the toast and sent chat bubbles. The one dark field.
- **Forest Lift** (forest-2): Hover state of forest buttons only.

### Secondary
- **Spring Lime** (lime): The highlight pill behind a word, the order count, the quantity stepper, the selected size price on the chart, the done mark, the flying "added" label, text selection, and the rescue headline set on forest. Never a large field.
- **Lime Wash** (lime-2): The pale tint of the same accent, for soft active surfaces: the current nav link, the open-now status, the care stage tip, a checked delivery method, care item art and hover on the delivery ways.

### Tertiary
- **Leaf** (leaf): Function green. Focus rings, input caret and focus border, the slider fill, the sparkles beside notes, the active dash in the hero nav, step numbers, the progress bar, the open status dot, and the highlight pill when it sits on forest.

### Neutral
- **Bone** (bone): The hero sheet and quiet inner surfaces (product art wells, delivery ways, drawer line art, chat bot bubbles, status pills).
- **Bone Table** (bone-2): The page ground the sheets sit on, plus segmented control tracks and round icon buttons.
- **Paper** (paper): Cards, the delivery sheet, the drawer, the chat panel, menu, pills and inputs.
- **Chart Sand** (sand): The size chart field and services art; the one warm neutral band.
- **Ink** (ink): All primary text.
- **Ink Soft** (ink-2): Secondary text, ledes, meta lines, inactive nav.
- **Rule** (rule): Hairline borders, dividers, input strokes, the unfilled slider track.
- **On Forest** (on-forest) and **On Forest Soft** (on-forest-2): Primary and secondary text on forest surfaces.
- **Field Error** (error): Invalid input border and error message only.

### Named Rules
**The Lime Is A Highlighter Rule.** Full lime is only ever a pill behind a word, a count, or the mark of a chosen thing. It never fills a section, a card or a band. The hero's soft lime glow (a radial at 45% fading to nothing) is the one atmospheric use and stays behind the tree.

**The One Dark Chapter Rule.** Forest is the colour of action and of the rescue story. As a full sheet it appears once in the content (the rescue chapter) and once as the footer; within other sheets it is limited to buttons, selected states and the single "Talk to us" card.

**The Lime Button Lives On Forest Rule.** A lime button is used only where it sits on a forest surface (the rescue chapter, the "Talk to us" card). On light sheets the primary button is forest.

## Typography

**Display Font:** Onest (with Segoe UI, system-ui)
**Body Font:** Onest (with Segoe UI, system-ui)

**Character:** One variable grotesque from 300 to 700. Headlines are very light and tightly tracked so that they read as calm and expensive; labels step up to 500 and reading text stays at 400.

### Hierarchy
- **Display** (300, clamp(2.6rem, 1.2rem + 3.7vw, 4.8rem), 1, -0.04em): The hero headline, bottom-left of the hero sheet.
- **Headline** (300, clamp(2.2rem, 1.3rem + 2.8vw, 4rem), 1.02, -0.03em): Section H2s and the footer's closing line. Balanced wrapping.
- **Figure** (300, clamp(2.2rem, 1.6rem + 1.8vw, 3.2rem), 1, -0.04em): The live price readout; the care month (2.6rem) and phone number (2rem) use the same light, tight treatment.
- **Title** (500, 1.4rem, 1.2, -0.01em): Card, way, place and panel headings. Product names at 1.25rem.
- **Body** (400, 1.125rem, 1.6): All reading text; ledes at 1.2rem in ink-2 capped at 38ch.
- **Small** (400, 1rem): Card text, step detail, panel copy. Fine print goes no smaller than 0.88rem except the chat disclaimer.
- **Label** (500, ~0.98rem, 1.1): Buttons, pills, nav, chips, field labels. Counts and prices use tabular numerals at 600.

### Named Rules
**The One Face Rule.** Onest is the only typeface. Hierarchy comes from size and weight (300 for anything large, 500 for anything you press), never from a second family.

**The Light Large Rule.** Anything set above 2rem is weight 300 with negative tracking. Large text is never bold.

**The No Kicker Rule.** Headlines stand on their own. There are no small uppercase labels above them.

## Layout

The body carries a 12px frame (8px on small screens) of bone-table ground, and every section is a rounded sheet within it. Content sits in an 80rem maximum column with a fluid gutter (clamp(1rem, 0.4rem + 2.6vw, 3rem)) and generous vertical bands (clamp(5rem, 9vw, 8.5rem)). The hero is a full-viewport sheet (100svh minus the frame) with faint vertical hairlines at quarters; its pieces are placed around the tree: wordmark top-left, a vertical text nav top-right, notes scattered left and right, the headline and CTAs bottom-left, a glass chip bottom-right.

Two-column splits are asymmetric (0.9fr / 1.1fr, 0.85fr / 1.15fr) and align to the bottom or centre. Card sets use 1.2rem gaps in three-column grids or an auto-fill shelf (min 17rem), with one wide product card spanning two columns. A floating pill bar appears once the hero has mostly scrolled away and tracks the current section.

Breakpoints: at 1100px the bar's nav collapses into a menu pill; at 860px all splits stack, the hero becomes a flowing column (copy, canvas, hint, chip) and its notes, sparkles and side nav are hidden; at 440px step lists go single column and drawer padding tightens.

## Elevation & Depth

Depth is soft and ambient. Sheets on the ground are flat; white cards, pills and floating chrome lift with one shared two-layer shadow that is barely there up close and soft at a distance. Overlays (drawer, chat) use a deeper, wider version. Glass (white at 60 to 82% with backdrop blur) is reserved for things that float over the hero or the page: the bar, ghost pills and the hero chip.

### Shadow Vocabulary
- **Soft lift** (`box-shadow: 0 1px 2px rgba(19,26,21,.06), 0 18px 40px -22px rgba(19,40,25,.35)`): Cards, place cards, panels, pills, the bar, menu, hero chip, toast.
- **Forest press** (`box-shadow: 0 10px 24px -12px rgba(15,43,29,.6)`): Forest buttons only.
- **Overlay** (`box-shadow: 0 30px 80px -20px rgba(10,30,15,.45)`): The order drawer and chat panel.
- **Inset line** (`box-shadow: inset 0 0 0 1.5px rgba(19,26,21,.3)`): Line buttons; 1px rule inset on filter chips, month buttons and chat actions.

### Named Rules
**The Sheet Not Box Rule.** Sections never get shadows; they read as rounded sheets by colour change against the bone table. Only objects that sit on a sheet or float above the page lift.

## Shapes

Everything is rounded and soft. Sections and cards are 28px sheets; inner wells, photo columns and product art are 22px; small panels, menus and method rows are 18px; inputs are 14px. Anything you press or that labels state is a full pill (999px): buttons, nav links, pills, filters, counts, status tags, chat actions, the stepper, segmented controls and the row photo slices. Round icon buttons and portrait thumbnails are circles.

Photos are sliced rather than framed: one image cut across four rounded columns of staggered heights, or across four rounded pills offset left and right. The only ornament is the four-point sparkle, in ink or leaf.

## Components

### Buttons
Calm, round and weighty; they lift slightly under the hand.
- **Shape:** Full pill (999px), 3.1rem minimum height.
- **Primary:** Forest with on-forest text, 0.7rem 1.4rem padding, weight 500, a trailing arrow or leading SVG icon, and the forest press shadow.
- **Hover / Focus:** Rise 2px on hover with soft ease (0.4s), press down 1px and scale to 0.98 on active, forest-2 on hover. Primary CTAs are magnetic on hover-capable devices, drifting a few pixels toward the pointer. Focus is a 2px leaf outline at 3px offset.
- **Line:** Transparent with a 1.5px ink inset at 30%, full ink on hover.
- **Lime:** Lime with forest text, only on forest surfaces.
- **Quiet / Link / Round:** A transparent quiet button for Back; an underlined text link at 500; 2.9rem round icon buttons on bone-2.

### Chips
- **Style:** Filters are paper pills with a 1px rule inset and a small ink-2 count; care months follow the same form.
- **State:** Selected is forest with on-forest text and the count turning lime. Slot chips in the drawer use a 16px radius on bone, forest when chosen, struck through when unavailable. Suggestion chips in the chat are lime-2 pills.

### Cards / Containers
- **Corner Style:** 28px.
- **Background:** Paper on a bone or paper sheet; inner art wells in bone, lime-2 (care) or sand (services).
- **Shadow Strategy:** Soft lift; product cards rise 4px on hover and their drawing scales to 1.06.
- **Border:** None.
- **Internal Padding:** 1.6rem for panels and ways, 1.8rem for places, 0.6rem outer with a 1rem inner body for product cards.

### Inputs / Fields
- **Style:** Paper with a 1px rule border, 14px radius (pill in the chat), 3rem minimum height, label at 500 above.
- **Focus:** Leaf border with a 3px leaf ring at 18%.
- **Error / Disabled:** Error-red border and a 500-weight error line beneath; disabled options drop to 35 to 40% opacity.

### Navigation
- **Hero nav:** A vertical right-aligned text list in ink-2; the current item turns ink at 500 with a short leaf dash to its left.
- **Floating bar:** A glass pill that slides down once the hero leaves; wordmark left, pill links centre (current link on lime-2 with forest text), Ask and order pills right. The order pill is forest with a lime count that bumps when something is added.
- **Mobile:** Below 1100px the links move into a menu pill opening an 18px paper menu; below 860px the bar stays visible and shows icons only.

### Highlight Pill
The signature mark: a lime pill drawn behind one word of a headline, padded 0.18em with a 0.5em radius and cloned across line breaks. On forest it becomes leaf with on-forest text. With motion it wipes in from left to right over 0.9s after a 0.25s delay.

### Photo Slices
One photo cut across four rounded pieces. Column slices are 22px rounded columns of staggered height and offset; row slices are full pills with a faint on-forest ring, indented alternately. They slide into place on reveal (columns up 12%, rows in from alternate sides 8%) with a 0.1s stagger over 1.1s.

### Specimen Hero
The WebGL grass tree on a floating island of soil and grass, turned by drag and by scroll, growing with the chosen size, over a bone sheet with a soft lime glow and quarter hairlines. Small notes with leaf sparkles sit around it. Without WebGL the canvas is replaced by the Fremantle install photo on a 28px sheet with the soft lift.

### Motion
- **Easing:** cubic-bezier(0.16, 1, 0.3, 1) for everything that moves into place.
- **Reveals:** Start visible (opacity 0.25, 24px down) and settle over 1s, staggered 0.08s across siblings up to four.
- **Arrival:** The hero headline, notes, chip and CTAs rise 18px from 0.2 opacity once.
- **Feedback:** Price and stage text tick up 0.35em; the order count bumps to 1.1; overlays slide in 40px or scale from 0.92.
- **Reduced motion:** Reveals, wipes and slides are switched off and content shows at rest; only state changes remain.

## Do's and Don'ts

### Do:
- **Do** keep lime (#cdeb73) to highlight pills, counts and selected states; use lime-2 for soft active surfaces.
- **Do** make forest (#0f2b1d) the primary button colour on light sheets.
- **Do** set every section as a 28px rounded sheet on the bone-table ground inside the 12px frame.
- **Do** set anything above 2rem in Onest 300 with negative tracking.
- **Do** use pills (999px) for anything pressable or that labels state, including photo slices.
- **Do** start reveals from visible (opacity 0.25, 24px offset) on cubic-bezier(0.16, 1, 0.3, 1).
- **Do** provide the photo fallback wherever a WebGL object appears.

### Don't:
- **Don't** fill a section, card or band with full lime.
- **Don't** add a second dark chapter; forest as a full sheet is the rescue chapter and the footer.
- **Don't** introduce a second typeface or set large text bold.
- **Don't** add ornaments other than the four-point sparkle.
- **Don't** put small uppercase labels or kickers above headlines.
- **Don't** show rescue photos as plain rectangles where a sliced treatment fits.
- **Don't** use bouncy or overshooting easing; motion settles softly.
- **Don't** bring back the pop-up book palette (cobalt, red earth, wattle, ochre) or its display face.
