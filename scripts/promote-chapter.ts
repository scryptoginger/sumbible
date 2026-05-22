/**
 * promote-chapter — flip a chapter's workflow status (draft -> review ->
 * published) and update timestamps, without ever hand-editing frontmatter.
 *
 *   npm run promote-chapter -- --canon bible-ot --book genesis --chapter 1 --to published
 *   npm run promote-chapter -- --canon bible-nt --book john --chapter 1 --to review --reviewed-by keith
 *
 * Frontmatter round-trips through the yaml Document API, so fields other than
 * the ones changed keep their exact formatting; the body is untouched.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { canons, canonSlugs, type CanonSlug } from './lib/canons';
import { chapterPath } from './lib/paths';
import { readFrontmatter, updateFrontmatter } from './lib/frontmatter';

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const { values } = parseArgs({
  options: {
    canon: { type: 'string' },
    book: { type: 'string' },
    chapter: { type: 'string' },
    to: { type: 'string' },
    'reviewed-by': { type: 'string' },
  },
});

const canon = values.canon as CanonSlug | undefined;
if (!canon || !canonSlugs.includes(canon)) {
  fail(`--canon must be one of: ${canonSlugs.join(', ')}`);
}
const book = canons[canon].books.find((b) => b.slug === values.book);
if (!book) {
  fail(`Book "${values.book}" not found in ${canon}.`);
}
const chapter = Number(values.chapter);
if (!Number.isInteger(chapter) || chapter < 1) {
  fail('--chapter must be a positive integer.');
}

const VALID_STATUS = ['draft', 'review', 'published'] as const;
type Status = (typeof VALID_STATUS)[number];
const to = values.to as Status | undefined;
if (!to || !VALID_STATUS.includes(to)) {
  fail(`--to must be one of: ${VALID_STATUS.join(', ')}`);
}

const filePath = chapterPath(canon, book.slug, book.order, chapter);
if (!fs.existsSync(filePath)) {
  fail(`Chapter file not found: ${path.relative(process.cwd(), filePath)}`);
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

const rel = path.relative(process.cwd(), filePath);
const changed = Object.keys(updates).join(', ');
console.log(`✓ ${book.name} ${chapter}: status -> ${to}  (${rel})`);
console.log(`  updated: ${changed}`);
