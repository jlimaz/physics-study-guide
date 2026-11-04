import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/**
 * Server-side markdown for short strings that live in data files (quiz
 * options, exam solutions). Page content itself is MDX rendered by Nextra.
 */

/** A `$$ … $$` line directly under text is display math on GitHub; remark-math needs blank lines. */
function normalizeDisplayMath(md: string) {
  return md
    .split("\n")
    .flatMap((line) => {
      const m = line.match(/^\s*\$\$(.+?)\$\$\s*$/);
      return m ? ["", "$$", m[1].trim(), "$$", ""] : [line];
    })
    .join("\n");
}

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

export function Markdown({ children }: { children: string }) {
  return (
    <div className="md-block">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {normalizeDisplayMath(children)}
      </ReactMarkdown>
    </div>
  );
}
