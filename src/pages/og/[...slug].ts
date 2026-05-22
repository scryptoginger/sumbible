// Build-time Open Graph image generation (astro-og-canvas / CanvasKit).
// One PNG per chapter at /og/<canon>/<book>/<chapter>.png, plus /og/home.png
// and /og/about.png. Referenced from each page's <head> via BaseLayout.
import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

const chapters = await getCollection('chapters');

interface OgPage {
  title: string;
  subtitle: string;
}

const pages: Record<string, OgPage> = {
  home: {
    title: 'SumBible',
    subtitle: 'Two summaries for every chapter of scripture',
  },
  about: {
    title: 'About SumBible',
    subtitle: 'How these chapter summaries are written',
  },
};

for (const chapter of chapters) {
  const book =
    chapter.data.canon === 'doctrine-and-covenants'
      ? 'Doctrine and Covenants'
      : chapter.data.book;
  pages[`${chapter.data.canon}/${chapter.data.bookSlug}/${chapter.data.chapter}`] = {
    title: `${book} ${chapter.data.chapter}`,
    subtitle: chapter.data.title ?? 'A SumBible chapter summary',
  };
}

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'slug',
  pages,
  getImageOptions: (_path, page: OgPage) => ({
    title: page.title,
    description: `${page.subtitle}  ·  SumBible`,
    bgGradient: [
      [248, 245, 239],
      [233, 225, 212],
    ],
    border: { color: [124, 45, 18], width: 12, side: 'inline-start' },
    padding: 70,
    font: {
      title: { color: [26, 26, 26], size: 76, weight: 'Bold', lineHeight: 1.1 },
      description: { color: [107, 114, 128], size: 32, lineHeight: 1.4 },
    },
  }),
});
