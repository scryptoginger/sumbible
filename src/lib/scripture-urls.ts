// Outbound scripture-link URL builder, shared by <VerseRef /> and the
// index pages. URL patterns were verified against the live sites:
//   churchofjesuschrist.org  /study/scriptures/<path>/<abbr>/<chapter>?lang=eng&id=pN#pN
//   biblegateway.com         /passage/?search=<Book Chapter:Verse>&version=NIV
//   biblehub.com             /<book>/<chapter>-<verse>.htm
//   netbible.org             /bible/<Book+Chapter>
import { canonChurchPath, type BookMeta } from './canons';

export type Translation =
  | 'churchofjesuschrist'
  | 'biblegateway'
  | 'biblehub'
  | 'netbible';

const LDS_CANONS = ['book-of-mormon', 'doctrine-and-covenants', 'pearl-of-great-price'];

/** First verse number of a verse value that may be a number, "5-7", or "5,7". */
function firstVerse(verse: number | string | undefined): number {
  if (verse === undefined) return NaN;
  if (typeof verse === 'number') return verse;
  return parseInt(String(verse), 10);
}

/**
 * Build an outbound URL for a scripture reference. LDS-canon texts exist only
 * on churchofjesuschrist.org, so the `translation` argument is ignored for
 * those canons; for the Bible it defaults to churchofjesuschrist.
 */
export function buildScriptureUrl(
  book: BookMeta,
  chapter: number,
  verse?: number | string,
  translation: Translation = 'churchofjesuschrist',
): string {
  const isLds = LDS_CANONS.includes(book.canon);
  const effective: Translation = isLds ? 'churchofjesuschrist' : translation;
  const v = firstVerse(verse);

  switch (effective) {
    case 'biblegateway': {
      const ref = verse ? `${book.name} ${chapter}:${verse}` : `${book.name} ${chapter}`;
      return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=NIV`;
    }
    case 'biblehub': {
      const slug = book.name.toLowerCase().replace(/\s+/g, '_');
      return Number.isFinite(v)
        ? `https://biblehub.com/${slug}/${chapter}-${v}.htm`
        : `https://biblehub.com/${slug}/${chapter}.htm`;
    }
    case 'netbible':
      return `https://netbible.org/bible/${encodeURIComponent(`${book.name} ${chapter}`)}`;
    case 'churchofjesuschrist':
    default: {
      const base = `https://www.churchofjesuschrist.org/study/scriptures/${canonChurchPath[book.canon]}/${book.churchAbbr}/${chapter}`;
      return Number.isFinite(v) ? `${base}?lang=eng&id=p${v}#p${v}` : `${base}?lang=eng`;
    }
  }
}

/** Human-readable reference, e.g. "Isaiah 53:5–7" (range hyphens become en-dashes). */
export function formatReference(
  book: BookMeta,
  chapter: number,
  verse?: number | string,
): string {
  if (verse === undefined || verse === '') return `${book.name} ${chapter}`;
  return `${book.name} ${chapter}:${String(verse).replace(/-/g, '–')}`;
}
