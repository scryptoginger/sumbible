/**
 * new-canon — scaffold a schema-compliant MDX skeleton for a canon summary.
 *
 *   npm run new-canon -- --canon bible-ot
 *   npm run new-canon -- --canon bible-nt --drafted-by claude-code
 *
 * Flags: --canon (required); --drafted-by (optional).
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
    'drafted-by': { type: 'string' },
  },
});

const canon = values.canon as CanonSlug | undefined;
if (!canon || !canonSlugs.includes(canon)) {
  fail(`--canon must be one of: ${canonSlugs.join(', ')}`);
}

const filePath = path.join(REPO_ROOT, 'src', 'content', 'canons', `${canon}.mdx`);
if (fs.existsSync(filePath)) {
  fail(`File already exists: ${path.relative(REPO_ROOT, filePath)}`);
}

const today = new Date().toISOString().slice(0, 10);
const draftedBy = values['drafted-by'] ?? 'claude-code';

const frontmatter = [
  '---',
  `slug: ${canon}`,
  `name: "${canons[canon].name}"`,
  'highlightSummary: "TODO: 2-3 sentence highlight summary, 60-120 words, capturing the canon\'s overall theological arc."',
  '# spanNote: "..."       # optional — composition span / publication history',
  '# languageNote: "..."   # optional — original language(s)',
  `bookCount: ${canons[canon].books.length}`,
  'themes: [] # TODO: lowercase-hyphenated tags — see AUTHORING.md',
  'sources: [] # TODO: cite every non-obvious claim',
  'status: draft',
  `draftedBy: ${draftedBy}`,
  `draftedOn: "${today}"`,
  '---',
].join('\n');

const body = `
{/*
  DEEP SUMMARY — 400-600 words, prose paragraphs.
  Structure: what the canon is; its major structural divisions; the principal
  theological arcs; its overall orientation. Use <VerseRef /> for cross-
  references. Report contested authorship/dating as a spectrum — see
  AUTHORING.md. Cite every non-obvious claim in the sources frontmatter.
*/}
`;

fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, `${frontmatter}\n${body}`, 'utf8');

console.log(`✓ Created ${path.relative(REPO_ROOT, filePath)}`);
console.log('  Next: fill in highlightSummary, the deep summary body, and sources.');
