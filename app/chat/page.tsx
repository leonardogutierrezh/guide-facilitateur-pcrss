"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Chat } from "@/components/Chat";
import { LangToggle } from "@/components/LangToggle";
import { useLang } from "@/components/LanguageProvider";
import { t } from "@/lib/i18n";

function ChatScreen() {
  const { lang } = useLang();
  const params = useSearchParams();
  const about = params.get("about") || undefined;

  return (
    <main className="flex h-[100dvh] flex-col">
      <header className="z-30 flex items-center justify-between gap-2 border-b border-sand-200 bg-sand-50/90 px-4 py-3 backdrop-blur">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-black/5"
        >
          🏠 {t("home", lang)}
        </Link>
        <div className="flex items-center gap-2 font-extrabold text-clay-700">
          <span className="text-xl">💬</span>
          <span>{lang === "fr" ? "Assistant" : "Assistant"}</span>
        </div>
        <LangToggle />
      </header>
      <div className="min-h-0 flex-1">
        <Chat about={about} />
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatScreen />
    </Suspense>
  );
}
