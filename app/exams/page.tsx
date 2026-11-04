import type { Metadata } from "next";
import { EXAMS } from "@/lib/exams";
import { Markdown, MarkdownInline } from "@/components/Markdown";
import { Quiz } from "@/components/Quiz";
import { Reveal } from "@/components/Blocks";

export const metadata: Metadata = { title: "Practice exams" };

function PdfLink({ pdf, page }: { pdf: string; page: number }) {
  return (
    <a href={`${pdf}#page=${page}`} target="_blank" rel="noreferrer" className="text-sm text-accent underline-offset-4 hover:underline">
      View the figure (PDF p. {page}) ↗
    </a>
  );
}

export default function ExamsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Practice exams</h1>
        <p className="mt-3 text-muted">
          6 multiple choice + 4 free response, just like the real thing. Time yourself, do the free response on paper,
          then reveal the solution and grade yourself honestly.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2">
          {EXAMS.map((e) => (
            <a key={e.id} href={`#${e.id}`} className="min-h-10 rounded-full border border-line px-4 py-2 text-sm hover:border-accent">
              {e.title}
            </a>
          ))}
        </nav>
      </header>

      {EXAMS.map((exam) => (
        <section key={exam.id} id={exam.id} className="mb-20 scroll-mt-24">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
            <h2 className="font-display text-3xl font-semibold">{exam.title}</h2>
            <a href={exam.pdf} target="_blank" rel="noreferrer" className="text-sm text-accent underline-offset-4 hover:underline">
              Open original PDF ↗
            </a>
          </div>

          <h3 className="mt-8 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Multiple choice</h3>
          {exam.mc.map((q, i) => (
            <div key={q.id}>
              <Quiz
                id={`exam-${q.id}`}
                label={`MC${i + 1}`}
                shuffle={false}
                letters
                question={
                  <>
                    <MarkdownInline>{q.question}</MarkdownInline>
                    {q.figure && (
                      <span className="mt-2 block text-sm font-normal text-muted">
                        <b>Figure:</b> {q.figure}{" "}
                      </span>
                    )}
                  </>
                }
                options={q.options.map((o, k) => ({ content: <MarkdownInline>{o}</MarkdownInline>, correct: k === q.answer }))}
                explanation={
                  <div className="guide prose max-w-none">
                    <Markdown idPrefix={q.id}>{q.explanation}</Markdown>
                  </div>
                }
              />
              {q.figure && (
                <div className="-mt-5 mb-8 pl-1">
                  <PdfLink pdf={exam.pdf} page={q.page} />
                </div>
              )}
            </div>
          ))}

          <h3 className="mt-12 mb-4 text-xs font-semibold tracking-[0.14em] text-muted uppercase">Free response</h3>
          <div className="grid gap-6">
            {exam.fr.map((q) => (
              <article key={q.id} className="rounded-2xl border border-line bg-card p-5 sm:p-6">
                <h4 className="font-display text-xl font-semibold">{q.title}</h4>
                <div className="guide prose mt-3 max-w-none">
                  <Markdown idPrefix={q.id}>{q.prompt}</Markdown>
                  {q.figure && (
                    <p className="text-sm text-muted">
                      <b>Figure:</b> {q.figure}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <PdfLink pdf={exam.pdf} page={q.page} />
                </div>
                <Reveal summary="Hint: which method?">
                  <div className="guide prose max-w-none py-3">
                    <Markdown>{q.hint}</Markdown>
                  </div>
                </Reveal>
                <Reveal summary="Final answer">
                  <div className="py-4 text-lg">
                    <MarkdownInline>{q.answer}</MarkdownInline>
                  </div>
                </Reveal>
                <Reveal summary="Full worked solution">
                  <div className="guide prose max-w-none">
                    <Markdown idPrefix={q.id + "-sol"}>{q.solution}</Markdown>
                  </div>
                </Reveal>
              </article>
            ))}
          </div>
        </section>
      ))}

      <p className="text-sm text-muted">
        Solutions on this page were worked out for this study site, not taken from an official key. If one disagrees
        with your instructor&apos;s, trust the instructor and let the discrepancy teach you something.
      </p>
    </div>
  );
}
