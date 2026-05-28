# Bible Cross-Reference Sweep — Findings

Per-chapter ledger of verbatim Bible cross-reference quotations and their verification status.

This sweep is the structural twin of PR #13. PR #13 proved that Standard Works
cross-reference quotes (D&C, BoM, PoGP, JST quoted from memory inside chapters
about a different book) failed at 40%. The same mechanism — quoting a different
book from memory — is the structural twin in the Bible category (NT quoted in
OT chapters, OT in different-OT-book chapters).

**Method per quote:**
1. Identify quoted string + claimed reference (cross-reference only — not self-quote)
2. Fetch source from KJV (BibleGateway / BlueLetterBible / churchofjesuschrist.org)
3. Character-level diff
4. Classify: CLEAN / ERROR / UNVERIFIABLE

---

## Findings


### Exodus 03 — Matt 22:32 → Mark 12:27 — ⚠️ ERROR (FIXED)

**Quote in chapter (BEFORE fix):** `God is "not the God of the dead, but the God of the living"` attributed to `<VerseRef book="matthew" chapter={22} verse={32} />`

**Source (Matt 22:32 KJV):** `"...God is not the God of the dead, but of the living."`
**Source (Mark 12:27 KJV):** `"He is not the God of the dead, but the God of the living: ye therefore do greatly err."`

**Diff:** the chapter's quoted phrase `"not the God of the dead, but the God of the living"` matches Mark 12:27 verbatim but was attributed to Matt 22:32 — which has only `"but of the living"` (no second `"the God of"`). Memory-reconstruction conflated Mark's wording under a Matt citation.

**Fix:** re-attributed the quoted phrase to Mark 12:27 in body prose; updated verificationLog to show the three-Synoptic wording side by side (Mark / Matt / Luke).


### Genesis 25 — Romans 9:11 — ⚠️ ERROR (FIXED)

**Quote in chapter (BEFORE fix):** `"before they were born, neither having done any good or evil"` attributed to Rom 9:10-13.
**Source (Rom 9:11 KJV):** `"(For the children being not yet born, neither having done any good or evil, that the purpose of God according to election might stand, not of works, but of him that calleth;)"`
**Diff:** chapter substituted `"before they were born"` for KJV's `"the children being not yet born"`. The chapter's phrasing matches modern translations (ESV, NIV) but was presented as KJV-verbatim.
**Fix:** quoted v11 KJV verbatim with the full clause.


### Genesis 48 — 1 Chronicles 5:1 — ⚠️ ERROR (FIXED)

**Quote in chapter (BEFORE fix):** `"Reuben... when he defiled his father's bed, his birthright was given unto the sons of Joseph"` attributed to 1 Chr 5:1-2.
**Source (1 Chr 5:1 KJV):** `"Now the sons of Reuben the firstborn of Israel, (for he was the firstborn; but, forasmuch as he defiled his father's bed, his birthright was given unto the sons of Joseph the son of Israel..."`
**Diff:** chapter substituted `"when"` for KJV's `"forasmuch as"` as the connecting conjunction inside the elided portion. The phrase before-and-after the "when/forasmuch as" matches verbatim, but the connector word is changed.
**Fix:** quoted v1 verbatim including the full parenthetical clause.


### Genesis 48 — 1 Chronicles 5:1 — ⚠️ ERROR (FIXED)

**Quote in chapter (BEFORE fix):** `"Reuben... when he defiled his father's bed, his birthright was given unto the sons of Joseph"` attributed to 1 Chr 5:1-2.
**Source (1 Chr 5:1 KJV):** `"Now the sons of Reuben the firstborn of Israel, (for he was the firstborn; but, forasmuch as he defiled his father's bed, his birthright was given unto the sons of Joseph the son of Israel..."`
**Diff:** chapter substituted `"when"` for KJV's `"forasmuch as"` (the connecting conjunction within the source's parenthetical). The phrase before-and-after matches verbatim, but the connector word is changed.
**Fix:** quoted v1 verbatim including the full parenthetical clause.

