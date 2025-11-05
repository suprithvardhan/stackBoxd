import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const body = await request.json()
    
    // Store session stats (only if user is logged in for privacy)
    if (session?.user?.id) {
      // Store in analytics events table
      await (prisma as any).analyticsEvent.create({
        data: {
          userId: session.user.id,
          eventType: "session_stats",
          eventData: {
            sessionId: body.sessionId,
            totalCalls: body.totalCalls,
            cachedCalls: body.cachedCalls,
            cacheHitRate: body.cacheHitRate,
            duration: body.duration,
            averageDuration: body.averageDuration,
            callsPerSecond: body.callsPerSecond,
            callsByEndpoint: body.callsByEndpoint,
            callsByMethod: body.callsByMethod,
          },
          path: body.path || "/",
        },
      }).catch(() => {}) // Silent fail
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error storing session stats:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get recent session stats for this user
    const stats = await (prisma as any).analyticsEvent.findMany({
      where: {
        userId: session.user.id,
        eventType: "session_stats",
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        eventData: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      stats: stats.map((s: any) => ({
        ...s.eventData,
        timestamp: s.createdAt,
      })),
    })
  } catch (error) {
    console.error("Error fetching session stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

