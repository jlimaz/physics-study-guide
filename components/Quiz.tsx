"use client";

import { useMemo, type ReactNode } from "react";
import { quizKey, setValue, useValue, type QuizResult } from "@/lib/progress";

export type QuizOption = { content: ReactNode; correct: boolean };

function seededOrder(id: string, n: number) {
  let h = 2166136261;
  for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const idx = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
    const j = Math.abs(h) % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export function Quiz({
  id,
  question,
  options,
  explanation,
  label = "Check yourself",
  shuffle = true,
  letters = false,
}: {
  id: string;
  question: ReactNode;
  options: QuizOption[];
  explanation?: ReactNode;
  label?: string;
  shuffle?: boolean;
  letters?: boolean;
}) {
  const result = useValue<QuizResult>(quizKey(id));
  const order = useMemo(
    () => (shuffle ? seededOrder(id, options.length) : options.map((_, i) => i)),
    [id, options, shuffle],
  );
  const answered = result !== undefined;

  return (
    <div className="not-prose my-8 rounded-xl border border-line bg-card p-5 shadow-sm sm:p-6" data-quiz={id}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{label}</span>
        {answered && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              result.correct ? "bg-good/15 text-good" : "bg-bad/15 text-bad"
            }`}
          >
            {result.correct ? "Correct" : "Not quite"}
          </span>
        )}
      </div>
      <div className="quiz-text mb-4 text-[1.02rem] font-medium leading-relaxed">{question}</div>
      <div className="grid gap-2" role="group" aria-label="Answer options">
        {order.map((i, pos) => {
          const opt = options[i];
          const chosen = result?.choice === i;
          let state = "border-line hover:border-accent hover:bg-accent/5";
          if (answered) {
            if (opt.correct) state = "border-good bg-good/10";
            else if (chosen) state = "border-bad bg-bad/10";
            else state = "border-line opacity-60";
          }
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setValue(quizKey(id), { choice: i, correct: opt.correct })}
              className={`quiz-text flex min-h-11 w-full items-start gap-3 rounded-xl border px-4 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-default ${state}`}
            >
              <span className="mt-0.5 font-mono text-xs text-muted">
                {letters ? String.fromCharCode(65 + i) : String.fromCharCode(65 + pos)}
              </span>
              <span className="flex-1">{opt.content}</span>
              {answered && opt.correct && <span className="text-xs font-semibold text-good">Correct answer</span>}
              {answered && chosen && !opt.correct && <span className="text-xs font-semibold text-bad">Your answer</span>}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-4 rounded-xl bg-subtle p-4 text-[0.95rem] leading-relaxed">
          {explanation && <div className="quiz-text">{explanation}</div>}
          <button
            type="button"
            onClick={() => setValue(quizKey(id), undefined)}
            className="mt-3 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
