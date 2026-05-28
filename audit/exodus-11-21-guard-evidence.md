# Session 09 — Guard Evidence: Exodus 11-21 under v2 fetch-and-diff discipline

Companion document. Captures how the `lint:quotation-fidelity` v2 rule (PR #19 — symmetric proximity + same-book disambiguation) behaves during live drafting of the final-plague / Passover / Sinai / Decalogue / Book-of-the-Covenant arc.

This batch includes TWO extra-care chapters: Exodus 12 (Passover) and Exodus 20 (Decalogue). Both involve dense cross-reference networks (Exod 12 → 1 Cor 5:7, John 1:29, John 19:36, 1 Pet 1:18-19, Luke 22, 3 Nephi 18; Exod 20 → Matt 22, Mosiah 12-13, D&C 42, Rom 13, Jas 2, Heb 12). High fetch-verification rate expected.

This batch is also drafted off `feat/lint-quotation-fidelity-v2` (PR #19) rather than `dev` directly, because PR #19 had not merged into dev by session start (Keith directed branching off the v2 PR so the session operates under v2). The v2 rule is active throughout.

## 1. Cross-reference verbatim quotes drafted (count by chapter)

| Chapter | Cross-ref verbatim quotes >6w | Books cited verbatim |
|---|---:|---|
| 11 | 1 | Genesis (Gen 15:13-14) |
| 12 ⭐ | _filled in during drafting_ | |
| 13 | _filled in during drafting_ | |
| 14 | _filled in during drafting_ | |
| 15 | _filled in during drafting_ | |
| 16 | _filled in during drafting_ | |
| 17 | _filled in during drafting_ | |
| 18 | _filled in during drafting_ | |
| 19 | _filled in during drafting_ | |
| 20 ⭐ | _filled in during drafting_ | |
| 21 | _filled in during drafting_ | |

## 2. Fetch-verifications performed (verifiedViaFetch:true entry count)

| Chapter | verifiedViaFetch:true entries | What was fetched |
|---|---:|---|
| 11 | 1 | Gen 15:13-14 |
| _filled in during drafting_ | | |

## 3. Cross-references DOWNGRADED from verbatim to paraphrase

| Chapter | Originally planned verbatim | Cross-ref | Paraphrase used instead | Reason |
|---|---|---|---|---|
| _filled in during drafting_ | | | | |

## 4. lint:quotation-fidelity rule FIRINGS during drafting

| Chapter | Trigger (quote + cross-ref book) | Resolution | Resolution mode |
|---|---|---|---|
| 11 | `"thy seed shall be a stranger in a land that is not theirs... and afterward shall they come out with great substance"` (22w) near `<VerseRef book="genesis" chapter={15} verse="13-14" />` | Fetched Gen 15:13-14 KJV; exact substring match confirmed; verifiedViaFetch:true entry added with full quoteText. | **fetched-and-added** (verified correct, no drift) |

## 5. Memory-drifts caught by the guard

| Chapter | Cross-ref | What I would have written from memory | What the fetch showed | Source URL |
|---|---|---|---|---|
| _none so far_ | | | | |

## v2-specific notes (PR #19 behavior in live drafting)

| Chapter | v2-specific behavior observed | What would have happened under v1 |
|---|---|---|
| _none so far_ | | |

## Honest assessment (filled in at session end)

_filled in after all eleven chapters draft cleanly._

---

*This file is committed alongside the chapters; the chapter drafts are committed individually as each chapter completes lint clean.*
