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
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-clay-600 px-5 py-3.5 font-extrabold text-white shadow-xl ring-4 ring-clay-600/20 transition active:scale-95"
    >
      <span className="text-xl">💬</span>
      <span>{t("ask", lang)}</span>
    </Link>
  );
}
