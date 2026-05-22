// Authoritative canon / book / chapter-count metadata.
// Drives navigation menus, static route generation, and outbound links.
//
// Chapter counts follow the Protestant/KJV versification for the Bible and
// the current LDS editions for the Standard Works. A few books differ in
// chapter count across versification traditions (e.g. Joel and Malachi have
// extra chapters in the Hebrew Bible); the counts here are the Protestant/KJV
// numbers, which match the external editions SumBible links out to.
//
// `churchAbbr` is the book's URL slug on churchofjesuschrist.org (verified
// against the site's scripture index pages — e.g. Genesis is `gen`,
// 1 Nephi is `1-ne`). It is used by <VerseRef /> to build outbound links.

export type CanonSlug =
  | 'bible-ot'
  | 'bible-nt'
  | 'book-of-mormon'
  | 'doctrine-and-covenants'
  | 'pearl-of-great-price';

export interface BookMeta {
  slug: string;            // url-safe, e.g. "1-nephi"
  name: string;            // display name, e.g. "1 Nephi"
  shortName?: string;      // optional, e.g. "1 Ne."
  order: number;           // global order within canon
  chapterCount: number;
  canon: CanonSlug;
  churchAbbr: string;      // churchofjesuschrist.org URL slug, e.g. "1-ne"
}

// Rows: [slug, name, chapterCount, churchAbbr]
type BookRow = readonly [string, string, number, string];

const otBooks: ReadonlyArray<BookRow> = [
  ['genesis', 'Genesis', 50, 'gen'],
  ['exodus', 'Exodus', 40, 'ex'],
  ['leviticus', 'Leviticus', 27, 'lev'],
  ['numbers', 'Numbers', 36, 'num'],
  ['deuteronomy', 'Deuteronomy', 34, 'deut'],
  ['joshua', 'Joshua', 24, 'josh'],
  ['judges', 'Judges', 21, 'judg'],
  ['ruth', 'Ruth', 4, 'ruth'],
  ['1-samuel', '1 Samuel', 31, '1-sam'],
  ['2-samuel', '2 Samuel', 24, '2-sam'],
  ['1-kings', '1 Kings', 22, '1-kgs'],
  ['2-kings', '2 Kings', 25, '2-kgs'],
  ['1-chronicles', '1 Chronicles', 29, '1-chr'],
  ['2-chronicles', '2 Chronicles', 36, '2-chr'],
  ['ezra', 'Ezra', 10, 'ezra'],
  ['nehemiah', 'Nehemiah', 13, 'neh'],
  ['esther', 'Esther', 10, 'esth'],
  ['job', 'Job', 42, 'job'],
  ['psalms', 'Psalms', 150, 'ps'],
  ['proverbs', 'Proverbs', 31, 'prov'],
  ['ecclesiastes', 'Ecclesiastes', 12, 'eccl'],
  ['song-of-solomon', 'Song of Solomon', 8, 'song'],
  ['isaiah', 'Isaiah', 66, 'isa'],
  ['jeremiah', 'Jeremiah', 52, 'jer'],
  ['lamentations', 'Lamentations', 5, 'lam'],
  ['ezekiel', 'Ezekiel', 48, 'ezek'],
  ['daniel', 'Daniel', 12, 'dan'],
  ['hosea', 'Hosea', 14, 'hosea'],
  ['joel', 'Joel', 3, 'joel'],
  ['amos', 'Amos', 9, 'amos'],
  ['obadiah', 'Obadiah', 1, 'obad'],
  ['jonah', 'Jonah', 4, 'jonah'],
  ['micah', 'Micah', 7, 'micah'],
  ['nahum', 'Nahum', 3, 'nahum'],
  ['habakkuk', 'Habakkuk', 3, 'hab'],
  ['zephaniah', 'Zephaniah', 3, 'zeph'],
  ['haggai', 'Haggai', 2, 'hag'],
  ['zechariah', 'Zechariah', 14, 'zech'],
  ['malachi', 'Malachi', 4, 'mal'],
];

const ntBooks: ReadonlyArray<BookRow> = [
  ['matthew', 'Matthew', 28, 'matt'],
  ['mark', 'Mark', 16, 'mark'],
  ['luke', 'Luke', 24, 'luke'],
  ['john', 'John', 21, 'john'],
  ['acts', 'Acts', 28, 'acts'],
  ['romans', 'Romans', 16, 'rom'],
  ['1-corinthians', '1 Corinthians', 16, '1-cor'],
  ['2-corinthians', '2 Corinthians', 13, '2-cor'],
  ['galatians', 'Galatians', 6, 'gal'],
  ['ephesians', 'Ephesians', 6, 'eph'],
  ['philippians', 'Philippians', 4, 'philip'],
  ['colossians', 'Colossians', 4, 'col'],
  ['1-thessalonians', '1 Thessalonians', 5, '1-thes'],
  ['2-thessalonians', '2 Thessalonians', 3, '2-thes'],
  ['1-timothy', '1 Timothy', 6, '1-tim'],
  ['2-timothy', '2 Timothy', 4, '2-tim'],
  ['titus', 'Titus', 3, 'titus'],
  ['philemon', 'Philemon', 1, 'philem'],
  ['hebrews', 'Hebrews', 13, 'heb'],
  ['james', 'James', 5, 'james'],
  ['1-peter', '1 Peter', 5, '1-pet'],
  ['2-peter', '2 Peter', 3, '2-pet'],
  ['1-john', '1 John', 5, '1-jn'],
  ['2-john', '2 John', 1, '2-jn'],
  ['3-john', '3 John', 1, '3-jn'],
  ['jude', 'Jude', 1, 'jude'],
  ['revelation', 'Revelation', 22, 'rev'],
];

