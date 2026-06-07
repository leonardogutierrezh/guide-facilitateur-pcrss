"use client";

import Link from "next/link";
import { useLang } from "./LanguageProvider";
import { t } from "@/lib/i18n";

// Floating "ask the assistant" button, always within thumb reach.
export function AskButton({ context }: { context?: string }) {
  const { lang } = useLang();
  const href = context ? `/chat?about=${encodeURIComponent(context)}` : "/chat";
  return (
    <Link
      href={href}
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-clay-500 to-clay-700 px-5 py-3.5 font-extrabold text-white shadow-[0_14px_34px_-10px_rgba(177,74,31,0.7)] ring-1 ring-white/20 transition duration-200 hover:-translate-y-0.5 active:scale-95"
    >
      <span className="text-xl transition group-hover:rotate-[-8deg]">💬</span>
      <span>{t("ask", lang)}</span>
    </Link>
  );
}
