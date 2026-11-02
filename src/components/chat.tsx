"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = ["How long does shipping take?", "Can I return an item?", "When is support online?"];

export function Chat({ demo }: { demo: boolean }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop, error, regenerate } = useChat();
  const busy = status === "submitted" || status === "streaming";
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send(text: string) {
    if (!text.trim() || busy) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="flex h-[640px] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-indigo-950/40">
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-500 text-lg font-bold text-white">A</div>
        <div className="flex-1">
          <p className="font-semibold text-white">Acme Store Assistant</p>
          <p className="text-xs text-emerald-400">{busy ? "Typing..." : "Online"}</p>
        </div>
        {demo && <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-300">Demo mode</span>}
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
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

        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${m.role === "user" ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-100"}`}>
              {m.parts.map((part, i) => (part.type === "text" ? <span key={i}>{part.text}</span> : null))}
            </div>
          </div>
        ))}

        {status === "submitted" && <div className="w-16 animate-pulse rounded-2xl bg-zinc-800 px-4 py-3 text-zinc-400">...</div>}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            Something went wrong.{" "}
            <button onClick={() => regenerate()} className="underline">Try again</button>
          </div>
        )}
        <div ref={end} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t border-white/10 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about orders, shipping, returns..."
          className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500"
        />
        {busy ? (
          <button type="button" onClick={() => stop()} className="rounded-xl bg-zinc-700 px-5 font-semibold text-white">Stop</button>
        ) : (
          <button type="submit" disabled={!input.trim()} className="rounded-xl bg-indigo-500 px-5 font-semibold text-white disabled:opacity-40">Send</button>
        )}
      </form>
    </div>
  );
}
