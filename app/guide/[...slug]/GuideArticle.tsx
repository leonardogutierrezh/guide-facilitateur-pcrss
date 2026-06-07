"use client";

import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { Markdown } from "@/components/Markdown";
import { AskButton } from "@/components/AskButton";
import { useLang } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import { findItem, itemLabel, type NavItem } from "@/lib/nav";

export function GuideArticle({ slug, title, body }: { slug: string; title: string; body: string }) {
  const { lang } = useLang();
  const found = findItem(slug);
  const section = found?.section;

  // prev / next within the same section
  let prev: NavItem | null = null;
  let next: NavItem | null = null;
  if (section) {
    const i = section.items.findIndex((it) => it.slug === slug);
    prev = i > 0 ? section.items[i - 1] : null;
    next = i < section.items.length - 1 ? section.items[i + 1] : null;
  }

  return (
    <main className="min-h-screen pb-28">
      <TopBar showBack />
      <div className="mx-auto max-w-3xl px-4 pt-4">
        {section && (
          <Link
            href={`/section/${section.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-clay-700 shadow-sm ring-1 ring-black/5"
          >
            <span>{section.emoji}</span>
            <span>{lang === "fr" ? section.fr : section.en}</span>
          </Link>
        )}

        <article className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-7">
          <Markdown baseSlug={slug}>{body}</Markdown>
        </article>

        {/* prev / next */}
        <nav className="mt-5 grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/guide/${prev.slug}`}
              className="rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-black/5"
            >
              <div className="text-xs font-semibold text-gray-400">‹ {t("back", lang)}</div>
              <div className="truncate text-sm font-bold text-gray-700">
                {prev.emoji} {itemLabel(prev, lang)}
              </div>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/guide/${next.slug}`}
              className="rounded-2xl bg-white p-3 text-right shadow-sm ring-1 ring-black/5"
            >
              <div className="text-xs font-semibold text-gray-400">{lang === "fr" ? "Suivant" : "Next"} ›</div>
              <div className="truncate text-sm font-bold text-gray-700">
                {next.emoji} {itemLabel(next, lang)}
              </div>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>

      <AskButton context={found ? itemLabel(found.item, lang) : title} />
    </main>
  );
}
