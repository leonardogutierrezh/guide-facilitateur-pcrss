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
      <section className="mx-auto max-w-3xl px-4 pt-6 text-center">
        <div className="text-6xl">🧭</div>
        <h1 className="mt-2 text-3xl font-extrabold text-clay-700">{t("appName", lang)}</h1>
        <p className="mt-1 text-sm font-semibold text-clay-500">{t("appSub", lang)}</p>
        <p className="mx-auto mt-3 max-w-md text-gray-600">{t("tagline", lang)}</p>
      </section>

      {/* Two big actions */}
      <section className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-4 px-4 sm:grid-cols-2">
        <Link
          href="/chat"
          className="group rounded-3xl bg-gradient-to-br from-clay-600 to-clay-700 p-6 text-white shadow-lg transition active:scale-[0.98]"
        >
          <div className="text-5xl">💬</div>
          <div className="mt-3 text-2xl font-extrabold">{t("askTitle", lang)}</div>
          <div className="mt-1 text-white/90">{t("askSub", lang)}</div>
        </Link>
        <a
          href="#guide"
          className="group rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 transition active:scale-[0.98]"
        >
          <div className="text-5xl">📖</div>
          <div className="mt-3 text-2xl font-extrabold text-clay-700">{t("browseTitle", lang)}</div>
          <div className="mt-1 text-gray-600">{t("browseSub", lang)}</div>
        </a>
      </section>

      {/* Phase / section cards */}
      <section id="guide" className="mx-auto mt-10 max-w-3xl px-4">
        <h2 className="mb-3 text-xl font-extrabold text-gray-700">{t("browseTitle", lang)}</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {NAV.map((s) => (
            <Link
              key={s.id}
              href={`/section/${s.id}`}
              className={`flex items-start gap-3 rounded-2xl bg-gradient-to-br ${s.color} p-4 text-white shadow-md transition active:scale-[0.98]`}
            >
              <div className="text-4xl leading-none">{s.emoji}</div>
              <div className="min-w-0">
                <div className="text-lg font-extrabold leading-tight">{sectionLabel(s, lang)}</div>
                <div className="mt-0.5 text-sm text-white/90">{sectionSub(s, lang)}</div>
                <div className="mt-1 text-xs font-semibold text-white/80">
                  {s.items.length} {s.items.length > 1 ? t("steps", lang) : t("step", lang)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-12 max-w-3xl px-4 text-center text-xs text-gray-400">
        PCRSS · Liptako-Gourma · {lang === "fr" ? "Réplique fidèle du guide officiel" : "Faithful replica of the official guide"}
      </footer>
    </main>
  );
}
