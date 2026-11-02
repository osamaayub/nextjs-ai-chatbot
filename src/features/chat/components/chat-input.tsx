"use client";

import { useState } from "react";
import { CHAT_LIMITS } from "../config";

type Props = { busy: boolean; onSend: (text: string) => void; onStop: () => void };

export function ChatInput({ busy, onSend, onStop }: Props) {
  const [input, setInput] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    onSend(text);
    setInput("");
  }

  return (
    <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-4">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        maxLength={CHAT_LIMITS.maxMessageChars}
        aria-label="Message"
        placeholder="Ask about orders, shipping, returns..."
        className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500"
      />
      {busy ? (
        <button type="button" onClick={onStop} className="rounded-xl bg-zinc-700 px-5 font-semibold text-white">
          Stop
        </button>
      ) : (
        <button type="submit" disabled={!input.trim()} className="rounded-xl bg-indigo-500 px-5 font-semibold text-white disabled:opacity-40">
          Send
        </button>
      )}
    </form>
  );
}
