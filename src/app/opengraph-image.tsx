import { ImageResponse } from "next/og";

export const alt = "StackBoxd - Developer Stack Platform";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "nodejs";

// Add HEAD handler for social media bots (Telegram, WhatsApp, etc.)
export async function HEAD() {
  return new Response(null, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD",
    },
  })
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(135deg, #00FF8F 0%, #000000 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: "bold", marginBottom: 20 }}>StackBoxd</div>
        <div style={{ fontSize: 32, opacity: 0.9 }}>Log, Rate, and Reflect on Your Developer Stack</div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    }
  );
}

