/**
 * build-cross-reference-index — scans chapter MDX for <VerseRef /> usage and
 * writes a reverse index (target verse -> chapters that cite it) to
 * src/data/cross-references.json. Runs as the npm `prebuild` step.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { CONTENT_DIR, REPO_ROOT } from './lib/paths';
import { findBookBySlug } from './lib/canons';

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

/** Read a JSX attribute value, whether written name="x" or name={x}. */
function getAttr(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`\\b${name}=(?:"([^"]*)"|\\{([^}]*)\\})`));
  if (!m) return undefined;
  return (m[1] ?? m[2] ?? '').trim();
}

interface Citation {
  canon: string;
  book: string;
  chapter: number;
  url: string;
}
interface IndexEntry {
  target: {
    book: string;
    bookSlug: string;
    canon: string | null;
    chapter: string;
    verse: string | null;
  };
  citedBy: Citation[];
}

const index: Record<string, IndexEntry> = {};
let citationCount = 0;

for (const file of walk(CONTENT_DIR).sort()) {
  const parsed = matter(fs.readFileSync(file, 'utf8'));
  const d = parsed.data as Record<string, any>;
  const source: Citation = {
    canon: d.canon,
    book: d.book,
    chapter: d.chapter,
    url: `/${d.canon}/${d.bookSlug}/${d.chapter}`,
  };

  for (const tag of parsed.content.match(/<VerseRef\b[^>]*?\/>/g) ?? []) {
    const book = getAttr(tag, 'book');
    const chapter = getAttr(tag, 'chapter');
    const verse = getAttr(tag, 'verse');
    if (!book || !chapter) continue;

    const meta = findBookBySlug(book);
    const key = [book, chapter, verse]
      .filter(Boolean)
      .join('-')
      .replace(/[^a-z0-9-]/gi, '-')
      .toLowerCase();

    if (!index[key]) {
      index[key] = {
        target: {
          book: meta ? meta.name : book,
          bookSlug: book,
          canon: meta ? meta.canon : null,
          chapter,
          verse: verse ?? null,
        },
        citedBy: [],
      };
    }
    if (!index[key].citedBy.some((c) => c.url === source.url)) {
      index[key].citedBy.push(source);
      citationCount++;
    }
  }
}

const sorted = Object.fromEntries(
  Object.entries(index).sort(([a], [b]) => a.localeCompare(b)),
);
const outDir = path.join(REPO_ROOT, 'src', 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'cross-references.json'),
  `${JSON.stringify(sorted, null, 2)}\n`,
);
console.log(
  `[cross-references] ${Object.keys(sorted).length} target reference(s), ${citationCount} citation(s)`,
);
