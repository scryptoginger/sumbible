// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import matter from 'gray-matter';

// The live deployment. `sumbible.app` is the eventual custom domain; until it
// is pointed at the Vercel project, the canonical site is the .vercel.app URL,
// so sitemap/canonical/OG URLs resolve. Update this one line when the custom
// domain goes live.
const SITE = 'https://sumbible.vercel.app';

/**
 * Paths the sitemap must NOT advertise: the internal /review page and any
 * chapter not yet `status: published`. Read straight from the MDX frontmatter.
 * @returns {Set<string>}
 */
function excludedSitemapPaths() {
  /** @type {Set<string>} */
  const excluded = new Set(['/review']);
  /** @param {string} dir */
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.endsWith('.mdx')) {
        const fm = matter(fs.readFileSync(full, 'utf8')).data;
        if (fm.status !== 'published') {
          excluded.add(`/${fm.canon}/${fm.bookSlug}/${fm.chapter}`);
        }
      }
    }
  };
  walk(path.resolve('./src/content/chapters'));
  return excluded;
}

const EXCLUDED = excludedSitemapPaths();

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, '');
        return !EXCLUDED.has(pathname);
      },
    }),
  ],
  adapter: vercel(),
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
