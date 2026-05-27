# SumBible — Chapter-Drafting Batch Task File Template

> Starting-point template for chapter-drafting sessions. Hand-customize for
> each batch; do not run as-is. See AUTHORING.md §22 for the small-batch
> discipline this template encodes.

**Session Type:** Overnight autonomous (Claude Code, `--dangerously-skip-permissions` inside VM)
**Reference Repo:** `https://github.com/scryptoginger/sumbible`
**Branch:** `content/<book>-batch-<N>` (feature branch; branch protection active on main)
**Final action:** Open a PR; do NOT merge. Keith reviews on Vercel preview.

---

## CONTEXT

This session drafts chapters `<FIRST>` through `<LAST>` of `<BOOK>` (`<CANON>`).
It is part of the small-batch chapter-drafting discipline established in
AUTHORING.md §22.

### Hard rules

- **Feature branch.** Create `content/<book>-batch-<N>` at start; open PR at
  end; do NOT merge.
- **Preserve prior content.** Any prior chapter of `<BOOK>` already drafted
  (any status) is authoritative. The agent reads `src/data/book-context/
  <canon>/<book-slug>.md` in Phase 0 and never contradicts or duplicates
  the established content unless explicitly directed.
- **AUTHORING.md is the contract.** Believing voice for LDS-canon content
  (§3), deity capitalization (§4), editorial discipline (§5), no
  editorializing about uniqueness/precision, sources cited for every
  non-obvious claim (§2), verification log populated during research
  (§20), pre-commit audit checklist (§18) before every commit.
- **One chapter per commit.** No batching in working memory; each chapter
  is drafted, audited, committed, pushed; the agent re-orients to the next
  chapter from a refreshed context.

---

## PHASE 0 — Environment Sync, Branch Creation, Context Read

### 0.1 Sync

```bash
cd ~/sumbible
git fetch origin
git checkout main
git pull origin main
git status   # clean
npm ci
npm run build && npm run lint:content && npx astro check   # all pass
```

If any fail, STOP.

### 0.2 Branch

```bash
git checkout -b content/<book>-batch-<N>
git push -u origin content/<book>-batch-<N>
```

### 0.3 Read the book-context file

```bash
cat src/data/book-context/<canon>/<book-slug>.md
```

This file carries everything already established in `<BOOK>` — themes,
Christ references, per-chapter highlights. The agent's drafts MUST be
consistent with this content.

### 0.4 Read the prior chapter draft

```bash
cat src/content/chapters/<canon>/<NN>-<book-slug>/<prior-chapter>.mdx
```

Where `<prior-chapter>` is the chapter immediately preceding the batch
(if any). The voice, structure, and component-use rhythm here is the
reference the new batch matches.

### 0.5 Conflicts log

```bash
echo "# Batch <N> Conflicts" > BATCH_<N>_CONFLICTS.md
grep -q "BATCH_<N>_CONFLICTS.md" .gitignore || echo "BATCH_<N>_CONFLICTS.md" >> .gitignore
```

---

## PHASE 1 — Chapter `<FIRST>`

### 1.1 Scaffold

```bash
npm run new-chapter -- --canon <canon> --book <book-slug> --chapter <FIRST>
```

### 1.2 Research

Before writing prose:

1. Read the chapter in question (use the relevant external translation links).
2. Consult the relevant lexicons, commentaries, and translator's notes for
   every original-language term planned.
3. Verify every cross-reference planned (look up each cited verse).
4. Populate `verificationLog` in frontmatter with one entry per non-obvious
   claim — claim text, source, optional URL, optional verifiedOn.

### 1.3 Draft

Fill in:

- `highlightSummary` — 2–3 sentences, 60–120 words (§4 word counts).
- Deep summary body — 400–700 words of prose paragraphs, NOT a
  verse-by-verse retelling. Insight, not restatement.
- `<LangNote>` for any inline original-language terms (§13).
- `<VerseRef />` for every cross-reference cited (§8).
- `<LangNotes>` for longer language/structural commentary at the end (§13).
- `<TranslationCompare>` for any verse where honest translations
  meaningfully diverge (§13).
- `<ScriptureBlock>` for any short quotation (§6 quotation discipline).
- `sources` frontmatter populated.
- `christReferences` for any Christological appearance in the chapter.
- `themes` lowercase-hyphenated tags (§14).

### 1.4 Pre-commit audit

Run through the AUTHORING §18 checklist:

1. Deity capitalized
2. No editorializing about uniqueness / precision
3. Bible cross-references via `<VerseRef />`
4. LDS-canon cross-references via `<VerseRef />`
5. No repeated canon-level meta-claims
6. Quotation discipline followed
7. Sources cited for all non-obvious claims
8. LDS-canon content in believing voice; Bible content reports spectrum
9. Keith's prior edits preserved (check baseline diff)
10. Proper-noun consistency (§15)
11. Verification log populated

### 1.5 Commit and push

```bash
npm run build && npm run lint:content   # both pass
git add src/content/chapters/<canon>/<NN>-<book-slug>/<FIRST>.mdx
git commit -m "feat(content): draft <BOOK> <FIRST>"
git push origin content/<book>-batch-<N>
```

### 1.6 Re-orient

Before drafting the next chapter:

```bash
cat src/content/chapters/<canon>/<NN>-<book-slug>/<FIRST>.mdx
```

Use the freshly-committed file as the authoritative reference for what's
been established. Move to Phase 2.

---

## PHASES 2 through N — One per remaining chapter

Same structure as Phase 1, for chapters `<FIRST+1>` through `<LAST>`.

---

## PHASE N+1 — Final Validation and PR

### N+1.1 Full validation

```bash
npm run build              # zero errors
npm run lint:content       # zero errors
npx astro check            # zero errors
```

### N+1.2 Smoke-check the site

```bash
npm run preview
```

Visit each new chapter page and confirm:
- Content renders correctly
- VerseRefs link to the right destinations
- LangNotes and TranslationCompare blocks work
- Research-sources details block populates

### N+1.3 Open the PR

```bash
git add -A
git commit -m "chore: phase N+1 validation pass — <BOOK> batch <N> complete" || echo "nothing new"
git push origin content/<book>-batch-<N>

# Use the GitHub REST API to open the PR (gh CLI not installed)
# — see prior session task files for the curl + python3 pattern.
```

### N+1.4 Do NOT merge

PR opened for Keith's review on Vercel preview. Agent does not merge.

---

## WHAT SUCCESS LOOKS LIKE

When this session ends, Keith should be able to:

1. Visit the Vercel preview and read each new chapter at the same quality
   bar as the existing seed chapters.
2. Expand the "Research sources" block on each chapter and see the
   verification log — every non-obvious claim traces to a real source.
3. See the book-context file regenerate on the next build, carrying the
   newly-drafted chapters' themes, Christ references, and highlights.
4. Approve and merge the PR (or request specific revisions).
