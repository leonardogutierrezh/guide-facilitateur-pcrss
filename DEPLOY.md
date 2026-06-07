# Deploying the Facilitator Guide

The app is a standard **Next.js** project. The only secret it needs is your
OpenAI API key.

## 1. Get an OpenAI API key

1. Go to <https://platform.openai.com/api-keys>.
2. Create an API key (it looks like `sk-...`).
3. Keep it secret — never commit it to git.

## 2. Deploy on Vercel (recommended)

### Option A — from the dashboard

1. Push this repo to GitHub (already done if you cloned it from there).
2. Go to <https://vercel.com/new> and **import** the repository.
3. Framework preset: **Next.js** (auto-detected). No build settings to change —
   `npm run build` already regenerates the content bundle via the `prebuild` hook.
4. Under **Environment Variables**, add:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** your `sk-...` key
   - Apply to **Production**, **Preview**, and **Development**.
5. Click **Deploy**.

### Option B — from the CLI

```bash
vercel                       # link/create the project
vercel env add OPENAI_API_KEY production    # paste the key when prompted
vercel env add OPENAI_API_KEY preview
vercel --prod                # deploy to production
```

## 3. Verify

- Open the deployment URL.
- Tap **💬 Poser une question / Ask a question**.
- Ask: *"Quel est le quorum d'une assemblée générale ?"* — you should get
  *50% des ménages, 30% de femmes*, with a `📂` source line.

If the chat returns an error, the key is almost always missing or misspelled in
the Vercel project settings — re-check **Settings → Environment Variables** and
redeploy.

## Model & cost

- Model: `gpt-4o-mini` (cheap and fast; swap to `gpt-4o` for top quality).
- The whole guide (~230 KB ≈ 60k tokens) is sent as the **system prompt**.
  OpenAI **automatically caches** this static prefix, so after the first request
  each question is cheaper and faster.
- To change the model, edit `MODEL` in [`app/api/chat/route.ts`](app/api/chat/route.ts).
