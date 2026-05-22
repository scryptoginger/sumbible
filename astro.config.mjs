// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://sumbible.app',
  integrations: [mdx()],
  adapter: vercel(),
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
