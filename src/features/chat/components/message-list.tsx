"use client";

import type { UIMessage } from "ai";
import { useEffect, useRef } from "react";

export function MessageList({ messages, thinking }: { messages: UIMessage[]; thinking: boolean }) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {messages.map((m) => (
        <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
          <div
            className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
              m.role === "user" ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-100"
            }`}
          >
            {/* Rendered as text, never as HTML, so model output can't inject scripts */}
            {m.parts.map((part, i) => (part.type === "text" ? <span key={i}>{part.text}</span> : null))}
          </div>
        </div>
      ))}
      {thinking && (
        <div aria-label="Assistant is typing" className="w-16 animate-pulse rounded-2xl bg-zinc-800 px-4 py-3 text-zinc-400">
          ...
        </div>
      )}
      <div ref={end} />
    </>
  );
}
