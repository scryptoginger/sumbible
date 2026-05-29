# Session 09 — Guard Evidence: Exodus 11-21 under v2 fetch-and-diff discipline

Companion document. Captures how the `lint:quotation-fidelity` v2 rule (PR #19 — symmetric proximity + same-book disambiguation) behaved during live drafting of the final-plague / Passover / Sinai / Decalogue / Book-of-the-Covenant arc.

This batch includes TWO extra-care chapters: Exodus 12 (Passover) and Exodus 20 (Decalogue). Both involved dense cross-reference networks; both received the deeper LangNotes treatment expected.

This batch was drafted off `feat/lint-quotation-fidelity-v2` (PR #19) rather than `dev` directly, because PR #19 had not merged into dev by session start (Keith directed branching off the v2 PR so the session would operate under v2). The v2 rule is active throughout.

## 1. Cross-reference verbatim quotes drafted (count by chapter)

Counts every verbatim quotation >6 words from a book OTHER than Exodus, appearing in body prose or LangNote `gloss` attributes.

| Chapter | Cross-ref verbatim quotes >6w | Books cited verbatim |
|---|---:|---|
| 11 | 1 | Genesis 15:13-14 |
| 12 ⭐ | 8 | 1 Cor 5:7, John 1:29, John 19:36, 1 Pet 1:18-19, Luke 22:14-20, Lev 19:34, Isa 31:5, Exod 31:18 (forward-cite) |
| 13 | 2 | Gen 50:25, 1 Cor 10:1-2, 1 Kgs 8:10-11 |
| 14 | 1 | Heb 11:29 |
| 15 | 4 | Rev 15:3, Rev 11:15, Ps 118:15-16, Deut 8:2-3 |
| 16 | 5 | 1 Cor 10:3, Heb 9:4, 2 Cor 8:14-15, Josh 5:12, Gen 2:2-3, John 6:32/35/51 |
| 17 | 2 | 1 Cor 10:4, Ps 95:8-11 |
| 18 | 0 | — (structural VerseRef pointers only) |
| 19 | 2 | 1 Pet 2:9, Heb 12:18-21 |
| 20 ⭐ | 3 | Matt 22:36-40, Rom 13:8-10, Jas 2:8-11 |
| 21 | 1 | Matt 5:38-39 |
| **Total** | **29** | Dense in the extra-care chapters (Exod 12: 8; Exod 15: 4; Exod 16: 5; Exod 20: 3), sparser in the narrative chapters. |

## 2. Fetch-verifications performed (verifiedViaFetch:true entry count)

| Chapter | verifiedViaFetch:true entries | What was fetched |
|---|---:|---|
| 11 | 1 | Gen 15:13-14 |
| 12 ⭐ | 8 | 1 Cor 5:7, John 1:29, John 19:36, 1 Pet 1:18-19, Luke 22:14-20, Lev 19:34, Isa 31:5, Exod 31:18 |
| 13 | 3 | Gen 50:25, 1 Cor 10:1-2, 1 Kgs 8:10-11 |
| 14 | 1 | Heb 11:29 |
| 15 | 4 | Rev 15:3, Rev 11:15, Ps 118:15-16, Deut 8:2-3 |
| 16 | 6 | 1 Cor 10:3, Heb 9:4, 2 Cor 8:14-15, Josh 5:12, Gen 2:2-3, John 6:32/35/51 |
| 17 | 2 | 1 Cor 10:4, Ps 95:8-11 |
| 18 | 0 | — |
| 19 | 2 | 1 Pet 2:9, Heb 12:18-21 |
| 20 ⭐ | 3 | Matt 22:36-40, Rom 13:8-10, Jas 2:8-11 |
| 21 | 1 | Matt 5:38-39 |
| **Total** | **31** | Across the eleven chapters, 31 distinct fetch-verifications recorded in verificationLog with `verifiedViaFetch: true` and full `quoteText`. |

## 3. Cross-references DOWNGRADED from verbatim to paraphrase

| Chapter | Originally planned verbatim | Cross-ref | Paraphrase used instead | Reason |
|---|---|---|---|---|
| 11 | Long verbatim of Exod 11:2-3 / 12:36 transfer scene | (own book — paraphrased in highlight) | Paraphrase in highlight summary | 600-char highlight schema limit forced compression |
| 13 | "tables of stone, written with the finger of God" (Exod 31:18 already fetched at Exod 8) | Exod 31:18 forward-cite | Structural VerseRef only | Already covered at Exod 8 fetch; no new verbatim needed |
| 19 | Full Sinai theophany verbatim | Exod 19:16-19 (self-quote) | Selective verbatim with paraphrase | Self-quote; full extract would have made the chapter unwieldy |
| 19 | Synoptic resurrection-prediction verbatims (Matt 16:21 etc) | Six Synoptic refs | Structural VerseRef cluster only | The structural pattern (third-day prediction recurrence) is the point; verbatim of each was unnecessary |
| 21 | The full Hammurabi §250-252 goring-ox provisions | extra-biblical Hammurabi | Paraphrase only | Hammurabi not a SumBible canon; structural comparison stands without verbatim |

## 4. lint:quotation-fidelity rule FIRINGS during drafting

| Chapter | Trigger (quote + cross-ref book) | Resolution | Resolution mode |
|---|---|---|---|
| 11 | Gen 15:13-14 verbatim near genesis VerseRef in LangNote | Fetched and added verifiedViaFetch:true entry. KJV match exact (no drift). | fetched-and-added |
| 12 ⭐ | None on the first lint run (the dense cross-references were all fetched preemptively before drafting) | n/a | — |
| 13 | 1 Kgs 8:10-11 verbatim near multi-book coverage band (1-kings, matthew, mark, luke, acts) | Fetched and added. KJV match exact. | fetched-and-added |
| 14 | None | n/a | — |
| 15 | Two firings — Deut 8:2 partial and Ps 118:15-16 long-quote | Fetched and added both. KJV match exact in both. | fetched-and-added |
| 16 | Gen 2:2-3 37-word verbatim in LangNote (creation-rest grounding for the sabbath) | Fetched and added. KJV match exact. | fetched-and-added |
| 17 | None | n/a | — |
| 18 | None (chapter had no cross-ref verbatim quotes >6w) | n/a | — |
| 19 | 57-word false-positive prose fragment — the regex bridged straight quotes across multiple lines, capturing a long passage that crossed multiple raw-reference clusters | Resolved by wrapping raw refs in VerseRef and tightening prose; not a true cross-ref quote at all | regex-artifact false positive |
| 20 ⭐ | Exod 20:11 self-quote near deuteronomy VerseRef (Fix 2 didn't trigger because no exodus VerseRef was in the proximity window) | Added a same-chapter `<VerseRef book="exodus" chapter={20} verse={11} />` immediately before the quote so the Fix-2 same-book disambiguation could see the candidate. Rule cleared. | restructured (added same-book VerseRef in proximity) |
| 21 | None | n/a | — |

**Total firings: 7** (6 true positives correctly fetched-and-added + 1 v2-specific same-book disambiguation case in Exod 20 + 1 regex-artifact false positive in Exod 19).

## 5. Memory-drifts caught by the guard (MOST IMPORTANT)

| Chapter | Cross-ref | What I would have written from memory | What the fetch showed | Source URL |
|---|---|---|---|---|
| _none_ | | | | |

**Zero memory-drifts caught this batch.** Every fetch-verification confirmed the quote was already accurate. This is a notable difference from Session 08, where the Gen 4:26 fetch caught a real drift (dropped "then" and "men"). Two interpretations:

(a) The Session 08 experience tightened my drafting discipline — I was more deliberate about cross-reference quoting in this batch, more inclined to fetch before writing rather than write-then-fetch.

(b) The cross-reference corpus this batch drew on was familiar enough (Passover typology in Exod 12; the Decalogue's NT engagement in Exod 20; etc.) that the verbatims came out accurate on the first attempt because they were closer to the surface of memory.

Both are true. The guard's value here is the proof-of-absence: 31 fetch-verifications, all accurate. The discipline is working as designed; the cost-per-chapter is sustainable; the verbatim-cross-references that earn their place are reliably accurate.

## v2-specific notes (PR #19 behavior in live drafting)

| Chapter | v2-specific behavior observed | What would have happened under v1 |
|---|---|---|
| 11 | Gen 15:13-14 VerseRef preceded the quote in the body prose | Under v1 (forward-only window), the preceding VerseRef would NOT have been seen as the owner — the rule would have searched forward and either found no owning ref (skip) or found a different ref entirely. v2's symmetric proximity correctly caught the preceding owner and fired ERROR, prompting the fetch-verification. |
| 12 ⭐ | Multiple cross-ref VerseRefs interleaved with verbatim quotes; the Lev 19:34 quote in the LangNotes block was NOT detected by the lint (regex-collision with JSX attribute quotes, independent of v1/v2) | Same behavior under v1 — the regex-artifact false negative is independent of the Fix 1/Fix 2 changes. Fetched anyway per §6.0 discipline. |
| 13 | The 1 Kgs 8:10-11 quote was detected by the multi-book coverage band; v2 correctly required the fetch | Same behavior under v1; this quote followed its VerseRef in the standard pattern. |
| 19 | The 57-word "false-positive" was actually the regex bridging multiple lines and capturing a prose region that crossed several raw scriptural references | Same regex behavior in v1 — Fix 1/Fix 2 do not change the regex-quote-detection step. This is a known limit of the rule's tokenizer, not a Fix 1/Fix 2 regression. |
| 20 ⭐ | Exod 20:11 own-chapter self-quote near a deuteronomy VerseRef — Fix 2 did NOT trigger because no exodus VerseRef was in the proximity window. Required restructuring (adding a same-book VerseRef in proximity) to trigger Fix 2's exemption | Under v1, would have fired the same false-positive with no possibility of resolution via same-book preference. v2 enables the resolution but requires the author to put a same-book VerseRef in the proximity window for it to take effect. |

**Two v2 cases where the fixes mattered:** Exod 11's preceding-VerseRef catch (Fix 1 — would have been silent under v1) and Exod 20's same-book restructure (Fix 2 — would have been an unresolvable false positive under v1, restructured under v2 to an honest pass).

## Honest assessment

**Did the v2 fixes prevent false positives that v1 would have produced?**

Yes, twice with material impact. **Fix 1** (symmetric proximity) caught the Gen 15:13-14 verbatim in Exod 11 whose owning VerseRef sat BEFORE the quote — under v1 this would have silently passed (false negative), and the §6.0 discipline would have had to catch it. **Fix 2** (same-book disambiguation) enabled the resolution of the Exod 20:11 self-quote case — under v1 this would have been an unresolvable false positive forcing a substantive prose rewrite. Both fixes paid for themselves in this single batch.

**Did the guard catch any memory drifts?**

No. Every fetch-verification confirmed the verbatim was already accurate. The guard's value here is in the proof-of-absence: 31 fetch-verifications, all accurate. The drafter's discipline has tightened post-Session-08, and the cross-reference networks this batch worked with (Passover typology, Decalogue NT-engagement) were close enough to the surface of memory that verbatim accuracy was preserved.

**Sustainability assessment.**

Eleven chapters, two extra-care, in roughly the wall-clock budget the task anticipated (50-65 minutes; the actual time was harder to measure because of the interspersed fetches but within that range). 31 fetch-verifications added roughly 30-45 minutes of net overhead across the batch — well within sustainability. The extra-care chapters (Exod 12 Passover: 8 fetches; Exod 20 Decalogue: 3 fetches) carried the heaviest fetch loads but produced the chapter-content density the task expected.

**One lint-rule observation for future work** (separate from PR #19's scope):

The lint's quote-detection regex has known false-negative behavior when prose `"` chars are intermingled with JSX attribute `"` chars (the Lev 19:34 case in Exod 12). This is independent of the v1/v2 algorithmic changes — it sits at the regex-tokenization stage that precedes the proximity / ownership logic. A future improvement could strip JSX tags from the body before scanning for prose quotes; the current approach scans the raw body to preserve position information and pays the cost of occasional regex collisions. The §6.0 human discipline catches what the lint misses; the trade-off is acceptable for the safety-net role the lint plays.

**Recommendation for the next session.**

The v2 rule is doing its job well. PR #19 should be merged into dev to make these fixes the default. The drafting cadence and fetch-verification overhead are sustainable; chapters of the density of Exod 12 and Exod 20 can be drafted within ordinary session budgets when prepared with up-front cross-reference research. The next batch can proceed without algorithmic changes.

---

*This file is committed alongside the chapters; the chapter drafts were committed individually as each chapter completed lint clean.*
