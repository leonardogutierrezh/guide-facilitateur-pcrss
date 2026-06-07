"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

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
