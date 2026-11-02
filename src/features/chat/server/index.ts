import "server-only";
import { env } from "@/server/env";
import { log } from "@/server/logger";
import { handleChat } from "./handle-chat";
import { getModel } from "./model";
import { createMemoryRateLimiter, type RateLimiter } from "./rate-limit";

// Composition root: wires real dependencies into the handler.
let limiter: RateLimiter | undefined;

export function chatHandler(req: Request) {
  const config = env();
  limiter ??= createMemoryRateLimiter(config.CHAT_RATE_LIMIT_PER_MINUTE);
  return handleChat(req, { model: getModel(), rateLimiter: limiter, allowedOrigins: config.ALLOWED_ORIGINS, log });
}

export { isDemoMode } from "./model";