const bomBooks: ReadonlyArray<BookRow> = [
  ['1-nephi', '1 Nephi', 22, '1-ne'],
  ['2-nephi', '2 Nephi', 33, '2-ne'],
  ['jacob', 'Jacob', 7, 'jacob'],
  ['enos', 'Enos', 1, 'enos'],
  ['jarom', 'Jarom', 1, 'jarom'],
  ['omni', 'Omni', 1, 'omni'],
  ['words-of-mormon', 'Words of Mormon', 1, 'w-of-m'],
  ['mosiah', 'Mosiah', 29, 'mosiah'],
  ['alma', 'Alma', 63, 'alma'],
  ['helaman', 'Helaman', 16, 'hel'],
  ['3-nephi', '3 Nephi', 30, '3-ne'],
  ['4-nephi', '4 Nephi', 1, '4-ne'],
  ['mormon', 'Mormon', 9, 'morm'],
  ['ether', 'Ether', 15, 'ether'],
  ['moroni', 'Moroni', 10, 'moro'],
];

function buildBooks(canon: CanonSlug, rows: ReadonlyArray<BookRow>): BookMeta[] {
  return rows.map(([slug, name, chapterCount, churchAbbr], i) => ({
    slug,
    name,
    order: i + 1,
    chapterCount,
    canon,
    churchAbbr,
  }));
}

/** Path segment(s) for a canon on churchofjesuschrist.org's /study/scriptures/. */
export const canonChurchPath: Record<CanonSlug, string> = {
  'bible-ot': 'ot',
  'bible-nt': 'nt',
  'book-of-mormon': 'bofm',
  'doctrine-and-covenants': 'dc-testament',
  'pearl-of-great-price': 'pgp',
};

export const canons: Record<CanonSlug, { name: string; books: BookMeta[] }> = {
  'bible-ot': {
    name: 'Old Testament',
    books: buildBooks('bible-ot', otBooks),
  },
  'bible-nt': {
    name: 'New Testament',
    books: buildBooks('bible-nt', ntBooks),
  },
  'book-of-mormon': {
    name: 'Book of Mormon',
    books: buildBooks('book-of-mormon', bomBooks),
  },
  'doctrine-and-covenants': {
    name: 'Doctrine and Covenants',
    books: [
      // D&C is a single book with 138 sections (plus Official Declarations
      // 1 & 2, deferred to a later iteration). Modeled as one "book"; the
      // churchofjesuschrist.org path is dc-testament/dc/<section>.
      { slug: 'sections', name: 'Sections', order: 1, chapterCount: 138, canon: 'doctrine-and-covenants', churchAbbr: 'dc' },
    ],
  },
  'pearl-of-great-price': {
    name: 'Pearl of Great Price',
    books: [
      { slug: 'moses', name: 'Moses', order: 1, chapterCount: 8, canon: 'pearl-of-great-price', churchAbbr: 'moses' },
      { slug: 'abraham', name: 'Abraham', order: 2, chapterCount: 5, canon: 'pearl-of-great-price', churchAbbr: 'abr' },
      { slug: 'joseph-smith-matthew', name: 'Joseph Smith—Matthew', order: 3, chapterCount: 1, canon: 'pearl-of-great-price', churchAbbr: 'js-m' },
      { slug: 'joseph-smith-history', name: 'Joseph Smith—History', order: 4, chapterCount: 1, canon: 'pearl-of-great-price', churchAbbr: 'js-h' },
      { slug: 'articles-of-faith', name: 'Articles of Faith', order: 5, chapterCount: 1, canon: 'pearl-of-great-price', churchAbbr: 'a-of-f' },
    ],
  },
};

/** Ordered list of canon slugs, for nav and route generation. */
export const canonSlugs = Object.keys(canons) as CanonSlug[];

/** Look up a single book within a canon. */
export function getBook(canon: CanonSlug, bookSlug: string): BookMeta | undefined {
  return canons[canon]?.books.find((b) => b.slug === bookSlug);
}

/** Look up a book by slug across every canon (slugs are globally unique). */
export function findBookBySlug(bookSlug: string): BookMeta | undefined {
  for (const canon of canonSlugs) {
    const book = canons[canon].books.find((b) => b.slug === bookSlug);
    if (book) return book;
  }
  return undefined;
}

/** Display name for a canon slug. */
export function canonName(canon: CanonSlug): string {
  return canons[canon].name;
}
