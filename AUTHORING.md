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
`src/content.config.ts` — a build will fail if it does not conform. Fields:

| Field | Type | Required | Notes |
| :-- | :-- | :-- | :-- |
| `canon` | enum | yes | One of: `bible-ot`, `bible-nt`, `book-of-mormon`, `doctrine-and-covenants`, `pearl-of-great-price`. |
| `book` | string | yes | Human-readable book name, e.g. `Genesis`, `1 Nephi`. |
| `bookSlug` | string | yes | URL-safe slug, e.g. `genesis`, `1-nephi`. Must match `src/lib/canons.ts`. |
| `bookOrder` | integer | yes | The book's order within its canon (Genesis = 1, John = 4, Romans = 6). |
| `chapter` | positive integer | yes | The chapter (or D&C section) number. |
| `originalLanguage` | enum | yes | `hebrew`, `aramaic`, `greek`, `mixed-hebrew-aramaic`, `modern-english`, or `none`. |
| `title` | string | no | Optional thematic title, e.g. `The Word Made Flesh`. |
| `highlightSummary` | string | yes | The highlight reel. 40–600 characters; aim for 60–120 words. |
| `externalLinks` | object | no | Any of `churchofjesuschrist`, `biblegateway`, `bibleHub`, `blueLetterBible`, `netBible` — each a full URL. |
| `sources` | array | no | `{ title, author?, url?, note? }`. List every source behind the deep summary. |
| `christReferences` | array | no | `{ verse, name, note? }`. Flags a verse where a name or title of Christ appears. Forward-compatible data hook. |
| `status` | enum | no | `draft` (default), `review`, or `published`. |
| `draftedBy` | string | no | Set to `claude-code` for AI drafts. |
| `draftedOn` | string | no | ISO date. **Must be quoted** (`"2026-05-22"`) or YAML parses it as a date object and validation fails. |
| `reviewedOn` | string | no | ISO date, quoted. Set at review time. |

**Always set `status: draft`, `draftedBy: claude-code`, and a quoted
`draftedOn` on a new AI-drafted chapter.** A human flips `status` after review.

---

## 3. The two summaries

### Highlight summary (frontmatter `highlightSummary`)

≤ 3 sentences, **~60–120 words**. It captures the chapter's *load-bearing
movement* — not merely "what happens" but *what matters* about what happens. It
is the one paragraph a reader should get even if they read nothing else.

### Deep summary (the MDX body)

**400–700 words of prose** (aim 500–700 for richer chapters, 300–500 for short
ones like D&C sections). Organized in clear paragraphs — **not** a verse-by-verse
retelling. It surfaces structure, key terms, intertextual links, and theological
weight. It should read like a knowledgeable friend talking: not a Sunday-school
lesson, not a seminary textbook.

The deep summary is **insight, not restatement**. If a sentence only retells the
chapter, cut it. Every sentence should help the reader see something they would
not otherwise see.

---

## 4. The three content components

These are available **globally** inside chapter MDX — do not `import` them.
Use a component only where it earns its place; never shoehorn.

### `<LangNote>` — inline original-language term

For a short observation about one Hebrew, Aramaic, or Greek word, inline in the
prose. Renders a dotted underline; the gloss appears on hover/tap.

```mdx
The first word sets the tone. <LangNote term="bara" script="בָּרָא"
language="Hebrew" gloss="to create. In the Hebrew Bible this verb in its basic
(qal) form takes only God as its subject.">Created</LangNote> is a verb the
Hebrew Bible reserves.
```

Attributes: `term` (transliteration), `script` (optional, the original script),
`language` (`Hebrew` | `Aramaic` | `Greek`), `gloss` (the explanation). Use
**double quotes** for attributes and avoid double quotes inside the `gloss`
(single quotes are fine). Skip `<LangNote>` entirely when there is no extant
original-language text (Book of Mormon, D&C, JST material).

### `<LangNotes>` — collapsible notes section

A collapsible block at the **foot of the deep summary** for longer commentary —
structure, extended word study, intertextual links. Content is plain
Markdown/MDX, flush-left, blank lines between blocks.

```mdx
<LangNotes>

**The seven-day frame.** The days are not a simple list...

**A plural word for one God.** *Elohim* is grammatically plural...

</LangNotes>
```

For chapters with no original language, the section is still useful — reframe
its content (e.g. "Structural and Hebraistic Notes", "Intertextual Notes",
"Relationship to Genesis and Theological Notes") rather than dropping it.

### `<TranslationCompare>` — translation-divergence callout

For a specific verse where honest translations meaningfully diverge. The
`translations` slot holds a Markdown list; the default slot holds the
commentary explaining what is at stake.

```mdx
<TranslationCompare verse={28} passage="Romans 8:28">
<Fragment slot="translations">
- **KJV:** "all things work together for good..."
- **NIV:** "in all things God works for the good..."
</Fragment>

Behind the difference is a textual variant...
</TranslationCompare>
```

Skip it when a chapter has no meaningful divergence, or when the text exists in
only one translation (the Book of Mormon, the D&C).

**MDX formatting note:** keep component children **flush-left** with blank lines
separating block content. Indenting Markdown four-plus spaces inside a component
turns it into a code block.

---

## 5. Sources discipline

- List **every** source behind the deep summary in the `sources` frontmatter
  array. It renders as a "Sources" block at the foot of the page.
- Acceptable sources: published lexicons (BDB, HALOT, BDAG, Strong's),
  peer-reviewed commentaries, the NET Bible translator's notes, the LDS Bible
  Dictionary and Guide to the Scriptures (for LDS-adjacent claims), the Joseph
  Smith Papers, and reputable academic scholarship.
- **Not** acceptable: random blogs, AI summaries of other texts, or your own
  training-data confidence without verification.
- Verify every cross-reference before citing it.
- Where a scholarly view is contested, name the disagreement; do not pick a
  winner.
- Only include a `url` you are confident resolves. A missing URL is better than
  a broken one.

---

## 6. Tone discipline

- **Insight, not retelling.** Commentary that helps a reader see something new.
- **Enhance, never replace, personal study.** The site sends readers *to* the
  text, quoting no more than a verse or two for context.
- **Multi-translation and multi-tradition.** Where translations meaningfully
  disagree, surface it. Where Christian traditions read a passage differently,
  name it.
- **Faith-respecting but not tendentious.** Reverent and devotional in spirit,
  academically honest in substance. No sermonizing. Never subtly argue that one
  tradition's reading is obviously correct.

---

## 7. Quick checklist before committing a draft

- [ ] Frontmatter validates (`npm run build` and `npx astro check` pass).
- [ ] `status: draft`, `draftedBy: claude-code`, quoted `draftedOn`.
- [ ] Highlight is ≤ 3 sentences, ~60–120 words.
- [ ] Deep summary is 400–700 words, paragraphs, not a verse-by-verse retell.
- [ ] Every non-obvious claim is sourced; every cross-reference is verified.
- [ ] Components used only where they earn their place; MDX renders correctly.
- [ ] No invented etymologies, citations, or scholarly attributions.
