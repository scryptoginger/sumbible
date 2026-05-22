// Book-level and canon-level summaries.
//
// SCAFFOLD ONLY — the maps below are intentionally empty. The prose is drafted
// in a dedicated content session under the AUTHORING.md hallucination
// guardrail (book/canon summaries make sourceable claims about authorship,
// date, and theme, so they get the same care as chapter summaries).
//
// To populate: add an entry keyed by book slug (bookSummaries) or canon slug
// (canonSummaries). The canon page renders canonSummaries[canon]; the book
// page renders bookSummaries[bookSlug]. Absent entries simply render nothing.
//
//   bookSummaries['genesis'] = {
//     summary: 'Genesis, the first book of the Torah, moves from creation ...',
//     status: 'published',
//     sources: [{ title: 'Anchor Bible Dictionary, "Genesis"' }],
//   };
import type { CanonSlug } from '../lib/canons';

export interface Summary {
  /** A short prose summary — a few sentences. Plain text. */
  summary: string;
  status: 'draft' | 'review' | 'published';
  sources?: { title: string; author?: string; url?: string }[];
}

/** Keyed by book slug (e.g. "genesis", "1-nephi"). Empty until drafted. */
export const bookSummaries: Record<string, Summary> = {};

/** Keyed by canon slug. Empty until drafted. */
export const canonSummaries: Partial<Record<CanonSlug, Summary>> = {};
