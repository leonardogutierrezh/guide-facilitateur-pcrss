"use client";

import { useLang } from "./LanguageProvider";

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="relative inline-flex items-center rounded-full bg-white/70 p-1 shadow-sm ring-1 ring-black/[0.06] backdrop-blur">
      {/* sliding pill */}
      <span
        aria-hidden
        className="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-br from-clay-500 to-clay-700 shadow-sm transition-transform duration-300 ease-out"
        style={{ transform: lang === "fr" ? "translateX(0)" : "translateX(100%)" }}
      />
      <button
        onClick={() => setLang("fr")}
        aria-pressed={lang === "fr"}
        className={`relative z-10 rounded-full px-3 py-1 text-sm font-bold transition ${
          lang === "fr" ? "text-white" : "text-gray-500"
        }`}
      >
        🇫🇷 FR
      </button>
      <button
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`relative z-10 rounded-full px-3 py-1 text-sm font-bold transition ${
          lang === "en" ? "text-white" : "text-gray-500"
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
