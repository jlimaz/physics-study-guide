/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import Link from "next/link";
import { Fragment, isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { load as yamlLoad } from "js-yaml";
import { remarkCallouts, remarkWorkedExamples } from "@/lib/remark-plugins";
import { Quiz } from "./Quiz";
import { Callout, TaskItem, WorkedExample } from "./Blocks";
import { Mermaid } from "./Mermaid";
import { RCSimulator } from "./RCSimulator";
import { FlashcardDeck } from "./FlashcardDeck";

/** Render a short string (quiz option, table cell…) without a wrapping <p>. */
export function MarkdownInline({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{ p: ({ children }) => <Fragment>{children}</Fragment> }}
    >
      {children}
    </ReactMarkdown>
  );
}

type QuizSrc = {
  id: string;
  question: string;
  options: { text: string; correct?: boolean }[];
  explanation?: string;
};

function SpecialBlock({ lang, src }: { lang: string; src: string }) {
  if (lang === "quiz") {
    const q = yamlLoad(src) as QuizSrc;
    return (
      <Quiz
        id={q.id}
        question={<MarkdownInline>{q.question}</MarkdownInline>}
        options={q.options.map((o) => ({ content: <MarkdownInline>{String(o.text)}</MarkdownInline>, correct: !!o.correct }))}
        explanation={q.explanation ? <MarkdownInline>{q.explanation}</MarkdownInline> : undefined}
      />
    );
  }
  if (lang === "flashcards") {
    const cards = yamlLoad(src) as { front: string; back: string }[];
    return (
      <div className="not-prose my-8">
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
  if (lang === "widget") {
    const w = yamlLoad(src) as { type: string; title?: string };
    if (w.type === "rc-simulator") return <RCSimulator title={w.title} />;
    return null;
  }
  if (lang === "mermaid") return <Mermaid chart={src} />;
  return null;
}

const SPECIAL = new Set(["quiz", "flashcards", "widget", "mermaid"]);

function buildComponents(idPrefix: string): Components {
  return {
    pre({ children, node: _node, ...rest }) {
      const child = Array.isArray(children) ? children[0] : children;
      if (isValidElement(child)) {
        const props = child.props as { className?: string; children?: ReactNode };
        const lang = /language-([\w-]+)/.exec(props.className ?? "")?.[1];
        if (lang && SPECIAL.has(lang)) return <SpecialBlock lang={lang} src={String(props.children ?? "").trim()} />;
        if (lang === "text") return <pre className="ascii" {...rest}>{children}</pre>;
      }
      return <pre {...rest}>{children}</pre>;
    },
    a({ href = "", children, node: _node, ...rest }) {
      const chapter = href.match(/^#(\d+)-/);
      if (chapter) return <Link href={`/learn/${chapter[1]}`}>{children}</Link>;
      if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
      if (href.startsWith("#")) return <a href={href} {...rest}>{children}</a>;
      return (
        <a href={href} target="_blank" rel="noreferrer" {...rest}>
          {children}
        </a>
      );
    },
    li({ children, className, node }) {
      if (className?.includes("task-list-item")) {
        const line = (node as any)?.position?.start?.line ?? 0;
        return <TaskItem id={`${idPrefix}:${line}`}>{children}</TaskItem>;
      }
      return <li className={className}>{children}</li>;
    },
    input({ type, node: _node, ...rest }) {
      if (type === "checkbox") return null;
      return <input type={type} {...rest} />;
    },
    table({ children, node: _node, ...rest }) {
      return (
        <div className="table-wrap">
          <table {...rest}>{children}</table>
        </div>
      );
    },
    ul({ children, className, node: _node, ...rest }) {
      const isTasks = className?.includes("contains-task-list");
      return (
        <ul className={isTasks ? "task-list" : className} {...rest}>
          {children}
        </ul>
      );
    },
    ...({
      "call-out": ({ kind, children }: any) => <Callout kind={kind}>{children}</Callout>,
      "worked-example": ({ intro, children }: any) => <WorkedExample intro={intro}>{children}</WorkedExample>,
    } as any),
  };
}

/**
 * GitHub treats a line of the form `$$ … $$` as display math even when it sits
 * right under a line of text; remark-math reads it as inline. Split such lines
 * into a fenced `$$` block with blank lines around it (keeping any `>` / indent).
 */
function normalizeDisplayMath(md: string) {
  let inFence = false;
  const out: string[] = [];
  for (const line of md.split("\n")) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const m = !inFence && line.match(/^((?:\s*>)*\s*)\$\$(.+?)\$\$\s*$/);
    if (m) {
      const pre = m[1];
      const bare = pre.replace(/\s+$/, "");
      out.push(bare, `${pre}$$`, `${pre}${m[2].trim()}`, `${pre}$$`, bare);
    } else out.push(line);
  }
  return out.join("\n");
}

export function Markdown({ children, idPrefix = "doc" }: { children: string; idPrefix?: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath, remarkCallouts, remarkWorkedExamples]}
      rehypePlugins={[rehypeRaw, rehypeKatex, rehypeSlug]}
      components={buildComponents(idPrefix)}
    >
      {normalizeDisplayMath(children)}
    </ReactMarkdown>
  );
}
