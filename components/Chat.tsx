"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Markdown } from "./Markdown";
import { useLang } from "./LanguageProvider";
import { t, UI } from "@/lib/i18n";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function Chat({ about }: { about?: string }) {
  const { lang } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  // null = still checking, true = ready, false = no provider/key configured
  const [configured, setConfigured] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = UI.suggestions[lang];

  // Ask the server whether a provider + key are configured.
  useEffect(() => {
    let alive = true;
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setConfigured(Boolean(d?.configured));
      })
      .catch(() => {
        if (alive) setConfigured(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy || configured === false) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(next);
    setBusy(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next, lang, about }),
      });
      // A 500 here is almost always a missing provider/key — show the clean
      // "setup needed" state instead of a generic error.
      if (res.status === 500) {
        setConfigured(false);
        setMessages((m) => m.slice(0, -1)); // drop the empty assistant bubble
        return;
      }
      if (!res.ok || !res.body) throw new Error("network");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: t("chatError", lang) };
        return copy;
      });
    } finally {
      setBusy(false);
      taRef.current?.focus();
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto max-w-3xl space-y-4">
          {/* Greeting */}
          <div className="flex gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-clay-500 to-clay-700 text-lg shadow-sm">
              🤝
            </div>
            <div className="card max-w-[86%] rounded-2xl rounded-tl-md p-3.5">
              <p className="text-[var(--ink)]">{t("chatHello", lang)}</p>
              {about && (
                <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-clay-50 px-2.5 py-1 text-sm font-bold text-clay-600">
                  📂 {about}
                </p>
              )}
            </div>
          </div>

          {/* Setup-needed notice when no provider/key is configured */}
          {configured === false && (
            <div className="rise rounded-[1.5rem] border border-amber-300/60 bg-amber-50/80 p-4 shadow-sm backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-200/70 text-2xl">
                  ⚙️
                </div>
                <div className="min-w-0">
                  <div className="text-base font-extrabold text-amber-900">
                    {t("notConfiguredTitle", lang)}
                  </div>
                  <p className="mt-1 text-sm text-amber-900/80">{t("notConfiguredBody", lang)}</p>
                  <Link
                    href="/"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-clay-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition active:scale-95"
                  >
                    {t("notConfiguredCta", lang)}
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions (only before first message, when chat is available) */}
          {empty && configured === true && (
            <div className="flex flex-wrap gap-2 pl-11 pt-1">
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className={`chip pressable rise rise-${Math.min(i + 1, 6)} text-left`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Conversation */}
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end">
                <div className="max-w-[86%] rounded-2xl rounded-tr-md bg-gradient-to-br from-clay-500 to-clay-700 p-3.5 text-white shadow-[0_10px_24px_-12px_rgba(177,74,31,0.7)]">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-clay-500 to-clay-700 text-lg shadow-sm">
                  🤝
                </div>
                <div className="card max-w-[86%] rounded-2xl rounded-tl-md p-3.5">
                  {m.content ? (
                    <Markdown className="chat-md">{m.content}</Markdown>
                  ) : (
                    <span className="inline-flex gap-1 text-2xl leading-none text-clay-500">
                      <span className="dot">•</span>
                      <span className="dot">•</span>
                      <span className="dot">•</span>
                    </span>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Composer (hidden when the assistant isn't configured) */}
      <div className="border-t border-black/[0.05] bg-white/60 px-3 py-3 backdrop-blur-xl">
        {configured === false ? (
          <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-[1.4rem] bg-white/70 px-4 py-3.5 text-sm font-semibold text-[var(--ink-soft)] ring-1 ring-black/[0.06]">
            ⚙️ {t("composerDisabled", lang)}
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-[1.4rem] bg-white p-1.5 shadow-[0_8px_26px_-14px_rgba(44,36,32,0.4)] ring-1 ring-black/[0.06] focus-within:ring-2 focus-within:ring-clay-500/40">
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder={t("askPlaceholder", lang)}
              className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-[var(--ink-soft)]/60"
            />
            <button
              onClick={() => send(input)}
              disabled={busy || !input.trim()}
              aria-label={t("ask", lang)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-clay-500 to-clay-700 text-xl text-white shadow-md transition hover:-translate-y-0.5 active:scale-90 disabled:translate-y-0 disabled:opacity-35"
            >
              ➤
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
