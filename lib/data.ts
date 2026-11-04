import chapters from "./data/chapters.json";
import quizzes from "./data/quizzes.json";
import flashcards from "./data/flashcards.json";
import clues from "./data/clues.json";

export type Topic = "electric" | "circuits" | "magnetic" | "trap" | "review";
export type Chapter = { num: number; slug: string; title: string; topic: Topic; quizIds: string[]; blurb: string };
export type QuizData = { question: string; options: { text: string; correct: boolean }[]; explanation: string };

export const CHAPTERS = chapters as Chapter[];
export const QUIZZES = quizzes as Record<string, QuizData>;
export const FLASHCARDS = flashcards as { front: string; back: string }[];
export const CLUES = clues as { clue: string; tool: string; chapter: number }[];

export const chapterBySlug = (slug: string) => CHAPTERS.find((c) => c.slug === slug);
export const chapterByNum = (num: number) => CHAPTERS.find((c) => c.num === num);
