# Calibration Batch — Exodus 1-4 — Per-Chapter Metrics

Instrumented run measuring chapter-level drafting effort against chapter
characteristics. Three ordinary chapters (1, 2, 4) and one extra-care chapter
(3, the burning bush / divine name).

**Sequential drafting, no parallelism.** Wall-clock from start of research
through commit. **Token / usage consumption NOT measured from inside the
session** — Keith will correlate these external metrics against the
percentage he observes externally.

Hardware/environment context: claude-opus-4-7[1m], single VM, sandboxed
filesystem with full repo, network access to BDB / NET Bible Notes / churchof
jesuschrist.org.

---

## Raw entries

(populated chapter-by-chapter)


### Exodus 1 (ordinary)

| Metric | Value |
|---|---|
| Extra-care | no |
| Start (UTC) | 2026-05-28T15:13:53Z |
| End (UTC)   | 2026-05-28T15:17:03Z |
| Elapsed (min) | 3.17 |
| Body words | ~1190 |
| LangNote components | 5 |
| VerseRef components | 7 |
| TranslationCompare components | 0 |
| verificationLog entries | 8 |
| Web fetches | 0 |
| Research density (1-5) | 2 — standard Hebrew lexical work (avad, parah/ravah, yada, yare et-elohim, midwives' names); one NT cross-ref cluster (Acts 7:17-19, Heb 11:23). No fetches; all lexical claims within stable BDB-reliable territory. |


### Exodus 2 (ordinary)

| Metric | Value |
|---|---|
| Extra-care | no |
| Start (UTC) | 2026-05-28T15:17:17Z |
| End (UTC)   | 2026-05-28T15:20:19Z |
| Elapsed (min) | 3.03 |
| Body words | ~1375 |
| LangNote components | 5 |
| VerseRef components | 7 |
| TranslationCompare components | 0 |
| verificationLog entries | 8 |
| Web fetches | 0 |
| Research density (1-5) | 2 — solid lexical work (tevah, mashah/moshe, gershom, ger, shama/zakar/ra'ah/yada cluster) and three OT type-scenes; Moses etymology question (Hebrew folk vs Egyptian m-s) reported from stable commentary tradition; Reuel/Jethro question canvassed. No fetches. |


### Exodus 3 (EXTRA CARE — burning bush, divine name)

| Metric | Value |
|---|---|
| Extra-care | yes |
| Start (UTC) | 2026-05-28T15:20:50Z |
| End (UTC)   | 2026-05-28T15:25:00Z |
| Elapsed (min) | 4.17 |
| Body words | ~2084 |
| LangNote components | 6 |
| VerseRef components | 20 |
| TranslationCompare components | 1 |
| christReferences | 2 |
| verificationLog entries | 11 |
| Web fetches | 0 |
| Research density (1-5) | 5 — central OT divine-name disclosure; multivalent Hebrew word study (three readings of ehyeh asher ehyeh); cross-traditional canonical reception (Jewish Targumic, Greek philosophical via LXX, Christian, LDS); seven I AM sayings to cross-reference; NT use of Exod 3:6 for resurrection (Matt 22:32); LDS doctrinal harmonization with John 8:58 and D&C 110. Highest possible density rating. |


### Exodus 4 (ordinary)

| Metric | Value |
|---|---|
| Extra-care | no |
| Start (UTC) | 2026-05-28T15:25:26Z |
| End (UTC)   | 2026-05-28T15:28:24Z |
| Elapsed (min) | 2.97 |
| Body words | ~1377 |
| LangNote components | 4 |
| VerseRef components | 6 |
| TranslationCompare components | 0 |
| verificationLog entries | 8 |
| Web fetches | 0 |
| Research density (1-5) | 3 — ordinary narrative with two harder elements: the rod-serpent sign (cross-ref to Exod 7's nachash/tannin distinction) and the chathan-damim crux of 4:24-26 (one of the OT's most opaque texts, requiring neutral spectrum-reporting). Otherwise standard. |

---

## Summary table

| Chapter | Extra-care | Elapsed (min) | Body words | LangNote | VerseRef | TC | vLog | Fetches | Density |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Exodus 1 | no  | 3.17 | ~1190 | 5 | 7  | 0 | 8  | 0 | 2 |
| Exodus 2 | no  | 3.03 | ~1375 | 5 | 7  | 0 | 8  | 0 | 2 |
| Exodus 3 | YES | 4.17 | ~2084 | 6 | 20 | 1 | 11 | 0 | 5 |
| Exodus 4 | no  | 2.97 | ~1377 | 4 | 6  | 0 | 8  | 0 | 3 |
| **Avg ordinary (1,2,4)** | — | **3.06** | **~1314** | 4.7 | 6.7 | 0 | 8.0 | 0 | 2.3 |
| **Extra-care (3)** | — | **4.17** | **~2084** | 6   | 20  | 1 | 11  | 0 | 5.0 |
| **Multiplier (extra-care / ordinary avg)** | — | **1.36×** | **1.59×** | 1.28× | 2.99× | — | 1.38× | — | 2.17× |

---

## Observations on what drove the differences

**Wall-clock cost was the smallest delta.** The extra-care Exodus 3 took 4.17 min vs the ordinary average of 3.06 min — only a 1.36× multiplier. The much larger relative deltas were in **cross-reference count** (3.0×) and **body word count** (1.6×). The extra-care chapter required substantially more material per minute of wall-clock, not just more minutes.

**The extra-care work was concentrated in cross-reference density, not per-claim effort.** Exodus 3's twenty VerseRef components (vs the ordinary average of 6.7) trace the canonical-reception fan-out: the divine-name disclosure flows out to seven Johannine I-AM sayings, the Mark 12 / Matt 22 resurrection-argument from Exod 3:6, Acts 7:30-34, D&C 110, the Bible Dictionary's "Jehovah is the premortal Jesus Christ" identification, the Gen 22 / Gen 46 double-name parallels, the Exod 2:24-25 four-verb cluster that the LORD Himself reuses in 3:7. None of these is hard to find; the count is high because the chapter sits at a canonical hub.

**Body length scales with theological hubness, not with narrative length.** Exodus 3 is 22 verses (shorter than Ex 4's 31 verses), but the body is 51% longer than Exodus 4's. The hub-ness drives the prose: ehyeh asher ehyeh needs a three-reading spectrum; the malak YHWH needs a Christophany note; the I AM sayings need enumeration. None of these can be shortened without losing the chapter's center.

**TranslationCompare adds focused weight to one verse.** The TC component on Exod 3:14 walks the reader through KJV / NKJV / NIV / NRSV / NET / NJPS / JB / LXX / Vulgate — a small amount of prose, but high information density per word. Ordinary chapters in this batch needed no TC; the extra-care chapter needed exactly one, on the chapter's most-debated verse.

**Web fetches: zero, all four chapters.** All lexical and canonical claims were within stable BDB / NET Bible Notes / standard-commentary knowledge. A calibration batch that included chapters requiring genuine source-hunting (an obscure historical narrative, a disputed-dating question, a contested rabbinic-tradition citation, or a less-rehearsed minor prophet) would likely show a very different wall-clock pattern — research-density rating 4-5 would push the elapsed time up by some multiplier we cannot estimate from this batch alone. This batch's measurements bound the floor of extra-care cost, not the ceiling.

**Research-density rating tracked the wall-clock multiplier loosely, but not the body-word multiplier closely.** The 5/5 extra-care chapter took 1.36× the wall-clock of the 2/5 ordinary chapters but produced 1.6× the body words. The rating captures the cognitive load (how much source-hunting and decision-making is required) better than it captures the produced volume. A future batch with a 4/5-density chapter that is narratively short would test whether density-without-volume produces a different cost pattern.

**Token/usage consumption was NOT measured from inside the session.** Keith will correlate these wall-clock and density numbers against the percentage he observes externally.

## Predicted cost model from this batch (preliminary, n=4)

- **Ordinary chapter floor:** ~3 minutes wall-clock, ~1300 body words, 5 LangNote / 7 VerseRef / 8 verificationLog. Web fetches 0 when the content is within stable knowledge.
- **Extra-care chapter (canonical-hub type, well-rehearsed material):** ~4 minutes wall-clock, ~2100 body words, 6 LangNote / 20 VerseRef / 11 verificationLog, 1 TranslationCompare, 2 christReferences. Web fetches still 0 when the material is within stable knowledge.
- **Extra-care chapter (research-hunting type) — NOT MEASURED HERE.** This batch's extra-care chapter was hub-density, not hunt-density. A chapter requiring genuine source acquisition would likely produce a different wall-clock multiplier; the floor would shift upward by the time cost of each fetch + integration step.

The clearest single-number prediction: an extra-care chapter at the hub-density end of the spectrum costs ~36% more wall-clock and produces ~60% more content than an ordinary chapter at the same quality bar.
