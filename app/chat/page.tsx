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
      <header className="z-30 flex items-center justify-between gap-2 border-b border-black/[0.05] bg-white/55 px-4 py-3 backdrop-blur-xl">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur transition active:scale-95"
        >
          🏠 {t("home", lang)}
        </Link>
        <div className="flex items-center gap-2 font-extrabold tracking-tight text-clay-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-clay-500 to-clay-700 text-base shadow-sm">
            💬
          </span>
          <span>Assistant</span>
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
