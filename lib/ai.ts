// AI provider abstraction (server-only).
// The active provider is chosen by the AI_PROVIDER env var ("anthropic" | "openai").
// If AI_PROVIDER is unset, we auto-detect from whichever API key is present.
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export type Provider = "anthropic" | "openai";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Sensible defaults; override per provider with ANTHROPIC_MODEL / OPENAI_MODEL.
const DEFAULT_MODELS: Record<Provider, string> = {
  anthropic: "claude-sonnet-4-6",
  openai: "gpt-4o-mini",
};

export interface ResolvedProvider {
  provider: Provider;
  model: string;
  apiKey: string;
}

/**
 * Decide which provider to use and validate that its key exists.
 * Returns a string error message instead of throwing, so the route can
 * surface a clean 500 to the client.
 */
export function resolveProvider(): ResolvedProvider | { error: string } {
  const requested = (process.env.AI_PROVIDER || "").trim().toLowerCase();

  let provider: Provider | null = null;
  if (requested === "anthropic" || requested === "openai") {
    provider = requested;
  } else if (requested === "") {
    // auto-detect from available keys
    if (process.env.ANTHROPIC_API_KEY) provider = "anthropic";
    else if (process.env.OPENAI_API_KEY) provider = "openai";
  } else {
    return { error: `AI_PROVIDER must be "anthropic" or "openai" (got "${requested}").` };
  }

  if (!provider) {
    return {
      error:
        "No AI provider configured. Set AI_PROVIDER and the matching API key (ANTHROPIC_API_KEY or OPENAI_API_KEY).",
    };
  }

  const apiKey =
    provider === "anthropic" ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const varName = provider === "anthropic" ? "ANTHROPIC_API_KEY" : "OPENAI_API_KEY";
    return { error: `${varName} is not configured for provider "${provider}".` };
  }

  const modelEnv =
    provider === "anthropic" ? process.env.ANTHROPIC_MODEL : process.env.OPENAI_MODEL;
  const model = (modelEnv && modelEnv.trim()) || DEFAULT_MODELS[provider];

  return { provider, model, apiKey };
}

/**
 * Stream a chat completion as plain-text chunks via the provided callback.
 * `system` is the full grounded guide prompt; `messages` is the conversation.
 */
export async function streamChat(
  resolved: ResolvedProvider,
  system: string,
  messages: ChatMessage[],
  onText: (text: string) => void
): Promise<void> {
  if (resolved.provider === "anthropic") {
    const anthropic = new Anthropic({ apiKey: resolved.apiKey });
    const stream = anthropic.messages.stream({
      model: resolved.model,
      max_tokens: 1024,
      // Cache the big static guide prompt so repeat questions are cheap.
      system: [
        {
          type: "text",
          text: system,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    stream.on("text", (t) => onText(t));
    await stream.finalMessage();
    return;
  }

  // openai
  const openai = new OpenAI({ apiKey: resolved.apiKey });
  const completion = await openai.chat.completions.create({
    model: resolved.model,
    max_tokens: 1024,
    temperature: 0.2,
    stream: true,
    // OpenAI auto-caches the static system prefix across requests.
    messages: [{ role: "system", content: system }, ...messages],
  });
  for await (const chunk of completion) {
    const t = chunk.choices[0]?.delta?.content;
    if (t) onText(t);
  }
}
