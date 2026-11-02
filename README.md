# Next.js 16 AI Chatbot (AI SDK 7)

[![CI](https://github.com/osamaayub/nextjs-ai-chatbot/actions/workflows/ci.yml/badge.svg)](https://github.com/osamaayub/nextjs-ai-chatbot/actions/workflows/ci.yml)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black) ![AI SDK 7](https://img.shields.io/badge/AI%20SDK-7-6366f1) ![License: MIT](https://img.shields.io/badge/license-MIT-green)

A streaming AI support chatbot for any website, built with Next.js 16 and the Vercel AI SDK 7. It answers only from your business facts, streams replies word by word, and is hardened for production: input validation, rate limiting, origin checks, cost limits and security headers.

**Live demo:** https://nextjs-ai-chatbot-three-kappa-qi5cfa7xvl.vercel.app (demo mode, no API key)

**Tutorial:** [Build an AI Chatbot in Next.js 16 with the Vercel AI SDK 7](https://youtu.be/YjKn5UeH9t4) on [@osamaayubdev](https://www.youtube.com/@osamaayubdev)

> The code exactly as shown in the video is on the [`video-version`](https://github.com/osamaayub/nextjs-ai-chatbot/tree/video-version) tag. `main` has the production-ready structure described below.

## Features

- **Streaming answers** with `streamText` on the server and `useChat` in the browser
- **One file for the business facts** (`src/features/chat/instructions.ts`) you edit per client
- **AI SDK 7** `instructions` option (it replaced `system`)
- **Typing indicator, stop and retry**. Stop also cancels the model call, so you don't pay for unread text
- **Demo mode**: runs with no API key using the AI SDK mock model
- **Secure by default** (see [Security](#security))
- **Fast and SEO-ready**: Lighthouse 93+ performance and 100 for accessibility, best practices and SEO (mobile). Open Graph image, sitemap, robots, JSON-LD, no layout shift
- **Tested**: 12 unit tests with Vitest, CI on every push

## Quick start

```bash
git clone https://github.com/osamaayub/nextjs-ai-chatbot.git
cd nextjs-ai-chatbot
npm install
cp .env.example .env.local   # add OPENAI_API_KEY, or leave it empty for demo mode
npm run dev
```

Open http://localhost:3000.

## Environment variables

Validated with Zod on first use (`src/server/env.ts`). A bad value fails fast with a clear message.

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | No | empty | Empty means demo mode |
| `OPENAI_MODEL` | No | `gpt-5.4-mini` | Any OpenAI model ID |
| `CHAT_RATE_LIMIT_PER_MINUTE` | No | `10` | Messages per minute per IP |
| `ALLOWED_ORIGINS` | No | empty | Extra sites allowed to call `/api/chat`, comma-separated |
| `NEXT_PUBLIC_SITE_URL` | No | Vercel URL | Canonical URL for SEO tags and the sitemap |

## Architecture

Feature-first structure. Routes stay thin, and the chat logic is plain TypeScript you can test without Next.js.

```
src/
  app/
    page.tsx                     Static page shell + JSON-LD, chat loaded lazily
    layout.tsx                   SEO metadata, Open Graph, viewport
    opengraph-image.tsx          Generated social share image
    robots.ts, sitemap.ts        Crawling rules and sitemap
    manifest.ts                  Web app manifest
    api/chat/route.ts            Thin route: calls chatHandler
  config/
    site.ts                      Site name, URL and SEO text
  server/
    env.ts                       Typed, validated config (server only)
    logger.ts                    Structured JSON logs with request IDs (never logs message text)
  features/chat/
    config.ts                    All limits in one place (shared with the UI)
    instructions.ts              The bot's role and business facts
    schema.ts                    Zod validation of untrusted requests
    components/
      lazy-chat.tsx              Loads the chat client after first paint
      chat-skeleton.tsx          Same-size placeholder (no layout shift)
      chat.tsx                   useChat, status, stop, retry
      message-list.tsx           Renders text parts safely
      chat-input.tsx             Input with length limit
      demo-badge.tsx             Server component, checks the key at request time
    server/
      handle-chat.ts             Request pipeline (framework-free, unit tested)
      model.ts                   Real OpenAI model or demo model
      demo-model.ts              AI SDK mock model that streams canned answers
      rate-limit.ts              RateLimiter interface + in-memory version
      index.ts                   Composition root: wires real dependencies
test/                            Vitest tests for schema, rate limit and handler
```

Full system design, decisions and scaling plan: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

### Request flow

```
useChat (browser)
  -> POST /api/chat
    -> handleChat()
       1. origin check          other websites get 403
       2. rate limit per IP     429 with Retry-After
       3. body size limit       413 above 64 KB
       4. Zod validation        400, client "system" messages rejected
       5. streamText            instructions + last 20 messages, 300 max tokens
  <- streamed UI message response (generic error text, details only in server logs)
```

## Security

| Risk | What this app does |
| --- | --- |
| API key leaks | Key is read only in `server-only` modules and never sent to the browser |
| Someone else's site using your key | Origin check on `/api/chat`; add trusted sites to `ALLOWED_ORIGINS` |
| Spam and cost attacks | Per-IP rate limit, 64 KB body limit, 2,000 characters per message, 300 output tokens, last 20 messages only |
| Prompt injection via fake system messages | Only `user` and `assistant` text parts are accepted; everything else is dropped or rejected |
| Instruction leaking | Instructions tell the model not to reveal them. Treat them as public anyway: never put secrets in them |
| XSS from model output | Messages render as text, never as HTML |
| Error details leaking | Clients get a generic message; details go to server logs, tagged with the `x-request-id` returned on every response |
| Clickjacking and sniffing | `X-Frame-Options: DENY`, `nosniff`, HSTS, `Referrer-Policy`, `Permissions-Policy`, no `X-Powered-By` |

**Rate limiting on serverless:** the in-memory limiter works on a single server. On Vercel each instance has its own memory, so plug in a shared store (for example Upstash Redis) by implementing the `RateLimiter` interface in `rate-limit.ts`. Also set a monthly spending limit in your OpenAI account.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run check` | Lint, type-check and tests |
| `npm test` | Vitest unit tests |

## Deploy

1. Import the repo on [Vercel](https://vercel.com).
2. Add `OPENAI_API_KEY` (and optionally the other variables) in Project Settings.
3. Set a spending limit in your OpenAI account.
4. For multiple instances, switch to a shared rate limiter (see Security).

## Make it yours

- Edit `src/features/chat/instructions.ts` with your business facts
- Change the limits in `src/features/chat/config.ts`
- Swap OpenAI for another provider in `src/features/chat/server/model.ts` (one line)

## Hire me

Need an AI chatbot or AI feature in your app? [Hire me on Upwork](https://www.upwork.com/freelancers/~01c0c3cf471b66a427).

## License

MIT
