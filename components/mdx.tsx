import Link from "next/link";
import { CHAPTERS, CLUES, FLASHCARDS, QUIZZES, chapterByNum, chapterBySlug } from "@/lib/data";
import { EXAMS } from "@/lib/exams";
import { Markdown, MarkdownInline } from "./Markdown";
import { Quiz as QuizCard } from "./Quiz";
import { FlashcardDeck } from "./FlashcardDeck";
import { RecognizerTrainer as Trainer } from "./RecognizerTrainer";
import { ChapterGrid, MarkDone, OverallProgress } from "./Progress";
import { Reveal } from "./Blocks";

/* Server components used directly in content/*.mdx (registered in mdx-components.tsx). */

export function Quiz({ id }: { id: string }) {
  const q = QUIZZES[id];
  if (!q) throw new Error(`Unknown quiz id "${id}"`);
  return (
    <QuizCard
      id={id}
      question={<MarkdownInline>{q.question}</MarkdownInline>}
      options={q.options.map((o) => ({ content: <MarkdownInline>{o.text}</MarkdownInline>, correct: o.correct }))}
      explanation={q.explanation ? <MarkdownInline>{q.explanation}</MarkdownInline> : undefined}
    />
  );
}

export function Flashcards() {
  return (
    <div className="not-prose mt-6">
      <FlashcardDeck
        cards={FLASHCARDS.map((c, i) => ({
          key: `fc-${i}`,
          front: <MarkdownInline>{c.front}</MarkdownInline>,
          back: <MarkdownInline>{c.back}</MarkdownInline>,
        }))}
      />
    </div>
  );
}

export function RecognizerTrainer() {
  return (
    <Trainer
      items={CLUES.map((c) => {
        const ch = chapterByNum(c.chapter);
        return {
          clue: <MarkdownInline>{c.clue}</MarkdownInline>,
          tool: <MarkdownInline>{c.tool}</MarkdownInline>,
          chapterSlug: ch?.slug,
          chapterTitle: ch?.title,
        };
      })}
    />
  );
}

export function ChapterComplete({ slug }: { slug: string }) {
  const ch = chapterBySlug(slug);
  return <MarkDone slug={slug} quizIds={ch?.quizIds ?? []} />;
}

export function Chapters({ group }: { group: "chapters" | "reference" }) {
  const list = CHAPTERS.filter((c) => (group === "chapters" ? c.num >= 1 && c.num <= 9 : c.num === 0 || c.num >= 10));
  return <ChapterGrid chapters={list} />;
}

export function Progress() {
  return <OverallProgress chapters={CHAPTERS} />;
}

const TOOLS = [
  { href: "/problem-recognizer", title: "Problem recognizer", text: "Read a problem's clue and pick the method it calls for." },
  { href: "/flashcards", title: "Flashcards", text: "Key facts and formulas, sorted into “know it” and “review” piles." },
  { href: "/practice-exams", title: "Practice exams", text: "Versions 4 and 5, with explanations and full worked solutions." },
  { href: "/common-mistakes", title: "Common mistakes", text: "A checklist of the errors that cost the most points." },
];

export function Tools() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {TOOLS.map((t) => (
        <Link key={t.href} href={t.href} className="rounded-xl border border-line bg-card p-4 no-underline transition-colors hover:border-accent">
          <div className="font-semibold text-fg">{t.title}</div>
          <p className="mt-1 text-sm text-muted">{t.text}</p>
        </Link>
      ))}
    </div>
  );
}

function examFor(id: string) {
  const e = EXAMS.find((x) => x.id === id);
  if (!e) throw new Error(`Unknown exam "${id}"`);
  return e;
}

function PdfLink({ pdf, page, label }: { pdf: string; page?: number; label?: string }) {
  return (
    <a href={page ? `${pdf}#page=${page}` : pdf} target="_blank" rel="noreferrer" className="text-sm">
      {label ?? `View the figure (PDF page ${page})`} ↗
    </a>
  );
}

export function ExamPdf({ exam }: { exam: string }) {
  return (
    <p>
      <PdfLink pdf={examFor(exam).pdf} label="Open the original exam PDF" />
    </p>
  );
}

export function ExamMC({ exam }: { exam: string }) {
  const e = examFor(exam);
  return (
    <>
      {e.mc.map((q, i) => (
        <div key={q.id}>
          <QuizCard
            id={`exam-${q.id}`}
            label={`MC${i + 1}`}
            shuffle={false}
            letters
            question={
              <>
                <MarkdownInline>{q.question}</MarkdownInline>
                {q.figure && (
                  <span className="mt-2 block text-sm font-normal text-muted">
                    <b>Figure:</b> {q.figure}
                  </span>
                )}
              </>
            }
            options={q.options.map((o, k) => ({ content: <MarkdownInline>{o}</MarkdownInline>, correct: k === q.answer }))}
            explanation={<Markdown>{q.explanation}</Markdown>}
          />
          {q.figure && (
            <div className="-mt-5 mb-8 pl-1">
              <PdfLink pdf={e.pdf} page={q.page} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export function ExamFR({ exam }: { exam: string }) {
  const e = examFor(exam);
  return (
    <div className="not-prose mt-4 grid gap-6">
      {e.fr.map((q) => (
        <article key={q.id} className="rounded-xl border border-line bg-card p-5">
          <h4 className="text-lg font-semibold">{q.title}</h4>
          <div className="mt-2">
            <Markdown>{q.prompt}</Markdown>
            {q.figure && (
              <p className="mt-2 text-sm text-muted">
                <b>Figure:</b> {q.figure}
              </p>
            )}
          </div>
          <div className="mt-2">
            <PdfLink pdf={e.pdf} page={q.page} />
          </div>
          <Reveal summary="Hint: which method?">
            <div className="py-3">
              <Markdown>{q.hint}</Markdown>
            </div>
          </Reveal>
          <Reveal summary="Final answer">
            <div className="py-4 text-lg">
              <MarkdownInline>{q.answer}</MarkdownInline>
            </div>
          </Reveal>
          <Reveal summary="Full worked solution">
            <Markdown>{q.solution}</Markdown>
          </Reveal>
        </article>
      ))}
    </div>
  );
}
