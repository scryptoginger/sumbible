# Authoring SumBible Content

This document is the **contract** for drafting any scriptural content on
SumBible — chapter summaries, book summaries, canon summaries, and (soon)
related-text entries — whether the drafter is a future Claude Code session or
a human contributor. Read it before drafting, and follow it.

---

## 0. Prime Directive

These five principles outrank everything else in this document. When any
other rule, instruction, or task-file directive appears to conflict with
these, **these win**.

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

---

## 1. Purpose and Scope

SumBible is a public scriptural-reference site. Its content is dual: a short
*highlight* (the chapter / book / canon summary in three sentences or fewer)
and a longer *deep summary* in the MDX body. The disciplines below govern
both.

The hard rules — hallucination guardrail (§2), LDS-canon believing voice (§3),
deity capitalization (§4), editorial discipline (§5), quotation discipline
(§6), repetition discipline (§7), cross-reference discipline (§8), and
anonymity (§9) — apply to every piece of content. The mechanical guides
(schema §10, dates §11, word counts §12, components §13) tell you how to
realize those rules in practice. The Pre-Commit Audit Checklist (§18) is the
final pass before any commit that touches content.

---

## 2. The Hallucination Guardrail — read this twice

SumBible is a public reference site. **Every non-obvious claim in a summary
must be traceable to a real, published source.**

