import { ImageResponse } from "next/og";

export const alt = "AI support chatbot built with Next.js 16 and the Vercel AI SDK 7";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(135deg, #09090b 0%, #312e81 100%)", color: "white" }}>
        <div style={{ fontSize: 30, color: "#facc15", fontWeight: 700 }}>NEXT.JS 16 + AI SDK 7</div>
        <div style={{ fontSize: 84, fontWeight: 800, marginTop: 20, lineHeight: 1.05 }}>AI Support Chatbot</div>
        <div style={{ fontSize: 36, color: "#c7d2fe", marginTop: 24 }}>Streaming answers from your business facts. Free open-source code.</div>
      </div>
    ),
    size,
  );
}
