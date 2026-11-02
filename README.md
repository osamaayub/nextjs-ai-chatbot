# Next.js 16 AI Chatbot (AI SDK 7)

A streaming AI support chatbot built with Next.js 16 and the Vercel AI SDK 7. It answers only from your business facts, streams replies word by word, and has stop and retry built in.

Watch the step-by-step tutorial on YouTube: [@osamaayubdev](https://www.youtube.com/@osamaayubdev)

## Features

- Streaming answers with `streamText` and `useChat`
- Business facts in one file (`src/lib/store-info.ts`) that you edit per client
- AI SDK 7 `instructions` option (it replaced `system`)
- Typing indicator, stop button, and retry on error
- Demo mode: runs with no API key using the AI SDK mock model
- Cost guards: last 20 messages only, `maxOutputTokens: 300`

## Quick start

```bash
git clone https://github.com/osamaayub/nextjs-ai-chatbot.git
cd nextjs-ai-chatbot
npm install
cp .env.example .env.local   # add OPENAI_API_KEY, or leave empty for demo mode
npm run dev
```

Open http://localhost:3000.

## Files that matter

| File | What it does |
| --- | --- |
| `src/app/api/chat/route.ts` | API route: calls `streamText` and streams the answer |
| `src/lib/store-info.ts` | The bot's instructions and business facts |
| `src/lib/model.ts` | Real OpenAI model with a key, demo model without one |
| `src/components/chat.tsx` | Chat UI with `useChat`, stop and retry |

## Deploy

1. Push to GitHub and import the repo on [Vercel](https://vercel.com).
2. Add `OPENAI_API_KEY` as an environment variable.
3. Set a spending limit in your OpenAI account.

## Hire me

Need an AI chatbot or AI feature in your app? [Hire me on Upwork](https://www.upwork.com/freelancers/~01c0c3cf471b66a427).

## License

MIT
