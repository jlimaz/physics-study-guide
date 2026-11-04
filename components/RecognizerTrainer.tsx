"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

type Item = { clue: ReactNode; tool: ReactNode; chapterSlug?: string; chapterTitle?: string };
type Round = { target: number; options: number[] };

function makeRound(n: number, prev?: number): Round {
  let target = Math.floor(Math.random() * n);
  if (n > 1 && target === prev) target = (target + 1) % n;
  const pool = [...Array(n).keys()].filter((i) => i !== target);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const options = [target, ...pool.slice(0, 3)];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return { target, options };
}

export function RecognizerTrainer({ items }: { items: Item[] }) {
  const [round, setRound] = useState<Round | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0, streak: 0, best: 0 });

  // Random first round is picked after mount so server and client HTML match.
  useEffect(() => {
    const t = setTimeout(() => setRound(makeRound(items.length)), 0);
    return () => clearTimeout(t);
  }, [items.length]);

  const next = useCallback(() => {
    setPicked(null);
    setRound((r) => makeRound(items.length, r?.target));
  }, [items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!round) return;
      if (picked !== null && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      } else if (picked === null && ["1", "2", "3", "4"].includes(e.key)) {
        choose(round.options[Number(e.key) - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function choose(i: number) {
    if (!round || picked !== null) return;
    setPicked(i);
    const ok = i === round.target;
    setScore((s) => {
      const streak = ok ? s.streak + 1 : 0;
      return { right: s.right + (ok ? 1 : 0), total: s.total + 1, streak, best: Math.max(s.best, streak) };
    });
  }

  if (!round) return <div className="h-96 animate-pulse rounded-xl bg-subtle" />;
  const target = items[round.target];

  return (
    <div className="not-prose mt-6">
      <div className="mb-6 flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm text-muted">
        <span>
          score <b className="text-fg">{score.right}</b>/{score.total}
        </span>
        <span>
          streak <b className="text-fg">{score.streak}</b>
        </span>
        <span>
          best <b className="text-fg">{score.best}</b>
        </span>
      </div>

      <div className="rounded-xl border border-line bg-card p-5 sm:p-6">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">The problem says or shows</div>
        <div className="quiz-text text-xl font-semibold leading-snug">{target.clue}</div>
      </div>

      <div className="mt-6 mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Which method applies?</div>
      <div className="grid gap-2.5">
        {round.options.map((i, k) => {
          let cls = "border-line hover:border-accent hover:bg-accent/5";
          if (picked !== null) {
            if (i === round.target) cls = "border-good bg-good/10";
            else if (i === picked) cls = "border-bad bg-bad/10";
            else cls = "border-line opacity-50";
          }
          return (
            <button
              key={i}
              type="button"
              disabled={picked !== null}
              onClick={() => choose(i)}
              className={`quiz-text flex min-h-12 items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${cls}`}
            >
              <kbd className="mt-0.5 font-mono text-xs text-muted">{k + 1}</kbd>
              <span className="flex-1">{items[i].tool}</span>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-subtle p-4">
          <span className="font-medium">
            {picked === round.target ? "Correct." : "Incorrect. The right method is highlighted."}
            {target.chapterSlug && (
              <>
                {" "}
                <Link href={`/${target.chapterSlug}`} className="text-accent underline-offset-4 hover:underline">
                  Review: {target.chapterTitle} →
                </Link>
              </>
            )}
          </span>
          <button type="button" onClick={next} className="min-h-11 rounded-xl bg-accent px-5 font-medium text-accent-fg hover:opacity-90">
            Next clue
          </button>
        </div>
      )}
    </div>
  );
}
