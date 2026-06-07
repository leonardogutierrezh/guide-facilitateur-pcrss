import Anthropic from "@anthropic-ai/sdk";
import { combinedText } from "@/lib/guide";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-6";

interface InMsg {
  role: "user" | "assistant";
  content: string;
}

function systemBlocks(lang: "fr" | "en", about?: string) {
  const langName = lang === "fr" ? "French (français)" : "English";
  const instructions = `You are the friendly assistant inside the "Guide du Facilitateur" app for PCRSS / Sahel Community-Driven Development (DCC/CDD) facilitators.

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
${about ? `\nThe facilitator is currently reading the section: "${about}". If their question is vague, assume it relates to this section.` : ""}`;

  return [
    { type: "text" as const, text: instructions },
    {
      type: "text" as const,
      text:
        "===== BEGIN OFFICIAL GUIDE CONTENT (the only source you may use) =====\n" +
        combinedText +
        "\n===== END OFFICIAL GUIDE CONTENT =====",
      cache_control: { type: "ephemeral" as const },
    },
  ];
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured on the server." }),
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
  const messages = (body.messages || [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12) // keep last few turns
    .map((m) => ({ role: m.role, content: m.content }));

  if (messages.length === 0) {
    return new Response(JSON.stringify({ error: "No message" }), { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const mStream = anthropic.messages.stream({
          model: MODEL,
          max_tokens: 1024,
          system: systemBlocks(lang, body.about),
          messages,
        });
        mStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });
        await mStream.finalMessage();
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
