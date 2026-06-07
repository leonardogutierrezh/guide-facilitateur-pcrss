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
            className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-bold text-clay-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur transition active:scale-95"
          >
            <span>{section.emoji}</span>
            <span>{lang === "fr" ? section.fr : section.en}</span>
          </Link>
        )}

        <article className="card rise mt-4 overflow-hidden rounded-[1.75rem] p-5 sm:p-8">
          {section && (
            <div
              className={`-mx-5 -mt-5 mb-5 h-1.5 bg-gradient-to-r ${section.color} sm:-mx-8 sm:-mt-8`}
            />
          )}
          <Markdown baseSlug={slug}>{body}</Markdown>
        </article>

        {/* prev / next */}
        <nav className="mt-5 grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/guide/${prev.slug}`}
              className="card pressable rounded-2xl p-3.5 text-left"
            >
              <div className="text-xs font-bold text-clay-500/70">‹ {t("back", lang)}</div>
              <div className="mt-0.5 truncate text-sm font-bold text-[var(--ink)]">
                {prev.emoji} {itemLabel(prev, lang)}
              </div>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/guide/${next.slug}`}
              className="card pressable rounded-2xl p-3.5 text-right"
            >
              <div className="text-xs font-bold text-clay-500/70">{lang === "fr" ? "Suivant" : "Next"} ›</div>
              <div className="mt-0.5 truncate text-sm font-bold text-[var(--ink)]">
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
