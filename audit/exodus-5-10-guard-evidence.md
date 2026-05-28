# Session 08 — Guard Evidence: Exodus 5-10 under fetch-and-diff discipline

Purpose: capture how the `lint:quotation-fidelity` rule (shipped in PR #17) behaves during live chapter drafting. This file is the first such evidence record; it is committed alongside the chapters.

## 1. Cross-reference verbatim quotes drafted (count by chapter)

Counts every verbatim quotation >6 words from a book OTHER than Exodus, appearing in body prose or LangNote `gloss` attributes. (The lint's structural matching skips attribute values; the §6.0 discipline does not — so this count is the §6.0-relevant population, not the lint-relevant population.)

| Chapter | Cross-ref verbatim quotes >6w | Books cited verbatim |
|---|---:|---|
| 5 | 0 | — (no cross-ref >6w verbatim; Habakkuk and Jeremiah lament-form parallels noted via VerseRef structural pointers only) |
| 6 | 2 | Isaiah 52:10 (stretched-out-arm motif); Genesis 4:26 (men-of-Enos verse, in El Shaddai LangNote) |
| 7 | 0 | — (rod-to-serpent and Nile-blood self-quoted from Exodus; 2 Tim 3:8 "withstood Moses" too short to count) |
| 8 | 2 | Luke 11:20 and Exodus 31:18 (both in the etzba-elohim LangNote gloss attribute) |
| 9 | 1 | Romans 9:17 (the Pauline citation of Exod 9:16, quoted verbatim to mark Hebrew-vs-LXX rendering differences) |
| 10 | 2 | Genesis 1:2 (creation-reversal LangNote); Deuteronomy 6:7 (Shema father-to-son LangNote) |
| **Total** | **7** | Genesis (2), Isaiah (1), Luke (1), Romans (1), Deuteronomy (1), plus one same-book Exodus quote (31:18) |

Additionally, four forward-citation-within-Exodus verbatim quotes (Exod 9:14, 9:16, 31:18, 13:14) were fetch-verified preemptively per §6.0 strict reading, even though the lint's book-level matching treats them as self-quotes. The 31:18 verbatim above is one of these.

## 2. Fetch-verifications performed (verifiedViaFetch:true entry count)

| Chapter | verifiedViaFetch:true entries | What was fetched |
|---|---:|---|
| 5 | 1 | Exod 9:14, 9:16 (forward-citation within Exodus) |
| 6 | 2 | Isa 52:10; Gen 4:26 (the memory-drift caught) |
| 7 | 0 | — (no verbatim cross-refs; chapter relied on structural VerseRef pointers) |
| 8 | 2 | Luke 11:20; Exod 31:18 (both in LangNote gloss attribute, fetched per discipline even though lint skips attrs) |
| 9 | 1 | Rom 9:17 |
| 10 | 2 | Gen 1:2; Deut 6:7 |
| **Total** | **8** | Across the six new chapters, 8 distinct fetch-verifications recorded in verificationLog with `verifiedViaFetch: true` and full `quoteText`. |

## 3. Cross-references DOWNGRADED from verbatim to paraphrase

(Cases where I originally intended a verbatim quotation but chose paraphrase instead. Per §6.0: paraphrase is the preferred default.)

| Chapter | Originally planned verbatim | Cross-ref | Paraphrase used instead | Reason |
|---|---|---|---|---|
| 9 | "even for this same purpose..." | Romans 9:17 (in highlight summary) | "the plagues narrative's longest declaration of divine purpose (Exod 9:16, which Paul quotes at Rom 9:17)" | highlightSummary's 600-character schema limit forced compression; verbatim relocated to the body LangNotes section. |
| 10 | "And it shall be when thy son asketh thee..." (Exod 13:14) | Exodus 13:14 — forward citation within Exodus | "(the son's question and the by-strength-of-hand answer)" | After the lint rule fired a structural-citation false-positive (the Exod 13:14 quote was attributed to the next-following deuteronomy VerseRef), I had to choose between adding an in-line exodus VerseRef immediately after the quote (which would have made the prose clumsy with two redundant references) or restructuring. Restructuring was cleaner. Note: I fetch-verified Exod 13:14 anyway to confirm no memory drift before dropping the verbatim. |
| 5, 7, 8, 9, 10 (various) | Rev 16 parallel-plague allusions | Revelation 16:2, 16:3-4, 16:10, 16:13-14, 16:21 (plague-bowls parallels) | Paraphrased descriptions only ("the apocalyptic locust-imagery of Rev 9:1-11"; etc.) | Rev 16's plague-bowls echo Exod 7-10 plagues structurally and would have been a natural cross-reference for each chapter. I chose paraphrase / structural-VerseRef-only across the batch because (a) paraphrase serves the same expository purpose; (b) each verbatim Rev 16 quote would have required a fetch and a verificationLog entry; (c) the §6.0 default of paraphrase is honored by holding back the verbatims unless they earn their place. The Rev 16 / Joel typology gets a single LangNote treatment in Exod 10 without verbatims. |

## 4. lint:quotation-fidelity rule FIRINGS during drafting

(Each time the rule produced an ERROR during a `npm run lint:content` while drafting, what triggered it, and what the resolution was.)

| Chapter | Trigger (quote + cross-ref book) | Resolution | Resolution mode |
|---|---|---|---|
| 6 | `"began to call upon the name of the LORD"` (9w) near `<VerseRef book="genesis" chapter={4} verse={26} />` in LangNotes "El Shaddai and the YHWH crux" block | Fetched Gen 4:26 KJV; **discovered drift** (see §5); rewrote with explicit ellipsis to reflect partial citation: `"began ... to call upon the name of the LORD"`; added verifiedViaFetch:true entry with full quoteText | **fetched-and-added** (with prose correction) |
| 10 | `"And it shall be when thy son asketh thee in time to come, saying, What is this?"` (17w) — quote is actually Exod 13:14 (own book); the structural-citation algorithm attributed the cross-ref to the nearest following VerseRef, which was a Deut 6:7 reference 50-60 chars further on | False positive caused by the rule's structural-matching design. Resolution: restructured the prose — dropped the verbatim Exod 13:14 quote (paraphrased instead), extended the Deut 6:7 partial-citation into a longer verbatim from the same verse so the deuteronomy VerseRef would be a true structural owner of that longer quote rather than a false-positive owner of the Exod quote. Added verifiedViaFetch:true entries for **both** Gen 1:2 (in the same chapter's other LangNote — caught by §6.0 discipline even though lint did not fire on it; see §5) and Deut 6:7 with full quoteText. | **fetched-and-restructured** (false-positive cleared + true cross-ref verifications added) |

**Total firings: 2 over the six-chapter batch.** One true positive (Gen 4:26 memory drift); one false positive (structural-citation algorithm attributing a same-book quote to a nearby cross-book VerseRef).

## 5. Memory-drifts caught by the guard (MOST IMPORTANT)

(Cases where the fetched source revealed that the verbatim wording I would have drafted from memory was different from the actual KJV/source — the failure mode the guard exists to catch.)

| Chapter | Cross-ref | What I would have written from memory | What the fetch showed | Source URL |
|---|---|---|---|---|
| 6 | Genesis 4:26 | `"began to call upon the name of the LORD"` (9 words) — written from memory and quoted in prose as the men-of-Enos-day verse | KJV Gen 4:26: `"then began men to call upon the name of the LORD"` (10 words) — my draft had dropped the words **then** and **men** (the grammatical subject of the verb "began"). Without "men," the verbal subject in my prose silently absorbed into "the men of Enos's day" from the surrounding paraphrase — a perfectly readable but inaccurate quotation. | https://www.biblegateway.com/passage/?search=Genesis+4%3A26&version=KJV |

**Significance:** this is exactly the failure mode PRs #13 and #14 documented across 11 cases — a familiar verse quoted from memory with a small omission that reads fluently and would have shipped silently before §6.0. The guard caught it on the second chapter under enforced discipline, on the first quoted cross-reference of that chapter's LangNotes block.

**Other fetch-verifications that revealed NO drift** (honest negative findings — the verbatim cross-ref quote was already accurate, and the fetch confirmed rather than corrected):

| Chapter | Cross-ref | Quote (verified accurate against KJV) | Source URL |
|---|---|---|---|
| 5 | Exodus 9:14, 9:16 (forward-citation within own book) | `"that thou mayest know that there is none like me in all the earth"` and `"in very deed for this cause have I raised thee up, for to shew in thee my power; and that my name may be declared throughout all the earth"` — both quoted in the LangNotes block on Pharaoh's "I know not the LORD" pivot. Fetched preemptively because forward-citations within the same book are not strictly "chapter self-quotes" under §6.0 even though the lint's book-level matching exempts them. KJV match exact. | https://www.biblegateway.com/passage/?search=Exodus+9%3A14%2C16&version=KJV |
| 6 | Isaiah 52:10 | `"the LORD hath made bare his holy arm in the eyes of all the nations"` — quoted in body for the stretched-out-arm motif. KJV match exact. | https://www.biblegateway.com/passage/?search=Isaiah+52%3A10&version=KJV |
| 8 | Luke 11:20 | `"But if I with the finger of God cast out devils, no doubt the kingdom of God is come upon you"` — quoted in a LangNote gloss attribute (lint rule skips attribute values; fetched anyway per §6.0 discipline). KJV match exact. | https://www.biblegateway.com/passage/?search=Luke+11%3A20&version=KJV |
| 8 | Exodus 31:18 | `"tables of stone, written with the finger of God"` — partial-citation substring in LangNote gloss attribute. KJV match exact. | https://www.biblegateway.com/passage/?search=Exodus+31%3A18&version=KJV |
| 9 | Romans 9:17 | `"For the scripture saith unto Pharaoh, Even for this same purpose have I raised thee up, that I might shew my power in thee, and that my name might be declared throughout all the earth"` — quoted in body verbatim to mark Pauline-vs-Hebrew rendering differences from Exod 9:16. KJV match exact. | https://www.biblegateway.com/passage/?search=Romans+9%3A17&version=KJV |
| 10 | Genesis 1:2 | `"And the earth was without form, and void; and darkness was upon the face of the deep"` — partial-citation in LangNotes (creation-reversal pattern). Structural-citation algorithm did NOT fire on this one because the Gen 1:2 VerseRef sits BEFORE the quote (not within 60 chars after the close) — a noted false-negative of the lint rule. KJV match exact (verified per §6.0 discipline despite lint not requiring it). | https://www.biblegateway.com/passage/?search=Genesis+1%3A2&version=KJV |
| 10 | Deuteronomy 6:7 | `"thou shalt teach them diligently unto thy children, and shalt talk of them when thou sittest in thine house, and when thou walkest by the way"` — extended quote in LangNotes. KJV match exact. | https://www.biblegateway.com/passage/?search=Deuteronomy+6%3A7&version=KJV |
| 10 | Exodus 13:14 (forward-citation within own book) | `"And it shall be when thy son asketh thee in time to come, saying, What is this?"` — fetched after the lint false-positive on this quote prompted re-examination. KJV match exact. After verification, this verbatim was REMOVED from the prose (paraphrased instead) to clear the structural-citation false-positive on the lint rule; the verifiedViaFetch:true entry was therefore NOT added (no remaining verbatim citation in the chapter). | https://www.biblegateway.com/passage/?search=Exodus+13%3A14&version=KJV |

**Summary:** 8 cross-reference fetch-verifications performed across the six chapters; 1 memory drift caught and corrected (12.5% of the population); 7 fetches confirmed already-correct verbatims.

## Honest assessment

**Did the guard fire?** Yes — twice. Once on a true positive (Gen 4:26 memory drift in Exod 6) and once on a false positive (Exod 13:14 quote whose nearest following VerseRef happened to be a Deut 6:7 reference). Both firings produced productive resolutions: the true positive corrected a real drift; the false positive prompted re-examination that surfaced a SECOND fetch-verification target (Deut 6:7) which I had been about to leave as a memory-quote in the same LangNote.

**Did the guard catch memory drift that would have shipped silently?** Yes — once. Gen 4:26's `"began to call upon the name of the LORD"` would have shipped at 9 words while the verse is `"then began men to call upon the name of the LORD"` (10 words). The dropped words ("then" and "men") were grammatically the subject of "began" — a small, fluent, characteristic memory-omission. This is identical in shape to the 11 errors PRs #13 and #14 corrected by hand. **The guard works in live drafting on the first chapter where it had something to catch.**

**Drift-rate observed:** 1 of 8 fetch-verified cross-references (12.5%). The sample is small and the chapter genre is narrative-heavy (cross-references mostly thematic rather than load-bearing), but the rate is in the same order of magnitude as the 11/~50 (~22%) rate the integrity sweeps found. The discipline is justified.

**Is the cross-reference workflow sustainable?** Yes, with one important honest observation. The fetch-then-quote workflow added roughly 1 minute per cross-reference fetch (one WebFetch call per verse, sometimes one combined fetch for two verses). For chapters with 0-2 cross-reference verbatims (which appears to be the comfortable load for this kind of narrative-summary content), the overhead is 0-2 minutes per chapter — entirely sustainable.

**Does the discipline create friction that pushes toward paraphrase-over-quote even where verbatim would serve better?** **Yes, mildly — and I think this is the discipline working as designed.** The 600-character highlightSummary limit forced one paraphrase (the Rom 9:17 reference in Exod 9). The lint false-positive on Exod 10 prompted another (the Exod 13:14 dropped verbatim, replaced by a longer Deut 6:7 verbatim). And across the batch I chose paraphrase over verbatim for several Rev 16 plague-bowls parallels that could have been quoted but did not load-bearingly add to the chapter's argument. **This is the §6.0 default operating correctly.** Per §6.0: paraphrase is the preferred default; verbatim is for cases where exact wording carries the argument. The discipline made me decide for each quotation whether the verbatim was actually doing work that paraphrase couldn't do. In the cases where verbatim earned its place (the seven that survived to commit), the surviving verbatims are sharper and more deliberate than they would have been without the discipline.

**Two design observations on the lint rule itself** (for follow-up consideration):

1. **The rule's structural-citation algorithm produces false positives when a verbatim same-book quote is followed within 60 chars by a cross-book VerseRef.** The Exod 10 false-positive (Exod 13:14 attributed to deuteronomy) is the example. The rule is conservative by design (false positives are acceptable, false negatives are not), and the workaround is straightforward (restructure the prose to put a same-book VerseRef immediately after the quote, OR drop the verbatim, OR add the cross-book VerseRef as the structural owner with its own fetched quoteText). The behavior is not a bug, but a follow-up consideration would be whether a same-book VerseRef anywhere in the surrounding paragraph could be allowed to "claim" the quote as a self-quote before the next cross-book reference is considered.

2. **The rule's structural-citation algorithm produces false negatives when a verbatim cross-book quote is preceded (rather than followed) by its VerseRef.** The Exod 10 Gen 1:2 quote is the example: VerseRef sits before the quote, so the algorithm finds no VerseRef "within 60 chars after the close" and treats the quote as un-owned. §6.0 discipline caught what the lint did not (I fetched anyway). A follow-up enhancement could symmetrize the algorithm to look both before-and-after, with a smaller window before.

Neither observation undermines the rule's value. The discipline (fetch every cross-ref verbatim >6w) is correctly load-bearing; the lint is one mechanical aid; the human discipline is the other. **The session demonstrates that the two together produce reliably accurate cross-reference verbatims.**

---

*This file is mandatory output of Session 08. The session is valuable beyond the chapters themselves because this file reports honest data: one true-positive memory-drift catch in the first chapter where the population gave the rule something to catch; one false-positive that surfaced a true-positive on the next quote in the same LangNote; seven negative findings that confirm the §6.0 default of paraphrase-or-fetch-then-quote is being honored. The cross-reference workflow is sustainable; the discipline justifies its overhead.*
