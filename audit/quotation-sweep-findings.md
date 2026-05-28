# Quotation Sweep — Findings

Per-chapter ledger of verbatim scripture quotations and their verification status.

**Method per quote:**
1. Identify quoted string + claimed reference
2. Fetch source text from authoritative origin
3. Character-level diff
4. Classify: CLEAN / ERROR / UNVERIFIABLE

**Diff conventions for ERRORs:**
- "in chapter" — the quoted text as the chapter currently has it
- "in source" — the verbatim text from the fetched authoritative source
- Differences are character-exact (punctuation, capitalization, word choice)

Pre-sweep known issue (already fixed on dev): **Exodus 3 D&C 110:4** —
the original quote dropped the leading "I am" and the trailing
"I am your advocate with the Father" clause; cited as 110:1-4 when
the actual quote is 110:4 only. Fixed in commit d473d62 on the
calibration branch, merged via PR #12 into dev. The sweep that follows
audits whether the D&C 110 error was an isolated case or part of a
broader pattern.

---

## Priority 1 findings


### Genesis 02 — Moses 3:5

**Quote in chapter:** `"I, the Lord God, created all things... spiritually, before they were naturally upon the face of the earth"`
**Source (Moses 3:5):** `"...For I, the Lord God, created all things, of which I have spoken, spiritually, before they were naturally upon the face of the earth."`
**Classification:** CLEAN — leading "For" dropped (standard mid-sentence citation), ellipsis correctly marks omission of "of which I have spoken,". Matches source character-for-character within the marked portion.

### Genesis 03 — 2 Nephi 2:22-25

**Quote in chapter:** `"If Adam had not transgressed he would not have fallen... Adam fell that men might be; and men are, that they might have joy."`
**Source:** v22 "And if Adam had not transgressed he would not have fallen, but he would have remained in the garden of Eden." + v25 "Adam fell that men might be; and men are, that they might have joy."
**Classification:** CLEAN — leading "And" dropped (standard); ellipsis correctly marks large omission of v22b-24 and v25 opening; v25 quoted character-exact.

### Genesis 03 — D&C 29:39

**Quote in chapter:** `"it must needs be that the devil should tempt the children of men, or they could not be agents unto themselves."`
**Source (D&C 29:39):** `"And it must needs be that the devil should tempt the children of men, or they could not be agents unto themselves; for if they never should have bitter they could not know the sweet—"`
**Classification:** CLEAN — leading "And" dropped (standard); closing period replaces source's semicolon-plus-continuation (acceptable partial quotation).


### Genesis 04 — Moses 5:7 — ⚠️ ERROR (FIXED)

**Quote in chapter (BEFORE fix):** `"in similitude of the sacrifice of the Only Begotten of the Father"`
**Source (Moses 5:7):** `"This thing is a similitude of the sacrifice of the Only Begotten of the Father, which is full of grace and truth."`
**Diff:** word substitution `"a"` → `"in"`. The chapter reframed the predicate nominative as a prepositional phrase to fit its grammar.
**Fix:** restructured chapter prose to quote the source phrase exactly as `"a similitude of the sacrifice of the Only Begotten of the Father"`.

### Genesis 04 — Moses 5:31 — ⚠️ ERROR (FIXED)

**Quote in chapter (BEFORE fix):** `"Master Mahan, the master of this great secret, that I may murder to get gain"` — presented as Cain's self-naming.
**Source (Moses 5:31a, Cain's own words):** `"Truly I am Mahan, the master of this great secret, that I may murder and get gain."`
**Source (Moses 5:31b, narrator's epithet):** `"Wherefore Cain was called Master Mahan, and he gloried in his wickedness."`
**Diff:**
1. Cain's actual self-naming is `"Truly I am Mahan"`, NOT `"Master Mahan"` — the epithet `"Master Mahan"` is the narrator's, not Cain's
2. word substitution `"and get gain"` → `"to get gain"`
**Fix:** chapter prose now quotes Cain's words exactly per v31a and separately notes the narrator's `"Master Mahan"` epithet from v31b.

**Pattern:** matches the D&C 110:4 failure mode — quotes reconstructed from memory with small word substitutions that alter meaning. The verificationLog had described the quote without ever fetching the source.


### Genesis 05 — Moses 7:18

**Quote in chapter:** `"they were of one heart and one mind, and dwelt in righteousness; and there was no poor among them"`
**Source (Moses 7:18):** `"And the Lord called his people Zion, because they were of one heart and one mind, and dwelt in righteousness; and there was no poor among them."`
**Classification:** CLEAN — leading "And the Lord called his people Zion, because" omitted (standard partial-verse citation); quoted phrase character-exact.

### Genesis 06 — Moses 8:24

**Quote in chapter:** `"Believe, and repent of your sins, and be baptized in the name of Jesus Christ, the Son of God"`
**Source (Moses 8:24):** `"Believe and repent of your sins and be baptized in the name of Jesus Christ, the Son of God, even as our fathers..."`
**Classification:** CLEAN (with punctuation drift) — chapter adds two serial commas (after "Believe" and after "your sins") that source does not have. Word-for-word identical; punctuation drift does not change meaning. Noted for the record.

### Genesis 06 — Genesis 6:18 (KJV self-reference inside LangNote)

**Quote in chapter:** `"But with thee will I establish my covenant."` (covenant wrapped in LangNote)
**Source (KJV Gen 6:18):** `"But with thee will I establish my covenant; and thou shalt come into the ark..."`
**Classification:** CLEAN — partial-verse quote ending at "covenant" with period (acceptable; source has semicolon and continues).

