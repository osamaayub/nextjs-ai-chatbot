// Public site info used for SEO. Safe to import anywhere.
function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Acme Store Assistant",
  title: "AI Support Chatbot Demo | Next.js 16 + AI SDK 7",
  description:
    "Try a streaming AI customer support chatbot built with Next.js 16 and the Vercel AI SDK 7. Answers shipping, returns and store questions instantly. Free open-source code.",
  url: siteUrl(),
  author: { name: "Osama Ayub", url: "https://osama-ayubpersonal.vercel.app/" },
  repo: "https://github.com/osamaayub/nextjs-ai-chatbot",
  keywords: ["AI chatbot", "Next.js 16", "Vercel AI SDK", "AI SDK 7", "customer support chatbot", "OpenAI", "streaming chat", "React"],
};
