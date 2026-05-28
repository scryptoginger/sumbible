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

