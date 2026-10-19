# Replants: website concept

A redesign concept for [replants.com](https://replants.com), a Fremantle business that rescues grass trees from WA bushland being cleared and rehomes them in gardens. Made by Cre8tive Sync as a pitch; this is not the live site.

- `index.html`: the concept homepage. It has a 3D grass tree (Three.js) that regrows to the size you pick, a quote builder, the rescue story, planting and care, services, and locations.
- `AUDIT.md`: what's failing on the current replants.com, and what the concept fixes.
- `PRODUCT.md`: product facts and real prices the design is built on.

## View it

The page loads ES modules, so open it through a local server rather than by double-clicking:

```sh
npx serve .
```

Or publish with GitHub Pages: Settings → Pages → deploy from `main`, root folder.

## Stack

Plain HTML, CSS and JS, with no build step. Three.js 0.160.0 loads from jsDelivr. Fonts (Anybody, Lexend) and photos are self-hosted in `assets/`. The photos belong to Replants and were taken from their current site.
