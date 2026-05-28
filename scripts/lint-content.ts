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
    // Verification-log discipline (AUTHORING §Verification Log Discipline).
    // Chapters in review/published with substantial deep summaries should
    // carry at least 3 verification-log entries. Sparse logs on substantial
    // content suggest claims that weren't actually verified — or work that
    // was done but not recorded. Both are surfaced as warnings.
    const log = Array.isArray(data.verificationLog) ? data.verificationLog : [];
    const statusGated = data.status === 'review' || data.status === 'published';
    if (statusGated && body.length > 1600 && log.length < 3) {
      report(
        rel,
        'WARN',
        `verificationLog has ${log.length} entry(ies) — chapter has a substantial body (${body.length} chars); status "${data.status}" expects at least 3 verified claims`,
      );
    }

    // 13 — quotation fidelity (AUTHORING §6.0 + §17). Cross-reference
    // verbatim quotes >6 words must have a corresponding verificationLog
    // entry with `verifiedViaFetch: true` that points to the same book
    // being cross-referenced. The two integrity sweeps (PRs #13 and #14)
    // proved this discipline is necessary: 11 memory-reconstruction errors
    // were found across both Standard Works and Bible cross-references.
    //
    // The `quotationFidelity` frontmatter field controls enforcement
    // severity: 'enforced' (default for new chapters) produces ERROR;
    // 'legacy' (grandfather for chapters drafted before the rule shipped)
    // produces WARN. Legacy marking is HONEST about discipline-not-yet-
    // applied; it is not a permanent exemption.
    const fidelityMode = (data.quotationFidelity ?? 'enforced') as 'enforced' | 'legacy';
    checkQuotationFidelity(rel, body, data.bookSlug as string, log, fidelityMode);
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

  // 10 — deity capitalization. Scan body prose (with JSX tags stripped so
  // attribute values like gloss="..." aren't scanned) for lowercase
  // occurrences of always-capitalized deity terms.
  // ERROR list: unambiguous proper nouns and exclusive theological titles.
  // WARN list: context-dependent (could be earthly father/lord/etc).
  for (let i = fmEnd + 1; i < fileLines.length; i++) {
    const line = fileLines[i];
    const stripped = line.replace(/<[^>]*>/g, ' ');
    for (const term of DEITY_ERROR_TERMS) {
      const re = new RegExp(`\\b${escapeRegex(term)}\\b`, 'g');
      for (const m of stripped.matchAll(re)) {
        report(
          rel,
          'ERROR',
          `deity term "${m[0]}" appears lowercase — capitalize when referring to Deity. Line: ${line.trim().slice(0, 120)}`,
          i + 1,
        );
      }
    }
    for (const term of DEITY_WARN_TERMS) {
      const re = new RegExp(`\\b${escapeRegex(term)}\\b`, 'g');
      for (const m of stripped.matchAll(re)) {
        report(
          rel,
          'WARN',
          `possible deity term "${m[0]}" lowercase — capitalize if referring to Deity. Line: ${line.trim().slice(0, 120)}`,
          i + 1,
        );
      }
    }

    // 11 — evaluative-adjective discipline. Hedge words that smuggle an
    // argument about the text's uniqueness or precision.
    for (const term of EVAL_HEDGES) {
      const re = new RegExp(`\\b${escapeRegex(term)}\\b`, 'gi');
      for (const m of stripped.matchAll(re)) {
        report(
          rel,
          'WARN',
          `"${m[0]}" may editorialize. Confirm this describes the content's effect (allowed) rather than arguing for its uniqueness or precision (not allowed).`,
          i + 1,
        );
      }
    }
  }

  // 12 — no-original-language repetition (WARN). Meta-claims about source
  // language availability belong in the canon summary, not every chapter.
  if (
    kind === 'chapter' &&
    ['book-of-mormon', 'doctrine-and-covenants', 'pearl-of-great-price'].includes(data.canon)
  ) {
    for (let i = fmEnd + 1; i < fileLines.length; i++) {
      const lowered = fileLines[i].toLowerCase();
      for (const phrase of NO_ORIG_PHRASES) {
        if (lowered.includes(phrase)) {
          report(
            rel,
            'WARN',
            `meta-claims about source-language availability belong in the canon summary, not every chapter. Consider removing: "${phrase}"`,
            i + 1,
          );
        }
      }
    }
  }
}

