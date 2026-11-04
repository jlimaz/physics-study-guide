"use client";

import { useState, type ReactNode } from "react";
import { checkKey, setValue, useValue } from "@/lib/progress";

/** Wraps the solution part of a worked example so it can be hidden while you try it. */
export function Solution({ children }: { children?: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  return (
    <div className="solution">
      <button type="button" onClick={() => setHidden((h) => !h)} className="solution-toggle" aria-expanded={!hidden}>
        {hidden ? "Show solution" : "Hide solution and try it first"}
      </button>
      {hidden ? (
        <p className="solution-hidden">Solution hidden. Work it on paper, then show it to check each step.</p>
      ) : (
        <div className="solution-body">{children}</div>
      )}
    </div>
  );
}

export function Checklist({ children }: { children?: ReactNode }) {
  return <ul className="checklist">{children}</ul>;
}

export function Check({ id, children }: { id: string; children?: ReactNode }) {
  const checked = useValue<boolean>(checkKey(id)) ?? false;
  return (
    <li>
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
        <svg viewBox="0 0 16 16" width="16" height="16" style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform 150ms" }} aria-hidden>
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="reveal-body">{children}</div>}
    </div>
  );
}
