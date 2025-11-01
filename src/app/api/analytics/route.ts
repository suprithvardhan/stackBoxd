import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const body = await request.json()
    const { eventType, eventData, path, referrer, duration } = body

    if (!eventType) {
      return NextResponse.json({ error: "Missing eventType" }, { status: 400 })
    }

    // Get IP address and user agent
    const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0] || 
                     request.headers.get("x-real-ip") || 
                     request.headers.get("cf-connecting-ip") ||
                     "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    
    // Get country from Cloudflare header or fallback
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

    const where: any = {}
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    if (eventType) {
      where.eventType = eventType
    }

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

