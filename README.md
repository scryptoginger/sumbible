# SumBible

Chapter-by-chapter summaries of the Bible and the LDS Standard Works, informed by Hebrew, Greek, and multi-translation insight.

**Live site:** [sumbible.vercel.app](https://sumbible.vercel.app)

## What this is

SumBible is a public reference site. For each chapter of scripture it covers, it
offers two summaries: a short "highlight reel" of what the chapter is really
doing, and a deeper summary that draws on the original languages, the structure
of the text, cross-references, and the places where translations and traditions
read a passage differently.

It covers the Protestant 66-book Bible and the Latter-day Saint Standard Works
(Book of Mormon, Doctrine and Covenants, Pearl of Great Price). It **does not**
reproduce the text of scripture — every chapter links out to canonical online
editions, and quotes no more than a verse or two for context.

The guiding principle is **accuracy over coverage**: a few well-sourced chapters
are worth more than a thousand hallucinated ones. See [`AUTHORING.md`](./AUTHORING.md)
for the full content contract.

## Tech stack

- **[Astro 6](https://astro.build)** — static site generator
- **MDX** — chapter content, so custom components embed inline
- **Tailwind CSS 4** — via the `@tailwindcss/vite` plugin
- **Astro Content Collections** — Zod-typed chapter metadata
- **`@astrojs/vercel`** — static-output adapter; deployed on **Vercel**
- **TypeScript** throughout

> Note: the project was specified against Astro 5, but `create-astro` now
> installs Astro 6. Astro 6 supports the same Content Layer API, MDX, Tailwind,
> and Vercel adapter, so the project runs on Astro 6.

## Local development

Requires Node 20.3+ or 22+ (see `.nvmrc`; Node 22 recommended).

```sh
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:4321)
npm run build    # build the static site to ./dist
npm run preview  # preview the production build locally
npx astro check  # type-check + validate content collections
```

## Project structure

```text
src/
├── components/        # LangNote, LangNotes, TranslationCompare, Sources, StatusBadge, Header, Footer
├── content/
│   └── chapters/      # chapter MDX files, organized by canon and book
├── content.config.ts  # Zod schema for the 'chapters' collection
├── layouts/           # BaseLayout
├── lib/canons.ts      # canon / book / chapter-count metadata
├── pages/             # routes (home, about, [canon], [canon]/[book], chapter, 404)
├── scripts/           # langnote-mobile.ts (touch-device popover toggle)
└── styles/global.css  # Tailwind import + theme tokens
```

## Adding a chapter

A chapter is a single `.mdx` file under `src/content/chapters/<canon>/<book>/`.
Filenames and folder names are organizational only — routes are generated from
the **frontmatter**, not the file path.

1. Create the file, e.g. `src/content/chapters/bible-ot/01-genesis/02.mdx`.
2. Fill in the frontmatter (schema in [`AUTHORING.md`](./AUTHORING.md) and
   enforced by `src/content.config.ts`).
3. Write the deep summary in the MDX body. The `<LangNote>`, `<LangNotes>`, and
   `<TranslationCompare>` components are available globally — do **not** import
   them.
4. Run `npm run build` and `npx astro check`; the chapter appears in navigation
   automatically.

The seven seed chapters are the templates to copy from:

| Chapter | Path | Demonstrates |
| :-- | :-- | :-- |
| Genesis 1 | `bible-ot/01-genesis/01.mdx` | full Hebrew workflow, all three components |
| John 1 | `bible-nt/43-john/01.mdx` | full Greek workflow |
| Romans 8 | `bible-nt/45-romans/08.mdx` | a textual-variant `TranslationCompare` |
| 1 Nephi 1 | `book-of-mormon/01-1-nephi/01.mdx` | no original language; `LangNotes` only |
| 3 Nephi 11 | `book-of-mormon/03-3-nephi/11.mdx` | intertextual notes; `christReferences` |
| D&C 1 | `doctrine-and-covenants/001.mdx` | no content components at all |
| Moses 1 | `pearl-of-great-price/moses/01.mdx` | JST text; Genesis-relationship notes |

## Content workflow

AI-drafted on a feature branch → pull request → human review → merge to `main`
→ Vercel auto-deploys. Each chapter carries a workflow `status`:

- **`draft`** — AI-drafted, not yet reviewed. Shows a "Draft — awaiting review"
  badge. May contain errors.
- **`review`** — under human review. Shows an "In review" badge.
- **`published`** — reviewed and approved. No badge.

## License

- **Code:** MIT (see `LICENSE`).
- **Summary text and other written content:** © Keith Lutes. All rights
  reserved. _(This licensing split is provisional and may be revisited.)_
