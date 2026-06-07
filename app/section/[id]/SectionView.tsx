"use client";

import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { AskButton } from "@/components/AskButton";
import { useLang } from "@/components/LanguageProvider";
import { NAV, sectionLabel, sectionSub, itemLabel } from "@/lib/nav";

export function SectionView({ id }: { id: string }) {
  const { lang } = useLang();
  const section = NAV.find((s) => s.id === id);
  if (!section) return null;

  return (
    <main className="min-h-screen pb-28">
      <TopBar showBack />
      <div className="mx-auto max-w-3xl px-4 pt-5">
        <div
          className={`sheen rise rounded-[1.75rem] bg-gradient-to-br ${section.color} p-6 text-white shadow-[0_18px_44px_-18px_rgba(44,36,32,0.65)]`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 text-4xl backdrop-blur">
            {section.emoji}
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight">{sectionLabel(section, lang)}</h1>
          <p className="mt-1 text-white/90">{sectionSub(section, lang)}</p>
        </div>

        <ol className="mt-5 space-y-2.5">
          {section.items.map((item, idx) => (
            <li key={item.slug} className={`rise rise-${Math.min(idx + 1, 6)}`}>
              <Link
                href={`/guide/${item.slug}`}
                className="card pressable group flex items-center gap-3.5 rounded-2xl p-3.5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sand-100 to-sand-200 text-2xl shadow-inner">
                  {item.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-clay-500/70">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="block text-[1.02rem] font-bold leading-tight text-[var(--ink)]">
                    {itemLabel(item, lang)}
                  </span>
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-clay-50 text-lg font-bold text-clay-500 transition group-hover:bg-clay-100 group-hover:translate-x-0.5">
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <AskButton context={sectionLabel(section, lang)} />
    </main>
  );
}
