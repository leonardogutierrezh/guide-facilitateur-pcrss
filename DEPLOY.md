# Deploying the Facilitator Guide

The app is a standard **Next.js** project. It can use **Anthropic (Claude)** or
**OpenAI** for the chat — you choose with an environment variable.

## 1. Get an API key

- **Anthropic:** <https://console.anthropic.com/> → key looks like `sk-ant-...`
- **OpenAI:** <https://platform.openai.com/api-keys> → key looks like `sk-...`

Keep keys secret — never commit them to git.

## 2. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `AI_PROVIDER` | recommended | `anthropic` or `openai`. If empty, the app auto-detects from whichever key is set. |
| `ANTHROPIC_API_KEY` | if using Anthropic | Your Claude key. |
| `OPENAI_API_KEY` | if using OpenAI | Your OpenAI key. |
| `ANTHROPIC_MODEL` | optional | Override the Claude model (default `claude-sonnet-4-6`). |
| `OPENAI_MODEL` | optional | Override the OpenAI model (default `gpt-4o-mini`). |

You can set **both** keys and just flip `AI_PROVIDER` to switch providers — then
redeploy. The app only calls the provider named in `AI_PROVIDER`.

## 3. Deploy on Vercel

### Option A — dashboard

1. Push this repo to GitHub (already done if you cloned it from there).
2. <https://vercel.com/new> → **import** the repository (Next.js auto-detected).
3. **Settings → Environment Variables** → add `AI_PROVIDER` and the matching
   `*_API_KEY` for **Production** (and Preview/Development if you want).
4. Click **Deploy**.

### Option B — CLI

```bash
vercel                                    # link/create the project
vercel env add AI_PROVIDER production     # type: anthropic  (or openai)
vercel env add ANTHROPIC_API_KEY production   # or OPENAI_API_KEY
vercel --prod                             # deploy to production
```

## 4. Verify

- Open the deployment URL → **💬 Poser une question / Ask a question**.
- Ask *"Quel est le quorum d'une assemblée générale ?"* — expect
  *50% des ménages, 30% de femmes* with a `📂` source line.

If the chat returns an error, the provider/key pair is usually mismatched — make
sure `AI_PROVIDER` matches the key you set, then redeploy.

## Switching or changing the model

- Switch provider: change `AI_PROVIDER`, ensure that provider's key exists, redeploy.
- Change model: set `ANTHROPIC_MODEL` / `OPENAI_MODEL` (e.g. `gpt-4o` for top
  OpenAI quality), redeploy. Defaults live in [`lib/ai.ts`](lib/ai.ts).
