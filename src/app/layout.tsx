import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acme Store Assistant | Next.js 16 AI Chatbot",
  description: "A streaming AI support chatbot built with Next.js 16 and the Vercel AI SDK.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