- If you write that a Hebrew or Greek word "means X," you must have actually
  consulted a lexicon (BDB, HALOT, BDAG, Strong's) or a set of translator's
  notes (e.g. the NET Bible notes). Do not reconstruct an etymology from
  memory and present it as fact.
- If you cite a cross-reference, **verify the cited verse actually says what
  you claim.** "This echoes Isaiah 53:5" requires checking Isaiah 53:5.
- If you attribute a view to a scholar or a tradition, make sure that scholar
  or tradition actually holds it. If a view is contested, say so.
- If you cite a book or article, it must really exist, with the author, title,
  and venue stated correctly. Do not invent plausible-sounding citations.

Inventing word etymologies, fabricating cross-references, or attributing views
to people or traditions that do not hold them is a **project-killing failure
mode** — worse than producing fewer summaries, and worse than leaving a claim
out. **When in doubt, omit the claim.** A thin, accurate summary beats a rich,
unreliable one every time.

**Sources discipline.** List every source behind a deep summary in the
`sources` frontmatter. Acceptable sources: published lexicons, peer-reviewed
commentaries, the NET Bible notes, the LDS Bible Dictionary and Guide to the
Scriptures, the Joseph Smith Papers, and reputable academic scholarship. Not
acceptable: random blogs, AI summaries of other texts, or training-data
confidence without verification. Only include a `url` you are confident
resolves.

Accuracy over coverage. Always.

---

## 3. LDS-Canon Believing Voice

SumBible writes from the perspective of a faithful Latter-day Saint who fully
believes the Book of Mormon, Doctrine and Covenants, and Pearl of Great Price
as scripture from the mouth of God.

**For Bible content** (Old Testament, New Testament), report the spectrum of
scholarly views where genuine believer-level disagreement exists — Mosaic
authorship of the Pentateuch, dating of John, the Pauline disputed letters.
Bible-content discipline remains "report the spectrum, don't arbitrate."

**For LDS-canon content** (BoM, D&C, PGP), **do not equivocate** about the
text's canonical claims. The Book of Mormon *is* another testament of Jesus
Christ, *was* translated by Joseph Smith through divine power, *records* the
religious history of ancient American peoples. The Doctrine and Covenants
*is* revelation. The Pearl of Great Price *is* scripture. Use the
matter-of-fact voice the LDS Bible Dictionary or *Saints* would use — not
"the text describes," "the Church teaches," "claims to be." Those hedges
import outsider skepticism into a believer's reference.

Where scholarly conversations exist (the Book of Abraham papyri question, BoM
historicity debates, the dating of D&C revelations), report them with the
believer's frame intact. "Scholars have raised questions about X; the
canonical claim is Y" — not "X is contested, so Y is uncertain."

---

## 4. Deity Capitalization

**Every reference to Deity gets capitalized.** This is enforced by the lint
rule (`lint:content` deity-cap check) and by the pre-commit audit checklist
(§18). Before you commit, run your own eye through the new prose and verify.

**Always-capitalized terms** (lowercase in Deity context = ERROR):

- "God" (when referring to the Christian / LDS God)
- "Lord" (when referring to Deity)
- "Father" (when referring to God the Father)
- "Son" (when referring to Christ)
- "Holy Ghost", "Holy Spirit", "Spirit" (when referring to the Holy Spirit)
- "Savior", "Redeemer", "Creator", "Author" (when referring to Deity)
- "Almighty", "Most High", "Ancient of Days"
- "Word" (when referring to Christ as Logos)
- "Beloved" (when referring to Christ)
- "Messiah", "Christ", "Jesus", "Yahweh", "Jehovah"
- Pronouns referring to Deity: "He", "Him", "His", "Himself"

**Context-dependent terms** (the lint warns; you verify):

- "spirit" — lowercase OK for mood / attitude / disposition; capital required
  for the Holy Spirit
- "father" — lowercase OK for an earthly father; capital for God the Father
- "lord" — lowercase OK for an earthly noble; capital for Deity
- "son" — lowercase OK in general; capital when referring to Christ

**Quoted scripture is exempt.** Capitalization in `<ScriptureBlock>` and
quoted passages reflects the published text — do not alter quotations.
Capitalization applies to SumBible's own prose.

---

## 5. Editorial Discipline

There is a real distinction between:

- *Describing the text's effect* (allowed): "Romans 8 is a profoundly moving
  meditation on hope and suffering."
- *Arguing for the text's uniqueness or precision* (not allowed): "Romans 8's
  chiasm is unusually precise for Pauline epistolary work."

The first reports the experience of a reader. The second smuggles a
comparative-uniqueness argument that the text — and the reader — has not
earned. The same word can land either way; the lint rule warns on hedge words
and you judge.

**Hedge words the lint warns on:** unusually, remarkably, surprisingly,
extraordinarily, uniquely, improbably, "particularly precise", "exceptionally
accurate".

**Words the lint does *not* flag** (legitimate descriptions of effect):
powerful, notable, striking, profound, moving, memorable, significant.

**Tone discipline.** Insight, not retelling. Faith-respecting, never
tendentious. Reverent in spirit, academically honest in substance. No
sermonizing for the Bible canons; no equivocating for the LDS canons (§3).

---

## 6. Quotation Discipline

**Public-domain scripture** can be quoted at length with proper attribution.
This covers the KJV, the ASV, the JPS 1917 Tanakh, the Geneva Bible, the
Douay-Rheims, and **all of the LDS Standard Works**. The `<ScriptureBlock />`
2-verse soft limit is **removed** for these sources.

**Modern copyrighted translations** (NIV, ESV, NRSV, NLT, NASB, NABRE, and
the like) follow their publisher licensing — typically 500 verses or 25% of a
work, whichever is shorter, with required attribution. SumBible defaults to
short quotation (one or two verses at a time) from copyrighted translations
to stay comfortably within fair use.

**Copyrighted commentary, books, articles, and websites:** paraphrase first.
Short direct quotes (≤ 15 words) only when the exact wording is load-bearing.
Always attribute inline and add to Sources.

---

## 7. Repetition Discipline

Meta-claims about a canon — its origin language, translation provenance,
manuscript history, the dating debates around it — belong in the **canon
summary**, not in every chapter. State once at the highest applicable level
and do not repeat.

For example, the fact that the Book of Mormon has no extant source-language
manuscript is a canon-level fact. It belongs in the BoM canon summary, not in
every BoM chapter summary. The lint rule warns when these phrases reappear
in a chapter under a canon that already carries them.

---

## 8. Cross-Reference Discipline

**Every cross-reference cited in a deep summary uses `<VerseRef />`** — so
each becomes a clickable, verified outbound link. `lint:content` warns on raw
textual references (e.g. `Isaiah 53:5` written as plain prose).

```mdx
<VerseRef book="isaiah" chapter={53} verse={5} />
<VerseRef book="proverbs" chapter={8} verse="22-31" />   {/* verse range */}
<VerseRef book="ezekiel" chapter="1-3" />                {/* chapter range */}
<VerseRef book="3-nephi" chapter={11} verse="22-28" />
```

`book` is the canon slug from `src/lib/canons.ts`; the canon is inferred.
`verse` is optional (omit for a chapter-level reference). LDS-canon
references always link to churchofjesuschrist.org.

**Symmetric discipline.** Every reference to a Bible character, place, event,
or passage in LDS-canon content gets a `<VerseRef />` to its Bible occurrence
— a BoM mention of Zedekiah or Isaiah or the temple of Solomon becomes a
link back to the Bible. Conversely, Bible-canon content with direct LDS
parallel passages (Moses 2 paralleling Genesis 1, for example) gets
`<VerseRef />` links to the LDS material.

Do **not** wrap a self-reference (a pointer to the current chapter) or a
reference trapped inside another component's attribute. When unsure whether a
mention is a real cross-reference, leave it as plain text — a false link is
worse than a missed one.

---

## 9. Anonymity

The site does not name its author personally. **JSON-LD `author` is
`{ "@type": "Organization", "name": "SumBible" }`**, not Person. The About
page uses passive / organizational voice ("SumBible was built using...",
not "I built SumBible..."). The repository link stays accessible — in the
"Suggest a correction" GitHub URL, and in the HTML-comment build credit in
every page's `<head>` — for anyone determined to find the builder. The site
surface stays anonymous.

---

## 10. Frontmatter Schema

Every piece of content is one `.mdx` file, validated by
`src/content.config.ts`. Generate a fresh, schema-correct skeleton with
`new-chapter` / `new-book` / `new-canon` (§16); never freehand the
frontmatter.

Common fields (chapters / books / canons):

| Field | Type | Notes |
| :-- | :-- | :-- |
| `highlightSummary` | string (required) | ≤ 3 sentences, target word count per §12. |
| `themes` | string[] | Thematic tags, lowercase-hyphenated. |
| `sources` | array of `{title, author?, url?, note?}` | Every non-obvious claim cited. |
| `status` | enum: `draft` / `review` / `published` | Defaults to `draft`. |
| `draftedBy` | string | `claude-code` for AI drafts. |
| `draftedOn` | quoted ISO date | See §11. |
| `reviewedBy`, `reviewedOn` | string / quoted date | Set by `promote-content`. |

Chapter-specific fields: `canon`, `book`, `bookSlug`, `bookOrder`, `chapter`,
`originalLanguage`, `title` (optional, ≤ 80 chars ≈ 10 words),
`externalLinks`, `christReferences`.

Book-specific: `canon`, `bookSlug`, `name`, `subtitle` (optional, ≤ 80 chars),
`authorshipNote`, `datingNote`, `literaryGenre`.

Canon-specific: `slug`, `name`, `subtitle` (optional, ≤ 120 chars),
`spanNote`, `languageNote`, `bookCount`.

---

## 11. The Date-Quoting Rule

**Every date in frontmatter MUST be a quoted string.** An unquoted ISO date
is parsed by YAML as a Date object, which fails the `z.string()` schema and
breaks the build. `lint:content` enforces this as a hard ERROR.

```yaml
draftedOn: "2026-05-27"     # ✅ correct — quoted
draftedOn: 2026-05-27       # ❌ wrong — parses as a YAML date, build fails
```

The `new-*` scaffolds quote dates automatically; `promote-content` keeps them
quoted. You only need to think about this if you hand-edit frontmatter.

---

## 12. Content Type Word-Count Targets

**Chapter summaries.** Highlight ≤ 3 sentences, 60–120 words. Deep summary
**500–700 words** of prose paragraphs — not a verse-by-verse retell. The
deep summary is *insight, not restatement*. If a sentence only retells the
chapter, cut it.

**Book summaries.** Highlight ≤ 3 sentences, 60–120 words. Deep summary
**150–250 words** (revised from 300–500). Voice: warm, knowledgeable friend
— matching the chapter register scaled up to the book level. The book
summary's job is orientation — what *is* this book, what's its shape, why
does it matter — not comprehensive treatment. Avoid academic essay structure.

**Canon summaries.** Highlight ≤ 3 sentences, 60–120 words. Deep summary
**400–600 words**. Structure: what the canon is; its major structural
divisions; its principal theological arcs; its overall orientation.

**Related-texts entries.** Defined in session 04b.

---

## 13. Component Usage

Six components are available **globally** inside chapter / book / canon MDX —
do not `import` them. Use a component only where it earns its place.

### `<LangNote>` — inline original-language term

```mdx
<LangNote term="bara" script="בָּרָא" language="Hebrew"
  gloss="to create. In the Hebrew Bible this verb in its basic (qal) form
  takes only God as its subject.">Created</LangNote>
```

Use double quotes for attributes; avoid double quotes inside `gloss`. Skip
when there is no extant original-language text.

### `<LangNotes>` — collapsible notes section

A collapsible block at the foot of a deep summary for longer commentary. For
chapters with no original language, reframe it ("Structural Notes",
"Intertextual Notes", "Relationship to Genesis", etc.) rather than dropping.

### `<TranslationCompare>` — translation-divergence callout

For a specific verse where honest translations meaningfully diverge. Skip
when the text exists in only one translation (Book of Mormon, D&C).

### `<VerseRef>` — clickable cross-reference (see §8)

### `<ScriptureBlock>` — quoted passage

```mdx
<ScriptureBlock reference="Romans 8:1" translation="ESV">
  There is therefore now no condemnation for those who are in Christ Jesus.
</ScriptureBlock>
```

Public-domain sources (KJV / ASV / JPS 1917 / LDS Standard Works): quote as
much as serves. Copyrighted translations: 1–2 verses at a time. See §6.

### MDX formatting note

Keep component children **flush-left** with blank lines between blocks.
Indenting Markdown four-plus spaces inside a component turns it into a code
block.

---

## 14. Themes and christReferences

`themes` are lowercase-hyphenated thematic tags. There is no fixed
vocabulary — themes accrete organically — but reuse existing tags rather than
coining near-duplicates. Suggested starting vocabulary:

`creation`, `covenant`, `messianic-prophecy`, `divine-name`, `theophany`,
`wisdom`, `prophetic-call`, `atonement`, `restoration`, `temple`,
`exile-and-return`, `kingdom-of-god`, `discipleship`, `eschatology`.

`christReferences` (chapters only) flags verses where a name or title of
Christ appears. The `/christ` index renders these, and each becomes a verse
anchor on the chapter page. **Verify each verse number.**

```yaml
christReferences:
  - verse: 7
    name: Beloved Son
    note: "Spoken by the voice of the Father, introducing the Son."
```

---

## 15. Proper-Noun Consistency

A short list of terms whose capitalization SumBible standardizes:

- Tree of Life
- Atonement (capital A, referring to Christ's atoning act)
- Restoration (capital R, referring to the LDS Restoration)
- First Vision (Joseph Smith's vision)
- Standard Works (the LDS scriptural canon)
- Gospel (capital G when referring to the Christian / LDS gospel; lowercase for
  one of the four Gospel narratives — "the Gospel of John")
- Plan of Salvation
- Word of Wisdom

---

## 16. Authoring Scripts

| Command | What it does |
| :-- | :-- |
| `npm run new-chapter -- --canon <c> --book <slug> --chapter <n> [--title "..."]` | Scaffolds a schema-correct chapter MDX skeleton (dates quoted, `status: draft`). |
| `npm run new-book -- --canon <c> --book <slug>` | Scaffolds a book-summary MDX skeleton. |
| `npm run new-canon -- --canon <c>` | Scaffolds a canon-summary MDX skeleton. |
| `npm run promote-content -- --kind <chapter\|book\|canon> --canon <c> [--book <slug>] [--chapter <n>] --to <status> [--reviewed-by <name>]` | Flips status; stamps `reviewedOn` / `reviewedBy`. Never hand-edit status. |
| `npm run promote-chapter -- ...` | Backward-compat alias for `promote-content --kind chapter`. |
| `npm run lint:content` | Runs the discipline checks Zod can't, across the chapter / book / canon collections. |
| `npm run build-favicons` | Rasterizes `public/favicon.svg` to the PNG favicon set. |

---

## 17. Status Workflow and CI

New content starts at `draft`. After review, a human promotes it via
`promote-content`:

```
draft  ──promote-content──▶  review  ──promote-content──▶  published
```

`draft` and `review` content shows a badge, carries
`<meta name="robots" content="noindex">`, and is kept out of the sitemap and
the JSON-LD. Only `published` content is advertised to search engines.

**CI.** Every pull request to `main` runs `.github/workflows/validate.yml`
(`lint:content`, `astro check`, `build`). A local pre-commit hook (`astro
check` + `lint:content`) catches the same issues earlier. Content is drafted
on a feature branch, opened as a PR, and merged only after human review —
never committed straight to `main`.

---

## 18. Pre-Commit Audit Checklist

Before every commit that touches content, run through this:

1. Deity references all capitalized (see §4).
2. No editorializing about content's uniqueness / precision / unlikelihood
   (see §5).
3. All Bible cross-references in LDS-canon content use `<VerseRef />` (see §8).
4. All LDS-canon cross-references in Bible content use `<VerseRef />` (see §8).
5. No repeated canon-level meta-claims in chapter content (see §7).
6. Quotation discipline followed: public-domain vs copyrighted (see §6).
7. Sources cited for all non-obvious claims (see §2).
8. LDS-canon content uses believing voice; Bible content reports the
   spectrum (see §3).
9. For files in `KEITH_EDITS_BASELINE.md` (when present in a session):
   Keith's prior edits preserved.
10. Proper-noun consistency (Tree of Life, Atonement, Restoration, First
    Vision, etc. — see §15).

---

## 19. Christ Iconography Reference

SumBible's visual identity is built from **symbolic** Christian iconography,
never figurative imagery. Hard rule: **no generated or embedded image
depicting Christ, a prophet, or any divine figure as a person** — not in
favicons, OG images, decoration, or anywhere else.

Icon components in `src/components/icons/`:

- **ChiRho** — the Christogram (Χ + Ρ). Favicon, header mark, `/christ` page
  anchor; emblem of the New Testament and Book of Mormon canons.
- **AlphaOmega** — Revelation 1:8. Centerpiece of `<SectionDivider />`.
- **Ichthys** — the early-Christian fish. Footer decoration.
- **Cross** — a plain Latin cross. Emblem of the Doctrine and Covenants and
  the Pearl of Great Price.
- **Aleph** — the Hebrew letter א. Emblem of the Old Testament, which
  predates the Christian christogram.

`<CanonIcon canon={...} />` maps each canon to its emblem. All icons render
in `currentColor`.

---

## 20. Verification Log Discipline

Every chapter MDX file includes a `verificationLog` field in frontmatter. The
drafting agent populates it **during research, before drafting the prose** —
every non-obvious claim that appears in the deep summary or the LangNotes
section traces to one entry in the log. The log is the *receipt* of the
research: a permanent record of which sources the drafter actually consulted
and verified.

```yaml
verificationLog:
  - claim: "Hebrew bara takes only God as subject in the qal form"
    source: "Brown-Driver-Briggs Hebrew and English Lexicon, entry on bara"
    verifiedOn: "2026-05-27"
  - claim: "Colwell's rule on definite predicate nouns lacking the article"
    source: "E. C. Colwell, JBL 52 (1933): 12-21"
    url: https://example.org/colwell-1933
    verifiedOn: "2026-05-27"
```

The lint rule (`scripts/lint-content.ts` check #7) warns when a chapter at
`status: review` or `status: published` has a substantial deep summary
(>1,600 characters) and fewer than 3 verification-log entries. A near-empty
log on substantial content indicates either (a) claims that weren't actually
verified, or (b) verification work that wasn't recorded. Both are blockers.

The verification log renders on the chapter page as a collapsed
`<details>` block titled "Research sources" below the canonical Sources
block — readers can expand it to see what the drafter consulted.

The pre-commit audit checklist (§18) is extended by item 11: verification
log populated for the work claimed in the chapter.

---

## 21. Book Context Discipline

Every book with at least one drafted chapter has a context file at
`src/data/book-context/<canon>/<book-slug>.md`, regenerated at every build
from the chapters of that book (any status — draft, review, or published).
The context file is a running summary of what's been established across
already-drafted chapters: themes, Christ references, per-chapter highlights.

**When dispatching a chapter-drafting session for a book that has prior
chapters, the session task file MUST instruct the agent to read the relevant
book-context file in its Phase 0 before drafting.** The file appears in the
agent's context, ensuring cross-chapter consistency: themes already
established, characters already introduced, cross-references already cited,
key narrative facts already covered.

For example: drafting Genesis 2 with Genesis 1 already in the corpus, the
agent reads `src/data/book-context/bible-ot/genesis.md` and knows what
Genesis 1's deep summary established about *Elohim*, *bara*, the seven-day
pattern, the imago Dei — and can build on rather than re-establish those
points.

The standard Phase 0 line for a chapter-drafting session:

```bash
cat src/data/book-context/<canon>/<book-slug>.md
```

The script lives at `scripts/build-book-context.ts` and is wired into
the `prebuild` npm script alongside `build-cross-reference-index.ts`.

---

## 22. Chapter-Drafting Session Discipline (Small Batches)

Chapter-drafting sessions follow a small-batch rhythm to protect against
context fatigue and cross-chapter contradiction.

**Batch size.** 5–7 chapters per session, maximum 10. Batches are scoped to
coherent narrative units where possible — e.g. "Genesis primeval history,
chapters 2–11" (chapter 1 is already drafted, so the actual batch covers 10
chapters in one coherent unit).

**Session structure.** Phase 0 includes reading the book-context file (§21)
and the prior chapter's draft (the one immediately preceding the batch). One
phase per chapter follows. Each chapter commit pushes to the feature branch.
After every commit, the agent reads its own freshly-committed chapter before
drafting the next — using its own published-and-committed work as the
authoritative reference rather than holding the entire batch in working
memory.

**Per-chapter discipline.** The verificationLog (§20) is populated during
research, before drafting the prose. The pre-commit audit checklist (§18,
extended by §20's item 11) runs before every chapter commit. The agent does
NOT batch chapters in working memory — each chapter is drafted, audited,
committed, pushed, and the agent re-orients to the next chapter from a
refreshed context.

**Session boundary.** At the end of every chapter-drafting session, the
book-context file is regenerated automatically on the next build (via the
prebuild hook). Subsequent sessions for the same book consume the updated
context.

**Branch and PR workflow.** Each batch is its own feature branch (typical
naming: `content/<book>-batch-<N>`) and its own PR. Keith reviews each batch
on Vercel preview before merging. No batch is merged autonomously; the
small-batch discipline includes a human review gate at every batch boundary.

A starting-point task-file template lives at
`templates/chapter-batch-task-file.md` — the structure encodes the
discipline above. The template is a *starting point*, not run directly;
it's the skeleton for hand-customizing each batch task file.
