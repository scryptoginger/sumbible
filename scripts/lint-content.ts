/**
 * lint:content — discipline checks for the chapter, book, and canon MDX
 * collections that Zod can't express.
 *
 *   npm run lint:content
 *
 * Exits 1 if any ERROR is found; WARN-only runs exit 0.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { CONTENT_DIR } from './lib/paths';
import { canons, canonSlugs, type CanonSlug } from './lib/canons';

type Severity = 'ERROR' | 'WARN';
type Kind = 'chapter' | 'book' | 'canon';
interface Issue {
  file: string;
  line?: number;
  severity: Severity;
  message: string;
}

const issues: Issue[] = [];
function report(file: string, severity: Severity, message: string, line?: number): void {
  issues.push({ file, line, severity, message });
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Book names (plus the common "Psalm" singular) for the raw-reference scan.
const bookNames = [
  ...new Set(Object.values(canons).flatMap((c) => c.books.map((b) => b.name))),
  'Psalm',
];
const refPattern = new RegExp(
  `\\b(${bookNames.map(escapeRegex).join('|')})\\s+\\d+:\\d+(?:[-,\\u2013]\\d+)?\\b`,
  'g',
);

function checkFile(kind: Kind, file: string): void {
  const rel = path.relative(process.cwd(), file);
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data as Record<string, any>;
  const body = parsed.content;
  const fileLines = raw.split('\n');

  // 1 & 2 — highlight summary shape (all collections).
  const highlight = typeof data.highlightSummary === 'string' ? data.highlightSummary : '';
  if (highlight) {
    const sentences = highlight.trim().split(/[.!?]+\s+/).filter(Boolean).length;
    if (sentences > 3) {
      report(rel, 'WARN', `highlightSummary has ${sentences} sentences (target ≤ 3)`);
    }
    const words = highlight.trim().split(/\s+/).filter(Boolean).length;
    if (words < 40 || words > 200) {
      report(rel, 'WARN', `highlightSummary is ${words} words (target 40-200)`);
    }
  }

  // 3 — long deep summary should cite something (all collections).
  if (body.length > 1500 && (!Array.isArray(data.sources) || data.sources.length === 0)) {
    report(rel, 'WARN', `deep summary is ${body.length} chars but cites no sources`);
  }

  // 4 — frontmatter dates must be quoted strings (all collections).
  const fmEnd = fileLines.indexOf('---', 1);
  for (let i = 1; i < (fmEnd === -1 ? fileLines.length : fmEnd); i++) {
    if (/^\s*(draftedOn|reviewedOn):\s*\d{4}-\d{2}-\d{2}\s*$/.test(fileLines[i])) {
      const field = fileLines[i].trim().split(':')[0];
      report(rel, 'ERROR', `${field} is an unquoted date — wrap it in quotes`, i + 1);
    }
  }

  // 5 — raw scripture references that should be <VerseRef /> (all collections).
  const prose = body.replace(/<[^>]*>/g, ' ');
  const seen = new Set<string>();
  for (const match of prose.matchAll(refPattern)) {
    if (seen.has(match[0])) continue;
    seen.add(match[0]);
    report(rel, 'WARN', `raw reference "${match[0]}" — consider wrapping it in <VerseRef />`);
  }

  // 6 — status workflow integrity (all collections).
  if (data.status === 'published' && (!data.draftedOn || !data.reviewedOn)) {
    report(rel, 'ERROR', 'status is published but draftedOn/reviewedOn is missing');
  }
  if (data.status === 'review' && !data.reviewedOn) {
    report(rel, 'ERROR', 'status is review but reviewedOn is missing');
  }

  // 7 — chapter-only checks.
  if (kind === 'chapter') {
    if (Array.isArray(data.christReferences)) {
      for (const cr of data.christReferences) {
        if (!Number.isInteger(cr?.verse) || cr.verse < 1) {
          report(rel, 'ERROR', `christReferences entry has invalid verse: ${JSON.stringify(cr?.verse)}`);
        }
      }
    }
    if (
      (data.canon === 'bible-ot' || data.canon === 'bible-nt') &&
      ['none', 'modern-english'].includes(data.originalLanguage)
    ) {
      report(rel, 'WARN', `originalLanguage is "${data.originalLanguage}" for a Bible canon`);
    }
  }

  // 8 — book-only checks: canon + bookSlug must resolve in canons.ts.
  if (kind === 'book') {
    const canon = data.canon as CanonSlug;
    if (!canonSlugs.includes(canon)) {
      report(rel, 'ERROR', `unknown canon "${data.canon}"`);
    } else if (!canons[canon].books.some((b) => b.slug === data.bookSlug)) {
      report(rel, 'ERROR', `bookSlug "${data.bookSlug}" not found in canon ${canon}`);
    }
  }

  // 9 — canon-only checks: slug must match the filename.
  if (kind === 'canon') {
    const expected = path.basename(file, '.mdx');
    if (data.slug !== expected) {
      report(rel, 'ERROR', `slug "${data.slug}" does not match filename "${expected}.mdx"`);
    }
  }
}

const collections: { kind: Kind; dir: string }[] = [
  { kind: 'chapter', dir: CONTENT_DIR },
  { kind: 'book', dir: path.join(CONTENT_DIR, '..', 'books') },
  { kind: 'canon', dir: path.join(CONTENT_DIR, '..', 'canons') },
];

let fileCount = 0;
for (const { kind, dir } of collections) {
  if (!fs.existsSync(dir)) continue;
  for (const file of walk(dir).sort()) {
    fileCount++;
    checkFile(kind, file);
  }
}

const errors = issues.filter((i) => i.severity === 'ERROR');
const warns = issues.filter((i) => i.severity === 'WARN');

for (const issue of issues) {
  const loc = issue.line ? `${issue.file}:${issue.line}` : issue.file;
  console.log(`  ${issue.severity}  ${loc}  ${issue.message}`);
}

console.log(
  `\nlint:content — ${fileCount} file(s): ${errors.length} error(s), ${warns.length} warning(s)`,
);
process.exit(errors.length > 0 ? 1 : 0);
