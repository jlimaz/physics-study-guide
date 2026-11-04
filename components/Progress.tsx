"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { doneKey, quizKey, resetPrefix, setValue, useStore, type QuizResult } from "@/lib/progress";
import type { NavItem } from "@/lib/guide";

type Store = Record<string, unknown>;

export function chapterProgress(store: Store, item: Pick<NavItem, "slug" | "quizIds">) {
  const done = !!store[doneKey(item.slug)];
  const answered = item.quizIds.filter((id) => store[quizKey(id)] !== undefined).length;
  const correct = item.quizIds.filter((id) => (store[quizKey(id)] as QuizResult | undefined)?.correct).length;
  const frac = done ? 1 : item.quizIds.length ? (answered / item.quizIds.length) * 0.8 : 0;
  return { done, answered, correct, total: item.quizIds.length, frac };
}

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

export const topicColor = (t: string) => `var(--c-${t})`;

export function Sidebar({ nav }: { nav: NavItem[] }) {
  const store = useStore();
  const pathname = usePathname();
  return (
    <nav aria-label="Chapters" className="text-sm">
      <ol className="grid gap-0.5">
        {nav.map((item) => {
          const p = chapterProgress(store, item);
          const active = pathname === `/learn/${item.slug}`;
          return (
            <li key={item.slug}>
              <Link
                href={`/learn/${item.slug}`}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors ${
                  active ? "bg-subtle font-semibold text-fg" : "text-muted hover:bg-subtle hover:text-fg"
                }`}
              >
                <Ring frac={p.frac} color={topicColor(item.topic)} size={18} />
                <span className="w-5 shrink-0 font-mono text-xs opacity-70">{item.num}</span>
                <span className="leading-snug">{item.title.split(":")[0]}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function MarkDone({ slug, quizIds }: { slug: string; quizIds: string[] }) {
  const store = useStore();
  const p = chapterProgress(store, { slug, quizIds });
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-card p-5">
      <div className="flex-1">
        <div className="font-semibold">{p.done ? "Chapter complete" : "Finished this chapter?"}</div>
        {p.total > 0 && (
          <div className="text-sm text-muted">
            Quizzes: {p.correct} correct, {p.answered}/{p.total} answered
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setValue(doneKey(slug), p.done ? undefined : true)}
        className={`min-h-11 rounded-xl px-5 font-medium transition-colors ${
          p.done ? "border border-line hover:border-bad" : "bg-accent text-accent-fg hover:opacity-90"
        }`}
      >
        {p.done ? "Mark as not done" : "Mark complete"}
      </button>
    </div>
  );
}

export function ChapterGrid({ nav }: { nav: (NavItem & { blurb: string })[] }) {
  const store = useStore();
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {nav.map((item) => {
        const p = chapterProgress(store, item);
        return (
          <li key={item.slug}>
            <Link
              href={`/learn/${item.slug}`}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-line bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--tc)] hover:shadow-md"
              style={{ ["--tc" as string]: topicColor(item.topic) }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-wide text-[var(--tc)]">Chapter {item.num}</span>
                <Ring frac={p.frac} color={topicColor(item.topic)} size={24} />
              </div>
              <div>
                <div className="font-display text-lg leading-snug font-semibold">{item.title}</div>
              </div>
              {item.blurb && <p className="line-clamp-2 text-sm text-muted">{item.blurb}</p>}
              <div className="mt-auto text-xs text-muted">
                {p.done ? "Complete" : p.total ? `${p.answered}/${p.total} quizzes` : "Reading"}
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function OverallProgress({ nav }: { nav: NavItem[] }) {
  const store = useStore();
  const ps = nav.map((n) => chapterProgress(store, n));
  const done = ps.filter((p) => p.done).length;
  const answered = ps.reduce((a, p) => a + p.answered, 0);
  const correct = ps.reduce((a, p) => a + p.correct, 0);
  const total = ps.reduce((a, p) => a + p.total, 0);
  const frac = ps.reduce((a, p) => a + p.frac, 0) / ps.length;
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-line bg-card p-5">
      <div className="relative">
        <Ring frac={frac} color="var(--accent)" size={64} />
        <span className="absolute inset-0 grid place-items-center font-mono text-sm font-semibold">{Math.round(frac * 100)}%</span>
      </div>
      <div className="grid gap-0.5 text-sm">
        <div className="font-semibold">Your progress</div>
        <div className="text-muted">
          {done}/{nav.length} chapters complete
        </div>
        <div className="text-muted">
          {correct} of {answered} quiz answers correct ({total} quizzes total)
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset ALL progress (quizzes, chapters, checklists, flashcards)?")) resetPrefix("");
          }}
          className="mt-1 w-fit text-xs text-muted underline-offset-4 hover:text-bad hover:underline"
        >
          Reset all progress
        </button>
      </div>
    </div>
  );
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => {
        const dark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("psg-theme", dark ? "dark" : "light");
      }}
      className="grid size-10 place-items-center rounded-full border border-line hover:border-accent"
    >
      <svg viewBox="0 0 24 24" className="size-[18px] dark:hidden" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
      </svg>
      <svg viewBox="0 0 24 24" className="hidden size-[18px] dark:block" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
      </svg>
    </button>
  );
}
