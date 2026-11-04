import Link from "next/link";
import { getIntro, getMeta, getNav, getSections } from "@/lib/guide";
import { Markdown } from "@/components/Markdown";
import { ChapterGrid, OverallProgress } from "@/components/Progress";

function blurb(md: string) {
  const kid = md.split(/### 🧠 Say it like a kid\s*\n/)[1] ?? "";
  const para = (kid || md)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !/^[#>|`\-!<*]|^\$\$/.test(p) && p.length > 40);
  return (para ?? "")
    .replace(/\$[^$]*\$/g, "")
    .replace(/\*\*|__|\*|`/g, "")
    .replace(/(^|\n)\s*[-*]\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const TOOLS = [
  { href: "/flashcards", emoji: "🃏", title: "Flashcards", text: "Flip, sort into “know it” and “review” piles." },
  { href: "/recognizer", emoji: "🔎", title: "Problem Recognizer", text: "See a clue, name the tool. The skill exams actually test." },
  { href: "/exams", emoji: "📝", title: "Practice exams", text: "Both v4 and v5: MC you can click, free response with solutions." },
  { href: "/learn/11", emoji: "🚨", title: "Trap checklist", text: "Tick through it the night before." },
];

export default function Home() {
  const meta = getMeta();
  const sections = getSections();
  const nav = getNav();
  const chapters = sections.filter((s) => s.num >= 1 && s.num <= 9);
  const review = sections.filter((s) => s.num >= 10 || s.num === 0);
  const withBlurb = (list: typeof sections) =>
    list.map((s) => ({ ...nav.find((n) => n.slug === s.slug)!, blurb: blurb(s.markdown) }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="grid items-end gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <p className="mb-3 text-sm font-semibold tracking-[0.14em] text-accent uppercase">
            {meta.course ?? "Physics 10320"}
          </p>
          <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
            Potential, circuits <span className="text-[var(--c-electric)]">&amp;</span> magnetism,
            <br className="hidden sm:block" /> explained like you&apos;re ten.
          </h1>
          <div className="guide prose mt-6 max-w-2xl text-lg">
            <Markdown idPrefix="intro">{getIntro()}</Markdown>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/learn/1" className="inline-flex min-h-12 items-center rounded-xl bg-accent px-6 font-semibold text-accent-fg hover:opacity-90">
              Start with chapter 1 →
            </Link>
            <Link href="/learn/0" className="inline-flex min-h-12 items-center rounded-xl border border-line px-6 font-medium hover:border-accent">
              See what&apos;s on the exam
            </Link>
          </div>
          {meta.estimated_study_time && (
            <p className="mt-4 text-sm text-muted">Estimated study time: {meta.estimated_study_time}</p>
          )}
        </div>
        <OverallProgress nav={nav} />
      </section>

      <section className="mt-16">
        <h2 className="mb-5 font-display text-2xl font-semibold">Chapters</h2>
        <ChapterGrid nav={withBlurb(chapters)} />
      </section>

      <section className="mt-16">
        <h2 className="mb-5 font-display text-2xl font-semibold">Practice tools</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="rounded-2xl border border-line bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-md">
              <div className="text-2xl" aria-hidden>
                {t.emoji}
              </div>
              <div className="mt-3 font-display text-lg font-semibold">{t.title}</div>
              <p className="mt-1 text-sm text-muted">{t.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="mb-5 font-display text-2xl font-semibold">Review &amp; reference</h2>
        <ChapterGrid nav={withBlurb(review)} />
      </section>
    </div>
  );
}
