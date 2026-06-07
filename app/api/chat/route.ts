import OpenAI from "openai";
import { combinedText } from "@/lib/guide";

export const runtime = "nodejs";
export const maxDuration = 60;

// OpenAI model. gpt-4o-mini is cheap, fast and handles the ~60k-token guide
// context well. Swap to "gpt-4o" for the highest answer quality.
const MODEL = "gpt-4o-mini";

interface InMsg {
  role: "user" | "assistant";
  content: string;
}

function systemPrompt(lang: "fr" | "en", about?: string) {
  const langName = lang === "fr" ? "French (français)" : "English";
  return `You are the friendly assistant inside the "Guide du Facilitateur" app for PCRSS / Sahel Community-Driven Development (DCC/CDD) facilitators.

WHO YOU HELP: facilitators (FC/FT) working in villages in the Sahel (Mali, Liptako-Gourma). Many have limited formal education and read on a small phone over a slow connection.

HOW TO ANSWER:
- Reply in ${langName}. If the user clearly writes in the other language, follow their language instead.
- Keep it SIMPLE and warm. Short sentences. Plain everyday words. Prefer a few numbered steps or short bullets over long paragraphs. A relevant emoji here and there is welcome, but do not overdo it.
- Be exact on hard facts — quorums (50% of households, 30% women), the grant amount (33,5 millions FCFA per village), tranche splits, procurement thresholds, petty-cash ceiling (50 000 FCFA), retention (10 years), committee composition. Quote numbers exactly, never invent or round loosely.
- Preserve official terms (B-CDVFQ, PDC, MGP, AG, screening, CTMO, CEM…) and give a 2–3 word gloss the first time.
- When an activity uses a form, name its code (e.g. F19, OP1, T15) and say it comes from the Forms catalog.
- Mention the gender, climate, or grievance (MGP) angle when it matters.

GROUNDING — VERY IMPORTANT:
- Answer ONLY from the guide content provided below. This is a faithful replica of the official facilitator guide.
- Do NOT invent procedures, amounts, durations, quorums, thresholds, or committee compositions.
- If the answer is not in the guide, say so plainly (in the user's language) and point to the closest relevant section instead of guessing.
- At the very end of your answer, add one short line starting with "📂 " naming the most relevant guide section title(s) you used, so the facilitator can read more. Keep it to one line.
${about ? `\nThe facilitator is currently reading the section: "${about}". If their question is vague, assume it relates to this section.\n` : ""}
===== BEGIN OFFICIAL GUIDE CONTENT (the only source you may use) =====
${combinedText}
===== END OFFICIAL GUIDE CONTENT =====`;
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY is not configured on the server." }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  let body: { messages?: InMsg[]; lang?: "fr" | "en"; about?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Bad request" }), { status: 400 });
  }

  const lang = body.lang === "en" ? "en" : "fr";
  const history = (body.messages || [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12) // keep last few turns
    .map((m) => ({ role: m.role, content: m.content }));

  if (history.length === 0) {
    return new Response(JSON.stringify({ error: "No message" }), { status: 400 });
  }

  const openai = new OpenAI({ apiKey });

  // The big, static system prompt is sent first so OpenAI's automatic prompt
  // caching reuses it across requests (cheaper + faster after the first call).
  const messages = [
    { role: "system" as const, content: systemPrompt(lang, body.about) },
    ...history,
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create({
          model: MODEL,
          max_tokens: 1024,
          temperature: 0.2,
          stream: true,
          messages,
        });
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content;
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "error";
        controller.enqueue(encoder.encode("\n\n⚠️ " + msg));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