/**
 * lint:quotation-fidelity rule (v2 — symmetric proximity + same-book
 * disambiguation).
 *
 * For each chapter body, find every substantial verbatim quotation (text
 * inside double-quotes, ≥7 words long). For each such quote, look at the
 * SURROUNDING ±CITATION_WINDOW chars of the body in BOTH directions for
 * any `<VerseRef book="..." />` candidate owners.
 *
 *   - If ANY candidate owner points to the chapter's own book, treat the
 *     quote as a self-quote and exempt it (PRs #13 + #14 proved self-
 *     quotes reliably accurate). Trade-off documented at the rule body.
 *   - Else (all candidates cross-book), the quote MUST be covered by a
 *     verificationLog entry with `verifiedViaFetch: true` and whose `url`
 *     or `claim` references the same cross-reference book.
 *   - If no candidate owner exists in the proximity window at all, the
 *     quote has no structural citation pointer and the rule does not fire
 *     (rule is conservative — quotes without clear citation pointers are
 *     not flagged).
 *
 * Conservative — false positives are acceptable (resolve by rewording,
 * dropping the quote marks, or adding the vLog entry). The rule fails
 * with ERROR; it cannot be silenced.
 *
 * Why this rule exists: PRs #13 + #14 found 11 cross-reference scripture
 * quotes pulled from memory and falsely certified as verified by the
 * verificationLog. See AUTHORING.md §6.0 and §6.2.
 *
 * v2 changes over v1 (PR #17):
 *
 *   1. Symmetric proximity window (previous commit) — v1 searched
 *      forward only from a quote for its owning VerseRef. PR #18
 *      documented a Gen 1:2 verbatim in Exod 10 whose owning VerseRef
 *      sat BEFORE the quote, slipping past v1 undetected. v2 searches
 *      both forward and backward within CITATION_WINDOW chars.
 *
 *   2. Same-book disambiguation (this commit) — v1 picked the single
 *      nearest VerseRef as the structural owner. PR #18 documented an
 *      Exod 13:14 verbatim in Exod 10 (same-book self-quote) whose
 *      nearest-following VerseRef happened to be a Deuteronomy 6:7
 *      reference, producing a false-positive ERROR. v2 considers ALL
 *      VerseRefs within the proximity window as candidate owners and
 *      exempts the quote if any one of them points to the chapter's
 *      own book.
 */
interface VLogEntry {
  claim: string;
  source: string;
  url?: string;
  verifiedOn?: string;
  verifiedViaFetch: boolean;
  quoteText?: string;
}

