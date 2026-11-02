"use client";

import { useChat } from "@ai-sdk/react";
import { SUGGESTIONS } from "../config";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";

// Our API returns short plain-text errors (rate limit, too long). Show those, hide anything else.
const KNOWN_ERRORS = ["Too many messages", "Message too long"];
function friendly(error: Error) {
  return KNOWN_ERRORS.some((k) => error.message.startsWith(k)) ? error.message : "Something went wrong.";
}

export function Chat({ badge }: { badge?: React.ReactNode }) {
  const { messages, sendMessage, status, stop, error, regenerate } = useChat();
  const busy = status === "submitted" || status === "streaming";
  const send = (text: string) => sendMessage({ text });

  return (
    <div className="flex h-[640px] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-indigo-950/40">
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-500 text-lg font-bold text-white">A</div>
        <div className="flex-1">
          <p className="font-semibold text-white">Acme Store Assistant</p>
          <p className="text-xs text-emerald-400">{busy ? "Typing..." : "Online"}</p>
        </div>
        {badge}
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
        {messages.length === 0 && (
          <div className="space-y-3 pt-8 text-center">
            <p className="text-lg font-semibold text-white">Hi! How can I help you today?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <MessageList messages={messages} thinking={status === "submitted"} />

        {error && (
          <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {friendly(error)}{" "}
            <button onClick={() => regenerate()} className="underline">
              Try again
            </button>
          </div>
        )}
      </div>

      <ChatInput busy={busy} onSend={send} onStop={() => stop()} />
    </div>
  );
}
