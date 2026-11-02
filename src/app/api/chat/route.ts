import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getModel } from "@/lib/model";
import { STORE_INSTRUCTIONS } from "@/lib/store-info";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Keep requests small and cheap: last 20 messages only.
  const recent = messages.slice(-20);

  const result = streamText({
    model: getModel(),
    instructions: STORE_INSTRUCTIONS, // called "system" before AI SDK 7
    messages: await convertToModelMessages(recent),
    maxOutputTokens: 300,
  });

  return result.toUIMessageStreamResponse();
}
