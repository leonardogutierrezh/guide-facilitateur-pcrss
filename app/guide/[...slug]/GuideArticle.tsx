"use client";

import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { Markdown } from "@/components/Markdown";
import { AskButton } from "@/components/AskButton";
import { useLang } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import { findEntry, prevNext, leafLabel } from "@/lib/nav";

export function GuideArticle({ slug, title, body }: { slug: string; title: string; body: string }) {
  const { lang } = useLang();
  const entry = findEntry(slug);
  const section = entry?.section;
  const isTask = !!entry?.task;
  const { prev, next } = prevNext(slug);

  return (
    <main className="min-h-screen pb-28">
      <TopBar showBack />
      <div className="mx-auto max-w-3xl px-4 pt-4">
        {/* breadcrumb chips */}
        {section && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/section/${section.id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-bold text-clay-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur transition active:scale-95"
            >
              <span>{section.emoji}</span>
              <span>{lang === "fr" ? section.fr : section.en}</span>
            </Link>
            {isTask && entry && (
              <>
                <span className="text-clay-400">›</span>
                <Link
                  href={`/guide/${entry.activity.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-bold text-clay-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur transition active:scale-95"
                >
                  <span>{entry.activity.emoji}</span>
                  <span className="max-w-[12rem] truncate">{leafLabel(entry.activity, lang)}</span>
                </Link>
              </>
            )}
          </div>
        )}

        <article className="card rise relative mt-4 overflow-hidden rounded-[1.75rem] p-5 pt-6 sm:p-8 sm:pt-9">
          {section && (
            <div className={`absolute inset-x-3 top-2 h-1.5 rounded-full bg-gradient-to-r ${section.color}`} />
          )}
          <Markdown baseSlug={slug}>{body}</Markdown>
        </article>

        {/* prev / next within the phase (activities + their tasks, in order) */}
        <nav className="mt-5 grid grid-cols-2 gap-3">
          {prev ? (
            <Link href={`/guide/${prev.slug}`} className="card pressable rounded-2xl p-3.5 text-left">
              <div className="text-xs font-bold text-clay-500/70">‹ {t("back", lang)}</div>
              <div className="mt-0.5 truncate text-sm font-bold text-[var(--ink)]">
                {prev.emoji} {leafLabel(prev, lang)}
              </div>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/guide/${next.slug}`} className="card pressable rounded-2xl p-3.5 text-right">
              <div className="text-xs font-bold text-clay-500/70">{lang === "fr" ? "Suivant" : "Next"} ›</div>
              <div className="mt-0.5 truncate text-sm font-bold text-[var(--ink)]">
                {next.emoji} {leafLabel(next, lang)}
              </div>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>

      <AskButton context={entry ? leafLabel(entry.task ?? entry.activity, lang) : title} />
    </main>
  );
}
