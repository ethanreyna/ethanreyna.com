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

All copy, links, stats, jobs, and screenshot captions live in
[`src/data/content.ts`](src/data/content.ts). Components in `src/components/` only render that data.

## Adding screenshots

1. Put original images in `screenshots/<project>/`, e.g. `screenshots/strata/mail-designer.png`.
   (This folder is git-ignored because originals are large.)
2. Run `npm run images`. Each image becomes a 2000px WebP, a 1000px `.md.webp` (served to phones via `srcset`),
   and a 400px `.thumb.webp` in `public/work/<project>/`. Outputs aren't cleaned up, so delete stale ones by hand
   if you remove an original.
   To blur a region (names, emails, client data), add its pixel box to `REDACT` in
   [`scripts/optimize-images.mjs`](scripts/optimize-images.mjs).
3. Add entries to that feature's `shots` array in `content.ts`:

   ```ts
   { src: "/work/strata/mail-designer.webp", alt: "…", caption: "…" }
   ```

   Use `fit: "contain"` for images that aren't roughly 16:9 (tall pages, small menus).

A feature with no shots shows as a compact card. Once it has shots, it switches to the full layout with a gallery and lightbox.

## Deploy

ethanreyna.com is the Cloudflare Pages project `ethanreyna-com`. It builds the **`ethanreyna/ethanreyna.com`**
repo (branch `main`, command `npm run build`, output `dist`), not this `portfolio` repo. To ship:

1. Commit and push here.
2. Copy this repo's tree into a checkout of `ethanreyna/ethanreyna.com` (e.g. `git archive HEAD | tar -x -C <checkout>`
   after `git rm -rq .` there), commit, and push. Pushing any other branch gives a preview at
   `<branch>.ethanreyna-com.pages.dev`; pushing `main` goes live.

The previous Astro site is preserved at the `astro-site` tag in that repo.

Build notes:

- `.node-version` pins Node 22. Cloudflare's default (Node 18) is too old for Tailwind v4.
- [`public/_headers`](public/_headers) sets the security headers (including a strict CSP) and long-lived caching for
  fingerprinted `/assets/*`. The CSP is `script-src 'self'`, which is why the pre-paint theme script lives in
  [`public/theme.js`](public/theme.js) rather than inline. Don't add inline scripts without updating the CSP.
- `public/og.png` is the link-preview image (a 1200x630 render of the hero). Re-render it if the hero copy changes.
