// Same size as the real chat, so nothing jumps when it loads (no layout shift).
export function ChatSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading chat" className="flex h-[min(640px,calc(100dvh-10rem))] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-2xl shadow-indigo-950/40">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-500 text-lg font-bold text-white">A</div>
        <div className="flex-1">
          <p className="font-semibold text-white">Acme Store Assistant</p>
          <p className="text-xs text-zinc-500">Connecting...</p>
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex gap-2 border-t border-white/10 p-4">
        <div className="h-12 flex-1 rounded-xl bg-zinc-800" />
        <div className="h-12 w-20 rounded-xl bg-indigo-500/40" />
      </div>
    </div>
  );
}
