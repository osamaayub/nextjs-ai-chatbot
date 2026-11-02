import { describe, expect, it, vi } from "vitest";
import { handleChat, type ChatDeps } from "@/features/chat/server/handle-chat";
import { createDemoModel } from "@/features/chat/server/demo-model";
import { createMemoryRateLimiter } from "@/features/chat/server/rate-limit";

const deps = (over: Partial<ChatDeps> = {}): ChatDeps => ({
  model: createDemoModel(),
  rateLimiter: createMemoryRateLimiter(100),
  allowedOrigins: [],
  log: vi.fn(),
  ...over,
});

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const ok = { messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "How long does shipping take?" }] }] };

describe("handleChat", () => {
  it("streams an answer", async () => {
    const res = await handleChat(req(ok), deps());
    expect(res.status).toBe(200);
    expect(res.headers.get("x-request-id")).toBeTruthy();
    const text = await res.text();
    expect(text).toContain("text-delta");
    expect(text).toContain("Pakistan");
  });
  it("blocks other websites", async () => {
    const res = await handleChat(req(ok, { origin: "https://evil.example" }), deps());
    expect(res.status).toBe(403);
  });
  it("allows listed origins", async () => {
    const res = await handleChat(req(ok, { origin: "https://shop.example" }), deps({ allowedOrigins: ["https://shop.example"] }));
    expect(res.status).toBe(200);
  });
  it("rate limits per IP", async () => {
    const d = deps({ rateLimiter: createMemoryRateLimiter(1) });
    expect((await handleChat(req(ok, { "x-forwarded-for": "1.1.1.1" }), d)).status).toBe(200);
    const res = await handleChat(req(ok, { "x-forwarded-for": "1.1.1.1" }), d);
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toBe("60");
  });
  it("rejects bad JSON, bad shape and huge bodies", async () => {
    expect((await handleChat(req("{not json"), deps())).status).toBe(400);
    expect((await handleChat(req({ messages: "hi" }), deps())).status).toBe(400);
    expect((await handleChat(req("x".repeat(70_000)), deps())).status).toBe(413);
  });
});
