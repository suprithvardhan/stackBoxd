import { NextRequest, NextResponse } from "next/server"
import { ImageResponse } from "next/og"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const alt = "StackBoxd Log Share Card"
export const contentType = "image/png"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "png"

    const log = await prisma.log.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        tool: {
          select: {
            name: true,
            icon: true,
            color: true,
            slug: true,
          },
        },
      },
    })

    if (!log) {
      return NextResponse.json({ error: "Log not found" }, { status: 404 })
    }

    // Escape HTML entities
    const escapeHtml = (str: string) => {
      if (!str) return ""
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
    }

    const userName = escapeHtml(log.user.displayName || log.user.username || "User")
    const toolName = escapeHtml(log.tool.name || "Tool")
    const reviewText = (log.review || "").substring(0, 200) || "No review provided"
    const toolColor = log.tool.color || "#00FF8F"
    const rating = Math.max(0, Math.min(5, log.rating || 0))

    // Better word wrapping for SVG text
    const wordWrap = (text: string, maxChars: number) => {
      const words = text.split(" ")
      const lines: string[] = []
      let currentLine = ""
      
      for (const word of words) {
        if (currentLine.length + word.length + 1 <= maxChars) {
          currentLine = currentLine ? `${currentLine} ${word}` : word
        } else {
          if (currentLine) lines.push(currentLine)
          currentLine = word.length > maxChars ? word.substring(0, maxChars - 1) + "…" : word
        }
        if (lines.length >= 8) break
      }
      if (currentLine && lines.length < 8) lines.push(currentLine)
      
      return lines
    }

    const reviewLines = wordWrap(reviewText, 60) // ~60 chars per line
    const dateStr = new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

    // Use ImageResponse from next/og which properly handles fonts and text rendering
    // ImageResponse always returns PNG, so we ignore the format parameter
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #000000 0%, #0a0a0a 100%)",
            position: "relative",
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: `linear-gradient(90deg, ${toolColor}80 0%, ${toolColor}25 100%)`,
            }}
          />

          {/* Main card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "1040px",
              height: "490px",
              backgroundColor: "#0d0d0d",
              borderRadius: "20px",
              border: `2px solid ${toolColor}25`,
              overflow: "hidden",
            }}
          >
            {/* Header section */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "40px 40px 30px",
                backgroundColor: "#080808",
                gap: "20px",
              }}
            >
              {/* User avatar circle */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: `${toolColor}20`,
                  border: `2px solid ${toolColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: toolColor,
                }}
              >
                {(userName[0] || "U").toUpperCase()}
              </div>

              {/* User info */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "34px",
                    fontWeight: "bold",
                    color: "#ffffff",
                  }}
                >
                  {userName}
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    color: "#999999",
                  }}
                >
                  reviewed{" "}
                  <span style={{ color: toolColor, fontWeight: "bold" }}>
                    {toolName}
                  </span>
                </div>
                {/* Stars */}
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    marginTop: "4px",
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "22px",
                        color: i < rating ? "#FFD700" : "#2a2a2a",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Tool badge */}
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "14px",
                  backgroundColor: `${toolColor}20`,
                  border: `2px solid ${toolColor}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: toolColor,
                }}
              >
                {(toolName[0] || "T").toUpperCase()}
              </div>
            </div>

            {/* Review content */}
            <div
              style={{
                flex: 1,
                padding: "40px",
                backgroundColor: "#121212",
                margin: "20px",
                borderRadius: "16px",
                border: `1px solid ${toolColor}10`,
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  color: "#e5e5e5",
                  lineHeight: "1.6",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {reviewLines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 40px 30px",
                fontSize: "18px",
                color: "#666666",
                fontWeight: "bold",
              }}
            >
              <div>stackboxd.com</div>
              <div>{dateStr}</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error("Error generating log share card:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}

