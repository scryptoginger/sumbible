# Authoring a SumBible Chapter

This document is the **contract** for drafting any chapter summary on SumBible —
whether the drafter is a future Claude Code session or a human contributor. Read
it before drafting, and follow it.

---

## 1. The hallucination guardrail — read this twice

SumBible lives publicly under Keith Lutes's name. **Every non-obvious claim in a
chapter summary must be traceable to a real, published source.**

- If you write that a Hebrew or Greek word "means X," you must have actually
  consulted a lexicon (BDB, HALOT, BDAG, Strong's) or a set of translator's
  notes (e.g. the NET Bible notes). Do not reconstruct an etymology from memory
  and present it as fact.
- If you cite a cross-reference, **verify the cited verse actually says what you
  claim.** "This echoes Isaiah 53:5" requires checking Isaiah 53:5.
- If you attribute a view to a scholar or a tradition, make sure that scholar or
  tradition actually holds it. If a view is contested, say so.
- If you cite a book or article, it must really exist, with the author, title,
  and venue stated correctly. Do not invent plausible-sounding citations.

Inventing word etymologies, fabricating cross-references, or attributing views
to people or traditions that do not hold them is a **project-killing failure
mode** — worse than producing fewer chapters, and worse than leaving a claim
out. **When in doubt, omit the claim.** A thin, accurate summary beats a rich,
unreliable one every time.

Accuracy over coverage. Always.

---

## 2. Frontmatter schema

Every chapter is one `.mdx` file. The frontmatter is validated by
`src/content.config.ts` — a build will fail if it does not conform. Generate a
fresh, schema-correct skeleton with `npm run new-chapter` (see §10); never
freehand the frontmatter.

| Field | Type | Required | Notes |
| :-- | :-- | :-- | :-- |
| `canon` | enum | yes | `bible-ot`, `bible-nt`, `book-of-mormon`, `doctrine-and-covenants`, `pearl-of-great-price`. |
| `book` | string | yes | Human-readable book name, e.g. `Genesis`, `1 Nephi`. |
| `bookSlug` | string | yes | URL-safe slug, e.g. `genesis`, `1-nephi`. Must match `src/lib/canons.ts`. |
| `bookOrder` | integer | yes | The book's order within its canon (Genesis = 1, John = 4, Romans = 6). |
| `chapter` | positive integer | yes | The chapter (or D&C section) number. |
| `originalLanguage` | enum | yes | `hebrew`, `aramaic`, `greek`, `mixed-hebrew-aramaic`, `modern-english`, or `none`. |
| `title` | string | no | Optional thematic title, e.g. `The Word Made Flesh`. |
| `highlightSummary` | string | yes | The highlight reel. 40–600 characters; aim for 60–120 words. |
| `externalLinks` | object | no | Any of `churchofjesuschrist`, `biblegateway`, `bibleHub`, `blueLetterBible`, `netBible` — each a full URL. |
| `sources` | array | no | `{ title, author?, url?, note? }`. List every source behind the deep summary. |
| `christReferences` | array | no | `{ verse, name, note? }`. See §7. |
| `themes` | array of string | no | Thematic tags. See §7. |
| `status` | enum | no | `draft` (default), `review`, or `published`. See §11. |
| `draftedBy` | string | no | Set to `claude-code` for AI drafts. |
| `draftedOn` | string | no | ISO date — **quoted** (see §3). |
| `reviewedBy` | string | no | Set by `promote-chapter` at review time. |
| `reviewedOn` | string | no | ISO date — **quoted**. Set by `promote-chapter`. |

**Always set `status: draft`, `draftedBy: claude-code`, and a quoted
`draftedOn` on a new AI-drafted chapter.** A human flips `status` after review.

---

## 3. The date-quoting rule

**Every date in frontmatter MUST be a quoted string.** An unquoted ISO date is
parsed by YAML as a date object, which fails the `z.string()` schema and breaks
the build. This is enforced by `npm run lint:content` (a hard ERROR).

```yaml
draftedOn: "2026-05-22"     # ✅ correct — quoted
draftedOn: 2026-05-22       # ❌ wrong — parses as a YAML date, build fails
```

`npm run new-chapter` already quotes dates; `npm run promote-chapter` keeps them
quoted. You only need to think about this if you hand-edit frontmatter.

---

## 4. The two summaries

### Highlight summary (frontmatter `highlightSummary`)

≤ 3 sentences, **~60–120 words**. It captures the chapter's *load-bearing
movement* — not merely "what happens" but *what matters* about what happens.

### Deep summary (the MDX body)

**400–700 words of prose** (aim 500–700 for richer chapters, 300–500 for short
ones like D&C sections). Organized in clear paragraphs — **not** a verse-by-verse
retelling. It surfaces structure, key terms, intertextual links, and theological
weight. It should read like a knowledgeable friend talking: not a Sunday-school
lesson, not a seminary textbook.

The deep summary is **insight, not restatement**. If a sentence only retells the
chapter, cut it.

---

## 5. Content components

Five components are available **globally** inside chapter MDX — do not `import`
them. Use a component only where it earns its place; never shoehorn.

### `<LangNote>` — inline original-language term

For a short observation about one Hebrew, Aramaic, or Greek word.

```mdx
<LangNote term="bara" script="בָּרָא" language="Hebrew"
  gloss="to create. In the Hebrew Bible this verb in its basic (qal) form
  takes only God as its subject.">Created</LangNote>
```

Use **double quotes** for attributes and avoid double quotes inside `gloss`.
Skip `<LangNote>` entirely when there is no extant original-language text.

### `<LangNotes>` — collapsible notes section

A collapsible block at the **foot of the deep summary** for longer commentary.
For chapters with no original language, reframe it ("Structural Notes",
"Intertextual Notes", etc.) rather than dropping it.

### `<TranslationCompare>` — translation-divergence callout

For a specific verse where honest translations meaningfully diverge. Skip it
when the text exists in only one translation (Book of Mormon, D&C).

### `<VerseRef>` — cross-reference link (see §6)

### `<ScriptureBlock>` — short quotation

```mdx
<ScriptureBlock reference="Romans 8:1" translation="ESV">
  There is therefore now no condemnation for those who are in Christ Jesus.
</ScriptureBlock>
```

**HARD RULE: never quote more than 2 verses** with `<ScriptureBlock>`, and never
chain several so they aggregate into a long passage. SumBible's commitment not
to reproduce scripture is real — link out with `<VerseRef />` for anything
longer. Use `<TranslationCompare>` (not `ScriptureBlock`) when the point is to
*compare* renderings.

**MDX formatting note:** keep component children **flush-left** with blank lines
between blocks. Indenting Markdown four-plus spaces inside a component turns it
into a code block.

---

## 6. The VerseRef discipline

**Every cross-reference cited in a deep summary uses `<VerseRef />`** — so each
becomes a clickable, verified outbound link. `npm run lint:content` warns on raw
textual references (e.g. `Isaiah 53:5` written as plain prose).

```mdx
<VerseRef book="isaiah" chapter={53} verse={5} />
<VerseRef book="proverbs" chapter={8} verse="22-31" />   {/* verse range */}
<VerseRef book="ezekiel" chapter="1-3" />                {/* chapter range */}
<VerseRef book="3-nephi" chapter={11} verse="22-28" />
```

- `book` is the canon slug from `src/lib/canons.ts`; the canon is inferred.
- `verse` is optional (omit for a chapter-level reference).
- LDS-canon references always link to churchofjesuschrist.org.
- Do **not** wrap a self-reference (a pointer to the current chapter) or a
  reference trapped inside another component's attribute. When unsure whether a
  mention is a real cross-reference, leave it as plain text — a false link is
  worse than a missed one.

---

## 7. Themes and christReferences

### `themes`

Lowercase, hyphenated thematic tags. They drive the `/themes` index. There is no
fixed vocabulary — themes accrete organically — but reuse existing tags rather
than coining near-duplicates. Suggested starting vocabulary:

`creation`, `covenant`, `messianic-prophecy`, `divine-name`, `theophany`,
`wisdom`, `prophetic-call`, `atonement`, `restoration`, `temple`.

```yaml
themes: ["creation", "divine-name", "theophany"]
```

### `christReferences`

Populate this array whenever a name or title of Christ appears in the chapter.
The `/christ` index page renders these, and each becomes a verse anchor on the
chapter page. **Verify each verse number before listing it.**

```yaml
christReferences:
  - verse: 7
    name: Beloved Son
    note: "Spoken by the voice of the Father, introducing the Son."
  - verse: 10
    name: Jesus Christ
    note: "Christ's own self-identification as he descends."
```

---

## 8. Sources discipline

- List **every** source behind the deep summary in the `sources` frontmatter.
- Acceptable: published lexicons (BDB, HALOT, BDAG, Strong's), peer-reviewed
  commentaries, the NET Bible notes, the LDS Bible Dictionary and Guide to the
  Scriptures, the Joseph Smith Papers, and reputable academic scholarship.
- **Not** acceptable: random blogs, AI summaries of other texts, or training-data
  confidence without verification.
- Verify every cross-reference before citing it.
- Where a scholarly view is contested, name the disagreement; do not pick a winner.
- Only include a `url` you are confident resolves.

---

## 9. Tone discipline

- **Insight, not retelling.** Commentary that helps a reader see something new.
- **Enhance, never replace, personal study.** Quote no more than a verse or two.
- **Multi-translation and multi-tradition.** Surface meaningful disagreement;
  name divergent readings rather than flattening them.
- **Faith-respecting but not tendentious.** Reverent in spirit, academically
  honest in substance. No sermonizing. Never subtly argue that one tradition's
  reading is obviously correct.

---

## 10. The authoring scripts

| Command | What it does |
| :-- | :-- |
| `npm run new-chapter -- --canon <c> --book <slug> --chapter <n> [--title "..."]` | Scaffolds a schema-correct MDX skeleton (dates quoted, `status: draft`). |
| `npm run promote-chapter -- --canon <c> --book <slug> --chapter <n> --to <status> [--reviewed-by <name>]` | Flips workflow status; stamps `reviewedOn`/`reviewedBy`. Never hand-edit status. |
| `npm run lint:content` | Runs the discipline checks Zod can't (highlight length, date quoting, raw references, status integrity, …). |

---

## 11. The status workflow and CI

New chapters start at **`draft`**. After review, a human promotes them:

```
draft  ──promote-chapter──▶  review  ──promote-chapter──▶  published
```

`draft` and `review` chapters show a badge, carry `<meta robots noindex>`, and
are kept out of the sitemap and the JSON-LD. Only `published` chapters are
advertised to search engines.

**CI:** every pull request to `main` runs `.github/workflows/validate.yml`
(`lint:content`, `astro check`, `build`). A local **pre-commit hook**
(`astro check` + `lint:content`) catches the same issues before you push.
Content is drafted on a feature branch, opened as a PR, and merged only after
human review — never committed straight to `main`.

---

## 12. Book and canon summaries

Beyond per-chapter summaries, each book and each canon can carry a short
overview, rendered on its index page (`/[canon]` and `/[canon]/[book]`). These
live in `src/data/summaries.ts` — `bookSummaries` (keyed by book slug) and
`canonSummaries` (keyed by canon slug) — currently empty scaffolds with the
rendering already wired up.

A book or canon summary is short prose that makes the same kind of sourceable
claims a chapter summary does — authorship, date, place in the canon, dominant
themes. It gets the same treatment: every non-obvious claim sourced (the
`sources` field), no invented attributions, drafted then reviewed (the `status`
field). Draft these in a dedicated content session, not casually.

---

## 13. Quick checklist before committing a draft

- [ ] Skeleton generated with `npm run new-chapter`.
- [ ] `status: draft`, `draftedBy: claude-code`, quoted `draftedOn`.
- [ ] Highlight is ≤ 3 sentences, ~60–120 words.
- [ ] Deep summary is 400–700 words, paragraphs, not a verse-by-verse retell.
- [ ] Every non-obvious claim is sourced; every cross-reference verified.
- [ ] Cross-references use `<VerseRef />`; quotations use `<ScriptureBlock>` (≤ 2 verses).
- [ ] `themes` and `christReferences` populated where applicable.
- [ ] `npm run build`, `npx astro check`, and `npm run lint:content` all pass.
- [ ] No invented etymologies, citations, or scholarly attributions.
