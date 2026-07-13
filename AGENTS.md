# SumBible Agent Harness

## §0 — Project Identity

SumBible is a public scriptural-reference site for readers who want concise orientation and substantive, source-grounded chapter, book, and canon summaries. Each entry pairs a short highlight with a detailed summary of the passage's ideas, history, theology, textual questions, and practical import.

User-facing content speaks in an organizational voice. Attribute the site to the organization `SumBible`, never to any individual by name. JSON-LD authorship is `{ "@type": "Organization", "name": "SumBible" }`.

Repository at a glance: Astro 6, MDX content collections, TypeScript, Zod 4 schemas, Tailwind CSS 4, Pagefind search, and Vercel deployment. Content lives under `src/content/`; `src/content.config.ts` defines the schema. Deployment is to `vercel.app`; DNS points to a custom domain.

## §1 — The Prime Directive

The following five rules are non-negotiable. They outrank every other instruction in this file whenever any conflict appears.

1. **Quality and accuracy over speed and quantity. Always.** Fewer entries
   at the correct quality bar is a better outcome than more entries with
   cut corners. There is no deadline that overrides this.
2. **Preserve the human's prior edits over any rule application.** When a
   rule would override an edit Keith has made, the edit wins. Surface the
   conflict; do not apply the rule.
3. **No figurative imagery of Christ or biblical figures.** All Christ
   iconography is symbolic (chi-rho, alpha-omega, ichthys, cross). Never
   generate, embed, or commit AI-produced figurative depictions of Christ,
   prophets, or divine figures.
4. **Verify before citing.** Every non-obvious claim traces to a real,
   locatable source. Open the source. Read it. If it cannot be verified,
   the claim does not go in.
5. **When uncertain, omit.** The default response to uncertainty is to
   leave the claim out — not to include it with a hedge, and never to
   invent a source.

## §2 — Voice Contract

For Bible content, use a scholarly-spectrum voice: where genuine believer-level disagreement exists, report the spectrum and do not arbitrate. For the Book of Mormon, Doctrine and Covenants, and Pearl of Great Price, use a believing voice calibrated to the community of faith that produced and sustains these texts.

The banned editorial adjective list is exactly: unusually, remarkably, surprisingly, extraordinarily, uniquely, improbably, "particularly precise", "exceptionally accurate".

Capitalize every reference to Deity in SumBible prose: God, Lord, Father, Son, Holy Ghost, Holy Spirit, Spirit, Savior, Redeemer, Creator, Author, Almighty, Most High, Ancient of Days, Word, Beloved, etc.

## §3 — The §6.0 Fetch-and-Diff Guard

This is the most important behavioral rule in this file. It prevents a proven systemic failure: before this guard existed, integrity sweeps found an error rate of 35% in Standard Works cross-reference quotations. This rule closed that gap entirely.

Any verbatim scripture quotation longer than approximately six words from a book OTHER than the chapter's primary subject MUST be fetch-verified against the actual source text at the time of writing. Record the source URL in the `verificationLog` with `verifiedViaFetch: true`.

Chapter self-quotes—where the chapter quotes its own primary verses—are exempt and honestly use `verifiedViaFetch: false`. When uncertain, paraphrase. Paraphrase is the preferred default; verbatim quotation is the exception.

## §4 — Per-Chapter Drafting Sequence

Follow these steps in this exact order for every chapter:

1. Read `src/data/book-context/<canon>/<book>.md`.
2. Read the immediately preceding chapter MDX.
3. Scaffold with `npm run new-chapter -- --canon <canon> --book <book> --chapter <N>`.
4. Populate `verificationLog` DURING research, not after drafting prose.
5. Draft the body: a 500–700-word deep summary; extra-care chapters may run longer.
6. Run the pre-commit audit checklist from the `AUTHORING.md` appendix (§18):
   - capitalize all Deity references;
   - remove editorial claims about uniqueness, precision, or unlikelihood;
   - use `<VerseRef />` for Bible cross-references in LDS-canon content and LDS-canon cross-references in Bible content;
   - do not repeat canon-level meta-claims in chapter prose;
   - obey public-domain and copyrighted quotation limits;
   - fetch-verify cross-reference verbatim quotations of seven or more words and record `verifiedViaFetch: true` plus the URL actually opened;
   - cite sources for every non-obvious claim;
   - preserve believing voice for LDS canon and scholarly-spectrum voice for Bible content;
   - preserve human edits recorded in `KEITH_EDITS_BASELINE.md`, when present;
   - enforce proper-noun consistency; and
   - ensure the verification log represents the research actually performed.
