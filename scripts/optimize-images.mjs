// Converts everything in screenshots/<project>/ into resized WebP files at
// public/work/<project>/<name>.webp, plus .md.webp (1000px, for phones via srcset)
// and .thumb.webp (400px, for the gallery strip). Run with `npm run images`.
// Originals stay out of git (see .gitignore); only the WebP output is committed.
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "screenshots";
const OUT = "public/work";
const MAX_WIDTH = 2000;
const MEDIUM_WIDTH = 1000;
const THUMB_WIDTH = 400;

// Regions to blur before export, in original-image pixels.
// Used to keep real people's names out of public screenshots.
const REDACT = {
  "trava/reports-list.png": [{ left: 440, top: 150, width: 460, height: 60 }],
  // Signed-in account name in the sidebar footer.
  "strata/data-requests.png": [{ left: 15, top: 1680, width: 420, height: 110 }],
  "strata/campaigns-list.png": [{ left: 15, top: 1680, width: 420, height: 110 }],
  "strata/dashboard.png": [{ left: 15, top: 1680, width: 420, height: 110 }],
  // Recipient name and address in the mailer preview.
  "strata/mail-designer.png": [{ left: 1640, top: 995, width: 300, height: 125 }],
  // "Updated ... by <name>".
  "strata/campaign-detail.png": [{ left: 380, top: 110, width: 240, height: 60 }],
};

async function redact(file, img) {
  const regions = REDACT[file];
  if (!regions) return img;
  const base = await img.toBuffer();
  const overlays = await Promise.all(
    regions.map(async (r) => ({
      input: await sharp(base).extract(r).blur(18).toBuffer(),
      left: r.left,
      top: r.top,
    })),
  );
  // Materialize the composite: sharp otherwise applies it after resize().
  return sharp(await sharp(base).composite(overlays).png().toBuffer());
}

for (const project of await readdir(SRC, { withFileTypes: true })) {
  if (!project.isDirectory()) continue;
  const dir = path.join(SRC, project.name);
  const outDir = path.join(OUT, project.name);
  await mkdir(outDir, { recursive: true });
  for (const name of await readdir(dir)) {
    if (!/\.(png|jpe?g|webp)$/i.test(name)) continue;
    const key = `${project.name}/${name}`;
    const img = await redact(key, sharp(path.join(dir, name)));
    const buf = await img.png().toBuffer();
    const out = path.join(outDir, name.replace(/\.\w+$/, ".webp"));
    const info = await sharp(buf)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    await sharp(buf)
      .resize({ width: MEDIUM_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(out.replace(/\.webp$/, ".md.webp"));
    // Small copy for the gallery thumbnail strip.
    await sharp(buf)
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(out.replace(/\.webp$/, ".thumb.webp"));
    console.log(`${key} -> ${out} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
  }
}
