import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

// Function to get country from IP using free geolocation API
async function getCountryFromIP(ipAddress: string): Promise<string | null> {
  try {
    // Skip geolocation for localhost/IPs
    if (!ipAddress || ipAddress === "unknown" || ipAddress.startsWith("127.") || ipAddress.startsWith("::1") || ipAddress === "localhost") {
      return null;
    }

    // Remove port if present
    const cleanIP = ipAddress.split(":")[0];

    // Use ip-api.com (free, no API key needed, 45 requests/min)
    // Alternative: ipapi.co or ipgeolocation.io
    const response = await fetch(`http://ip-api.com/json/${cleanIP}?fields=countryCode`, {
      headers: {
        "User-Agent": "stackBoxd-Analytics/1.0",
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // ip-api.com returns countryCode if successful, or "fail" message if failed
    if (data.countryCode && data.countryCode !== "fail") {
      return data.countryCode;
    }

    return null;
  } catch (error) {
    // Silent fail - don't block analytics if geolocation fails
    console.error("IP geolocation error:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const body = await request.json()
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
    if (!ipAddress && (request as any).ip) {
      ipAddress = (request as any).ip;
    }

    // Final fallback
    if (!ipAddress || ipAddress === "::1" || ipAddress === "127.0.0.1") {
      ipAddress = "unknown";
    }

    const userAgent = request.headers.get("user-agent") || "unknown"
    
    // Get country from Cloudflare/Vercel header first (fastest, most reliable)
    let country = request.headers.get("cf-ipcountry") || 
                  request.headers.get("x-vercel-ip-country") ||
                  null

    // Fallback: If no header, try IP geolocation (for local/dev environments)
    // This will work if testing from actual network connection (not localhost)
    if (!country && ipAddress && ipAddress !== "unknown") {
      country = await getCountryFromIP(ipAddress);
    }

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

