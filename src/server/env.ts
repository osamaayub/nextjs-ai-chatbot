import "server-only";
import { z } from "zod";

const schema = z.object({
  OPENAI_API_KEY: z.string().trim().optional().transform((v) => v || undefined),
  OPENAI_MODEL: z.string().trim().min(1).default("gpt-5.4-mini"),
  CHAT_RATE_LIMIT_PER_MINUTE: z.coerce.number().int().min(1).max(1000).default(10),
  // Comma-separated extra origins allowed to call /api/chat (your own site is always allowed)
  ALLOWED_ORIGINS: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [])),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

/** Validated config. Read lazily so builds work without secrets. */
export function env(): Env {
  if (!cached) {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      throw new Error(`Invalid environment variables: ${z.prettifyError(parsed.error)}`);
    }
    cached = parsed.data;
  }
  return cached;
}
