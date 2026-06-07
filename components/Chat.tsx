"use client";

import { useEffect, useRef, useState } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = UI.suggestions[lang];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {/* Greeting */}
          <div className="flex gap-2">
            <div className="text-2xl">🤝</div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-3 shadow-sm ring-1 ring-black/5">
              <p className="text-gray-700">{t("chatHello", lang)}</p>
              {about && (
                <p className="mt-2 text-sm font-semibold text-clay-600">
                  📂 {about}
                </p>
              )}
            </div>
          </div>

          {/* Suggestions (only before first message) */}
          {empty && (
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-clay-500/40 bg-white px-3 py-2 text-left text-sm font-semibold text-clay-700 shadow-sm transition active:scale-95"
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
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-clay-600 p-3 text-white shadow-sm">
                  {m.content}
                </div>
              </div>
            ) : (
              <div key={i} className="flex gap-2">
                <div className="text-2xl">🤝</div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-3 shadow-sm ring-1 ring-black/5">
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

      {/* Composer */}
      <div className="border-t border-sand-200 bg-sand-50/95 px-3 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
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
            className="max-h-32 flex-1 resize-none rounded-2xl border-2 border-sand-200 bg-white px-4 py-3 text-base outline-none focus:border-clay-500"
          />
          <button
            onClick={() => send(input)}
            disabled={busy || !input.trim()}
            aria-label={t("ask", lang)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-clay-600 text-2xl text-white shadow-md transition active:scale-90 disabled:opacity-40"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
