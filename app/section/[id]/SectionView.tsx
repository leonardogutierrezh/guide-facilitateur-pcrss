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
        <div className={`rounded-3xl bg-gradient-to-br ${section.color} p-5 text-white shadow-lg`}>
          <div className="text-5xl">{section.emoji}</div>
          <h1 className="mt-2 text-2xl font-extrabold">{sectionLabel(section, lang)}</h1>
          <p className="mt-1 text-white/90">{sectionSub(section, lang)}</p>
        </div>

        <ol className="mt-5 space-y-3">
          {section.items.map((item, idx) => (
            <li key={item.slug}>
              <Link
                href={`/guide/${item.slug}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand-100 text-2xl">
                  {item.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-gray-800">{itemLabel(item, lang)}</span>
                </span>
                <span className="text-2xl text-gray-300">›</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <AskButton />
    </main>
  );
}
