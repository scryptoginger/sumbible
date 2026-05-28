# Session 08 — Guard Evidence: Exodus 5-10 under fetch-and-diff discipline

Purpose: capture how the `lint:quotation-fidelity` rule (shipped in PR #17) behaves during live chapter drafting. This file is the first such evidence record; it is committed alongside the chapters.

## 1. Cross-reference verbatim quotes drafted (count by chapter)

Counts every verbatim quotation >6 words from a book OTHER than Exodus in the body prose (including LangNote `gloss` attributes).

| Chapter | Cross-ref verbatim quotes >6w | Books cited |
|---|---:|---|
| 5 | 0 | — (paraphrase used for Paul's "let my people go" allusions; no >6w verbatim cross-refs) |
| 6 | 0 | — (genealogy cross-refs are structural via VerseRef; no verbatim quotes) |
| 7 | 0 | — (rod-to-serpent / Nile-blood self-quoted from Exodus; Rev 16 plague-bowl reference paraphrased) |
| 8 | 0 | — (Rev 16:13-14 "spirits like frogs" allusion paraphrased; Ps 78 / Ps 105 plague-retellings paraphrased) |
| 9 | 0 | — (Rom 9:17 Pharaoh-citation paraphrased; Rev 16:2 boil-plague allusion paraphrased) |
| 10 | 0 | — (Joel 1-2 locust-plague typology paraphrased; Rev 16:10 darkness-plague allusion paraphrased) |
| **Total** | **0** | |

## 2. Fetch-verifications performed (verifiedViaFetch:true entry count)

| Chapter | verifiedViaFetch:true entries | What was fetched |
|---|---:|---|
| 5 | _filled in after drafting_ | |
| 6 | _filled in after drafting_ | |
| 7 | _filled in after drafting_ | |
| 8 | _filled in after drafting_ | |
| 9 | _filled in after drafting_ | |
| 10 | _filled in after drafting_ | |
| **Total** | | |

## 3. Cross-references DOWNGRADED from verbatim to paraphrase

(Cases where I originally intended a verbatim quotation but, on weighing the §6.0 fetch-then-quote workflow against the cost-of-error, chose paraphrase instead. Per §6.0: paraphrase is the preferred default.)

| Chapter | Originally planned verbatim | Cross-ref | Paraphrase used instead | Reason |
|---|---|---|---|---|
| _filled in during drafting_ | | | | |

## 4. lint:quotation-fidelity rule FIRINGS during drafting

(Each time the rule produced an ERROR during a `npm run lint:content` while drafting, what triggered it, and what the resolution was.)

| Chapter | Trigger (quote + cross-ref book) | Resolution | Resolution mode |
|---|---|---|---|
| 6 | `"began to call upon the name of the LORD"` (9w) near `<VerseRef book="genesis" chapter={4} verse={26} />` in LangNotes "El Shaddai and the YHWH crux" block | Fetched Gen 4:26 KJV; discovered drift; rewrote with ellipsis to reflect partial citation: `"began ... to call upon the name of the LORD"`; added verifiedViaFetch:true entry with full quoteText | **fetched-and-added** (with prose correction) |

## 5. Memory-drifts caught by the guard (MOST IMPORTANT)

(Cases where the fetched source revealed that the verbatim wording I would have drafted from memory was different from the actual KJV/source — the failure mode the guard exists to catch.)

| Chapter | Cross-ref | What I would have written from memory | What the fetch showed | Source URL |
|---|---|---|---|---|
| 6 | Genesis 4:26 | `"began to call upon the name of the LORD"` (9 words) — written from memory and quoted in prose as the men-of-Enos-day verse | KJV Gen 4:26: `"then began men to call upon the name of the LORD"` (10 words) — my draft had dropped the words **then** and **men** (the grammatical subject of the verb "began"). Without "men," the verbal subject in my prose silently absorbed into "the men of Enos's day" from the surrounding paraphrase — a perfectly readable but inaccurate quotation. | https://www.biblegateway.com/passage/?search=Genesis+4%3A26&version=KJV |

**Significance:** this is exactly the failure mode PRs #13 and #14 documented across 11 cases — a familiar verse quoted from memory with a small omission that reads fluently and would have shipped silently. The guard caught it on the first quoted cross-reference of the second chapter under enforced discipline.

## Honest assessment (filled in at session end)

_filled in after all six chapters draft cleanly._

---

*This file is mandatory output of Session 08. The session is valuable beyond the chapters themselves if and only if this file reports honest data — including a "rule never fired" outcome, which is itself evidence about how the discipline functions in disciplined drafting.*
