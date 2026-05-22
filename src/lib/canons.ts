// Authoritative canon / book / chapter-count metadata.
// Drives navigation menus and static route generation.
//
// Chapter counts follow the Protestant/KJV versification for the Bible and
// the current LDS editions for the Standard Works. A few books differ in
// chapter count across versification traditions (e.g. Joel and Malachi have
// extra chapters in the Hebrew Bible); the counts here are the Protestant/KJV
// numbers, which match the external editions SumBible links out to.

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
}

const otBooks: ReadonlyArray<readonly [string, string, number]> = [
  ['genesis', 'Genesis', 50],
  ['exodus', 'Exodus', 40],
  ['leviticus', 'Leviticus', 27],
  ['numbers', 'Numbers', 36],
  ['deuteronomy', 'Deuteronomy', 34],
  ['joshua', 'Joshua', 24],
  ['judges', 'Judges', 21],
  ['ruth', 'Ruth', 4],
  ['1-samuel', '1 Samuel', 31],
  ['2-samuel', '2 Samuel', 24],
  ['1-kings', '1 Kings', 22],
  ['2-kings', '2 Kings', 25],
  ['1-chronicles', '1 Chronicles', 29],
  ['2-chronicles', '2 Chronicles', 36],
  ['ezra', 'Ezra', 10],
  ['nehemiah', 'Nehemiah', 13],
  ['esther', 'Esther', 10],
  ['job', 'Job', 42],
  ['psalms', 'Psalms', 150],
  ['proverbs', 'Proverbs', 31],
  ['ecclesiastes', 'Ecclesiastes', 12],
  ['song-of-solomon', 'Song of Solomon', 8],
  ['isaiah', 'Isaiah', 66],
  ['jeremiah', 'Jeremiah', 52],
  ['lamentations', 'Lamentations', 5],
  ['ezekiel', 'Ezekiel', 48],
  ['daniel', 'Daniel', 12],
  ['hosea', 'Hosea', 14],
  ['joel', 'Joel', 3],
  ['amos', 'Amos', 9],
  ['obadiah', 'Obadiah', 1],
  ['jonah', 'Jonah', 4],
  ['micah', 'Micah', 7],
  ['nahum', 'Nahum', 3],
  ['habakkuk', 'Habakkuk', 3],
  ['zephaniah', 'Zephaniah', 3],
  ['haggai', 'Haggai', 2],
  ['zechariah', 'Zechariah', 14],
  ['malachi', 'Malachi', 4],
];

const ntBooks: ReadonlyArray<readonly [string, string, number]> = [
  ['matthew', 'Matthew', 28],
  ['mark', 'Mark', 16],
  ['luke', 'Luke', 24],
  ['john', 'John', 21],
  ['acts', 'Acts', 28],
  ['romans', 'Romans', 16],
  ['1-corinthians', '1 Corinthians', 16],
  ['2-corinthians', '2 Corinthians', 13],
  ['galatians', 'Galatians', 6],
  ['ephesians', 'Ephesians', 6],
  ['philippians', 'Philippians', 4],
  ['colossians', 'Colossians', 4],
  ['1-thessalonians', '1 Thessalonians', 5],
  ['2-thessalonians', '2 Thessalonians', 3],
  ['1-timothy', '1 Timothy', 6],
  ['2-timothy', '2 Timothy', 4],
  ['titus', 'Titus', 3],
  ['philemon', 'Philemon', 1],
  ['hebrews', 'Hebrews', 13],
  ['james', 'James', 5],
  ['1-peter', '1 Peter', 5],
  ['2-peter', '2 Peter', 3],
  ['1-john', '1 John', 5],
  ['2-john', '2 John', 1],
  ['3-john', '3 John', 1],
  ['jude', 'Jude', 1],
  ['revelation', 'Revelation', 22],
];

const bomBooks: ReadonlyArray<readonly [string, string, number]> = [
  ['1-nephi', '1 Nephi', 22],
  ['2-nephi', '2 Nephi', 33],
  ['jacob', 'Jacob', 7],
  ['enos', 'Enos', 1],
  ['jarom', 'Jarom', 1],
  ['omni', 'Omni', 1],
  ['words-of-mormon', 'Words of Mormon', 1],
  ['mosiah', 'Mosiah', 29],
  ['alma', 'Alma', 63],
  ['helaman', 'Helaman', 16],
  ['3-nephi', '3 Nephi', 30],
  ['4-nephi', '4 Nephi', 1],
  ['mormon', 'Mormon', 9],
  ['ether', 'Ether', 15],
  ['moroni', 'Moroni', 10],
];

function buildBooks(
  canon: CanonSlug,
  rows: ReadonlyArray<readonly [string, string, number]>,
): BookMeta[] {
  return rows.map(([slug, name, chapterCount], i) => ({
    slug,
    name,
    order: i + 1,
    chapterCount,
    canon,
  }));
}

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
      // 1 & 2, deferred to a later iteration). Modeled as one "book".
      { slug: 'sections', name: 'Sections', order: 1, chapterCount: 138, canon: 'doctrine-and-covenants' },
    ],
  },
  'pearl-of-great-price': {
    name: 'Pearl of Great Price',
    books: [
      { slug: 'moses', name: 'Moses', order: 1, chapterCount: 8, canon: 'pearl-of-great-price' },
      { slug: 'abraham', name: 'Abraham', order: 2, chapterCount: 5, canon: 'pearl-of-great-price' },
      { slug: 'joseph-smith-matthew', name: 'Joseph Smith—Matthew', order: 3, chapterCount: 1, canon: 'pearl-of-great-price' },
      { slug: 'joseph-smith-history', name: 'Joseph Smith—History', order: 4, chapterCount: 1, canon: 'pearl-of-great-price' },
      { slug: 'articles-of-faith', name: 'Articles of Faith', order: 5, chapterCount: 1, canon: 'pearl-of-great-price' },
    ],
  },
};

/** Ordered list of canon slugs, for nav and route generation. */
export const canonSlugs = Object.keys(canons) as CanonSlug[];

/** Look up a single book within a canon. */
export function getBook(canon: CanonSlug, bookSlug: string): BookMeta | undefined {
  return canons[canon]?.books.find((b) => b.slug === bookSlug);
}

/** Display name for a canon slug. */
export function canonName(canon: CanonSlug): string {
  return canons[canon].name;
}
