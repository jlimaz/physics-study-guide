"use client";

import { Children, isValidElement, useState, type ReactNode } from "react";
import { checkKey, setValue, useValue } from "@/lib/progress";

const CALLOUT: Record<string, { icon: string; label: string }> = {
  tip: { icon: "💡", label: "Tip" },
  note: { icon: "📝", label: "Note" },
  important: { icon: "⭐", label: "Important" },
  warning: { icon: "🚨", label: "Trap" },
  caution: { icon: "⚠️", label: "Caution" },
};

export function Callout({ kind = "note", children }: { kind?: string; children?: ReactNode }) {
  const c = CALLOUT[kind] ?? CALLOUT.note;
  return (
    <aside role="note" className={`callout callout-${kind}`}>
      <div className="callout-label">
        <span aria-hidden>{c.icon}</span> {c.label}
      </div>
      <div className="callout-body">{children}</div>
    </aside>
  );
}

export function WorkedExample({ intro = "1", children }: { intro?: string; children?: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const kids = Children.toArray(children).filter((c) => isValidElement(c));
  const n = Math.max(1, Number(intro) || 1);
  const head = kids.slice(0, n);
  const rest = kids.slice(n);
  return (
    <section className="worked">
      <div className="worked-head">{head}</div>
      {rest.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setHidden((h) => !h)}
            className="worked-toggle"
            aria-expanded={!hidden}
          >
            {hidden ? "👀 Show the solution" : "🙈 Hide the solution, let me try first"}
          </button>
          {hidden ? (
            <div className="worked-hidden">Work it out on paper, then reveal to check each step.</div>
          ) : (
            <div className="worked-body">{rest}</div>
          )}
        </>
      )}
    </section>
  );
}

export function TaskItem({ id, children }: { id: string; children?: ReactNode }) {
  const checked = useValue<boolean>(checkKey(id)) ?? false;
  return (
    <li className="task-item">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setValue(checkKey(id), e.target.checked || undefined)}
          className="mt-1.5 size-4 shrink-0 accent-[var(--accent)]"
        />
        <span className={checked ? "text-muted line-through decoration-1" : ""}>{children}</span>
      </label>
    </li>
  );
}

export function Reveal({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="reveal">
      <button type="button" className="reveal-summary" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>{summary}</span>
        <span aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
          ⌄
        </span>
      </button>
      {open && <div className="reveal-body">{children}</div>}
    </div>
  );
}
