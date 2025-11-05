import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { getSessionId, getSessionStats, getAllSessions } from "@/lib/prisma-monitor"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    // Get current session stats
    const currentSessionId = getSessionId(request)
    const currentStats = getSessionStats(currentSessionId)

    // Get all active sessions (for admin/debugging)
    const allSessions = getAllSessions()

    // Get recent session stats from database
    const recentStats = await (prisma as any).analyticsEvent.findMany({
      where: {
        userId: session.user.id,
        eventType: "session_stats",
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        eventData: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      currentSession: currentStats,
      allSessions: allSessions.slice(0, 20), // Limit to 20 most recent
      recentStats: recentStats.map((s: any) => ({
        ...s.eventData,
        timestamp: s.createdAt,
      })),
    }, {
      headers: {
        'Cache-Control': 'private, no-cache',
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

