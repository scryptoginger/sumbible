/**
 * promote-content — flip workflow status (draft -> review -> published) on a
 * chapter, book, or canon, and stamp timestamps, without hand-editing
 * frontmatter.
 *
 *   npm run promote-content -- --kind chapter --canon bible-ot --book genesis --chapter 1 --to published
 *   npm run promote-content -- --kind book --canon bible-ot --book genesis --to review
 *   npm run promote-content -- --kind canon --canon bible-ot --to published
 *
 * The legacy `promote-chapter` script is an alias for --kind chapter.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { canons, canonSlugs, type CanonSlug } from './lib/canons';
import { chapterPath, REPO_ROOT } from './lib/paths';
import { readFrontmatter, updateFrontmatter } from './lib/frontmatter';

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const { values } = parseArgs({
  options: {
    kind: { type: 'string' },
    canon: { type: 'string' },
    book: { type: 'string' },
    chapter: { type: 'string' },
    to: { type: 'string' },
    'reviewed-by': { type: 'string' },
  },
});

const VALID_KIND = ['chapter', 'book', 'canon'] as const;
type Kind = (typeof VALID_KIND)[number];
const kind = values.kind as Kind | undefined;
if (!kind || !VALID_KIND.includes(kind)) {
  fail(`--kind must be one of: ${VALID_KIND.join(', ')}`);
}

const canon = values.canon as CanonSlug | undefined;
if (!canon || !canonSlugs.includes(canon)) {
  fail(`--canon must be one of: ${canonSlugs.join(', ')}`);
}

const VALID_STATUS = ['draft', 'review', 'published'] as const;
type Status = (typeof VALID_STATUS)[number];
const to = values.to as Status | undefined;
if (!to || !VALID_STATUS.includes(to)) {
  fail(`--to must be one of: ${VALID_STATUS.join(', ')}`);
}

// Resolve the target file and a display label per kind.
let filePath: string;
let label: string;

if (kind === 'chapter') {
  const book = canons[canon].books.find((b) => b.slug === values.book);
  if (!book) fail(`Book "${values.book}" not found in ${canon}.`);
  const chapter = Number(values.chapter);
  if (!Number.isInteger(chapter) || chapter < 1) {
    fail('--chapter must be a positive integer.');
  }
  filePath = chapterPath(canon, book.slug, book.order, chapter);
  label = `${book.name} ${chapter}`;
} else if (kind === 'book') {
  const book = canons[canon].books.find((b) => b.slug === values.book);
  if (!book) fail(`Book "${values.book}" not found in ${canon}.`);
  filePath = path.join(REPO_ROOT, 'src', 'content', 'books', canon, `${book.slug}.mdx`);
  label = `${book.name} (book summary)`;
} else {
  // canon
  filePath = path.join(REPO_ROOT, 'src', 'content', 'canons', `${canon}.mdx`);
  label = `${canons[canon].name} (canon summary)`;
}

if (!fs.existsSync(filePath)) {
  fail(`Content file not found: ${path.relative(REPO_ROOT, filePath)}`);
}

const { data } = readFrontmatter(filePath);
const today = new Date().toISOString().slice(0, 10);

const updates: Record<string, unknown> = { status: to };
if ((to === 'review' || to === 'published') && !data.reviewedOn) {
  updates.reviewedOn = today;
}
if (values['reviewed-by']) {
  updates.reviewedBy = values['reviewed-by'];
}

updateFrontmatter(filePath, updates);

const rel = path.relative(REPO_ROOT, filePath);
console.log(`✓ ${label}: status -> ${to}  (${rel})`);
console.log(`  updated: ${Object.keys(updates).join(', ')}`);
