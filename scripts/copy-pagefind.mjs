// Copy the Pagefind index into the Vercel build output.
//
// `pagefind --site dist` runs AFTER `astro build`, by which point the Vercel
// adapter has already copied dist/ to .vercel/output/static. Without this
// step the deployed (Vercel) site would have no search index. Local
// `npm run preview` serves dist/ directly and already has it.
import fs from 'node:fs';
import path from 'node:path';

const src = path.join(process.cwd(), 'dist', 'pagefind');
const destParent = path.join(process.cwd(), '.vercel', 'output', 'static');
const dest = path.join(destParent, 'pagefind');

if (!fs.existsSync(src)) {
  console.warn('[copy-pagefind] dist/pagefind not found — skipping.');
  process.exit(0);
}
if (!fs.existsSync(destParent)) {
  console.log('[copy-pagefind] no .vercel/output/static — skipping (non-Vercel build).');
  process.exit(0);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log('[copy-pagefind] copied dist/pagefind -> .vercel/output/static/pagefind');
