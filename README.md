# PHYS 10320 · Exam 2 Study Guide

An interactive study site for PHYS 10320 Exam 2, built with [Nextra](https://nextra.site) (docs theme) on Next.js.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + Pagefind search index
```

## Where things live

| Path | What it is |
|---|---|
| `content/*.mdx` | One page per chapter. Edit these to change the guide. |
| `content/_meta.ts` | Sidebar order, titles and section separators. |
| `content/index.mdx` | Home page (progress, chapter grid, practice tools). |
| `content/practice-exams.mdx` | Practice exams v4 and v5. |
| `lib/data/quizzes.json` | Quiz questions, referenced from MDX as `<Quiz id="…" />`. |
| `lib/data/flashcards.json` | The flashcard deck. |
| `lib/data/clues.json` | Clues for the problem-recognizer drill. |
| `lib/data/chapters.json` | Chapter titles, blurbs and quiz ids used by the home page and progress tracking. |
| `lib/exams.ts` | Practice-exam questions and worked solutions (written for this site, not an official key). |
| `components/` | The interactive pieces (quiz, flashcards, RC simulator, solutions, checklist, progress). |
| `mdx-components.tsx` | Registers those components so every MDX page can use them without imports. |

## Writing content

Standard Markdown plus:

- Math: `$inline$` and `$$ … $$` blocks (KaTeX).
- Callouts: `> [!TIP]`, `> [!NOTE]`, `> [!IMPORTANT]`, `> [!WARNING]`. Put the marker on its own line followed by an empty `>` line.
- Diagrams: ` ```mermaid ` code blocks.
- `<Solution> … </Solution>` around the solution part of a worked example (adds the "hide solution" toggle). Leave blank lines inside the tags.
- `<Quiz id="potential-1" />`, `<Flashcards />`, `<RCSimulator />`, `<RecognizerTrainer />`, `<Checklist><Check id="c1">…</Check></Checklist>`.
- MDX treats `{`, `}` and `<` as code outside math and code spans; write them as `\{`, `\}` and `&lt;` in prose.

Progress (quiz answers, completed chapters, checklist ticks, flashcard piles) is saved in the browser's `localStorage`.

## Version notes

- **Nextra is pinned to 4.6.1, with `zod` pinned to 4.1.13 for it** (`overrides` in `package.json`). Nextra 4.6.1's `<Layout>` validates its props against a schema that requires `children` after removing `children`; zod releases after 4.1.x reject that, and every page fails to prerender with `Invalid input: expected nonoptional, received undefined → at children`. Remove the override only after upgrading to a Nextra release that fixes it.
- Cache Components is not enabled; Nextra's pages are plain static generation.
- The original exam PDFs go in `public/exams/`. They are git-ignored, so the "view the figure" links only work where those files exist.
