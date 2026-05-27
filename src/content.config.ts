import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const canonEnum = z.enum([
  'bible-ot',
  'bible-nt',
  'book-of-mormon',
  'doctrine-and-covenants',
  'pearl-of-great-price',
]);

const originalLanguageEnum = z.enum([
  'hebrew',
  'aramaic',
  'greek',
  'mixed-hebrew-aramaic',
  'modern-english',
  'none',
]);

const statusEnum = z.enum(['draft', 'review', 'published']);

const chapterSchema = z.object({
  // Identity
  canon: canonEnum,
  book: z.string(),            // human-readable, e.g. "Genesis", "1 Nephi"
  bookSlug: z.string(),        // url-safe, e.g. "genesis", "1-nephi"
  bookOrder: z.number().int(), // global ordering within canon for nav
  chapter: z.number().int().positive(),

  // Content metadata
  originalLanguage: originalLanguageEnum,
  highlightSummary: z.string().min(40).max(600),  // ≤3 sentences, target 60-120 words
  title: z.string().max(80).optional(),           // optional thematic title (≤10 words ≈ 80 chars)

  // External resources
  externalLinks: z.object({
    churchofjesuschrist: z.string().url().optional(),
    biblegateway: z.string().url().optional(),
    bibleHub: z.string().url().optional(),
    blueLetterBible: z.string().url().optional(),
    netBible: z.string().url().optional(),
  }).default({}),

  // Sources cited in the deep summary (renders as footer references)
  sources: z.array(z.object({
    title: z.string(),
    author: z.string().optional(),
    url: z.string().url().optional(),
    note: z.string().optional(),
  })).default([]),

  // Future-use: hook for the Christ-reference feature.
  // Each entry flags a verse where a name or title of Christ appears.
  // Schema is committed now so future content additions are forward-compatible;
  // most chapters will leave this empty for now.
  christReferences: z.array(z.object({
    verse: z.number().int().positive(),
    name: z.string(),
    note: z.string().optional(),
  })).default([]),

  // Free-form thematic tags (lowercase, hyphenated — see AUTHORING.md).
  // No controlled vocabulary in v1; themes accrete organically and the
  // /themes index renders them. Drives /themes and /themes/[theme].
  themes: z.array(z.string()).default([]),

  // Workflow status
  status: statusEnum.default('draft'),
  draftedBy: z.string().optional(),
  draftedOn: z.string().optional(),   // ISO date (quoted string — see AUTHORING.md)
  reviewedBy: z.string().optional(),
  reviewedOn: z.string().optional(),  // ISO date (quoted string — see AUTHORING.md)
});

// Book-level summaries — one MDX file per book, the body being the deep summary.
const bookSchema = z.object({
  // Identity (refs into src/lib/canons.ts)
  canon: canonEnum,
  bookSlug: z.string(),
  name: z.string(),
  subtitle: z.string().max(80).optional(),  // optional book subtitle (≤10 words ≈ 80 chars)

  // Content — highlight in frontmatter, deep summary (300-500 words) in the body
  highlightSummary: z.string().min(40).max(600),

  // Optional scholarly metadata
  authorshipNote: z.string().optional(),
  datingNote: z.string().optional(),
  literaryGenre: z.string().optional(),

  themes: z.array(z.string()).default([]),

  sources: z.array(z.object({
    title: z.string(),
    author: z.string().optional(),
    url: z.string().url().optional(),
    note: z.string().optional(),
  })).default([]),

  status: statusEnum.default('draft'),
  draftedBy: z.string().optional(),
  draftedOn: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedOn: z.string().optional(),
});

// Canon-level summaries — one MDX file per canon, named by slug.
const canonSchema = z.object({
  slug: canonEnum,
  name: z.string(),
  subtitle: z.string().max(120).optional(),  // optional canon subtitle (slightly longer cap)

  // Canon summaries can run slightly longer than book/chapter highlights
  highlightSummary: z.string().min(40).max(700),

  // Optional metadata
  spanNote: z.string().optional(),
  languageNote: z.string().optional(),
  bookCount: z.number().int().optional(),

  themes: z.array(z.string()).default([]),

  sources: z.array(z.object({
    title: z.string(),
    author: z.string().optional(),
    url: z.string().url().optional(),
    note: z.string().optional(),
  })).default([]),

  status: statusEnum.default('draft'),
  draftedBy: z.string().optional(),
  draftedOn: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedOn: z.string().optional(),
});

export const collections = {
  chapters: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/chapters' }),
    schema: chapterSchema,
  }),
  books: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/books' }),
    schema: bookSchema,
  }),
  canons: defineCollection({
    loader: glob({ pattern: '*.mdx', base: './src/content/canons' }),
    schema: canonSchema,
  }),
};
