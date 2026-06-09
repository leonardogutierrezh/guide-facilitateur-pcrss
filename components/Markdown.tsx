"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

/** A markdown task-list checkbox the facilitator can actually tick.
 *  Stateless across reloads by design — it just makes the list feel alive. */
function TickBox({ checked }: { checked?: boolean }) {
  const [on, setOn] = useState(!!checked);
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={`tickbox mt-[0.15em] flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-xs font-black text-white transition active:scale-90 ${
        on
          ? "border-clay-600 bg-clay-600"
          : "border-clay-500/40 bg-white hover:border-clay-500"
      }`}
    >
      {on ? "✓" : ""}
    </button>
  );
}

// Rewrites relative links between guide files (e.g. "../forms/forms-catalog.md"
// or "03-ag2-mise-en-place-cdv.md") into in-app /guide/<slug> routes.
function rewriteHref(href: string | undefined, baseSlug?: string): string | null {
  if (!href) return null;
  if (/^https?:\/\//i.test(href) || href.startsWith("mailto:")) return href; // external
  if (href.startsWith("#")) return null; // in-page anchor, drop (no headings ids)

  // strip anchor
  const [path] = href.split("#");
  if (!path.endsWith(".md")) return href;

  const baseDir = baseSlug ? baseSlug.split("/").slice(0, -1) : [];
  const parts = path.replace(/\.md$/, "").split("/");
  const stack = [...baseDir];
  for (const p of parts) {
    if (p === "." || p === "") continue;
    else if (p === "..") stack.pop();
    else stack.push(p);
  }
  return "/guide/" + stack.join("/");
}

export function Markdown({
  children,
  baseSlug,
  className = "prose-guide",
}: {
  children: string;
  baseSlug?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          ),
          input: ({ type, checked }) =>
            type === "checkbox" ? <TickBox checked={!!checked} /> : null,
          a: ({ href, children }) => {
            const rewritten = rewriteHref(href, baseSlug);
            if (!rewritten) return <span>{children}</span>;
            if (rewritten.startsWith("/")) return <Link href={rewritten}>{children}</Link>;
            return (
              <a href={rewritten} target="_blank" rel="noreferrer noopener">
                {children}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
