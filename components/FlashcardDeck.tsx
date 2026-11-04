"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { resetPrefix, setValue, useStore } from "@/lib/progress";

type Card = { key: string; front: ReactNode; back: ReactNode };
type Filter = "all" | "review" | "unseen";

const pileKey = (k: string) => `card:${k}`;

export function FlashcardDeck({ cards }: { cards: Card[] }) {
  const store = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [order, setOrder] = useState<number[]>(() => cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const pile = useCallback((i: number) => store[pileKey(cards[i].key)] as "know" | "review" | undefined, [store, cards]);

  const visible = useMemo(
    () =>
      order.filter((i) => {
        if (filter === "review") return pile(i) === "review";
        if (filter === "unseen") return pile(i) === undefined;
        return true;
      }),
    [order, filter, pile],
  );

  const known = cards.filter((c) => store[pileKey(c.key)] === "know").length;
  const review = cards.filter((c) => store[pileKey(c.key)] === "review").length;
  const current = visible[Math.min(pos, Math.max(visible.length - 1, 0))];

  const go = useCallback(
    (d: number) => {
      setFlipped(false);
      setPos((p) => (visible.length ? (p + d + visible.length) % visible.length : 0));
    },
    [visible.length],
  );

  const mark = useCallback(
    (which: "know" | "review") => {
      if (current === undefined) return;
      setValue(pileKey(cards[current].key), which);
      setFlipped(false);
      // When filtering, the card may drop out of the list; stay at the same index.
      if (filter === "all") setPos((p) => (p + 1) % Math.max(visible.length, 1));
    },
    [current, cards, filter, visible.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, select")) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "k") mark("know");
      else if (e.key === "r") mark("review");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, mark]);

  const shuffle = () => {
    const next = [...order];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setOrder(next);
    setPos(0);
    setFlipped(false);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
        {(
          [
            ["all", `All (${cards.length})`],
            ["review", `Review pile (${review})`],
            ["unseen", `Not seen (${cards.length - known - review})`],
          ] as [Filter, string][]
        ).map(([f, label]) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setFilter(f);
              setPos(0);
              setFlipped(false);
            }}
            className={`min-h-9 rounded-full border px-3.5 transition-colors ${
              filter === f ? "border-accent bg-accent text-accent-fg" : "border-line hover:border-accent"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto flex gap-2">
          <button type="button" onClick={shuffle} className="min-h-9 rounded-full border border-line px-3.5 hover:border-accent">
            🔀 Shuffle
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset all flashcard piles?")) resetPrefix("card:");
            }}
            className="min-h-9 rounded-full border border-line px-3.5 text-muted hover:border-bad hover:text-bad"
          >
            Reset
          </button>
        </span>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-subtle" aria-label={`${known} of ${cards.length} known`}>
        <div className="h-full bg-good transition-all" style={{ width: `${(known / cards.length) * 100}%` }} />
      </div>
      <p className="mb-6 text-sm text-muted">
        {known} of {cards.length} known · {review} to review
      </p>

      {current === undefined ? (
        <div className="rounded-3xl border border-dashed border-line p-12 text-center text-muted">
          {filter === "review" ? "Your review pile is empty. 🎉" : "You've seen every card."}
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="flip-card block h-72 w-full text-left sm:h-80"
            aria-label={flipped ? "Show question" : "Show answer"}
          >
            <div className={`flip-inner ${flipped ? "is-flipped" : ""}`}>
              <div className="flip-face border-line bg-card">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Question</span>
                <div className="flash-text font-display text-2xl leading-snug">{cards[current].front}</div>
                <span className="text-xs text-muted">Click or press space to flip</span>
              </div>
              <div className="flip-face flip-back border-accent/40 bg-subtle">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Answer</span>
                <div className="flash-text text-xl leading-relaxed">{cards[current].back}</div>
                <span className="text-xs text-muted">
                  {pile(current) === "know" ? "In your “know it” pile" : pile(current) === "review" ? "In your review pile" : " "}
                </span>
              </div>
            </div>
          </button>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={() => go(-1)} className="min-h-11 rounded-xl border border-line px-4 hover:border-accent" aria-label="Previous card">
              ←
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={() => mark("review")} className="min-h-11 rounded-xl border border-bad/50 px-4 font-medium text-bad hover:bg-bad/10">
                Review again <kbd className="ml-1 text-xs opacity-60">R</kbd>
              </button>
              <button type="button" onClick={() => mark("know")} className="min-h-11 rounded-xl bg-good px-4 font-medium text-white hover:opacity-90">
                Know it <kbd className="ml-1 text-xs opacity-70">K</kbd>
              </button>
            </div>
            <button type="button" onClick={() => go(1)} className="min-h-11 rounded-xl border border-line px-4 hover:border-accent" aria-label="Next card">
              →
            </button>
          </div>
          <p className="mt-3 text-center font-mono text-xs text-muted">
            {Math.min(pos, visible.length - 1) + 1} / {visible.length}
          </p>
        </>
      )}
    </div>
  );
}
