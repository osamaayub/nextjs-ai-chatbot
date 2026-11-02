import { Suspense } from "react";
import { Chat } from "@/features/chat/components/chat";
import { DemoBadge } from "@/features/chat/components/demo-badge";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_top,#312e81_0%,#09090b_60%)] p-6">
      <Chat
        badge={
          <Suspense>
            <DemoBadge />
          </Suspense>
        }
      />
    </main>
  );
}
