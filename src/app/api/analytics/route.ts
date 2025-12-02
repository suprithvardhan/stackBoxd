import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

// NOTE: getCountryFromIP removed - was slow (2s timeout) and not used in production
// Country detection now uses Cloudflare/Vercel headers only (instant, more reliable)

export async function POST(request: NextRequest) {
  try {
    // OPTIMIZATION: Run session and body parsing in parallel
    const [session, body] = await Promise.all([
      getSession(),
      request.json(),
    ])
    const { eventType, eventData, path, referrer, duration } = body

    if (!eventType) {
      return NextResponse.json({ error: "Missing eventType" }, { status: 400 })
    }

    // Get IP address - check multiple headers for proxy/load balancer scenarios
    let ipAddress = 
      request.headers.get("cf-connecting-ip") ||           // Cloudflare
      request.headers.get("x-real-ip") ||                   // Nginx proxy
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // Standard proxy header (take first IP)
      request.headers.get("x-client-ip") ||                 // Some proxies
      null;

    // Fallback: Try to get from request connection (Next.js/Node.js)
    // Note: This is usually not available in serverless environments
    if (!ipAddress && (request as unknown as { ip?: string }).ip) {
      ipAddress = (request as unknown as { ip?: string }).ip || null;
    }

    // Final fallback
    if (!ipAddress || ipAddress === "::1" || ipAddress === "127.0.0.1") {
      ipAddress = "unknown";
    }

    const userAgent = request.headers.get("user-agent") || "unknown"
    
    // Get country from Cloudflare/Vercel header first (fastest, most reliable)
    // OPTIMIZATION: Skip slow IP geolocation call - use headers only in production
    const country = request.headers.get("cf-ipcountry") || 
                  request.headers.get("x-vercel-ip-country") ||
                  null

    // Anonymize IP (remove last octet)
    const anonymizedIp = ipAddress !== "unknown" && ipAddress.includes(".")
      ? ipAddress.split(".").slice(0, 3).join(".") + ".0"
      : ipAddress

    // Extract metadata and sessionId from eventData
    const metadata = eventData?.metadata || {}
    const sessionId = metadata?.sessionId || null
    delete eventData?.metadata?.sessionId

    // Add country to metadata if available
    const enrichedMetadata = {
      ...metadata,
      ...(country && { country }),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).analyticsEvent.create({
      data: {
        userId: session?.user?.id || null,
        sessionId,
        eventType,
        eventData: eventData || {},
        path: path || null,
        referrer: referrer || null,
        userAgent,
        ipAddress: anonymizedIp,
        duration: duration || null,
        metadata: Object.keys(enrichedMetadata).length > 0 ? enrichedMetadata : null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const eventType = searchParams.get("eventType")

    const where: Record<string, unknown> = {}
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) (where.createdAt as Record<string, Date>).gte = new Date(startDate)
      if (endDate) (where.createdAt as Record<string, Date>).lte = new Date(endDate)
    }

    if (eventType) {
      where.eventType = eventType
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const events = await (prisma as any).analyticsEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 1000,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

