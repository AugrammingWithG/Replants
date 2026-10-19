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

Constraints: 3D required. Large legible text for an older audience. Works without WebGL and with reduced motion. Pensioner discount percentage is contradictory on the old site: say "ask us", no number.

Revision (user, 2026-10-19): the first build felt overwhelming. User chose "same idea, much calmer", asked for transitions, and picked three helpers: Ask Replants chat, pick-up slot booking, aftercare reminders.

## Direction contract

THESIS: On a clearing site, pink tape around a trunk means "this one gets saved". The page keeps that one mark and lets everything else go quiet: a rescued tree, one strip of tape, a calm path to booking it. It refuses both the nursery template of photo hero and product cards, and the loud version of itself.

OWN-WORLD: Near-white bleached-sand ground (#f3f3f0), white paper panels with hairline rules, char black for ink, the primary action and the single dark band (the rescue story). Flagging-tape pink is the only accent: the tape band behind "bulldozed.", the 3D tree's tape, the slider fill, selected states, focus. Peg orange survives only as the spray ring under the 3D tree. Crown green only on living things. Anybody in sentence case at 680–760 for headings; Lexend 400 for reading (Atkinson Hyperlegible was dropped: its slashed zero misreads 2000 and $200).

STORY: This tree was due to be bulldozed. Slide to a size, see price and age. Book it in three short steps with a real time slot. See where it came from. Keep it alive with a two-year timeline and calendar reminders. Ask the helper anything, or call.

FIRST VIEWPORT: Quiet sand nav with the phone pill. H1 "Every tree here was due to be bulldozed." in sentence case at left, last word on the pink tape band that runs behind the WebGL grass tree at right (taped, tagged with live size and price, height stake for scale). Under the lede, one picker: single/multi-head toggle, a trunk-height slider with tick labels, readout (trunk, age, price) and "Get this tree home". The chat button waits off-screen until the visitor scrolls.

FORM: Flagging Tape and Tree Tags, calm rendition. Seed key a13b33de. Signature interaction: dragging the slider regrows the 3D tree while the price counts to its new value. Motion grammar: tape ties on and the tree grows once at load; booking steps slide in the direction of travel; the chat panel grows out of its button; the care timeline draws once as time passing; everything else still. Reduced motion keeps state changes, drops travel.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
