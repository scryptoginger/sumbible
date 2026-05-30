# lint:quotation-fidelity v2 — deliberate-test evidence

PR-companion document. Captures the actual lint output for the three deliberate scratch tests at four timepoints: baseline (v1), after Fix 1 only (symmetric proximity), after Fix 1 + Fix 2 (same-book disambiguation), and after the positive-cleared path is exercised on scratch-fix1.

The scratch chapters themselves live under `src/content/chapters/_guard-test/` and are gitignored; only this evidence file is committed.

## Scratch chapters

| File | Pattern | v1 expected | v2 expected |
|---|---|---|---|
| `scratch-fix1.mdx` | Hebrews 11:1 verbatim with `<VerseRef book="hebrews" />` BEFORE the quote (separate paragraphs) | rule does NOT fire (false negative — forward-only window misses it) | rule FIRES ERROR (symmetric proximity catches the preceding VerseRef) |
| `scratch-fix2.mdx` | Exodus 7:16 verbatim (same-book self-quote) on an Exodus chapter, with `<VerseRef book="exodus" />` BEFORE (~28 chars away) and `<VerseRef book="deuteronomy" />` AFTER (~5 chars away — NEAREST). Designed so cross-book is the nearest candidate. | rule FIRES ERROR misattributing ownership to deuteronomy (false positive). Fix 1 alone is INSUFFICIENT here — it still picks the nearest, which is the cross-book Deuteronomy. | rule PASSES (Fix 2's any-same-book exemption catches the further Exodus VerseRef as a candidate owner; quote treated as self-quote). |
| `scratch-fix3.mdx` | Hebrews 11:1 verbatim with `<VerseRef book="hebrews" />` only, AFTER the quote, empty vLog (the v1 PR #17 standard pattern) | rule FIRES ERROR | rule FIRES ERROR (regression: core failure-mode detection unchanged) |

## Test results

### Phase 1 — Baseline (v1 rule, before any v2 changes)

```
WARN  src/content/chapters/_guard-test/scratch-fix1.mdx  highlightSummary is 28 words (target 40-200)
ERROR src/content/chapters/_guard-test/scratch-fix2.mdx  lint:quotation-fidelity — cross-reference verbatim quote (12 words, near VerseRef → deuteronomy) lacks a matching verifiedViaFetch:true verificationLog entry. ... Quote: "Let my people go, that they may serve me in the wilderness"
ERROR src/content/chapters/_guard-test/scratch-fix3.mdx  lint:quotation-fidelity — cross-reference verbatim quote (15 words, near VerseRef → hebrews) lacks a matching verifiedViaFetch:true verificationLog entry. ... Quote: "Now faith is the substance of things hoped for, the evidence of things not seen"

lint:content — 79 file(s): 2 error(s), 80 warning(s)
```

**Findings (Phase 1):**
- `scratch-fix1`: NO fidelity ERROR — **false negative confirmed**. The Hebrews VerseRef precedes the quote; v1's forward-only window doesn't see it.
- `scratch-fix2`: ERROR misattributed to deuteronomy — **false positive confirmed**. The cross-book Deuteronomy VerseRef sits within the forward window; the same-book Exodus VerseRef precedes the quote and is invisible to v1.
- `scratch-fix3`: ERROR fires correctly on the v1 standard pattern.

Baseline matches the expected v1 behavior described in PR #18's "Two design observations on the lint rule."

### Phase 2 — After Fix 1 only (symmetric proximity, single-nearest owner check)

```
WARN  src/content/chapters/_guard-test/scratch-fix1.mdx  highlightSummary is 28 words (target 40-200)
ERROR src/content/chapters/_guard-test/scratch-fix1.mdx  lint:quotation-fidelity — cross-reference verbatim quote (15 words, near VerseRef → hebrews) lacks a matching verifiedViaFetch:true verificationLog entry. ... Quote: "Now faith is the substance of things hoped for, the evidence of things not seen."
WARN  src/content/chapters/_guard-test/scratch-fix2.mdx  highlightSummary has 4 sentences (target ≤ 3)
ERROR src/content/chapters/_guard-test/scratch-fix2.mdx  lint:quotation-fidelity — cross-reference verbatim quote (12 words, near VerseRef → deuteronomy) lacks a matching verifiedViaFetch:true verificationLog entry. ... Quote: "Let my people go, that they may serve me in the wilderness"
ERROR src/content/chapters/_guard-test/scratch-fix3.mdx  lint:quotation-fidelity — cross-reference verbatim quote (15 words, near VerseRef → hebrews) lacks a matching verifiedViaFetch:true verificationLog entry. ... Quote: "Now faith is the substance of things hoped for, the evidence of things not seen"

lint:content — 79 file(s): 3 error(s), 89 warning(s)
```

**Findings (Phase 2):**
- `scratch-fix1`: ERROR fires — **Fix 1 works**. Symmetric proximity catches the preceding Hebrews VerseRef.
- `scratch-fix2`: ERROR still fires — **Fix 1 alone is INSUFFICIENT** for the same-book disambiguation case. The cross-book Deuteronomy is the nearest candidate; the single-nearest-owner check still misattributes.
- `scratch-fix3`: ERROR still fires — **regression preserved** for the standard cross-book pattern.

Phase 2 demonstrates that Fix 1 alone resolves one gap but not the other. The +8 corpus warnings (80 → 88) are legacy-chapter cross-reference quotes that v1 missed because of the forward-only window — now correctly surfaced as WARN under the legacy grandfather (the chapters are honestly marked `quotationFidelity: legacy`).

### Phase 3 — After Fix 1 + Fix 2 (symmetric proximity + any-same-book exemption)

```
WARN  src/content/chapters/_guard-test/scratch-fix1.mdx  highlightSummary is 28 words (target 40-200)
ERROR src/content/chapters/_guard-test/scratch-fix1.mdx  lint:quotation-fidelity — cross-reference verbatim quote (15 words, near VerseRef → hebrews) lacks a matching verifiedViaFetch:true verificationLog entry. ... Quote: "Now faith is the substance of things hoped for, the evidence of things not seen."
WARN  src/content/chapters/_guard-test/scratch-fix2.mdx  highlightSummary has 4 sentences (target ≤ 3)
ERROR src/content/chapters/_guard-test/scratch-fix3.mdx  lint:quotation-fidelity — cross-reference verbatim quote (15 words, near VerseRef → hebrews) lacks a matching verifiedViaFetch:true verificationLog entry. ... Quote: "Now faith is the substance of things hoped for, the evidence of things not seen"

lint:content — 79 file(s): 2 error(s), 89 warning(s)
```

**Findings (Phase 3):**
- `scratch-fix1`: ERROR fires ✓
- `scratch-fix2`: ERROR CLEARED ✓ — **Fix 2 works**. Any-same-book exemption catches the Exodus VerseRef in the proximity window and exempts the quote as a self-quote.
- `scratch-fix3`: ERROR fires ✓ — **regression preserved** under the combined v2 logic.

### Phase 4 — Positive-cleared path on scratch-fix1 (verifiedViaFetch:true added)

After adding to scratch-fix1's verificationLog:
```yaml
verificationLog:
  - claim: "Hebrews 11:1 KJV definition of faith."
    source: "King James Version, Hebrews 11:1 (Bible Gateway)"
    url: https://www.biblegateway.com/passage/?search=Hebrews+11%3A1&version=KJV
    verifiedOn: "2026-05-28"
    verifiedViaFetch: true
    quoteText: "Now faith is the substance of things hoped for, the evidence of things not seen."
```

```
WARN  src/content/chapters/_guard-test/scratch-fix1.mdx  highlightSummary is 28 words (target 40-200)
WARN  src/content/chapters/_guard-test/scratch-fix2.mdx  highlightSummary has 4 sentences (target ≤ 3)
ERROR src/content/chapters/_guard-test/scratch-fix3.mdx  lint:quotation-fidelity — cross-reference verbatim quote (15 words, near VerseRef → hebrews) lacks a matching verifiedViaFetch:true verificationLog entry. ... Quote: "Now faith is the substance of things hoped for, the evidence of things not seen"

lint:content — 79 file(s): 1 error(s), 89 warning(s)
```

**Findings (Phase 4):**
- `scratch-fix1`: ERROR CLEARED after adding the verifiedViaFetch:true entry ✓ — the v2 rule's vLog-coverage matching still works as designed.
- `scratch-fix3`: still ERROR — the regression scratch's vLog is intentionally empty.

## Full-corpus regression (scratches deleted)

After deleting `src/content/chapters/_guard-test/`:

| Check | v1 (PR #18 baseline) | v2 (this PR) |
|---|---|---|
| `npm run lint:content` files | 76 | 76 |
| `lint:content` errors | 0 | **0** |
| `lint:content` warnings | 79 | **87** (+8) |
| `npx astro check` | 0/0/0 | **0/0/0** |
| `npm run build` | 67 pages clean | **67 pages clean** |
| `lint:quotation-fidelity` firings (corpus only, all WARN under legacy grandfather) | 23 | **31** (+8) |

**The +8 warnings are all legacy-chapter `lint:quotation-fidelity` WARNs surfaced by Fix 1's symmetric proximity** — they are real cross-reference quotes that v1 missed because the owning VerseRef sat BEFORE the quote rather than after. All 8 are in chapters explicitly marked `quotationFidelity: legacy`, so the rule downgrades them from ERROR to WARN per the grandfather mechanism. They are honest signals of discipline-not-yet-applied in pre-PR-#17 content, not regressions.

No new ERROR-level firings. No changes to the 56 non-quotation-fidelity warnings. Build and astro-check both fully clean.

## What Phase 1 → Phase 3 demonstrates

The two fixes are independent and both necessary:

- **Fix 1 alone** handles the VerseRef-precedes-quote class (scratch-fix1) but cannot resolve the same-book-near-cross-book disambiguation class (scratch-fix2 still ERRORs).
- **Fix 2 alone** would handle the disambiguation class (any-same-book exemption) but cannot resolve the preceding-VerseRef class (which requires the symmetric window for any candidate to be visible at all).
- **Fix 1 + Fix 2 together** resolve both gaps and preserve the regression case unchanged.

The v2 rule's net behavior change in production: catches MORE real cross-reference cases that v1 missed (+8 corpus WARNs), and stops producing the specific structural-citation false-positive that PR #18 documented. The trade-off — a true cross-reference quote sitting near a same-book VerseRef would now slip through — is documented in the rule body and grounded in the lint-as-safety-net architecture: §6.0's paraphrase-by-default discipline is the primary defense, the lint is the mechanical safety net for the unambiguous-cross-book case.

---

*All three scratches deleted after the final test pass. The `src/content/chapters/_guard-test/` directory path is retained in `.gitignore` for future re-tests of the rule's behavior under controlled inputs.*
