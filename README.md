# PHYS 10320 · Exam 2 Study Guide (interactive)

An interactive study site built from `content/study-guide.md`.

```bash
npm install
npm run dev      # http://localhost:3000
```

## What's in it

| Page | What it does |
|---|---|
| `/` | Chapter map with progress rings and overall progress |
| `/learn/[n]` | One page per `##` chapter of the guide: quizzes, worked examples you can hide ("let me try first"), callouts, Mermaid diagrams, the RC simulator, reveal-able practice solutions, clickable trap checklist |
| `/flashcards` | The §13 deck: flip, "know it" / "review" piles, shuffle, keyboard (space, ←/→, K, R) |
| `/recognizer` | Trainer built from the §10 table: see a clue, pick the tool |
| `/exams` | Practice exams v4 and v5: clickable MC with explanations, free response with hint / final answer / full solution |

All progress (quiz answers, completed chapters, checklist ticks, flashcard piles) is saved in `localStorage`.

## Editing content

Edit `content/study-guide.md` and the site updates; no code changes needed.

- Every `## N. Title` heading becomes a chapter page (headings without a number, like the developer appendix, are skipped).
- ` ```quiz `, ` ```flashcards `, ` ```widget ` (`type: rc-simulator`) and ` ```mermaid ` fences become components.
- `> [!TIP]`, `> [!NOTE]`, `> [!IMPORTANT]`, `> [!WARNING]` become callouts.
- Headings or bold lines containing "Worked example" become collapsible worked-example cards.

Practice-exam questions and solutions live in `lib/exams.ts`. Those solutions were written for this site, not taken from an official key.

The original exam PDFs go in `public/exams/` (they're git-ignored, so the "view the figure" links only work where those files exist).
