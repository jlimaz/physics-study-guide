import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { load as yamlLoad } from "js-yaml";

export type Topic = "electric" | "circuits" | "magnetic" | "trap" | "review";

export type Section = {
  num: number;
  slug: string;
  emoji: string;
  title: string;
  markdown: string;
  quizIds: string[];
  topic: Topic;
};

export type Flashcard = { front: string; back: string };
export type Clue = { clue: string; tool: string; chapter: string };

const FILE = path.join(process.cwd(), "content", "study-guide.md");

const TOPIC_BY_NUM: Record<number, Topic> = {
  0: "review",
  1: "electric",
  2: "electric",
  3: "circuits",
  4: "circuits",
  5: "circuits",
  6: "magnetic",
  7: "magnetic",
  8: "magnetic",
  9: "magnetic",
  10: "review",
  11: "trap",
  12: "review",
  13: "review",
  14: "review",
  15: "review",
};

/** Split a markdown string on `## ` headings that are not inside code fences. */
function splitSections(body: string) {
  const lines = body.split("\n");
  const chunks: { heading: string | null; lines: string[] }[] = [
    { heading: null, lines: [] },
  ];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (!inFence && /^## /.test(line)) {
      chunks.push({ heading: line.slice(3).trim(), lines: [] });
    } else {
      chunks[chunks.length - 1].lines.push(line);
    }
  }
  return chunks;
}

function parseHeading(heading: string) {
  // "🗺️ 0. The Map: ..." or "1. ⛰️ Electric Potential: ..."
  const m = heading.match(/(\d+)\.\s*/);
  if (!m) return null;
  const num = Number(m[1]);
  const rest = heading.replace(m[0], "").trim();
  // Pull the first emoji cluster out (before or after the number).
  const emojiRe = /^(\p{Extended_Pictographic}[️‍\p{Extended_Pictographic}]*)\s*/u;
  let emoji = "";
  let title = rest;
  const lead = heading.match(emojiRe);
  if (lead) emoji = lead[1];
  const inner = rest.match(emojiRe);
  if (inner) {
    emoji = emoji || inner[1];
    title = rest.replace(inner[0], "");
  }
  return { num, emoji, title };
}

let cache: { sections: Section[]; intro: string; meta: Record<string, unknown> } | null = null;

function load() {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const raw = fs.readFileSync(FILE, "utf8");
  const { data, content } = matter(raw);
  const chunks = splitSections(content);
  const intro = chunks[0].lines
    .join("\n")
    .replace(/^# .*$/m, "")
    .replace(/^---\s*$/gm, "")
    .trim();

  const sections: Section[] = [];
  for (const c of chunks.slice(1)) {
    if (!c.heading) continue;
    const h = parseHeading(c.heading);
    if (!h) continue; // skips the developer appendix (no number)
    const markdown = c.lines
      .join("\n")
      .replace(/\n---\s*$/m, "")
      .trim();
    const quizIds = [...markdown.matchAll(/```quiz\s*\nid:\s*(\S+)/g)].map((m) => m[1]);
    sections.push({
      num: h.num,
      slug: String(h.num),
      emoji: h.emoji,
      title: h.title,
      markdown,
      quizIds,
      topic: TOPIC_BY_NUM[h.num] ?? "review",
    });
  }
  cache = { sections, intro, meta: data };
  return cache;
}

export function getSections(): Section[] {
  return load().sections;
}

export function getSection(slug: string): Section | undefined {
  return load().sections.find((s) => s.slug === slug);
}

export function getIntro(): string {
  return load().intro;
}

export function getMeta() {
  return load().meta as {
    title?: string;
    subtitle?: string;
    course?: string;
    estimated_study_time?: string;
  };
}

/** Lightweight nav info, safe to hand to client components. */
export function getNav() {
  return getSections().map(({ num, slug, emoji, title, quizIds, topic }) => ({
    num,
    slug,
    emoji,
    title,
    quizIds,
    topic,
  }));
}
export type NavItem = ReturnType<typeof getNav>[number];

export function getFlashcards(): Flashcard[] {
  const all: Flashcard[] = [];
  for (const s of getSections()) {
    for (const m of s.markdown.matchAll(/```flashcards\s*\n([\s\S]*?)```/g)) {
      all.push(...(yamlLoad(m[1]) as Flashcard[]));
    }
  }
  return all;
}

export function getAllQuizzes() {
  const out: { section: number; src: string }[] = [];
  for (const s of getSections()) {
    for (const m of s.markdown.matchAll(/```quiz\s*\n([\s\S]*?)```/g)) {
      out.push({ section: s.num, src: m[1] });
    }
  }
  return out;
}

/** Rows of the "Problem Recognizer" table (§10). */
export function getClues(): Clue[] {
  const s = getSections().find((x) => x.num === 10);
  if (!s) return [];
  const rows = s.markdown
    .split("\n")
    .filter((l) => l.startsWith("|") && !/^\|\s*-/.test(l))
    .slice(1); // drop header
  return rows
    .map((r) => {
      // split on | but not on escaped \| (none expected) — cells may contain $|...|$ via \lvert
      const cells = r.split("|").slice(1, -1).map((c) => c.trim());
      return { clue: cells[0], tool: cells[1], chapter: cells[2] };
    })
    .filter((c) => c.clue && c.tool);
}
