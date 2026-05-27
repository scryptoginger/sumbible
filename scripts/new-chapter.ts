/**
 * new-chapter — scaffold a schema-compliant MDX skeleton for a new chapter.
 *
 *   npm run new-chapter -- --canon bible-ot --book genesis --chapter 2
 *   npm run new-chapter -- --canon bible-nt --book john --chapter 3 --title "Born Again"
 *
 * Flags: --canon, --book, --chapter (required); --title, --drafted-by (optional).
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { canons, canonSlugs, type CanonSlug } from './lib/canons';
import { chapterPath } from './lib/paths';

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const { values } = parseArgs({
  options: {
    canon: { type: 'string' },
    book: { type: 'string' },
    chapter: { type: 'string' },
    title: { type: 'string' },
    'drafted-by': { type: 'string' },
  },
});

const canon = values.canon as CanonSlug | undefined;
if (!canon || !canonSlugs.includes(canon)) {
  fail(`--canon must be one of: ${canonSlugs.join(', ')}`);
}
const bookSlug = values.book;
if (!bookSlug) fail('--book is required (a book slug, e.g. "genesis").');
const book = canons[canon].books.find((b) => b.slug === bookSlug);
if (!book) {
  fail(
    `Book "${bookSlug}" not found in ${canon}. ` +
      `Known: ${canons[canon].books.map((b) => b.slug).join(', ')}`,
  );
}
const chapter = Number(values.chapter);
if (!Number.isInteger(chapter) || chapter < 1) {
  fail('--chapter must be a positive integer.');
}
if (chapter > book.chapterCount) {
  fail(`${book.name} has only ${book.chapterCount} chapters; got ${chapter}.`);
}

const filePath = chapterPath(canon, book.slug, book.order, chapter);
if (fs.existsSync(filePath)) {
  fail(`File already exists: ${path.relative(process.cwd(), filePath)}`);
}

// originalLanguage default per canon. Note: some Old Testament passages are
// Aramaic (Daniel 2:4b-7:28; Ezra 4:8-6:18, 7:12-26) — override by hand for those.
const originalLanguage: Record<CanonSlug, string> = {
  'bible-ot': 'hebrew',
  'bible-nt': 'greek',
  'book-of-mormon': 'none',
  'doctrine-and-covenants': 'modern-english',
  'pearl-of-great-price': 'none',
};

const today = new Date().toISOString().slice(0, 10);
const draftedBy = values['drafted-by'] ?? 'claude-code';

const frontmatter = [
  '---',
  `canon: ${canon}`,
  `book: "${book.name}"`,
  `bookSlug: ${book.slug}`,
  `bookOrder: ${book.order}`,
  `chapter: ${chapter}`,
  ...(values.title ? [`title: "${values.title}"`] : []),
  `originalLanguage: ${originalLanguage[canon]}`,
  'highlightSummary: "TODO: write the 2-3 sentence highlight summary, 60-120 words."',
  'externalLinks: {} # TODO: churchofjesuschrist / biblegateway / bibleHub / blueLetterBible / netBible',
  'sources: [] # TODO: cite every non-obvious claim — see AUTHORING.md',
  'christReferences: [] # TODO: { verse, name, note } for each name/title of Christ in this chapter',
  'themes: [] # TODO: lowercase-hyphenated thematic tags — see AUTHORING.md',
  'verificationLog: [] # TODO: populate during research — every non-obvious claim → { claim, source, url?, verifiedOn? }',
  'status: draft',
  `draftedBy: ${draftedBy}`,
  `draftedOn: "${today}"`,
  '---',
].join('\n');

const body = `
{/*
  DEEP SUMMARY — 400-700 words, prose paragraphs.
  NOT a verse-by-verse retelling.
  Use <LangNote> for inline original-language terms.
  Use <VerseRef /> for every cross-reference cited.
  End with <LangNotes> for longer language commentary if applicable.
  End with <TranslationCompare verse={N}> for meaningful translation forks.
  Cite every non-obvious claim in the sources frontmatter.
*/}
`;

fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, `${frontmatter}\n${body}`, 'utf8');

const rel = path.relative(process.cwd(), filePath);
console.log(`✓ Created ${rel}`);
console.log(
  '  Next: fill in highlightSummary, externalLinks, the deep summary body, and sources.',
);
