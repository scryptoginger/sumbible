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
    churchofjesuschrist: z.url().optional(),
    biblegateway: z.url().optional(),
    bibleHub: z.url().optional(),
    blueLetterBible: z.url().optional(),
    netBible: z.url().optional(),
  }).default({}),

  // Sources cited in the deep summary (renders as footer references)
  sources: z.array(z.object({
    title: z.string(),
    author: z.string().optional(),
    url: z.url().optional(),
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

  // Verification log — every non-obvious claim in the deep summary or
  // LangNotes section traces to one entry. Populated during research,
  // before drafting the prose. See AUTHORING.md §20 and §6.0.
  //
  // verifiedViaFetch (REQUIRED): true means the `url` was actually opened
  // during this drafting session and any verbatim quotation in the chapter
  // prose was diffed against the source text. false means the claim is
  // from knowledge (paraphrase, interpretive, chapter self-quote, lexical).
  // Per AUTHORING §6.0, every cross-reference verbatim quote >6 words
  // requires a corresponding `verifiedViaFetch: true` entry; the
  // lint:quotation-fidelity rule blocks violations.
  //
  // quoteText (optional): for verbatim cross-reference quotes, the exact
  // text that was fetched and diffed. Records the audit trail in case the
  // chapter prose later drifts.
  verificationLog: z.array(z.object({
    claim: z.string(),
    source: z.string(),
    url: z.url().optional(),
    verifiedOn: z.string().optional(),
    verifiedViaFetch: z.boolean(),
    quoteText: z.string().optional(),
  })).default([]),

  // Workflow status
  status: statusEnum.default('draft'),
  draftedBy: z.string().optional(),
  draftedOn: z.string().optional(),   // ISO date (quoted string — see AUTHORING.md)
  reviewedBy: z.string().optional(),
  reviewedOn: z.string().optional(),  // ISO date (quoted string — see AUTHORING.md)

  // Quotation-fidelity discipline opt-in (AUTHORING §6.0).
  //
  // Drafted-after-the-rule-shipped chapters set this to true and accept full
  // ERROR-level enforcement from lint:quotation-fidelity. Legacy chapters
  // (drafted before the rule) explicitly mark `quotationFidelity: 'legacy'`
  // to acknowledge the discipline applies but downgrade the rule to WARN
  // for cross-reference quotes that lack fetch-verification.
  //
  // The grandfather state ('legacy') is honest: it says "these chapters
  // predate the §6.0 discipline; their cross-reference quotes have NOT
  // been mechanically fetch-verified; a follow-up sweep would need to
  // either fetch-verify each or paraphrase." It is NOT a permanent
  // exemption — chapters with active drafting work should be migrated
  // to 'enforced' as their cross-reference quotes are fetch-verified.
  quotationFidelity: z.enum(['legacy', 'enforced']).default('enforced'),
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
    url: z.url().optional(),
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
    url: z.url().optional(),
    note: z.string().optional(),
  })).default([]),

  status: statusEnum.default('draft'),
  draftedBy: z.string().optional(),
  draftedOn: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedOn: z.string().optional(),
});

// Related-texts collection: extracanonical works (ancient + LDS) that
// intersect with canonical scripture. One MDX file per entry.
const relatedTextCategoryEnum = z.enum([
  'ancient-extracanonical',
  'lds-extracanonical',
  'pseudepigrapha',
  'historical-collection',
]);

const relatedTextSchema = z.object({
  slug: z.string(),                     // url-safe, e.g. "book-of-enoch"
  name: z.string(),                     // display, e.g. "The Book of Enoch"
  category: relatedTextCategoryEnum,
  approximateDate: z.string().optional(),  // e.g. "3rd c. BCE – 1st c. CE"
  language: z.string().optional(),         // e.g. "Ge'ez; Aramaic fragments"
  highlightSummary: z.string().min(40).max(600),

  // Where this text intersects with canonical scripture (drives the
  // canonical-references link block on the detail page).
  canonicalReferences: z.array(z.object({
    canon: canonEnum,
    book: z.string(),                   // bookSlug from src/lib/canons.ts
    chapter: z.number().int().positive(),
    verse: z.string().optional(),       // e.g. "14-15" or "33"
    note: z.string().optional(),
  })).default([]),

  themes: z.array(z.string()).default([]),

  sources: z.array(z.object({
    title: z.string(),
    author: z.string().optional(),
    url: z.url().optional(),
    note: z.string().optional(),
  })).default([]),

  status: statusEnum.default('draft'),
  draftedBy: z.string().optional(),
  draftedOn: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedOn: z.string().optional(),
});

// Related-text parts: for long-form related texts originally published
// serially (or simply too long to read on one page), each installment gets
// its own MDX file and its own page nested under the parent entry's URL.
// The parent entry stays in `relatedTexts` and acts as the table of contents;
// parts never surface in the /related-texts index on their own.
const relatedTextPartSchema = z.object({
  parentSlug: z.string(),                     // relatedTexts slug this part belongs to
  part: z.number().int().positive(),          // ordinal — drives sequence and prev/next
  slug: z.string(),                           // url-safe, e.g. "part-01"
  title: z.string(),                          // display title for this installment
  originalPublication: z.string().optional(), // e.g. "Ensign, October 1975"
  highlightSummary: z.string().min(40).max(600),

  themes: z.array(z.string()).default([]),

  sources: z.array(z.object({
    title: z.string(),
    author: z.string().optional(),
    url: z.url().optional(),
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
  relatedTexts: defineCollection({
    loader: glob({ pattern: '*.mdx', base: './src/content/related-texts' }),
    schema: relatedTextSchema,
  }),
  relatedTextParts: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/related-text-parts' }),
    schema: relatedTextPartSchema,
  }),
};
