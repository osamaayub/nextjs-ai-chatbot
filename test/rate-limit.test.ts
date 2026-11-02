import { describe, expect, it } from "vitest";
import { createMemoryRateLimiter } from "@/features/chat/server/rate-limit";

describe("createMemoryRateLimiter", () => {
  it("allows up to the limit, then blocks until the window resets", () => {
    let t = 0;
    const rl = createMemoryRateLimiter(2, 60_000, () => t);
    expect(rl.check("a").ok).toBe(true);
    expect(rl.check("a").ok).toBe(true);
    const blocked = rl.check("a");
    expect(blocked).toEqual({ ok: false, retryAfterSeconds: 60 });
    expect(rl.check("b").ok).toBe(true); // other clients unaffected
    t = 60_001;
    expect(rl.check("a").ok).toBe(true);
  });
});
