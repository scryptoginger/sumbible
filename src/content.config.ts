import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
  title: z.string().optional(),                   // optional thematic title for the chapter

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

  // Workflow status
  status: statusEnum.default('draft'),
  draftedBy: z.string().optional(),
  draftedOn: z.string().optional(),   // ISO date (quoted string — see AUTHORING.md)
  reviewedBy: z.string().optional(),
  reviewedOn: z.string().optional(),  // ISO date (quoted string — see AUTHORING.md)
});

export const collections = {
  chapters: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/chapters' }),
    schema: chapterSchema,
  }),
};