function checkQuotationFidelity(
  rel: string,
  body: string,
  ownBookSlug: string,
  log: VLogEntry[],
  fidelityMode: 'enforced' | 'legacy',
): void {
  // Step 1: catalogue all VerseRef components in the body with their
  // positions (start AND end) and the book they point to. v2 tracks `end`
  // so that backward-proximity to a preceding VerseRef is measured from
  // VerseRef-end to quote-start (the natural citation distance), not
  // from VerseRef-start.
  const verseRefPattern = /<VerseRef\s+book="([^"]+)"[^/]*?\/>/g;
  const verseRefs: Array<{ book: string; pos: number; end: number }> = [];
  for (const m of body.matchAll(verseRefPattern)) {
    const start = m.index ?? 0;
    verseRefs.push({ book: m[1], pos: start, end: start + m[0].length });
  }

  // Step 2: scan body for quoted strings of ≥7 words.
  // Match both straight double-quotes and curly typographic double-quotes.
  // We use the ORIGINAL body (not stripped) to preserve positions for
  // structural-citation matching.
  const CITATION_WINDOW = 60; // chars around the quote to look for "owning" VerseRefs
  const MIN_WORDS = 7;

  const quotePattern = /"([^"\n]{20,500})"|“([^”\n]{20,500})”/g;
  for (const m of body.matchAll(quotePattern)) {
    const quote = (m[1] ?? m[2] ?? '').trim();
    if (!quote) continue;
    // Skip if this match is inside a JSX tag attribute value.
    const pos = m.index ?? 0;
    const before = body.slice(0, pos);
    const lastOpen = before.lastIndexOf('<');
    const lastClose = before.lastIndexOf('>');
    if (lastOpen > lastClose) continue; // inside a JSX tag

    const wordCount = quote.split(/\s+/).filter(Boolean).length;
    if (wordCount < MIN_WORDS) continue;

    // Skip embedded HTML/JSX-tag content masquerading as a quote (e.g., the
    // quote regex captured ``"http..." `` or text that's mostly JSX).
    // Heuristic: if the quote contains an unmatched '<', skip — it's likely
    // a regex artifact from crossing a JSX boundary.
    if ((quote.match(/</g) ?? []).length > (quote.match(/>/g) ?? []).length) continue;

    // Structural-citation matching (v2 — symmetric proximity).
    //
    // A VerseRef is a "candidate owner" of the quote if it sits within
    // CITATION_WINDOW chars of the quote in EITHER direction. Forward:
    // VerseRef-start within window after the quote's close (the "quoted
    // text (<VerseRef ... />)" pattern). Backward: VerseRef-end within
    // window before the quote's start (the "<VerseRef ... /> reads
    // 'quoted text'" pattern, which v1's forward-only window missed).
    //
    // If no candidate owner exists, the quote has no structural citation
    // pointer and the rule does not fire (rule is conservative — quotes
    // without clear citation pointers are not flagged).
    const matchEnd = pos + m[0].length;
    const candidateOwners = verseRefs.filter((r) => {
      if (r.pos >= matchEnd && r.pos - matchEnd <= CITATION_WINDOW) return true; // following
      if (r.end <= pos && pos - r.end <= CITATION_WINDOW) return true; // preceding
      return false;
    });
    if (candidateOwners.length === 0) continue; // unowned quote — no citation pointer

    // Same-book disambiguation (v2 Fix 2). If ANY candidate owner points
    // to the chapter's own book, treat the quote as a self-quote and
    // exempt it.
    //
    // Trade-off, explicitly documented for future maintainers: a true
    // cross-reference verbatim quote that happens to sit near a same-book
    // VerseRef now slips through without verifiedViaFetch:true. We accept
    // this for two reasons grounded in the PRs #13/#14/#17/#18 evidence:
    //
    //   (a) Self-quotes (a chapter quoting its own primary subject
    //       material) are PR #13/#14-proven reliably accurate — zero
    //       errors across both integrity sweeps. Cross-reference quotes
    //       from memory are the well-characterized failure mode.
    //
    //   (b) The lint rule is the SAFETY NET, not the primary defense.
    //       AUTHORING.md §6.0's paraphrase-by-default discipline is the
    //       primary defense for cross-references; the lint catches the
    //       unambiguous-cross-book case mechanically. PR #18's false
    //       positive (an Exodus 13:14 quote misattributed to a nearby
    //       Deut 6:7 VerseRef) forced a prose restructure around the
    //       lint quirk; the v2 preference removes that distortion at
    //       the cost of a narrow class of edge cases the human discipline
    //       continues to cover.
    if (candidateOwners.some((r) => r.book === ownBookSlug)) continue;

    // All candidate owners are cross-book. Pick the nearest one to name
    // in the ERROR message; on tie, prefer the preceding (the standard
    // citation-then-quote prose pattern).
    const owningRef = candidateOwners
      .map((r) => {
        const following = r.pos >= matchEnd;
        const dist = following ? r.pos - matchEnd : pos - r.end;
        const tiebreak = following ? 1 : 0; // preceding wins on tie
        return { r, dist, tiebreak };
      })
      .sort((a, b) => a.dist - b.dist || a.tiebreak - b.tiebreak)[0].r;

    // For coverage matching, accept BOTH the structurally-owning ref AND any
    // other VerseRefs within a slightly wider window. A quote may have its
    // attribution split across multiple nearby VerseRefs (e.g., the prose
    // says "from JST: 'quote' (JST Gen 14:27)" inline and then "<VerseRef
    // book=\"doctrine-and-covenants\" ... />" in the next sentence). Any of
    // those nearby cross-references could carry a matching fetched entry.
    const COVERAGE_WINDOW = 350;
    const coverageRefs = verseRefs.filter(
      (r) => r.pos >= pos - COVERAGE_WINDOW && r.pos <= matchEnd + COVERAGE_WINDOW
    );
    const crossRefs = coverageRefs.filter((r) => r.book !== ownBookSlug);
    if (crossRefs.length === 0) {
      // Owning ref was a cross-ref but no other cross-refs nearby — use owningRef alone
      crossRefs.push(owningRef);
    }

    // Cross-reference quote present. Look for a verifiedViaFetch:true entry
    // that covers it. Match by: (a) URL contains a cross-ref book slug,
    // (b) claim text contains the cross-ref book name, OR (c) quoteText
    // overlaps significantly with the quote.
    const fetched = log.filter((e) => e.verifiedViaFetch === true);
    const crossBooks = [...new Set(crossRefs.map((r) => r.book))];

    const covered = fetched.some((e) => {
      // (a) URL match — the URL should contain one of the cross-ref books
      if (e.url) {
        const urlLower = e.url.toLowerCase();
        for (const cb of crossBooks) {
          // Match common URL conventions: /book/, /book-slug/, ?search=Book+...
          const cbVariants = [
            cb, // raw slug
            cb.replace(/-/g, '+'), // search-query form
            cb.replace(/-/g, ' '), // space-separated
            cb.replace(/^(\d+)-/, '$1 '), // "1-nephi" → "1 nephi"
            // Common abbreviations
            cb === '2-chronicles' ? '2-chr' : cb,
            cb === '1-chronicles' ? '1-chr' : cb,
            cb === '2-samuel' ? '2-sam' : cb,
            cb === '1-samuel' ? '1-sam' : cb,
            cb === '2-kings' ? '2-kgs' : cb,
            cb === '1-kings' ? '1-kgs' : cb,
            cb === 'doctrine-and-covenants' ? 'dc' : cb,
            cb === 'doctrine-and-covenants' ? 'd&c' : cb,
            cb === 'romans' ? 'rom' : cb,
            cb === 'galatians' ? 'gal' : cb,
            cb === 'hebrews' ? 'heb' : cb,
            cb === 'matthew' ? 'matt' : cb,
            cb === 'ephesians' ? 'eph' : cb,
            cb === 'colossians' ? 'col' : cb,
          ].map((s) => s.toLowerCase());
          if (cbVariants.some((v) => urlLower.includes(v))) return true;
        }
      }
      // (b) claim text contains cross-ref book name
      const claimLower = (e.claim ?? '').toLowerCase();
      for (const cb of crossBooks) {
        const human = cb.replace(/-/g, ' ');
        if (claimLower.includes(human)) return true;
      }
      // (c) quoteText overlap — first 25 chars of either
      if (e.quoteText && quote.length >= 25) {
        const qHead = quote.slice(0, 30);
        const eHead = e.quoteText.slice(0, 30);
        if (e.quoteText.includes(qHead) || quote.includes(eHead)) return true;
      }
      return false;
    });

    if (!covered) {
      const crossLabel = crossBooks.join(', ');
      const severity: Severity = fidelityMode === 'legacy' ? 'WARN' : 'ERROR';
      const legacyNote =
        fidelityMode === 'legacy'
          ? ' [WARN-only because chapter is marked quotationFidelity: legacy; resolve by fetch-verifying and migrating to enforced.]'
          : '';
      report(
        rel,
        severity,
        `lint:quotation-fidelity — cross-reference verbatim quote (${wordCount} words, near VerseRef → ${crossLabel}) lacks a matching verifiedViaFetch:true verificationLog entry. Either: (a) fetch-verify the quote and add a verificationLog entry with verifiedViaFetch:true and the source URL; (b) paraphrase; or (c) remove the quotation marks. See AUTHORING.md §6.0.${legacyNote} Quote: "${quote.slice(0, 120)}${quote.length > 120 ? '...' : ''}"`,
      );
    }
  }
}

// Deity-cap and editorial discipline term lists — see AUTHORING.md §3, §4.
const DEITY_ERROR_TERMS = [
  'christ',
  'jesus',
  'messiah',
  'yahweh',
  'jehovah',
  'almighty',
  'most high',
  'ancient of days',
  'holy ghost',
  'holy spirit',
];
const DEITY_WARN_TERMS = ['god', 'lord', 'savior', 'redeemer'];
const EVAL_HEDGES = [
  'unusually',
  'remarkably',
  'surprisingly',
  'extraordinarily',
  'uniquely',
  'improbably',
  'particularly precise',
  'exceptionally accurate',
];
const NO_ORIG_PHRASES = [
  'no original-language manuscript',
  'no extant original',
  'no original-language source',
  'without an extant source language',
];

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
