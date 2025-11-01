import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username") || "user"
    const repo = searchParams.get("repo") || "repository"
    const stars = searchParams.get("stars") || "0"

    // Escape HTML entities
    const escapeHtml = (str: string) => {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }
    const safeUsername = escapeHtml(username)
    const safeRepo = escapeHtml(repo)

    // Smaller font size for better fit
    const fontSize = 28
    const centerX = 400
    const centerY = 200

    // Generate SVG cover image with properly aligned text
    const svg = `
      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="800" height="400" fill="#e5e5e5" rx="0"/>
        
        <!-- Main window with shadow -->
        <rect x="50" y="50" width="700" height="300" fill="#1e1e1e" rx="8" opacity="0.95"/>
        <rect x="48" y="48" width="700" height="300" fill="#0d0d0d" rx="8" opacity="0.3"/>
        
        <!-- Top bar -->
        <rect x="50" y="50" width="700" height="50" fill="#252525" rx="8" ry="0"/>
        
        <!-- Traffic light buttons (top-left) -->
        <circle cx="68" cy="75" r="7" fill="#ff5f57"/>
        <circle cx="92" cy="75" r="7" fill="#ffbd2e"/>
        <circle cx="116" cy="75" r="7" fill="#28ca42"/>
        
        <!-- Star count (top-right) -->
        <text x="720" y="80" font-family="'SF Mono', 'Monaco', 'Courier New', monospace" font-size="18" fill="#ffffff" text-anchor="end" font-weight="500">
          ${stars}
        </text>
        <text x="700" y="80" font-family="'SF Mono', 'Monaco', 'Courier New', monospace" font-size="16" fill="#ffffff">★</text>
        
        <!-- Main content: username/repo (centered, properly aligned) -->
        <text x="${centerX}" y="${centerY}" font-family="'SF Mono', 'Monaco', 'Courier New', monospace" font-size="${fontSize}" font-weight="600" text-anchor="middle" dominant-baseline="middle">
          <tspan fill="#ff79c6">${safeUsername}</tspan>
          <tspan fill="#ffffff"> / </tspan>
          <tspan fill="#50fa7b">${safeRepo}</tspan>
        </text>
        
        <!-- Bottom-left icon (white circle with green cross) -->
        <circle cx="80" cy="320" r="20" fill="#ffffff"/>
        <g transform="translate(80, 320)">
          <line x1="0" y1="-10" x2="0" y2="10" stroke="#50fa7b" stroke-width="3" stroke-linecap="round"/>
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#50fa7b" stroke-width="3" stroke-linecap="round"/>
        </g>
        
        <!-- Bottom-right username -->
        <text x="720" y="330" font-family="'SF Mono', 'Monaco', 'Courier New', monospace" font-size="16" fill="#888888" text-anchor="end" dominant-baseline="middle">
          ${safeUsername}
        </text>
      </svg>
    `.trim()

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error generating cover image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}

