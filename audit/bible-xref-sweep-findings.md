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

