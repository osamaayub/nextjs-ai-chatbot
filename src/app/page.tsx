import { Chat } from "@/components/chat";
import { isDemo } from "@/lib/model";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_top,#312e81_0%,#09090b_60%)] p-6">
      <Chat demo={isDemo()} />
    </main>
  );
}
