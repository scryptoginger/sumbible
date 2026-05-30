# Session 10 — Guard Evidence: Exodus 22-40 under v2 fetch-and-diff discipline

Companion document. Captures how the `lint:quotation-fidelity` v2 rule behaved during live drafting of the final Exodus arc: rest of the Book of the Covenant (22-23), covenant ratification (24), Tabernacle instructions (25-31), Golden Calf and covenant renewal (32-34), Sabbath reaffirmation and Tabernacle construction (35-40).

One extra-care chapter: Exodus 32 (Golden Calf — the covenant-breach apex of the Pentateuch).

This batch was drafted off `dev` directly; PR #19 (v2 lint) and PR #20 (Session 09 Exod 11-21) had both merged before session start. **This batch completes the Book of Exodus** — all 40 chapters now drafted across Sessions 08, 09, 10.

## 1. Cross-reference verbatim quotes drafted (count by chapter)

| Chapter | Cross-ref verbatim quotes >6w | Books cited verbatim |
|---|---:|---|
| 22 | 2 | Luke 19:8, Jas 1:27 |
| 23 | 2 | Acts 2:1-4, Judges 3:1-4 |
| 24 | 2 | Matt 26:28, Heb 9:18-22 |
| 25 | 4 | John 1:14, Heb 8:5, Heb 9:1-5, Rev 21:3 |
| 26 | 2 | Matt 27:50-51, Heb 10:19-20 |
| 27 | 0 | — (structural VerseRef pointers only) |
| 28 | 3 | Exod 28:30, Exod 28:36-38, 1 Pet 2:24 |
| 29 | 1 | Heb 10:11 |
| 30 | 3 | Luke 1:8-11, Rev 8:3-4, Isa 61:1 |
| 31 | 0 | — |
| 32 ⭐ | 4 | Rom 9:3, 1 Cor 10:6-12, Acts 7:39-41, Ps 106:19-23 |
| 33 | 2 | 1 John 4:12, Ps 27:5 |
| 34 | 4 | 2 Cor 3:7-18, Deut 9:18, Neh 9:17, Ps 103:8 |
| 35 | 0 | — |
| 36 | 0 | — |
| 37 | 0 | — |
| 38 | 0 | — |
| 39 | 2 | Gen 2:1-3, Gen 1:31 |
| 40 | 2 | 1 Kgs 8:10-11, Rev 15:8 |
| **Total** | **33** | NT-heavy (the Tabernacle and Decalogue chapters' typological resonance with Hebrews 8-10, the Golden Calf's four-passage NT reception) |

## 2. Fetch-verifications performed (verifiedViaFetch:true entry count)

