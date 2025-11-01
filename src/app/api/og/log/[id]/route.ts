import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

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
    const reviewText = log.review.substring(0, 200)
    const toolColor = log.tool.color || "#00FF8F"
    const rating = log.rating || 0

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
    const escapedLines = reviewLines.map(line => escapeHtml(line))

    // Completely new design from scratch - simple and clean
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0a0a0a;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="accentBar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${toolColor}50;stop-opacity:1" />
            <stop offset="100%" style="stop-color:${toolColor}15;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="1200" height="630" fill="url(#bgGrad)"/>
        
        <!-- Top bar -->
        <rect x="0" y="0" width="1200" height="3" fill="url(#accentBar)"/>
        
        <!-- Main card -->
        <rect x="80" y="70" width="1040" height="490" fill="#0d0d0d" rx="20" stroke="${toolColor}15" stroke-width="2"/>
        
        <!-- Header -->
        <rect x="80" y="70" width="1040" height="130" fill="#080808" rx="20" ry="0"/>
        
        <!-- User avatar -->
        <circle cx="150" cy="135" r="26" fill="${toolColor}12" stroke="${toolColor}" stroke-width="2"/>
        <text x="150" y="142" font-family="'Inter', 'SF Pro Display', -apple-system, sans-serif" font-size="18" font-weight="700" fill="${toolColor}" text-anchor="middle" dominant-baseline="central">${(userName[0] || "U").toUpperCase()}</text>
        
        <!-- User info -->
        <text x="200" y="110" font-family="'Inter', 'SF Pro Display', -apple-system, sans-serif" font-size="34" font-weight="700" fill="#ffffff" letter-spacing="-0.3">${userName}</text>
        <text x="200" y="138" font-family="'Inter', 'SF Pro Display', -apple-system, sans-serif" font-size="20" fill="#999999">reviewed <tspan fill="${toolColor}" font-weight="600">${toolName}</tspan></text>
        
        <!-- Stars -->
        <g transform="translate(200, 153)">
          ${[...Array(5)]
            .map(
              (_, i) =>
                `<text x="${i * 26}" y="0" font-family="'Inter', 'SF Pro Display', -apple-system, sans-serif" font-size="22" fill="${
                  i < rating ? "#FFD700" : "#2a2a2a"
                }">★</text>`
            )
            .join("")}
        </g>
        
        <!-- Tool badge (smaller) -->
        <rect x="1000" y="88" width="70" height="70" fill="${toolColor}10" rx="14" stroke="${toolColor}25" stroke-width="2"/>
        <text x="1035" y="132" font-family="'Inter', 'SF Pro Display', -apple-system, sans-serif" font-size="32" font-weight="700" fill="${toolColor}" text-anchor="middle" dominant-baseline="central">${(toolName[0] || "T").toUpperCase()}</text>
        
        <!-- Review container (properly sized) -->
        <rect x="140" y="240" width="920" height="270" fill="#121212" rx="16" stroke="${toolColor}06" stroke-width="1"/>
        
        <!-- Review text using tspan for proper wrapping -->
        <text x="170" y="280" font-family="'Inter', 'SF Pro Display', -apple-system, sans-serif" font-size="22" fill="#e5e5e5" font-weight="400" letter-spacing="-0.1">
          ${escapedLines.map((line, idx) => 
            `<tspan x="170" dy="${idx === 0 ? '0' : '30'}">${line}</tspan>`
          ).join("")}
        </text>
        
        <!-- Footer -->
        <text x="170" y="535" font-family="'Inter', 'SF Pro Display', -apple-system, sans-serif" font-size="18" fill="#666666" font-weight="500">stackboxd.com</text>
        <text x="1030" y="535" font-family="'Inter', 'SF Pro Display', -apple-system, sans-serif" font-size="18" fill="#666666" font-weight="500" text-anchor="end">${new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</text>
      </svg>
    `.trim()

    // Convert to PNG or JPEG using sharp
    if (format === "png" || format === "jpeg" || format === "jpg") {
      try {
        const sharp = (await import("sharp")).default
        const svgBuffer = Buffer.from(svg)
        const image = sharp(svgBuffer)
        
        if (format === "png") {
          const pngBuffer = await image.png().toBuffer()
          return new NextResponse(pngBuffer as any, {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          })
        } else {
          const jpegBuffer = await image.jpeg({ quality: 95 }).toBuffer()
          return new NextResponse(jpegBuffer as any, {
            headers: {
              "Content-Type": "image/jpeg",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          })
        }
      } catch (error) {
        console.error("Error converting SVG to image:", error)
        // Fallback to SVG if conversion fails
      }
    }

    // Return SVG
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error generating log share card:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
