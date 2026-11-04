/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";

type Node = any;

function textOf(node: Node): string {
  if (!node) return "";
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.children)) return node.children.map(textOf).join("");
  return "";
}

/** `> [!TIP]` style GitHub alerts → <call-out kind="tip"> */
export function remarkCallouts() {
  return (tree: Node) => {
    visit(tree, "blockquote", (node: Node) => {
      const first = node.children?.[0];
      if (first?.type !== "paragraph") return;
      const t = first.children?.[0];
      if (t?.type !== "text") return;
      const m = t.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/);
      if (!m) return;
      t.value = t.value.slice(m[0].length);
      if (!t.value && first.children.length === 1) node.children.shift();
      node.data = {
        hName: "call-out",
        hProperties: { kind: m[1].toLowerCase(), role: "note" },
      };
    });
  };
}

function isCallout(n: Node) {
  return n.type === "blockquote" && /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/.test(textOf(n.children?.[0]));
}

function workedTitle(n: Node): "heading" | "bare" | "inline" | null {
  if (n.type === "heading" && n.depth === 3 && /Worked example/.test(textOf(n))) return "heading";
  if (n.type === "paragraph" && n.children?.[0]?.type === "strong" && /Worked example/.test(textOf(n.children[0]))) {
    const rest = n.children.slice(1);
    return rest.some((c: Node) => textOf(c).trim()) ? "inline" : "bare";
  }
  return null;
}

function startsWithEmphasis(n: Node) {
  return n.type === "paragraph" && ["strong", "emphasis"].includes(n.children?.[0]?.type);
}

/**
 * Wrap every "Worked example" (heading or bold paragraph) together with the
 * content that follows it into <worked-example intro="N">, where the first N
 * children are the title + problem statement and the rest is the solution.
 */
export function remarkWorkedExamples() {
  return (tree: Node) => {
    const out: Node[] = [];
    const kids: Node[] = tree.children;
    let i = 0;
    while (i < kids.length) {
      const kind = workedTitle(kids[i]);
      if (!kind) {
        out.push(kids[i++]);
        continue;
      }
      const group: Node[] = [kids[i++]];
      while (i < kids.length) {
        const n = kids[i];
        if (
          n.type === "heading" ||
          n.type === "thematicBreak" ||
          workedTitle(n) ||
          isCallout(n) ||
          (n.type === "code" && ["quiz", "widget", "flashcards"].includes(n.lang))
        )
          break;
        group.push(n);
        i++;
      }
      // Decide how many nodes form the problem statement.
      let intro = 1;
      if (kind !== "inline") {
        let stop = -1;
        for (let j = 1; j < group.length; j++) {
          const n = group[j];
          if (startsWithEmphasis(n) || (n.type === "list" && n.ordered)) {
            stop = j;
            break;
          }
        }
        intro = stop > 1 ? stop : Math.min(2, group.length);
      }
      out.push({
        type: "workedExample",
        children: group,
        data: { hName: "worked-example", hProperties: { intro: String(intro) } },
      });
    }
    tree.children = out;
  };
}
