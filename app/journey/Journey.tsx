"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAV, sectionLabel, sectionSub, leafLabel } from "@/lib/nav";
import { useLang } from "@/components/LanguageProvider";
import { LangToggle } from "@/components/LangToggle";
import { t } from "@/lib/i18n";
import { pairOf, rgba } from "@/lib/colors";

/** The 6 numbered phases are the journey path; everything else (transversal,
 *  foundations, forms, apps) becomes "resources" at the end. */
const PHASES = NAV.filter((s) => s.id.startsWith("phase-"));
const EXTRAS = NAV.filter((s) => !s.id.startsWith("phase-"));

function prefersReduced(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function Journey() {
  const { lang } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [docProgress, setDocProgress] = useState(0);

  useEffect(() => {
    const reduce = prefersReduced();

    // Reveal-on-scroll. With reduced motion we just show everything.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    // Reveal anything already on screen synchronously (no flash, and it covers
    // anchor-jumps), then only observe the rest. Done before removing `no-js`.
    const vh = window.innerHeight;
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (reduce || (r.top < vh * 0.95 && r.bottom > 0)) el.classList.add("in");
      else io.observe(el);
    });
    // Mark JS as available so the .no-js fallback styles step aside.
    document.documentElement.classList.remove("no-js");

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight;
        const center = vh * 0.5;

        // Overall page progress for the top bar.
        const max = document.documentElement.scrollHeight - vh;
        setDocProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);

        // Which phase owns the viewport centre.
        let idx = 0;
        let best = Infinity;
        sectionRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          if (r.top <= center && r.bottom >= center) {
            idx = i;
            best = -1;
          } else if (best !== -1) {
            const d = Math.abs(r.top + r.height / 2 - center);
            if (d < best) {
              best = d;
              idx = i;
            }
          }
        });
        setActive(idx);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollTo = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({
      behavior: prefersReduced() ? "auto" : "smooth",
      block: "center",
    });
  };

  const [aFrom, aTo] = pairOf(PHASES[active]?.color ?? PHASES[0].color);

  return (
    <main className="relative min-h-screen overflow-x-clip">
      {/* Ambient tint that morphs to the active phase colour */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 transition-[background] duration-700 ease-out"
        style={{
          background: `radial-gradient(55rem 55rem at 12% -5%, ${rgba(aFrom, 0.2)}, transparent 60%), radial-gradient(50rem 50rem at 105% 25%, ${rgba(aTo, 0.16)}, transparent 55%), radial-gradient(60rem 60rem at 50% 115%, ${rgba(aFrom, 0.12)}, transparent 60%)`,
        }}
      />

      {/* Scroll-progress bar */}
      <div className="fixed inset-x-0 top-0 z-50 h-1">
        <div
          className="h-full rounded-r-full"
          style={{
            width: `${docProgress * 100}%`,
            background: `linear-gradient(90deg, ${aFrom}, ${aTo})`,
          }}
        />
      </div>

      {/* Minimal top bar */}
      <header className="sticky top-0 z-40 border-b border-black/[0.05] bg-white/45 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-2.5">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold tracking-tight text-clay-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-clay-500 to-clay-700 text-base shadow-sm">
              🧭
            </span>
            <span className="hidden sm:inline">{t("appName", lang)}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur transition active:scale-95"
            >
              {t("classicView", lang)}
            </Link>
            <LangToggle />
          </div>
        </div>
      </header>

      {/* Side phase nav (desktop) */}
      <nav
        aria-label="Phases"
        className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
      >
        {PHASES.map((s, i) => {
          const [, to] = pairOf(s.color);
          const on = i === active;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(i)}
              aria-label={sectionLabel(s, lang)}
              className="group relative flex items-center justify-center"
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: on ? 14 : 9,
                  height: on ? 14 : 9,
                  background: on ? to : rgba(to, 0.35),
                  boxShadow: on ? `0 0 0 4px ${rgba(to, 0.18)}` : "none",
                }}
              />
              <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-clay-700 opacity-0 shadow-sm ring-1 ring-black/5 backdrop-blur transition group-hover:opacity-100">
                {sectionLabel(s, lang)}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-3xl px-5 pt-16 pb-14 text-center sm:pt-24">
        <div className="float mx-auto flex h-24 w-24 items-center justify-center rounded-[1.8rem] bg-gradient-to-br from-clay-500 to-clay-700 text-6xl shadow-[0_18px_44px_-14px_rgba(177,74,31,0.6)]">
          🧭
        </div>
        <div className="reveal mt-6 inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-clay-600 shadow-sm ring-1 ring-clay-500/15 backdrop-blur">
          {t("journeyKicker", lang)}
        </div>
        <h1 className="reveal mx-auto mt-4 max-w-2xl text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-clay-700 sm:text-6xl">
          {t("journeyTitle", lang)}
        </h1>
        <p className="reveal mx-auto mt-5 max-w-xl text-lg text-[var(--ink-soft)] sm:text-xl">
          {t("journeyLead", lang)}
        </p>
        <button
          onClick={() => scrollTo(0)}
          className="reveal mx-auto mt-9 flex flex-col items-center gap-2 text-sm font-bold text-clay-600"
        >
          {t("journeyScroll", lang)}
          <span className="nudge text-2xl leading-none">↓</span>
        </button>
      </section>

      {/* The journey track */}
      <div ref={trackRef} className="relative mx-auto max-w-3xl px-4 sm:px-5">
        {PHASES.map((s, i) => {
          const [from, to] = pairOf(s.color);
          const reached = i <= active;
          const isActive = i === active;
          const first = i === 0;
          const last = i === PHASES.length - 1;
          return (
            <section
              key={s.id}
              id={s.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              className="relative grid scroll-mt-24 grid-cols-[3rem_1fr] gap-x-4 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6"
            >
              {/* Rail: connector spine + sticky station node */}
              <div className="relative flex justify-center">
                {/* base track */}
                <span
                  className="absolute left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-clay-500/10"
                  style={{ top: first ? "2.5rem" : 0, bottom: last ? "auto" : 0, height: last ? "3.5rem" : undefined }}
                />
                {/* lit overlay (fills as you reach each phase) */}
                <span
                  className="absolute left-1/2 w-[3px] -translate-x-1/2 rounded-full transition-opacity duration-700"
                  style={{
                    top: first ? "2.5rem" : 0,
                    bottom: last ? "auto" : 0,
                    height: last ? "3.5rem" : undefined,
                    background: `linear-gradient(${from}, ${to})`,
                    opacity: reached ? 1 : 0,
                  }}
                />
                {/* sticky station node */}
                <span className="sticky top-[42vh] z-10 flex h-11 w-11 items-center justify-center sm:h-12 sm:w-12">
                  {isActive && (
                    <span
                      className="halo absolute inset-0 rounded-2xl"
                      style={{ background: rgba(to, 0.5) }}
                    />
                  )}
                  <span
                    className="relative flex h-full w-full items-center justify-center rounded-2xl text-lg font-extrabold text-white transition-transform duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${from}, ${to})`,
                      transform: isActive ? "scale(1.12)" : "scale(1)",
                      boxShadow: isActive
                        ? `0 12px 30px -8px ${rgba(from, 0.6)}`
                        : `0 6px 16px -10px ${rgba(from, 0.7)}`,
                    }}
                  >
                    {i + 1}
                  </span>
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0 pb-24 pt-6 sm:pb-28 sm:pt-8">
                <div className="reveal">
                  <div
                    className="text-xs font-extrabold uppercase tracking-widest"
                    style={{ color: to }}
                  >
                    {t("phaseOf", lang)} {i + 1} · {PHASES.length}
                  </div>
                  <h2 className="mt-1 flex items-start gap-2 text-3xl font-extrabold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
                    <span className="text-3xl sm:text-4xl">{s.emoji}</span>
                    <span>{sectionLabel(s, lang)}</span>
                  </h2>
                  <p className="mt-2 text-base text-[var(--ink-soft)] sm:text-lg">
                    {sectionSub(s, lang)}
                  </p>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {s.items.map((item, k) => {
                    const tasks = item.children?.length ?? 0;
                    return (
                      <li
                        key={item.slug}
                        className="reveal"
                        style={{ transitionDelay: `${Math.min(k, 6) * 70}ms` }}
                      >
                        <Link
                          href={`/guide/${item.slug}`}
                          className="card pressable group flex items-center gap-3.5 rounded-2xl p-3.5"
                        >
                          <span
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl shadow-inner"
                            style={{ background: `linear-gradient(135deg, ${rgba(from, 0.16)}, ${rgba(to, 0.22)})` }}
                          >
                            {item.emoji}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span
                              className="text-[0.7rem] font-extrabold uppercase tracking-wider"
                              style={{ color: to }}
                            >
                              {lang === "fr" ? "Activité" : "Activity"} {k + 1}
                            </span>
                            <span className="block truncate text-[1.02rem] font-bold leading-tight text-[var(--ink)]">
                              {leafLabel(item, lang)}
                            </span>
                            {tasks > 0 && (
                              <span className="text-xs font-semibold text-[var(--ink-soft)]">
                                {tasks}{" "}
                                {tasks > 1
                                  ? lang === "fr" ? "tâches" : "tasks"
                                  : lang === "fr" ? "tâche" : "task"}
                              </span>
                            )}
                          </span>
                          <span
                            className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold transition group-hover:translate-x-0.5"
                            style={{ background: rgba(to, 0.12), color: to }}
                          >
                            ›
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <Link
                  href={`/section/${s.id}`}
                  className="sheen pressable mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_28px_-12px_rgba(44,36,32,0.6)]"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                >
                  {t("openPhase", lang)}
                  <span className="transition group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </section>
          );
        })}
      </div>

      {/* Outro */}
      <section className="mx-auto max-w-3xl px-5 pb-24 pt-6 text-center">
        <div className="reveal card rounded-[1.75rem] p-7 sm:p-9">
          <h2 className="text-2xl font-extrabold tracking-tight text-clay-700 sm:text-3xl">
            {t("journeyOutroTitle", lang)}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[var(--ink-soft)]">
            {t("journeyOutroLead", lang)}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/chat"
              className="sheen pressable inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-clay-500 to-clay-700 px-6 py-3 font-extrabold text-white shadow-[0_14px_34px_-12px_rgba(177,74,31,0.7)]"
            >
              {t("askTitle", lang)}
            </Link>
            <Link
              href="/"
              className="pressable inline-flex items-center gap-2 rounded-full bg-white/85 px-6 py-3 font-extrabold text-clay-700 shadow-sm ring-1 ring-black/[0.06] backdrop-blur"
            >
              {t("classicView", lang)}
            </Link>
          </div>
        </div>

        {/* Resources */}
        <div className="reveal mt-8 text-left">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest text-[var(--ink-soft)]">
            <span className="h-4 w-1.5 rounded-full bg-gradient-to-b from-clay-500 to-clay-700" />
            {t("resourcesWord", lang)}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {EXTRAS.map((s) => {
              const [from, to] = pairOf(s.color);
              return (
                <Link
                  key={s.id}
                  href={`/section/${s.id}`}
                  className="card pressable group flex items-center gap-3 rounded-2xl p-3.5"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl text-white shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                  >
                    {s.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[1.02rem] font-bold leading-tight text-[var(--ink)]">
                      {sectionLabel(s, lang)}
                    </span>
                    <span className="block truncate text-sm text-[var(--ink-soft)]">
                      {sectionSub(s, lang)}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-[var(--ink-soft)]/70">
          PCRSS · Liptako-Gourma ·{" "}
          {lang === "fr"
            ? "Réplique fidèle du guide officiel"
            : "Faithful replica of the official guide"}
        </footer>
      </section>
    </main>
  );
}
