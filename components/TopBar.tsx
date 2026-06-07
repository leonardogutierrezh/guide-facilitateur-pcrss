"use client";

import Link from "next/link";
import { LangToggle } from "./LangToggle";
import { useLang } from "./LanguageProvider";
import { t } from "@/lib/i18n";

export function TopBar({ showBack = false }: { showBack?: boolean }) {
  const { lang } = useLang();
  return (
    <header className="sticky top-0 z-30 border-b border-black/[0.05] bg-white/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight text-clay-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-clay-500 to-clay-700 text-lg shadow-sm">
            🧭
          </span>
          <span className="hidden sm:inline">{t("appName", lang)}</span>
        </Link>
        <div className="flex items-center gap-2">
          {showBack && (
            <Link
              href="/"
              className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur transition active:scale-95"
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
