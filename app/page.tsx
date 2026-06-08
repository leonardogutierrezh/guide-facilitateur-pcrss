"use client";

import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { useLang } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";
import { NAV, sectionLabel, sectionSub } from "@/lib/nav";

export default function HomePage() {
  const { lang } = useLang();
  return (
    <main className="min-h-screen pb-24">
      <TopBar />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pt-8 text-center">
        <div className="rise mx-auto flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-clay-500 to-clay-700 text-5xl shadow-[0_12px_30px_-10px_rgba(177,74,31,0.55)]">
          🧭
        </div>
        <h1 className="rise rise-1 mt-4 text-[2rem] font-extrabold leading-tight tracking-tight text-clay-700">
          {t("appName", lang)}
        </h1>
        <div className="rise rise-1 mt-2 inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1 text-xs font-bold text-clay-600 shadow-sm ring-1 ring-clay-500/15 backdrop-blur">
          {t("appSub", lang)}
        </div>
        <p className="rise rise-2 mx-auto mt-4 max-w-md text-[1.05rem] text-[var(--ink-soft)]">
          {t("tagline", lang)}
        </p>
      </section>

      {/* Two big actions */}
      <section className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 px-4 sm:grid-cols-2">
        <Link
          href="/chat"
          className="sheen pressable rise rise-2 group rounded-[1.75rem] bg-gradient-to-br from-clay-500 to-clay-700 p-6 text-white shadow-[0_18px_40px_-16px_rgba(177,74,31,0.6)]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
            💬
          </div>
          <div className="mt-4 text-2xl font-extrabold tracking-tight">{t("askTitle", lang)}</div>
          <div className="mt-1 text-white/90">{t("askSub", lang)}</div>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-white/80">
            {lang === "fr" ? "Commencer" : "Start"} <span className="transition group-hover:translate-x-1">→</span>
          </div>
        </Link>

        <a
          href="#guide"
          className="card pressable rise rise-3 group rounded-[1.75rem] p-6"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 text-3xl">
            📖
          </div>
          <div className="mt-4 text-2xl font-extrabold tracking-tight text-clay-700">{t("browseTitle", lang)}</div>
          <div className="mt-1 text-[var(--ink-soft)]">{t("browseSub", lang)}</div>
          <div className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-clay-600">
            {lang === "fr" ? "Explorer" : "Explore"} <span className="transition group-hover:translate-x-1">→</span>
          </div>
        </a>
      </section>

      {/* Phase / section cards */}
      <section id="guide" className="mx-auto mt-12 max-w-3xl scroll-mt-20 px-4">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold tracking-tight text-[var(--ink)]">
          <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-clay-500 to-clay-700" />
          {t("browseTitle", lang)}
        </h2>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {NAV.map((s, i) => (
            <Link
              key={s.id}
              href={`/section/${s.id}`}
              className={`sheen pressable rise rise-${Math.min(i + 1, 6)} flex items-start gap-3.5 rounded-[1.5rem] bg-gradient-to-br ${s.color} p-4 text-white shadow-[0_14px_34px_-18px_rgba(44,36,32,0.7)]`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
                {s.emoji}
              </div>
              <div className="min-w-0">
                <div className="text-[1.05rem] font-extrabold leading-tight tracking-tight">
                  {sectionLabel(s, lang)}
                </div>
                <div className="mt-0.5 text-sm leading-snug text-white/90">{sectionSub(s, lang)}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-white/95 backdrop-blur">
                  {s.items.length}{" "}
                  {s.kind === "phase"
                    ? lang === "fr"
                      ? s.items.length > 1 ? "activités" : "activité"
                      : s.items.length > 1 ? "activities" : "activity"
                    : s.items.length > 1 ? t("steps", lang) : t("step", lang)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-14 max-w-3xl px-4 text-center text-xs text-[var(--ink-soft)]/70">
        PCRSS · Liptako-Gourma ·{" "}
        {lang === "fr" ? "Réplique fidèle du guide officiel" : "Faithful replica of the official guide"}
      </footer>
    </main>
  );
}
