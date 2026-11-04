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
        <h1 className="font-display text-4xl font-semibold tracking-tight">🔎 Problem Recognizer</h1>
        <p className="mt-3 text-muted">
          On the exam, the hardest part is often figuring out which tool a problem wants. Read the clue, pick the tool.
          Keys 1–4 answer, Enter goes to the next clue.
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
