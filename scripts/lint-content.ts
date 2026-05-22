/**
 * lint:content — discipline checks for chapter MDX that Zod can't express.
 *
 *   npm run lint:content
 *
 * Exits 1 if any ERROR is found; WARN-only runs exit 0.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { CONTENT_DIR } from './lib/paths';
import { canons } from './lib/canons';

type Severity = 'ERROR' | 'WARN';
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

const files = fs.existsSync(CONTENT_DIR) ? walk(CONTENT_DIR).sort() : [];

for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  const data = parsed.data as Record<string, any>;
  const body = parsed.content;
  const fileLines = raw.split('\n');

  // 1 & 2 — highlight summary shape.
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

  // 3 — long deep summary should cite something.
  if (body.length > 1500 && (!Array.isArray(data.sources) || data.sources.length === 0)) {
    report(rel, 'WARN', `deep summary is ${body.length} chars but cites no sources`);
  }

  // 4 — frontmatter dates must be quoted strings (the session-01 YAML gotcha).
  const fmEnd = fileLines.indexOf('---', 1);
  for (let i = 1; i < (fmEnd === -1 ? fileLines.length : fmEnd); i++) {
    if (/^\s*(draftedOn|reviewedOn):\s*\d{4}-\d{2}-\d{2}\s*$/.test(fileLines[i])) {
      const field = fileLines[i].trim().split(':')[0];
      report(rel, 'ERROR', `${field} is an unquoted date — wrap it in quotes`, i + 1);
    }
  }

  // 5 — raw scripture references that should be <VerseRef /> (advisory).
  const prose = body.replace(/<[^>]*>/g, ' ');
  const seen = new Set<string>();
  for (const match of prose.matchAll(refPattern)) {
    if (seen.has(match[0])) continue;
    seen.add(match[0]);
    report(rel, 'WARN', `raw reference "${match[0]}" — consider wrapping it in <VerseRef />`);
  }

  // 6 — christReferences verse bounds.
  if (Array.isArray(data.christReferences)) {
    for (const cr of data.christReferences) {
      if (!Number.isInteger(cr?.verse) || cr.verse < 1) {
        report(rel, 'ERROR', `christReferences entry has invalid verse: ${JSON.stringify(cr?.verse)}`);
      }
    }
  }

  // 7 — status workflow integrity.
  if (data.status === 'published' && (!data.draftedOn || !data.reviewedOn)) {
    report(rel, 'ERROR', 'status is published but draftedOn/reviewedOn is missing');
  }
  if (data.status === 'review' && !data.reviewedOn) {
    report(rel, 'ERROR', 'status is review but reviewedOn is missing');
  }

  // 8 — original-language sanity for the Bible canons.
  if (
    (data.canon === 'bible-ot' || data.canon === 'bible-nt') &&
    ['none', 'modern-english'].includes(data.originalLanguage)
  ) {
    report(
      rel,
      'WARN',
      `originalLanguage is "${data.originalLanguage}" for a Bible canon (Aramaic portions aside)`,
    );
  }
}

const errors = issues.filter((i) => i.severity === 'ERROR');
const warns = issues.filter((i) => i.severity === 'WARN');

for (const issue of issues) {
  const loc = issue.line ? `${issue.file}:${issue.line}` : issue.file;
  console.log(`  ${issue.severity}  ${loc}  ${issue.message}`);
}

console.log(
  `\nlint:content — ${files.length} file(s): ${errors.length} error(s), ${warns.length} warning(s)`,
);
process.exit(errors.length > 0 ? 1 : 0);
