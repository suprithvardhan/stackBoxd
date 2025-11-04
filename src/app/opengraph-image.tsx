import { ImageResponse } from "next/og";

export const alt = "StackBoxd - Developer Stack Platform";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

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
    }
  );
}

