import { chatHandler } from "@/features/chat/server";

// Thin route: all logic lives in src/features/chat/server.
export function POST(req: Request) {
  return chatHandler(req);
}
