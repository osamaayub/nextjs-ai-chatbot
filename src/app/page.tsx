import { Suspense } from "react";
import { site } from "@/config/site";
import { LazyChat } from "@/features/chat/components/lazy-chat";
import { DemoBadge } from "@/features/chat/components/demo-badge";

// Structured data so search engines understand what this page is.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: site.name,
  description: site.description,
  url: site.url,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: site.author.name, url: site.author.url },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_top,#312e81_0%,#09090b_60%)] p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="max-w-xl text-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">AI Support Chatbot</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Ask about shipping, returns or store hours. Built with Next.js 16 and the Vercel AI SDK 7.{" "}
          <a href={site.repo} className="text-indigo-300 underline-offset-2 hover:underline">Free source code</a>
        </p>
      </header>
      <LazyChat
        badge={
          <Suspense>
            <DemoBadge />
          </Suspense>
        }
      />
    </main>
  );
}
