"use client";

import Link from "next/link";
import { doneKey, quizKey, resetPrefix, setValue, useStore, type QuizResult } from "@/lib/progress";
import type { Chapter } from "@/lib/data";

type Store = Record<string, unknown>;
type Progressable = Pick<Chapter, "slug" | "quizIds">;

export function chapterProgress(store: Store, item: Progressable) {
  const done = !!store[doneKey(item.slug)];
  const answered = item.quizIds.filter((id) => store[quizKey(id)] !== undefined).length;
  const correct = item.quizIds.filter((id) => (store[quizKey(id)] as QuizResult | undefined)?.correct).length;
  const frac = done ? 1 : item.quizIds.length ? (answered / item.quizIds.length) * 0.8 : 0;
  return { done, answered, correct, total: item.quizIds.length, frac };
}

export const topicColor = (t: string) => `var(--c-${t})`;

export function Ring({ frac, color, size = 22 }: { frac: number; color: string; size?: number }) {
  const r = size / 2 - 2.5;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - frac)}
        strokeLinecap="round"
        className="transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  );
}

export function MarkDone({ slug, quizIds }: Progressable) {
  const store = useStore();
  const p = chapterProgress(store, { slug, quizIds });
  return (
    <div className="mt-12 flex flex-wrap items-center gap-4 rounded-xl border border-line bg-card p-5">
      <div className="flex-1">
        <div className="font-semibold">{p.done ? "Chapter complete" : "Finished this chapter?"}</div>
        {p.total > 0 && (
          <div className="text-sm text-muted">
            Quizzes: {p.correct} correct, {p.answered} of {p.total} answered
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setValue(doneKey(slug), p.done ? undefined : true)}
        className={`min-h-10 rounded-lg px-4 text-sm font-medium transition-colors ${
          p.done ? "border border-line hover:border-bad" : "bg-accent text-accent-fg hover:opacity-90"
        }`}
      >
        {p.done ? "Mark as not done" : "Mark complete"}
      </button>
    </div>
  );
}

export function ChapterGrid({ chapters }: { chapters: Chapter[] }) {
  const store = useStore();
  return (
    <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {chapters.map((item) => {
        const p = chapterProgress(store, item);
        return (
          <li key={item.slug}>
            <Link
              href={`/${item.slug}`}
              className="flex h-full flex-col gap-2 rounded-xl border border-line bg-card p-4 no-underline transition-colors hover:border-[var(--tc)]"
              style={{ ["--tc" as string]: topicColor(item.topic) }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-wide text-[var(--tc)]">
                  {item.num >= 1 && item.num <= 9 ? `Chapter ${item.num}` : "Reference"}
                </span>
                <Ring frac={p.frac} color={topicColor(item.topic)} size={20} />
              </div>
              <div className="font-semibold leading-snug text-fg">{item.title}</div>
              {item.blurb && <p className="line-clamp-2 text-sm text-muted">{item.blurb}</p>}
              <div className="mt-auto text-xs text-muted">
                {p.done ? "Complete" : p.total ? `${p.answered} of ${p.total} quizzes` : "Reading"}
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function OverallProgress({ chapters }: { chapters: Chapter[] }) {
  const store = useStore();
  const ps = chapters.map((n) => chapterProgress(store, n));
  const done = ps.filter((p) => p.done).length;
  const answered = ps.reduce((a, p) => a + p.answered, 0);
  const correct = ps.reduce((a, p) => a + p.correct, 0);
  const total = ps.reduce((a, p) => a + p.total, 0);
  const frac = ps.reduce((a, p) => a + p.frac, 0) / ps.length;
  return (
    <div className="mt-6 flex items-center gap-5 rounded-xl border border-line bg-card p-5">
      <div className="relative">
        <Ring frac={frac} color="var(--accent)" size={60} />
        <span className="absolute inset-0 grid place-items-center font-mono text-sm font-semibold">{Math.round(frac * 100)}%</span>
      </div>
      <div className="grid gap-0.5 text-sm">
        <div className="font-semibold">Your progress</div>
        <div className="text-muted">
          {done} of {chapters.length} pages complete · {correct} of {answered} quiz answers correct ({total} quizzes)
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset all progress (quizzes, chapters, checklists, flashcards)?")) resetPrefix("");
          }}
          className="mt-1 w-fit text-xs text-muted underline-offset-4 hover:text-bad hover:underline"
        >
          Reset all progress
        </button>
      </div>
    </div>
  );
}
