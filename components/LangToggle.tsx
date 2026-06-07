"use client";

import { useLang } from "./LanguageProvider";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="inline-flex rounded-full bg-white/80 p-1 shadow-sm ring-1 ring-black/5">
      <button
        onClick={() => setLang("fr")}
        aria-pressed={lang === "fr"}
        className={`rounded-full px-3 py-1 text-sm font-bold transition ${
          lang === "fr" ? "bg-clay-600 text-white" : "text-gray-600"
        }`}
      >
        🇫🇷 FR
      </button>
      <button
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-3 py-1 text-sm font-bold transition ${
          lang === "en" ? "bg-clay-600 text-white" : "text-gray-600"
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
