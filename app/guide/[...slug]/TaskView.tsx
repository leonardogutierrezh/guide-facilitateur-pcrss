"use client";

import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { Markdown } from "@/components/Markdown";
import { AskButton } from "@/components/AskButton";
import { useLang } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import { findEntry, leafLabel } from "@/lib/nav";
import { pairOf, rgba } from "@/lib/colors";
import { stripHeader } from "@/lib/md";

interface Meta {
  source?: string;
}

export function TaskView({
  slug,
  body,
  meta,
}: {
  slug: string;
  body: string;
  meta: Meta;
}) {
  const { lang } = useLang();
  const entry = findEntry(slug);
  const section = entry?.section;
  const activity = entry?.activity;
  const task = entry?.task;

  const [from, to] = pairOf(section?.color ?? "from-clay-500 to-clay-700");

  if (!entry || !section || !activity || !task) return null;

  const children = activity.children ?? [];
  const idx = children.findIndex((c) => c.slug === slug);
  const total = children.length;
  const prev = idx > 0 ? children[idx - 1] : null;
  const next = idx >= 0 && idx < total - 1 ? children[idx + 1] : null;

  // Next activity in the same phase, for when this is the last task.
  const actIdx = section.items.findIndex((it) => it.slug === activity.slug);
  const nextActivity =
    actIdx >= 0 && actIdx < section.items.length - 1 ? section.items[actIdx + 1] : null;

  const content = stripHeader(body);

  return (
    <main className="min-h-screen pb-28">
      <TopBar showBack />
      <div className="mx-auto max-w-3xl px-4 pt-4">
        {/* Breadcrumb: section › activity › task */}
        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          <Link
            href={`/section/${section.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 font-bold text-clay-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur transition active:scale-95"
          >
            <span>{section.emoji}</span>
            <span className="max-w-[8rem] truncate sm:max-w-none">
              {lang === "fr" ? section.fr : section.en}
            </span>
          </Link>
          <span className="text-clay-400">›</span>
          <Link
            href={`/guide/${activity.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 font-bold text-clay-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur transition active:scale-95"
          >
            <span>{activity.emoji}</span>
            <span className="max-w-[10rem] truncate">{leafLabel(activity, lang)}</span>
          </Link>
        </div>

        {/* Task header */}
        <div
          className="sheen mt-4 rounded-[1.6rem] p-5 text-white shadow-[0_16px_40px_-18px_rgba(44,36,32,0.6)] sm:p-6"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        >
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/85">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 backdrop-blur">
              {t("taskWord", lang)} {idx + 1} / {total}
            </span>
            {meta.source && (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 backdrop-blur normal-case">
                {t("sourceWord", lang)} · {meta.source}
              </span>
            )}
          </div>
          <h1 className="mt-2 flex items-start gap-2.5 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            <span className="text-3xl">{task.emoji}</span>
            <span>{leafLabel(task, lang)}</span>
          </h1>
          <Link
            href={`/guide/${activity.slug}#etape-${idx + 1}`}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1.5 text-sm font-bold backdrop-blur transition active:scale-95"
          >
            ↪ {t("seeInFlow", lang)}
          </Link>
        </div>

        {/* How to perform */}
        <article className="card mt-4 rounded-[1.6rem] p-5 sm:p-7">
          <div
            className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest"
            style={{ color: to }}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-lg text-white"
              style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
            >
              🧭
            </span>
            {t("howTo", lang)}
          </div>
          <Markdown baseSlug={slug}>{content}</Markdown>
        </article>

        {/* Task-to-task navigation */}
        <nav className="mt-5 grid grid-cols-2 gap-3">
          {prev ? (
            <Link href={`/guide/${prev.slug}`} className="card pressable rounded-2xl p-3.5 text-left">
              <div className="text-xs font-bold text-clay-500/70">‹ {t("prevTask", lang)}</div>
              <div className="mt-0.5 truncate text-sm font-bold text-[var(--ink)]">
                {prev.emoji} {leafLabel(prev, lang)}
              </div>
            </Link>
          ) : (
            <Link href={`/guide/${activity.slug}`} className="card pressable rounded-2xl p-3.5 text-left">
              <div className="text-xs font-bold text-clay-500/70">‹ {t("backToActivity", lang)}</div>
              <div className="mt-0.5 truncate text-sm font-bold text-[var(--ink)]">
                {activity.emoji} {leafLabel(activity, lang)}
              </div>
            </Link>
          )}

          {next ? (
            <Link href={`/guide/${next.slug}`} className="card pressable rounded-2xl p-3.5 text-right">
              <div className="text-xs font-bold text-clay-500/70">{t("nextTask", lang)} ›</div>
              <div className="mt-0.5 truncate text-sm font-bold text-[var(--ink)]">
                {next.emoji} {leafLabel(next, lang)}
              </div>
            </Link>
          ) : nextActivity ? (
            <Link href={`/guide/${nextActivity.slug}`} className="card pressable rounded-2xl p-3.5 text-right">
              <div className="text-xs font-bold text-clay-500/70">{t("nextActivity", lang)} ›</div>
              <div className="mt-0.5 truncate text-sm font-bold text-[var(--ink)]">
                {nextActivity.emoji} {leafLabel(nextActivity, lang)}
              </div>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>

      <AskButton context={leafLabel(task, lang)} />
    </main>
  );
}
