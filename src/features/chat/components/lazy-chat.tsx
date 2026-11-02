"use client";

import dynamic from "next/dynamic";
import { ChatSkeleton } from "./chat-skeleton";

// The AI SDK client (useChat and its schema library) is the heaviest JS on the page.
// Load it in its own chunk after the page shell paints.
export const LazyChat = dynamic(() => import("./chat").then((m) => m.Chat), {
  ssr: false,
  loading: () => <ChatSkeleton />,
});
