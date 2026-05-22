import fs from 'node:fs';
import matter from 'gray-matter';
import { parseDocument } from 'yaml';

/**
 * Frontmatter helpers for the authoring scripts.
 *
 * The session-01 YAML gotcha: an unquoted ISO date in frontmatter
 * (`draftedOn: 2026-05-22`) is parsed by Astro as a YAML Date object, which
 * fails the `z.string()` schema. Every write path here therefore guarantees
 * date-shaped scalars are emitted as quoted strings.
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

/** Force any `key: 2026-05-22` line onto a quoted form: `key: "2026-05-22"`. */
function quoteBareDates(yamlText: string): string {
  return yamlText.replace(
    /^(\s*[A-Za-z0-9_]+:[ \t]*)(\d{4}-\d{2}-\d{2})[ \t]*$/gm,
    '$1"$2"',
  );
}

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

/**
 * Update specific frontmatter fields in place. Uses the `yaml` Document API
 * so every field NOT being changed keeps its exact original formatting,
 * scalar style, and comments; the body is preserved byte-for-byte.
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
  const doc = parseDocument(frontmatterText);
  for (const [key, value] of Object.entries(updates)) {
    doc.set(key, value);
  }
  const newFrontmatter = quoteBareDates(doc.toString().trimEnd());
  fs.writeFileSync(filePath, `---\n${newFrontmatter}\n---\n${body}`, 'utf8');
}
