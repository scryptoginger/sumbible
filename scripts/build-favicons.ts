// One-shot favicon rasterizer: renders public/favicon.svg (the chi-rho) to the
// PNG sizes browsers and PWA installs expect. Run via `npm run build-favicons`
// whenever favicon.svg changes; the PNGs are committed.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const svg = readFileSync(path.join(process.cwd(), 'public', 'favicon.svg'));
const sizes = [16, 32, 48, 180, 192, 512];

for (const size of sizes) {
  const outPath = path.join(process.cwd(), 'public', `favicon-${size}.png`);
  await sharp(svg).resize(size, size).png().toFile(outPath);
  console.log(`generated ${outPath}`);
}

// Apple touch icon (180x180, same chi-rho).
const appleIcon = path.join(process.cwd(), 'public', 'apple-touch-icon.png');
await sharp(svg).resize(180, 180).png().toFile(appleIcon);
console.log(`generated ${appleIcon}`);
