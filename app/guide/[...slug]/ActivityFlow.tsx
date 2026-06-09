"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { Markdown } from "@/components/Markdown";
import { AskButton } from "@/components/AskButton";
import { useLang } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import { findEntry, leafLabel } from "@/lib/nav";
import { pairOf, rgba } from "@/lib/colors";
import { stripHeader, prepareOverview } from "@/lib/md";

export interface FlowStep {
  slug: string;
  body: string;
}

interface Meta {
  step?: number | string;
  source?: string;
  actors?: string[];
  forms?: string[];
}

function prefersReduced(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ActivityFlow({
  slug,
  overviewBody,
  steps,
  meta,
}: {
  slug: string;
  overviewBody: string;
  steps: FlowStep[];
  meta: Meta;
}) {
  const { lang } = useLang();
  const entry = findEntry(slug);
  const section = entry?.section;
  const activity = entry?.activity;

  const [from, to] = pairOf(section?.color ?? "from-clay-500 to-clay-700");

  // The flow: step 0 = overview, then one step per task (aligned by slug).
  const flow = useMemo(() => {
    const bySlug = new Map(steps.map((s) => [s.slug, s.body]));
    const tasks = (activity?.children ?? []).map((c, i) => ({
      kind: "task" as const,
      num: i + 1,
      emoji: c.emoji,
      label: leafLabel(c, lang),
      body: stripHeader(bySlug.get(c.slug) ?? ""),
    }));
    return [
      {
        kind: "overview" as const,
        num: 0,
        emoji: "📋",
        label: t("overview", lang),
        body: prepareOverview(overviewBody),
      },
      ...tasks,
    ];
  }, [activity, steps, overviewBody, lang]);

  const [mode, setMode] = useState<"guided" | "reading">("guided");
  const [step, setStep] = useState(0);
  const firstRun = useRef(true);
  const topRef = useRef<HTMLDivElement>(null);

  // Restore step from the URL hash (#etape-N) so steps are linkable / back works.
  useEffect(() => {
    const m = window.location.hash.match(/etape-(\d+)/);
    if (m) setStep(Math.max(0, Math.min(flow.length - 1, Number(m[1]))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    history.replaceState(null, "", `#etape-${step}`);
    topRef.current?.scrollIntoView({
      behavior: prefersReduced() ? "auto" : "smooth",
      block: "start",
    });
  }, [step]);

  const go = (i: number) => setStep(Math.max(0, Math.min(flow.length - 1, i)));

  // Next activity in the same phase (for the final "Next activity" button).
  const nextActivity = useMemo(() => {
    if (!section || !activity) return null;
    const idx = section.items.findIndex((it) => it.slug === activity.slug);
    return idx >= 0 && idx < section.items.length - 1 ? section.items[idx + 1] : null;
  }, [section, activity]);

  if (!entry || !section || !activity) return null;

  const cur = flow[step];
  const isLast = step === flow.length - 1;
  const actors = Array.isArray(meta.actors) ? meta.actors : [];
  const forms = Array.isArray(meta.forms) ? meta.forms : [];

  return (
    <main className="min-h-screen pb-28">
      <TopBar showBack />
      <div ref={topRef} className="mx-auto max-w-3xl scroll-mt-20 px-4 pt-4">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/section/${section.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-bold text-clay-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur transition active:scale-95"
          >
            <span>{section.emoji}</span>
            <span>{lang === "fr" ? section.fr : section.en}</span>
          </Link>
        </div>

        {/* Activity header */}
        <div
          className="sheen mt-4 rounded-[1.6rem] p-5 text-white shadow-[0_16px_40px_-18px_rgba(44,36,32,0.6)] sm:p-6"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
              {activity.emoji}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
                {leafLabel(activity, lang)}
              </h1>
              <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs font-bold">
                {meta.step != null && (
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 backdrop-blur">
                    {t("stepWord", lang)} {String(meta.step)}
                  </span>
                )}
                {meta.source && (
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 backdrop-blur">
                    {t("sourceWord", lang)} · {meta.source}
                  </span>
                )}
              </div>
            </div>
          </div>

          {(actors.length > 0 || forms.length > 0) && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {actors.length > 0 && (
                <div className="rounded-2xl bg-white/15 p-2.5 backdrop-blur">
                  <div className="text-[0.65rem] font-extrabold uppercase tracking-wider text-white/80">
                    {t("actorsWord", lang)}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {actors.map((a) => (
                      <span
                        key={a}
                        className="rounded-md bg-white/25 px-1.5 py-0.5 text-[0.7rem] font-bold"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {forms.length > 0 && (
                <div className="rounded-2xl bg-white/15 p-2.5 backdrop-blur">
                  <div className="text-[0.65rem] font-extrabold uppercase tracking-wider text-white/80">
                    {t("formsWord", lang)}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {forms.map((f) => (
                      <Link
                        key={f}
                        href="/guide/forms/forms-catalog"
                        className="rounded-md bg-white/25 px-1.5 py-0.5 text-[0.7rem] font-bold underline-offset-2 hover:underline"
                      >
                        {f}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mode toggle */}
        <div className="mt-4 inline-flex rounded-full bg-white/70 p-1 text-sm font-bold shadow-sm ring-1 ring-black/[0.06] backdrop-blur">
          {(["guided", "reading"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1.5 transition ${
                mode === m ? "text-white" : "text-clay-700"
              }`}
              style={mode === m ? { background: `linear-gradient(135deg, ${from}, ${to})` } : undefined}
            >
              {m === "guided" ? t("guidedView", lang) : t("readingView", lang)}
            </button>
          ))}
        </div>

        {mode === "reading" ? (
          <article className="card mt-4 rounded-[1.6rem] p-5 sm:p-7">
            <Markdown baseSlug={slug}>{overviewBody}</Markdown>
            {flow
              .filter((s) => s.kind === "task")
              .map((s, i) => (
                <div key={i} className="mt-6 border-t border-clay-500/10 pt-5">
                  <Markdown baseSlug={steps[i]?.slug ?? slug}>{s.body}</Markdown>
                </div>
              ))}
          </article>
        ) : (
          <>
            {/* Stepper */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--ink-soft)]">
                <span>
                  {t("stepWord", lang)} {step + 1} {t("ofWord", lang)} {flow.length}
                </span>
                <span>{Math.round(((step + 1) / flow.length) * 100)}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-clay-500/12">
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{
                    width: `${((step + 1) / flow.length) * 100}%`,
                    background: `linear-gradient(90deg, ${from}, ${to})`,
                  }}
                />
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {flow.map((s, i) => {
                  const on = i === step;
                  const done = i < step;
                  return (
                    <button
                      key={i}
                      onClick={() => go(i)}
                      aria-current={on}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition"
                      style={
                        on
                          ? { background: `linear-gradient(135deg, ${from}, ${to})`, color: "#fff" }
                          : done
                            ? { background: rgba(to, 0.16), color: to }
                            : { background: "rgba(0,0,0,0.04)", color: "var(--ink-soft)" }
                      }
                    >
                      {i === 0 ? "•" : done ? "✓" : i}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current step card */}
            <article key={step} className="step-in card mt-4 rounded-[1.6rem] p-5 sm:p-7">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg text-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                >
                  {cur.kind === "overview" ? "📋" : cur.num}
                </span>
                <h2 className="flex-1 text-lg font-extrabold tracking-tight text-[var(--ink)]">
                  {cur.label}
                </h2>
                {cur.kind === "task" && (
                  <Link
                    href={`/guide/${steps[cur.num - 1]?.slug}`}
                    className="shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold transition active:scale-95"
                    style={{ background: rgba(to, 0.12), color: to }}
                  >
                    {t("openDetail", lang)} ↗
                  </Link>
                )}
              </div>
              <Markdown baseSlug={cur.kind === "overview" ? slug : steps[cur.num - 1]?.slug ?? slug}>
                {cur.body}
              </Markdown>
            </article>

            {/* Footer navigation */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                onClick={() => go(step - 1)}
                disabled={step === 0}
                className="pressable inline-flex items-center gap-1.5 rounded-full bg-white/85 px-5 py-3 text-sm font-extrabold text-clay-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur disabled:cursor-not-allowed disabled:opacity-40"
              >
                ‹ {t("previous", lang)}
              </button>

              {!isLast ? (
                <button
                  onClick={() => go(step + 1)}
                  className="sheen pressable inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_-12px_rgba(44,36,32,0.6)]"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                >
                  {t("next", lang)} ›
                </button>
              ) : nextActivity ? (
                <Link
                  href={`/guide/${nextActivity.slug}`}
                  className="sheen pressable inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-clay-500 to-clay-700 px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_-12px_rgba(177,74,31,0.6)]"
                >
                  {t("nextActivity", lang)} →
                </Link>
              ) : (
                <Link
                  href={`/section/${section.id}`}
                  className="sheen pressable inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-clay-500 to-clay-700 px-6 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_-12px_rgba(177,74,31,0.6)]"
                >
                  {t("finishActivity", lang)} ✓
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      <AskButton context={leafLabel(activity, lang)} />
    </main>
  );
}
