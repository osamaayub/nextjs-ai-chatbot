import { z } from "zod";
import type { UIMessage } from "ai";
import { CHAT_LIMITS } from "./config";

// The client is untrusted. Accept only plain text messages from the user
// and assistant, so nobody can inject a "system" message or other part types.
const textPart = z.object({
  type: z.literal("text"),
  text: z.string().max(CHAT_LIMITS.maxMessageChars),
});

const message = z.object({
  id: z.string().min(1).max(100),
  role: z.enum(["user", "assistant"]),
  parts: z.array(z.unknown()).max(20),
});

export const chatRequestSchema = z.object({
  messages: z.array(message).min(1).max(CHAT_LIMITS.maxMessagesInRequest),
});

/** Parses the body and keeps only valid text parts. Returns null if invalid. */
export function parseChatRequest(body: unknown): UIMessage[] | null {
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) return null;

  const messages: UIMessage[] = [];
  for (const m of parsed.data.messages) {
    const parts = m.parts
      .map((p) => textPart.safeParse(p))
      .filter((r) => r.success)
      .map((r) => r.data);
    if (m.role === "user" && parts.length === 0) return null;
    if (parts.length) messages.push({ id: m.id, role: m.role, parts });
  }
  if (messages.at(-1)?.role !== "user") return null;
  return messages;
}
