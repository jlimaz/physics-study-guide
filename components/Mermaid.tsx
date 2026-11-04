"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";

function isDark() {
  return document.documentElement.classList.contains("dark");
}

function subscribeTheme(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}

export function Mermaid({ chart }: { chart: string }) {
  const rawId = useId();
  const id = "m" + rawId.replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState("");
  const dark = useSyncExternalStore<boolean | null>(subscribeTheme, isDark, () => null);

  useEffect(() => {
    if (dark === null) return;
    let cancelled = false;
    (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        fontFamily: "var(--font-sans)",
        themeVariables: dark
          ? { primaryColor: "#1d2433", primaryTextColor: "#e8e6df", primaryBorderColor: "#4a5568", lineColor: "#8b95a7", background: "transparent" }
          : { primaryColor: "#fff8e6", primaryTextColor: "#1f2430", primaryBorderColor: "#d9c28a", lineColor: "#6b7280", background: "transparent" },
      });
      try {
        const { svg } = await mermaid.render(`${id}-${dark ? "d" : "l"}`, chart);
        if (!cancelled) setSvg(svg);
      } catch {
        if (!cancelled) setSvg("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, dark, id]);

  return (
    <figure className="not-prose my-8 overflow-x-auto rounded-2xl border border-line bg-card p-4">
      {svg ? (
        <div className="mermaid-svg flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <pre className="text-xs text-muted">{chart}</pre>
      )}
    </figure>
  );
}
