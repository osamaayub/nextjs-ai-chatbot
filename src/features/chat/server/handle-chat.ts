import "server-only";
import { convertToModelMessages, streamText, type LanguageModel } from "ai";
import { CHAT_LIMITS } from "../config";
import { STORE_INSTRUCTIONS } from "../instructions";
import { parseChatRequest } from "../schema";
import type { RateLimiter } from "./rate-limit";

export type ChatDeps = {
  model: LanguageModel;
  rateLimiter: RateLimiter;
  allowedOrigins: string[];
  log: (level: "info" | "warn" | "error", event: string, data?: Record<string, unknown>) => void;
};

const text = (status: number, body: string, headers: Record<string, string> = {}) =>
  new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8", ...headers } });

/** Framework-free request handler, so it can be unit tested with plain Request objects. */
export async function handleChat(req: Request, deps: ChatDeps): Promise<Response> {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  const res = await pipeline(req, deps, requestId);
  res.headers.set("x-request-id", requestId);
  return res;
}

async function pipeline(req: Request, deps: ChatDeps, requestId: string): Promise<Response> {
  // 1. Only your own site (and listed origins) may use your API key.
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin && !deps.allowedOrigins.includes(origin)) {
    deps.log("warn", "chat.origin_blocked", { requestId, origin });
    return text(403, "Forbidden");
  }

  // 2. Rate limit per client IP.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const limit = deps.rateLimiter.check(ip);
  if (!limit.ok) {
    deps.log("warn", "chat.rate_limited", { requestId });
    return text(429, "Too many messages. Please wait a minute and try again.", {
      "retry-after": String(limit.retryAfterSeconds),
    });
  }

  // 3. Reject big bodies before parsing them.
  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > CHAT_LIMITS.maxBodyBytes) return text(413, "Message too long.");

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return text(400, "Invalid request.");
  }
  const messages = parseChatRequest(body);
  if (!messages) return text(400, "Invalid request.");
  deps.log("info", "chat.request", { requestId, messages: messages.length });

  // 4. Stream the answer. Stop in the browser aborts the model call too.
  const result = streamText({
    model: deps.model,
    instructions: STORE_INSTRUCTIONS, // called "system" before AI SDK 7
    messages: await convertToModelMessages(messages.slice(-CHAT_LIMITS.maxMessagesToModel)),
    maxOutputTokens: CHAT_LIMITS.maxOutputTokens,
    abortSignal: req.signal,
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      deps.log("error", "chat.stream_failed", { requestId, message: error instanceof Error ? error.message : String(error) });
      return "Sorry, something went wrong. Please try again.";
    },
  });
}
