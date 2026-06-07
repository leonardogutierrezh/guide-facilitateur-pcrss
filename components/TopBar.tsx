"use client";

import Link from "next/link";
import { LangToggle } from "./LangToggle";
import { useLang } from "./LanguageProvider";
import { t } from "@/lib/i18n";

export function TopBar({ showBack = false }: { showBack?: boolean }) {
  const { lang } = useLang();
  return (
    <header className="sticky top-0 z-30 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-clay-700">
          <span className="text-2xl">🧭</span>
          <span className="hidden sm:inline">{t("appName", lang)}</span>
          <span className="sm:hidden">{lang === "fr" ? "Guide" : "Guide"}</span>
        </Link>
        <div className="flex items-center gap-2">
          {showBack && (
            <Link
              href="/"
              className="rounded-full bg-white px-3 py-1.5 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-black/5"
            >
              🏠 {t("home", lang)}
            </Link>
          )}
          <LangToggle />
        </div>
      </div>
    </header>
  );
}
