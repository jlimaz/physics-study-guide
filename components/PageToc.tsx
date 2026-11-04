"use client";

import { useEffect, useState } from "react";

type H = { id: string; text: string };

export function PageToc({ watch }: { watch: string }) {
  const [heads, setHeads] = useState<H[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLHeadingElement>("article.guide h3[id]")];
    const frame = requestAnimationFrame(() =>
      setHeads(
        els.map((e) => {
          // KaTeX renders math twice (MathML + HTML); keep only the visible copy.
          const clone = e.cloneNode(true) as HTMLElement;
          clone.querySelectorAll(".katex-mathml").forEach((m) => m.remove());
          return { id: e.id, text: clone.textContent?.trim() ?? "" };
        }),
      ),
    );
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    els.forEach((e) => obs.observe(e));
    return () => {
      cancelAnimationFrame(frame);
      obs.disconnect();
    };
  }, [watch]);

  if (heads.length < 2) return null;
  return (
    <nav aria-label="On this page" className="text-sm">
      <div className="mb-3 text-xs font-semibold tracking-[0.14em] text-muted uppercase">On this page</div>
      <ul className="grid gap-1 border-l border-line">
        {heads.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l-2 py-1 pl-3 leading-snug transition-colors ${
                active === h.id ? "border-accent text-fg" : "border-transparent text-muted hover:text-fg"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