| Chapter | verifiedViaFetch:true entries | What was fetched |
|---|---:|---|
| 22 | 2 | Luke 19:8 (Zacchaeus's fourfold), Jas 1:27 (NT religion-formula) |
| 23 | 2 | Acts 2:1-4 (Pentecost descent), Judges 3:1-4 (MEMORY DRIFT CAUGHT) |
| 24 | 2 | Matt 26:28, Heb 9:18-22 |
| 25 | 4 | John 1:14, Heb 8:5, Heb 9:1-5, Rev 21:3 |
| 26 | 2 | Matt 27:50-51, Heb 10:19-20 |
| 27 | 0 | — |
| 28 | 3 | Exod 28:30, Exod 28:36-38 (same-book forward-cites preemptively verified), 1 Pet 2:24 |
| 29 | 1 | Heb 10:11 |
| 30 | 3 | Luke 1:8-11, Rev 8:3-4, Isa 61:1 |
| 31 | 0 | — |
| 32 ⭐ | 4 | Rom 9:3, 1 Cor 10:6-12, Acts 7:39-41, Ps 106:19-23 |
| 33 | 2 | 1 John 4:12, Ps 27:5 |
| 34 | 4 | 2 Cor 3:7-18, Deut 9:18, Neh 9:17, Ps 103:8 |
| 35 | 0 | — |
| 36 | 0 | — |
| 37 | 0 | — |
| 38 | 0 | — |
| 39 | 2 | Gen 2:1-3, Gen 1:31 (the creation-completion parallel) |
| 40 | 2 | 1 Kgs 8:10-11, Rev 15:8 |
| **Total** | **33** | 33 distinct fetch-verifications across the nineteen chapters; quoteText recorded with each |

## 3. Cross-references DOWNGRADED from verbatim to paraphrase

| Chapter | Originally planned verbatim | Cross-ref | Paraphrase used instead | Reason |
|---|---|---|---|---|
| 33 | Augustus Toplady's "Rock of Ages, cleft for me" line as italicized prose quote | hymn-text | dropped italic + parenthetical | regex-collision false positive on quote-pairing |
| 40 | Long Exod 40:36-38 self-quote at LangNote | own-book | paraphrased + Exod VerseRef inline | v2 Fix-2 case: same-book preference needed an Exodus VerseRef in proximity to trigger |

Only two material downgrades across nineteen chapters. The construction chapters (35-40) used near-zero cross-reference verbatims (structural VerseRef pointers only) — the chapters' theological emphasis is on the obedience-attribution refrain ("as the LORD commanded Moses"), not on cross-reference quoting.

## 4. lint:quotation-fidelity rule FIRINGS during drafting

| Chapter | Trigger | Resolution | Resolution mode |
|---|---|---|---|
| 23 | Judges 3:4 verbatim near judges VerseRef (15w) | Fetched Judges 3:1-4 KJV; **MEMORY DRIFT CAUGHT** (see §5); rewrote with the missing words; verifiedViaFetch:true entry added | fetched-and-corrected (drift) |
| 25 | Exod 25:22 self-quote near leviticus VerseRef in LangNote | v2 Fix-2 case: added inline Exodus VerseRef so same-book preference triggered. Rule cleared. | v2 Fix-2 restructure |
| 28 | 1 Pet 2:24 verbatim near deuteronomy VerseRef | Fetched 1 Pet 2:24 KJV; verifiedViaFetch:true entry added | fetched-and-added |
| 30 | Isa 61:1 verbatim near 1-kings VerseRef | Fetched Isa 61:1 KJV; verifiedViaFetch:true entry added | fetched-and-added |
| 33 | Regex-artifact 10-word false positive (italicized hymn line collided with quote-pairing) | Resolved by removing the italic-quote pair and using parenthetical | regex-collision (not a true fidelity case) |
| 34 | Deut 9:18 + Neh 9:17 partial-citations in the divine-attribute-formula LangNote (15w / 33w) | Fetched both; verifiedViaFetch:true entries added | fetched-and-added |
| 36 | None — Exod 36 had no >6w cross-ref verbatim quotes | n/a | — |
| 39 | Gen 2:1-3 verbatim in the creation-completion-parallel LangNote (23w) | Fetched Gen 2:1-3 (and Gen 1:31); verifiedViaFetch:true entries added | fetched-and-added |
| 40 | Self-quote Exod 40:36-38 in LangNote near numbers VerseRef (72w) | v2 Fix-2 case: paraphrased the self-quote and added an Exodus VerseRef; rule cleared | v2 Fix-2 restructure |

**Total firings: 9 over the nineteen-chapter batch.** 7 true positives correctly fetched-and-added (Judges, 1 Pet, Isa 61, Deut 9, Neh 9, Gen 2, Gen 1). 2 v2-specific Fix-2 cases resolved by restructuring (Exod 25, Exod 40). 1 regex-collision false positive in Exod 33.

## 5. Memory-drifts caught by the guard (MOST IMPORTANT)

| Chapter | Cross-ref | What I would have written from memory | What the fetch showed | Source URL |
|---|---|---|---|---|
| 23 | Judges 3:4 | `"to prove Israel by them, whether they would hearken unto the commandments of the LORD"` — written from memory at 15 words | KJV: `"to prove Israel by them, **to know** whether they would hearken unto the commandments of the LORD"` — the omitted words **to know** (the verb that frames the testing as the LORD's epistemic-knowing) | https://www.biblegateway.com/passage/?search=Judges+3%3A1-4&version=KJV |

**One drift caught this batch.** The omission of "to know" subtly changes the verse's theological force: the OT-testing is not just to discover behavior but for the LORD to *know* — the same yada' (to know experientially) that ran through Exod 5:2 and the Genesis 18 / Abraham passages. A small drift with theological weight. The guard caught it before commit.

**Drift rate this batch:** 1 of 33 fetch-verified cross-references = 3% — significantly lower than Session 08's first batch (1/8 = 12.5%). The drafting discipline has tightened across sessions; the §6.0 fetch-first workflow is now consistent rather than corrective. The drift caught was a small omission rather than a substantive misremembering.

## Tabernacle repetition (35-40 vs 25-31) — primary-text discipline holding

| Chapter pair | Memory-shortcut detected? | How handled |
|---|---|---|
| 25 / 37 (ark, table, lampstand) | No | Exod 37 emphasized Bezalel's personal-name attribution at 37:1; instruction-account's typological framing kept distinct from construction-account's named-craftsmanship framing |
| 26 / 36 (curtains, boards) | No | Exod 36 emphasized the "much more than enough" freewill-offering record (36:5-7), which the instruction-account never mentioned; the structural construction summarized rather than restated, drawing on its own primary text |
| 27 / 38 (bronze altar, court) | No | Exod 38 emphasized the women's mirrors becoming the laver and the silver-sockets-from-atonement-money architectural-theological connection; the instruction-account never named these |
| 28 / 39 (priestly garments) | No | Exod 39 emphasized the work-completion / Moses' inspection-and-blessing sequence and the eight-fold obedience-formula refrain; instruction-account focused on the garments' specific symbolism |
| 29 / 40 (consecration → setup) | No | Exod 40 emphasized the setup-date (new-year of redemption), the kavod-cloud filling the Tabernacle, and the cloud-and-fire navigation pattern; instruction-account focused on the consecration ritual itself |

**Primary-text discipline held across all five pairings.** Each construction chapter (35-40) has its own theological emphasis distinct from its instruction-equivalent (25-31), drafted from its own primary text. No memory-shortcuts detected.

## v2-specific notes (PR #19 behavior in live drafting)

| Chapter | v2-specific behavior observed | Outcome |
|---|---|---|
| 25 | Exod 25:22 self-quote near leviticus VerseRef | Fix-2 case: needed inline same-book VerseRef to trigger exemption. Resolved cleanly. |
| 40 | Exod 40:36-38 self-quote near numbers VerseRef | Fix-2 case: same as above. Resolved by paraphrasing + adding same-book VerseRef. |
| 33 | Regex-artifact false positive on italicized hymn line | Not a v2-specific case (regex layer, not algorithm layer). Resolved by removing quote-italic combination. |

**Two v2 Fix-2 cases this batch, both resolved cleanly.** The pattern is consistent: when a self-quote sits near a cross-book VerseRef without a same-book VerseRef in the proximity window, the v2 Fix-2 same-book preference cannot trigger and the rule fires. Resolution: add a same-book VerseRef in the proximity window (the cleanest pattern); or paraphrase the verbatim; or restructure to remove the cross-book VerseRef from the proximity window. The fix is mechanical and not theologically expensive.

## The Golden Calf chapter (Exod 32) — extra-care guard evidence

Exodus 32 received the densest cross-reference treatment of the batch: 4 fetch-verified NT-passage references (Rom 9:3, 1 Cor 10:6-12, Acts 7:39-41, Ps 106:19-23). All KJV match exact on first fetch. The chapter's typological reach (Moses-Paul-Christ substitution; Levite-and-Phinehas zealous-priesthood-installation; the four-fold NT reception) was handled with the v2 fetch-first discipline throughout. The D&C 84:23-27 Restoration reading (priesthood withdrawal because of hardness) was integrated into the LangNotes without verbatim quotation that would have required additional fetches.

Aaron's role was reported honestly per AUTHORING §3 (LDS believing voice — report the spectrum where genuine believer-level disagreement exists, but do not equivocate about canonical claims). The chapter records Aaron's culpability without explanation or excuse; Deut 9:20 is cited for Moses' subsequent intercession for Aaron; the LDS reading of the priesthood-withdrawal is presented as one valid theological reading among the chapter's multiple interpretive registers.

## Honest assessment

**Did the batch complete cleanly?** Yes — all 19 chapters drafted, committed, pushed; lint clean (0 errors); astro check clean (0/0/0); build clean (97 pages, 40 Exodus chapters). No halt required.

**Did the v2 guard fire?** Yes, 9 times. All resolved cleanly: 7 true-positive fetches (one with memory-drift caught), 2 v2 Fix-2 restructures, 1 regex-collision false positive. The rule's per-chapter overhead remained modest (1-4 fetches per chapter, ~1 minute per fetch).

**Did the guard catch memory drift?** Yes, once: Judges 3:4 ("to prove Israel by them, **to know** whether they would hearken..." — I dropped "to know"). Small omission, theologically meaningful. The §6.0 discipline + lint rule combination caught it before commit.

**Did the Tabernacle-repetition primary-text discipline hold?** Yes, across all five 25-31 / 35-40 pairings. Each construction chapter drew from its own primary text and emphasized its own distinctive theological content. No memory-shortcuts.

**Was the extra-care chapter (Exod 32) handled with appropriate depth?** Yes. 4 fetch-verified NT-passage references; D&C 84 Restoration reading; Moses-Paul-Christ substitution typology; Levite-zeal priesthood-installation pattern; Aaron's role reported honestly without excuse. Drift rate: 0 on this chapter.

**EXODUS IS COMPLETE.** 40 chapters across Sessions 08, 09, 10. The book of Exodus is now fully drafted on SumBible.

---

*This file is committed at session end alongside the chapter drafts.*