7. Run `npm run build && npm run lint:content && npx astro check`. All three must pass. Do not commit until they do.
8. Commit with `feat(content): draft <book> <N> — <title>`.
9. Regenerate book context with `tsx scripts/build-book-context.ts`.
10. Commit with `chore(book-context): regenerate <book> context after chapter <N>`.
11. Read the regenerated book context before starting the next chapter.

## §5 — Validation Commands

Self-validation is mandatory. Run the commands and read their complete output; they are not optional ceremony.

```bash
npm run build
```

Runs the `prebuild` generators for cross-reference indexes and book contexts, then performs the Astro production build, creates the Pagefind index, and copies Pagefind assets. Passing means the command exits 0 and logs no errors in the build output.

```bash
npm run lint:content
```

Runs the repository's content-discipline checks: highlight shape, source coverage, quoted dates, raw references, status integrity, Christ-reference integrity, verification-log density, schema relations, and more. Passing means it exits 0.

```bash
npx astro check
```

Runs Astro and TypeScript diagnostics across `.astro`, MDX-adjacent, and TypeScript code. Passing means it exits 0 with no errors.

The final gate is the exact combined command below. A later command must not be run if an earlier command fails:

```bash
npm run build && npm run lint:content && npx astro check
```

## §6 — Halt-on-Failure Protocol

HALT if the build fails irrecoverably, lint will not pass after reasonable attempts, a required source cannot be fetched, or structural ambiguity requires human judgment. Do not bury the problem or we will discover it during review.

Commit everything that is clean, push the session branch, and write the reason to `SESSION_<N>_HALT.md`. Open a PR whose title begins `[PARTIAL]` and make the halt reason prominent in both title and body.

## §7 — Session Scope Rules

Draft chapters sequentially only. Never use parallel subagents for chapter drafting. Cross-chapter consistency depends on each completed chapter and regenerated book context being visible to the next drafting session.

Use a single push at session close to protect the Vercel Hobby-tier budget of 100 deployments per day. For normal content sessions, branch from `dev` and open a PR back to `dev`. Never commit directly to `main`.

## §8 — Component Usage

- `<VerseRef />` fires for every cross-canon reference and for other true cross-references required by `AUTHORING.md`; do not wrap a self-reference or invent a false link.
- `<LangNote>` fires when introducing an inline Hebrew or Greek term. Its claim must be lexically sourced. Skip it when no extant original-language text exists.
- `<TranslationCompare>` fires only where honest translations diverge meaningfully in wording or interpretation, not for cosmetic variation.
- `<ScriptureBlock>` fires for an extended quotation. Preserve the published text and obey source-specific quotation limits and §3 fetch verification.

Iconography is symbolic only. The permitted components are ChiRho, AlphaOmega, Ichthys, Aleph, and Cross. Never generate or embed figurative imagery of Christ, prophets, biblical persons, or divine figures.

## §9 — Current Corpus State

State verified from Git on 2026-07-12:

- `main` is at `afcfb81` (`Dev (#45)`). Its content tree includes the Pentateuch, Joshua 1–24, and Judges 1–18, plus the existing selected LDS-canon and New Testament samples.
- `dev` is at `ea7371e` (merge of Judges batch 5). Although its commit history differs from `main`, `git diff origin/main..origin/dev` is empty: their current file trees are identical.
- The next sequential chapter is Judges 19.
- The current harness session branch is `pi/agents-harness`, created from `main` as explicitly requested for this administrative task. A future chapter-drafting session must follow §7: create a new branch from `dev`.

Re-check this section against `git fetch`, `git log`, the remote branch structure, and the chapter inventory at the start of every session. Live repository state outranks this dated snapshot.

## §10 — Voice Calibration Anchor

If the voice starts to drift, stop immediately and re-read `src/content/chapters/bible-ot/01-genesis/01.mdx` before continuing. That chapter is the permanent voice reference for the entire project and is not to be edited without explicit approval.
