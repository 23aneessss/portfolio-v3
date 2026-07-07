# Portfolio v3 — Aness Bouziani

Interactive, Apple-flavored portfolio. Every section is a toy:

- **Home** — 3D floating objects (MacBook, iPhone, folder, coffee) as navigation
- **Tech Stack** (`/stack`) — folders that burst physics-driven tech icons; drag them back home
- **Work** (`/work`) — a real terminal: `cd projects`, `ls`, `cat <project>`
- **Contact** (`/contact`) — an iPhone home screen with working app links (+ jiggle mode)
- **About** (`/about`) — "About This Aness", a macOS system window

## Stack

[Astro](https://astro.build) · [three.js](https://threejs.org) (3D objects) · [matter-js](https://brm.io/matter-js/) (stack physics) · zero UI frameworks

## Develop

```sh
npm install
npm run dev      # localhost:4321
npm run build    # static build → dist/
npm run preview  # serve the build locally
```

## Deploy

Static output — deploys to **Vercel** with zero config (framework preset: Astro).
The canonical site URL lives in `astro.config.mjs` (`site`).

Before going live: fill in the real social handles in the `LINKS` block at the top of
`src/pages/contact.astro`.

## Credits

3D models: Folder by reyshapes (CC0) · Coffee cup by Poly by Google (CC-BY) via [Poly Pizza](https://poly.pizza) ·
iPhone 15 Pro Max by [MpPower™](https://sketchfab.com/MG990) (CC-BY) · MacBook Pro M3 by
[jackbaeten](https://sketchfab.com/jackbaeten) (CC-BY) via Sketchfab.
App icons on the contact page are official App Store artwork (via the iTunes API).
