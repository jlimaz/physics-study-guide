import type { Metadata } from "next";
import { getFlashcards } from "@/lib/guide";
import { MarkdownInline } from "@/components/Markdown";
import { FlashcardDeck } from "@/components/FlashcardDeck";

export const metadata: Metadata = { title: "Flashcards" };

export default function FlashcardsPage() {
  const cards = getFlashcards();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mx-auto mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Flashcards</h1>
        <p className="mt-3 text-muted">
          Say the answer out loud before you flip. Space flips, ← → move, <kbd>K</kbd> = know it, <kbd>R</kbd> = review again.
        </p>
      </header>
      <FlashcardDeck
        cards={cards.map((c, i) => ({
          key: `fc-${i}`,
          front: <MarkdownInline>{c.front}</MarkdownInline>,
          back: <MarkdownInline>{c.back}</MarkdownInline>,
        }))}
      />
    </div>
  );
}
