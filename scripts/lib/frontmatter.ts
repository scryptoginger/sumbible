import fs from 'node:fs';
import matter from 'gray-matter';

/**
 * Frontmatter helpers for the authoring scripts.
 *
 * The session-01 YAML gotcha: an unquoted ISO date in frontmatter
 * (`draftedOn: 2026-05-22`) is parsed by Astro as a YAML Date object, which
 * fails the `z.string()` schema. Every write path here therefore emits
 * date-shaped scalars as quoted strings.
 *
 * `updateFrontmatter` edits individual frontmatter LINES surgically rather
 * than round-tripping the whole block through a YAML serializer: a full
 * parse/stringify cycle re-wraps folded block scalars (highlightSummary,
 * long `note` strings) and produces a noisy diff. Surgical editing keeps a
 * status promotion to exactly the lines it changes.
 */

export interface ParsedChapter {
  data: Record<string, unknown>;
  body: string;
}

/** Read and parse a chapter file into its frontmatter object and body. */
export function readFrontmatter(filePath: string): ParsedChapter {
  const parsed = matter(fs.readFileSync(filePath, 'utf8'));
  return { data: parsed.data as Record<string, unknown>, body: parsed.content };
}

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

/** Render a scalar value as YAML, quoting ISO dates and anything ambiguous. */
function renderScalar(value: unknown): string {
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return `"${str}"`; // quote dates — always
  // Bare plain scalar only when unambiguously safe; otherwise double-quote.
  const safeBare =
    /^[A-Za-z0-9_][A-Za-z0-9 _.-]*$/.test(str) &&
    !/^(true|false|null|yes|no|on|off)$/i.test(str);
  return safeBare ? str : JSON.stringify(str);
}

/**
 * Update specific top-level frontmatter fields in place. An existing field
 * has only its line rewritten; a new field is appended to the end of the
 * frontmatter block. Every other line — and the body — is untouched.
 */
export function updateFrontmatter(
  filePath: string,
  updates: Record<string, unknown>,
): void {
  const raw = fs.readFileSync(filePath, 'utf8');
  const match = raw.match(FM_RE);
  if (!match) {
    throw new Error(`No parseable --- frontmatter block in ${filePath}`);
  }
  const [, frontmatterText, body] = match;
  const lines = frontmatterText.split('\n');
  for (const [key, value] of Object.entries(updates)) {
    const rendered = `${key}: ${renderScalar(value)}`;
    const idx = lines.findIndex((line) => line.startsWith(`${key}:`));
    if (idx >= 0) {
      lines[idx] = rendered;
    } else {
      lines.push(rendered);
    }
  }
  fs.writeFileSync(filePath, `---\n${lines.join('\n')}\n---\n${body}`, 'utf8');
}
