import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNav, getSection, getSections } from "@/lib/guide";
import { Markdown } from "@/components/Markdown";
import { MarkDone, Sidebar } from "@/components/Progress";

const topicColor = (t: string) => `var(--c-${t})`;
import { PageToc } from "@/components/PageToc";

export function generateStaticParams() {
  return getSections().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const s = getSection(slug);
  return { title: s ? `${s.num}. ${s.title}` : "Not found" };
}

const TOPIC_LABEL: Record<string, string> = {
  electric: "Electrostatics",
  circuits: "Circuits",
  magnetic: "Magnetism",
  trap: "Review",
  review: "Review",
};

export default async function ChapterPage(props: PageProps<"/learn/[slug]">) {
  const { slug } = await props.params;
  const section = getSection(slug);
  if (!section) notFound();
  const nav = getNav();
  const idx = nav.findIndex((n) => n.slug === slug);
  const prev = nav[idx - 1];
  const next = nav[idx + 1];

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_14rem]">
      <aside className="no-print hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6">
          <Sidebar nav={nav} />
        </div>
      </aside>

      <div className="min-w-0">
        <details className="no-print mb-6 rounded-xl border border-line bg-card lg:hidden">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium">All chapters</summary>
          <div className="px-2 pb-3">
            <Sidebar nav={nav} />
          </div>
        </details>

        <header className="mb-8 max-w-[46rem]">
          <span
            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
            style={{ color: topicColor(section.topic), borderColor: topicColor(section.topic) }}
          >
            {TOPIC_LABEL[section.topic]} · Chapter {section.num}
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            {section.title}
          </h1>
        </header>

        <article className="guide prose prose-lg max-w-[46rem] prose-headings:scroll-mt-24">
          <Markdown idPrefix={`s${section.slug}`}>{section.markdown}</Markdown>
        </article>

        <div className="no-print mt-14 grid max-w-[46rem] gap-4">
          <MarkDone slug={section.slug} quizIds={section.quizIds} />
          <div className="grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={`/learn/${prev.slug}`} className="rounded-2xl border border-line p-4 hover:border-accent">
                <div className="text-xs text-muted">← Previous</div>
                <div className="font-medium">
                  {prev.num}. {prev.title.split(":")[0]}
                </div>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/learn/${next.slug}`} className="rounded-2xl border border-line p-4 text-right hover:border-accent">
                <div className="text-xs text-muted">Next →</div>
                <div className="font-medium">
                  {next.num}. {next.title.split(":")[0]}
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      <aside className="no-print hidden xl:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
          <PageToc watch={slug} />
        </div>
      </aside>
    </div>
  );
}
