import "server-only";

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export interface RateLimiter {
  check(key: string): RateLimitResult;
}

/**
 * Fixed-window limiter kept in memory. Good for one server or local dev.
 * On serverless (Vercel) each instance has its own memory, so use a shared
 * store such as Upstash Redis in production. Swap it in via this interface.
 */
export function createMemoryRateLimiter(limit: number, windowMs = 60_000, now = () => Date.now()): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return {
    check(key) {
      const t = now();
      if (hits.size > 10_000) for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k);
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= t) {
        hits.set(key, { count: 1, resetAt: t + windowMs });
        return { ok: true };
      }
      if (entry.count >= limit) {
        return { ok: false, retryAfterSeconds: Math.ceil((entry.resetAt - t) / 1000) };
      }
      entry.count++;
      return { ok: true };
    },
  };
}
