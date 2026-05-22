import fs from 'node:fs';
import path from 'node:path';

export const REPO_ROOT = process.cwd();
export const CONTENT_DIR = path.join(REPO_ROOT, 'src', 'content', 'chapters');

/**
 * Chapter file name. D&C sections run to 138, so they are padded to 3 digits;
 * every other canon pads chapters to 2 digits.
 *   bible-ot/.../01.mdx   doctrine-and-covenants/001.mdx
 */
export function chapterFileName(canon: string, chapter: number): string {
  if (canon === 'doctrine-and-covenants') return `${String(chapter).padStart(3, '0')}.mdx`;
  return `${String(chapter).padStart(2, '0')}.mdx`;
}

/**
 * Resolve the directory that holds a book's chapter files.
 *
 * Session 01 produced an intentionally inconsistent set of directory names
 * (bible-nt/43-john, book-of-mormon/03-3-nephi, pearl-of-great-price/moses
 * with no numeric prefix at all). Directory names are organizational only —
 * routes are generated from frontmatter — so this helper prefers an EXISTING
 * directory matching the slug and only computes a fresh name (NN-slug, where
 * NN is the book's order within its canon) for a book that has no directory
 * yet. D&C has no per-book directory; its sections live in the canon dir.
 */
export function bookDir(canon: string, bookSlug: string, bookOrder: number): string {
  const canonDir = path.join(CONTENT_DIR, canon);
  if (canon === 'doctrine-and-covenants') return canonDir;
  if (fs.existsSync(canonDir)) {
    for (const entry of fs.readdirSync(canonDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (entry.name === bookSlug || entry.name.endsWith(`-${bookSlug}`)) {
        return path.join(canonDir, entry.name);
      }
    }
  }
  return path.join(canonDir, `${String(bookOrder).padStart(2, '0')}-${bookSlug}`);
}

/** Absolute path to a chapter's MDX file (the directory may not exist yet). */
export function chapterPath(
  canon: string,
  bookSlug: string,
  bookOrder: number,
  chapter: number,
): string {
  return path.join(bookDir(canon, bookSlug, bookOrder), chapterFileName(canon, chapter));
}
