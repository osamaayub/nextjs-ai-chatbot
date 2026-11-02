import "server-only";
import { openai } from "@ai-sdk/openai";
import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";

// Real model when OPENAI_API_KEY is set, otherwise a demo model
// that streams a canned answer so the app works with no key.
export function getModel() {
  if (process.env.OPENAI_API_KEY) {
    return openai(process.env.OPENAI_MODEL ?? "gpt-5.4-mini");
  }
  return demoModel();
}

export const isDemo = () => !process.env.OPENAI_API_KEY;

function demoModel() {
  return new MockLanguageModelV4({
    doStream: async ({ prompt }) => {
      const last = [...prompt].reverse().find((m) => m.role === "user");
      const question =
        last && Array.isArray(last.content)
          ? last.content.map((p) => ("text" in p ? p.text : "")).join(" ")
          : "";
      const words = demoAnswer(question).split(/(\s+)/);
      return {
        stream: simulateReadableStream({
          initialDelayInMs: 400,
          chunkDelayInMs: 35,
          chunks: [
            { type: "text-start", id: "t1" },
            ...words.map((w) => ({ type: "text-delta" as const, id: "t1", delta: w })),
            { type: "text-end", id: "t1" },
            {
              type: "finish",
              finishReason: { unified: "stop", raw: undefined },
              logprobs: undefined,
              usage: {
                inputTokens: { total: 0, noCache: 0, cacheRead: undefined, cacheWrite: undefined },
                outputTokens: { total: 0, text: 0, reasoning: undefined },
              },
            },
          ],
        }),
      };
    },
  });
}

function demoAnswer(q: string) {
  const s = q.toLowerCase();
  if (s.includes("ship") || s.includes("deliver"))
    return "We ship across Pakistan in 2 to 4 working days. Orders over Rs 5,000 ship free, and you get a tracking link by SMS as soon as your parcel leaves our warehouse.";
  if (s.includes("return") || s.includes("refund"))
    return "You can return any unused item within 14 days. Start a return from your order page, and we refund to your original payment method within 5 working days of receiving it.";
  if (["hour", "open", "contact", "online", "support", "when"].some((k) => s.includes(k)))
    return "Our support team is online Monday to Saturday, 9 am to 9 pm. You can reach us here in the chat, by email at help@acme-store.example, or on WhatsApp.";
  return "I can help with orders, shipping, returns and store hours. This is demo mode, so answers are pre-written. Add your OpenAI API key to get real AI answers.";
}
