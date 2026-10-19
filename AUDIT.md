# replants.com audit

Crawled 19 October 2026: all 27 URLs in the sitemap, plus every link, image, PDF, stylesheet and script those pages reference (81 assets).

## The short version

The site still runs on a CMS built around 2008. Behind it is a good business: real prices, real care advice and real photos of rescue work. The site makes all of that hard to find, impossible to use on a phone, and invisible to Google. It sells the tree, not the rescue, which is the one thing a nursery can't copy.

## Critical

| # | Failure | Evidence | Why it matters |
|---|---|---|---|
| 1 | **Not mobile-friendly** | No `<meta name="viewport">`. Fixed 770px layout (XHTML 1.0 Transitional, IE-only stylesheets and scripts) | Most garden shoppers browse on a phone, where the page renders as a shrunken desktop page |
| 2 | **No way to order online** | The "How to get a grass tree" page says "place an online order", but no form, cart or booking exists | The site sends every buyer to the phone or email, with nothing to start from |
| 3 | **The price list is a picture** | Pricing is one 500×309 JPEG (`69_chart.jpg`) with no text alternative | Screen readers can't read it, search engines can't index it, and phones can't zoom it cleanly |
| 4 | **Analytics are dead** | Universal Analytics `UA-49300132-1`, which Google switched off in 2023, set on the wrong domain (`replants.com.au`) | No traffic data has been collected for years |
| 5 | **Every page has the same description** | All 27 pages share one meta description; no Open Graph tags; no structured data | Weak search listings, and blank previews when shared on Facebook |

## Broken or wrong

- **Two 404s from internal links:** `/getting-a-grass-tree/salvage-sites` (linked from "How to get a grass tree") and `/grass-tree-care/grass-tree-maintenance` (printed as a raw URL on two pages).
- **CMS admin exposed:** the Trailer Specials page links to `/cms/`.
- **"Latest news" is empty on every page,** and the News archive has no articles.
- **The sitemap lists `/404` with top priority** and gives every page `changefreq: daily`.
- **The sitemap uses `http://www.` URLs,** while the site serves `https://` without `www`.
- **The pensioner discount contradicts itself:** 10% on Pricing, 20% on Specials.
- **Stale claims:** "80% survival… over the past 6 yrs" reads as about 2006. "Award winning" names no award.
- **Typos:** "helpfull", "nesessary", "Elememnts", "fugicide", "d ug", "it's own", "mail @replants.com" (with a space). The URL slug `grass-tree-heath-care` is missing an "l".
- **Duplicate pages:** "Grass Tree Maintenance" exists twice with different content (one in Planting and Care, one in Products and Services).
- **Contact details disagree:** the phone appears as "0408 885 435" and "040 888 5435"; email appears as mail@, sales@, enquiries@, support@ and bruce@. The fax number is still listed.
- **Copyright reads "2002–2026"** while the headline says "since 2000".

## Weak

- **Heavy, unoptimised images:** about 5 MB on the gallery page alone, served as resized JPEGs with names like `photo.jpgw500h261.jpg`. No lazy loading and no modern formats.
- **Generic alt text:** "tranby", "Replants" and "Facebook" (the last on a GIF button).
- **Navigation hides key content:** Pricing, Pick-up Sites and Warranty sit two clicks deep behind "Please select an option" landing pages.
- **The rescue story is buried in About:** the one thing that sets Replants apart from a nursery is never on the homepage.
- **Care information is scattered:** it's split across four pages and two PDFs. Nothing in the buying flow points to the warranty conditions.
- **No map** for either location, and no opening hours on the Contact page. Hours appear only on the Pick-up Sites page.

## What the concept fixes

The concept in this repo, `index.html`, addresses each of these:

- **The rescue leads the homepage,** starting with the headline "Every tree here was due to be bulldozed."
- **A 3D grass tree regrows to whichever size you pick.** It shows price and approximate age, with a height stake for honest scale.
- **A working quote builder:** choose size, quantity, and pick-up, delivery or install, and the estimate includes the transplant formula needed for the warranty. It sends a pre-filled request to sales@ (labelled as a concept, since no checkout exists yet).
- **Every price is real text:** trees, delivery, installation, pruning, maintenance and formula.
- **Responsive from 390px phones up,** and it works without WebGL (a photo fallback) and with reduced motion.
- **Care on one page:** planting diagram, 24-month timeline, four stress checks, and warranty conditions.
- **Both locations with hours and directions,** with one phone number used consistently.
- **Proper search basics:** unique meta description, Open Graph tags, and `GardenStore` structured data.

## Automations and quality-of-life features

Three are built into the concept as working demos. The rest are recommended next steps.

| Feature | In the concept | To make it real |
|---|---|---|
| **Ask Replants chat** | Answers from Replants' own prices, care and hours, with buttons to set a size, book, call or email a photo. It's a scripted demo. | An AI assistant (e.g. Claude) grounded on Replants' content. It hands over to a person by SMS or email when it can't answer, and logs the questions customers actually ask. |
| **Pick-up and delivery booking** | Three steps: how, when (with real Saturday and Wed–Sun slots), then contact details. A calendar file downloads. Availability is simulated. | A booking tool such as Cal.com, Square Appointments or Calendly, with slot limits per site and SMS confirmations. It could take a deposit through Stripe or Square to stop no-shows. |
| **Aftercare reminders** | Enter a planting date and you get eight reminders over 24 months as a calendar download, which works today. SMS sign-up is a demo. | SMS or email reminders through Twilio or Mailchimp, sent from the booking record. Tracking the 6-month formula reminder also protects the warranty. |
| Live tree stock | — | Photos of the actual bagged trees at Fremantle, with size and price, marked sold when they go. |
| Clearing-site intake | — | A form for landowners and developers: block location, number of trees, and clearing date. It goes straight to Bruce. |
| Review requests | — | An automatic text 3 weeks after planting asking for a Google review, along with a care check. |
| Trailer Special alerts | — | An opt-in SMS when a new salvage site opens or a clearance weekend is on. |

## For Replants to confirm before launch

- The pensioner discount: 10% or 20%?
- Whether delivery is charged on top of installation (the concept assumes it is, as the current pricing page reads).
- Current survival rate and number of trees rehomed, if they want either stated.
- The name of the award, if "award winning" stays.
- Whether the Rockingham site and its Saturday hours are still current.
