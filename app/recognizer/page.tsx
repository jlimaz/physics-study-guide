import type { Metadata } from "next";
import { getClues } from "@/lib/guide";
import { MarkdownInline } from "@/components/Markdown";
import { RecognizerTrainer } from "@/components/RecognizerTrainer";

export const metadata: Metadata = { title: "Problem Recognizer" };

export default function RecognizerPage() {
  const clues = getClues();
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mx-auto mb-8 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Problem Recognizer</h1>
        <p className="mt-3 text-muted">
          On the exam, the hardest step is often identifying which method a problem calls for. Read the clue and pick the method.
          Press 1–4 to answer and Enter for the next clue.
        </p>
      </header>
      <RecognizerTrainer
        items={clues.map((c) => ({
          clue: <MarkdownInline>{c.clue}</MarkdownInline>,
          tool: <MarkdownInline>{c.tool}</MarkdownInline>,
          chapter: c.chapter,
        }))}
      />
    </div>
  );
}
