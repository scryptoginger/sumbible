/**
 * new-book — scaffold a schema-compliant MDX skeleton for a book summary.
 *
 *   npm run new-book -- --canon bible-ot --book genesis
 *   npm run new-book -- --canon bible-nt --book john --drafted-by claude-code
 *
 * Flags: --canon, --book (required); --drafted-by (optional).
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { canons, canonSlugs, type CanonSlug } from './lib/canons';
import { REPO_ROOT } from './lib/paths';

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const { values } = parseArgs({
  options: {
    canon: { type: 'string' },
    book: { type: 'string' },
    'drafted-by': { type: 'string' },
  },
});

const canon = values.canon as CanonSlug | undefined;
if (!canon || !canonSlugs.includes(canon)) {
  fail(`--canon must be one of: ${canonSlugs.join(', ')}`);
}
const book = canons[canon].books.find((b) => b.slug === values.book);
if (!book) {
  fail(
    `Book "${values.book}" not found in ${canon}. ` +
      `Known: ${canons[canon].books.map((b) => b.slug).join(', ')}`,
  );
}

const filePath = path.join(REPO_ROOT, 'src', 'content', 'books', canon, `${book.slug}.mdx`);
if (fs.existsSync(filePath)) {
  fail(`File already exists: ${path.relative(REPO_ROOT, filePath)}`);
}

const today = new Date().toISOString().slice(0, 10);
const draftedBy = values['drafted-by'] ?? 'claude-code';

const frontmatter = [
  '---',
  `canon: ${canon}`,
  `bookSlug: ${book.slug}`,
  `name: "${book.name}"`,
  'highlightSummary: "TODO: 2-3 sentence highlight summary, 60-120 words, capturing the book\'s load-bearing theological movement."',
  '# authorshipNote: "..."   # optional — traditional attribution AND the critical scholarship range',
  '# datingNote: "..."       # optional — traditional dating AND modern scholarship range',
  '# literaryGenre: "..."    # optional — e.g. "Narrative with embedded law and poetry"',
  'themes: [] # TODO: lowercase-hyphenated tags — see AUTHORING.md',
  'sources: [] # TODO: cite every non-obvious claim, especially authorship/dating',
  'status: draft',
  `draftedBy: ${draftedBy}`,
  `draftedOn: "${today}"`,
  '---',
].join('\n');

const body = `
{/*
  DEEP SUMMARY — 300-500 words, prose paragraphs.
  Structure: the book's place in its canon; its major structural divisions;
  distinctive theology; how it points beyond itself.
  Use <VerseRef /> for cross-references. Authorship/dating claims must give
  BOTH the traditional attribution and the critical scholarship range — see
  AUTHORING.md. Cite every non-obvious claim in the sources frontmatter.
*/}
`;

fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, `${frontmatter}\n${body}`, 'utf8');

console.log(`✓ Created ${path.relative(REPO_ROOT, filePath)}`);
console.log('  Next: fill in highlightSummary, the deep summary body, and sources.');
