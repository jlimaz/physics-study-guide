import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";
import type { MDXComponents } from "nextra/mdx-components";
import { Check, Checklist, Solution } from "@/components/Blocks";
import { RCSimulator } from "@/components/RCSimulator";
import {
  ChapterComplete,
  Chapters,
  ExamFR,
  ExamMC,
  Flashcards,
  Progress,
  Quiz,
  RecognizerTrainer,
  Tools,
} from "@/components/mdx";

const themeComponents = getThemeComponents();

/** Components available in every content/*.mdx page without an import. */
const custom = {
  Quiz,
  Solution,
  Checklist,
  Check,
  Flashcards,
  RCSimulator,
  RecognizerTrainer,
  ChapterComplete,
  Chapters,
  Progress,
  Tools,
  ExamMC,
  ExamFR,
};

export function useMDXComponents(components?: MDXComponents) {
  return { ...themeComponents, ...custom, ...components };
}
