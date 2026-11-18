# ethanreyna.com

Personal portfolio. Vite + React 19 + TypeScript + Tailwind CSS v4. A single static page with no router or backend.

## Develop

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/
npm run preview   # serve the build locally
```

## Editing content

All copy, links, stats, jobs, projects, and screenshot captions live in
[`src/data/content.ts`](src/data/content.ts). Components in `src/components/` only render that data.

## Adding screenshots

1. Put original images in `screenshots/<project>/`, e.g. `screenshots/strata/mail-designer.png`.
   (This folder is git-ignored because originals are large.)
2. Run `npm run images`. Each image becomes a resized WebP plus a `.thumb.webp` in `public/work/<project>/`.
   To blur a region (names, emails, client data), add its pixel box to `REDACT` in
   [`scripts/optimize-images.mjs`](scripts/optimize-images.mjs).
3. Add entries to that feature's `shots` array in `content.ts`:

   ```ts
   { src: "/work/strata/mail-designer.webp", alt: "…", caption: "…" }
   ```

   Use `fit: "contain"` for images that aren't roughly 16:9 (tall pages, small menus).

A feature with no shots shows as a compact card. Once it has shots, it switches to the full layout with a gallery and lightbox.

## Deploy

`npm run build` produces a static site in `dist/` that works on any static host
(Cloudflare Pages, Netlify, Vercel, GitHub Pages).
