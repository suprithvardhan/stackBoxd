import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Verify admin session from request headers
 */
function verifyAdminSession(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }

  const token = authHeader.replace("Bearer ", "")
  try {
    // Decode the session token
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [email, timestamp] = decoded.split(":")
    
    // Verify email matches admin email
    if (email !== process.env.ADMIN_EMAIL) {
      return false
    }

    // Check if session expired (24 hours)
    const sessionTime = parseInt(timestamp, 10)
    const expiresAt = sessionTime + 24 * 60 * 60 * 1000
    if (Date.now() > expiresAt) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  // Verify admin authentication
  if (!verifyAdminSession(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "7d" // 7d, 30d, 90d, all

    const now = new Date()
    let startDate: Date | undefined
    
    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = undefined
    }

    const where = startDate ? { createdAt: { gte: startDate } } : {}

    // Get all analytics in parallel
    const [
      totalEvents,
      pageViews,
      uniqueUsers,
      eventsByType,
      eventsByDay,
      topPages,
      topUsers,
      newUsers,
      activeUsers,
      totalLogs,
      totalProjects,
      totalTools,
      totalLists,
      totalFollows,
      // New comprehensive metrics
      countryDistribution,
      deviceTypeDistribution,
      browserDistribution,
      osDistribution,
      referrerSources,
      hourlyDistribution,
      sessionMetrics,
      engagementMetrics,
      eventTypeDistribution,
    ] = await Promise.all([
      // Total events
      (prisma as any).analyticsEvent.count({ where }),
      
      // Page views
      (prisma as any).analyticsEvent.count({
        where: { ...where, eventType: "page_view" },
      }),
      
      // Unique users
      ((prisma as any).analyticsEvent.groupBy({
        by: ["userId"],
        where: { ...where, userId: { not: null } },
      }) as Promise<Array<{ userId: string | null }>>).then((result: Array<{ userId: string | null }>) => result.length),
      
      // Events by type
      ((prisma as any).analyticsEvent.groupBy({
        by: ["eventType"],
        where,
        _count: { eventType: true },
      }) as Promise<Array<{ eventType: string; _count: { eventType: number } }>>),
      
      // Events by day
      ((prisma as any).analyticsEvent.findMany({
        where,
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10000,
      }) as Promise<Array<{ createdAt: Date }>>).then((events: Array<{ createdAt: Date }>) => {
        const byDate = new Map<string, number>();
        events.forEach((e: { createdAt: Date }) => {
          const date = e.createdAt.toISOString().split("T")[0];
          byDate.set(date, (byDate.get(date) || 0) + 1);
        });
        return Array.from(byDate.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 30);
      }),
      
      // Top pages
      ((prisma as any).analyticsEvent.groupBy({
        by: ["path"],
        where: { ...where, path: { not: null } },
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 10,
      }) as Promise<Array<{ path: string | null; _count: { path: number } }>>),
      
      // Top users
      (((prisma as any).analyticsEvent.groupBy({
        by: ["userId"],
        where: { ...where, userId: { not: null } },
        _count: { userId: true },
        orderBy: { _count: { userId: "desc" } },
        take: 10,
      }) as Promise<Array<{ userId: string | null; _count: { userId: number } }>>).then(async (result: Array<{ userId: string | null; _count: { userId: number } }>) => {
        const userIds = result.map((r) => r.userId).filter(Boolean) as string[]
        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        })
        return result.map((r) => ({
          ...r,
          user: users.find((u) => u.id === r.userId),
        }))
      })),
      
      // New users (in period)
      prisma.user.count({
        where: startDate ? { createdAt: { gte: startDate } } : {},
      }),
      
      // Active users (users who had events in period)
      ((prisma as any).analyticsEvent.groupBy({
        by: ["userId"],
        where: { ...where, userId: { not: null } },
      }) as Promise<Array<{ userId: string | null }>>).then((result: Array<{ userId: string | null }>) => result.length),
      
      // Total logs
      prisma.log.count({ where: startDate ? { createdAt: { gte: startDate } } : {} }),
      
      // Total projects
      prisma.project.count({ where: startDate ? { createdAt: { gte: startDate } } : {} }),
      
      // Total tools
      prisma.tool.count(),
      
      // Total lists
      prisma.list.count({ where: startDate ? { createdAt: { gte: startDate } } : {} }),
      
      // Total follows
      prisma.follow.count({ where: startDate ? { createdAt: { gte: startDate } } : {} }),
      
      // Country distribution
      ((prisma as any).analyticsEvent.findMany({
        where: { ...where, metadata: { not: null } },
        select: { metadata: true },
      }) as Promise<Array<{ metadata: any }>>).then((events: Array<{ metadata: any }>) => {
        const byCountry = new Map<string, number>();
        events.forEach((e) => {
          const country = e.metadata?.country || "Unknown";
          byCountry.set(country, (byCountry.get(country) || 0) + 1);
        });
        return Array.from(byCountry.entries())
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count);
      }),
      
      // Device type distribution
      ((prisma as any).analyticsEvent.findMany({
        where: { ...where, metadata: { not: null } },
        select: { metadata: true },
      }) as Promise<Array<{ metadata: any }>>).then((events: Array<{ metadata: any }>) => {
        const byDevice = new Map<string, number>();
        events.forEach((e) => {
          const device = e.metadata?.deviceType || "unknown";
          byDevice.set(device, (byDevice.get(device) || 0) + 1);
        });
        return Array.from(byDevice.entries())
          .map(([device, count]) => ({ device, count }));
      }),
      
      // Browser distribution
      ((prisma as any).analyticsEvent.findMany({
        where: { ...where, metadata: { not: null } },
        select: { metadata: true },
      }) as Promise<Array<{ metadata: any }>>).then((events: Array<{ metadata: any }>) => {
        const byBrowser = new Map<string, number>();
        events.forEach((e) => {
          const browser = e.metadata?.browser || "unknown";
          byBrowser.set(browser, (byBrowser.get(browser) || 0) + 1);
        });
        return Array.from(byBrowser.entries())
          .map(([browser, count]) => ({ browser, count }))
          .sort((a, b) => b.count - a.count);
      }),
      
      // OS distribution
      ((prisma as any).analyticsEvent.findMany({
        where: { ...where, metadata: { not: null } },
        select: { metadata: true },
      }) as Promise<Array<{ metadata: any }>>).then((events: Array<{ metadata: any }>) => {
        const byOS = new Map<string, number>();
        events.forEach((e) => {
          const os = e.metadata?.os || "unknown";
          byOS.set(os, (byOS.get(os) || 0) + 1);
        });
        return Array.from(byOS.entries())
          .map(([os, count]) => ({ os, count }))
          .sort((a, b) => b.count - a.count);
      }),
      
      // Referrer sources
      ((prisma as any).analyticsEvent.findMany({
        where: { ...where, referrer: { not: null } },
        select: { referrer: true },
      }) as Promise<Array<{ referrer: string | null }>>).then((events: Array<{ referrer: string | null }>) => {
        const byReferrer = new Map<string, number>();
        events.forEach((e) => {
          if (!e.referrer) return;
          try {
            const url = new URL(e.referrer);
            const domain = url.hostname.replace("www.", "");
            byReferrer.set(domain, (byReferrer.get(domain) || 0) + 1);
          } catch {
            byReferrer.set("direct", (byReferrer.get("direct") || 0) + 1);
          }
        });
        return Array.from(byReferrer.entries())
          .map(([referrer, count]) => ({ referrer, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
      }),
      
      // Hourly distribution
      ((prisma as any).analyticsEvent.findMany({
        where,
        select: { createdAt: true },
        take: 10000,
      }) as Promise<Array<{ createdAt: Date }>>).then((events: Array<{ createdAt: Date }>) => {
        const byHour = new Map<number, number>();
        events.forEach((e) => {
          const hour = e.createdAt.getUTCHours();
          byHour.set(hour, (byHour.get(hour) || 0) + 1);
        });
        return Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          count: byHour.get(i) || 0,
        }));
      }),
      
      // Session metrics
      ((prisma as any).analyticsEvent.groupBy({
        by: ["sessionId"],
        where: { ...where, sessionId: { not: null } },
        _count: { sessionId: true },
        _avg: { duration: true },
      }) as Promise<Array<{ sessionId: string | null; _count: { sessionId: number }; _avg: { duration: number | null } }>>).then((sessions: Array<{ sessionId: string | null; _count: { sessionId: number }; _avg: { duration: number | null } }>) => {
        const totalSessions = sessions.length;
        const avgSessionDuration = sessions.reduce((sum, s) => sum + (s._avg.duration || 0), 0) / totalSessions || 0;
        const avgEventsPerSession = sessions.reduce((sum, s) => sum + s._count.sessionId, 0) / totalSessions || 0;
        return {
          totalSessions,
          avgSessionDuration: Math.round(avgSessionDuration),
          avgEventsPerSession: Math.round(avgEventsPerSession * 100) / 100,
        };
      }),
      
      // Engagement metrics
      ((prisma as any).analyticsEvent.findMany({
        where: { ...where, eventType: { in: ["page_view", "page_view_end"] } },
        select: { eventType: true, duration: true, path: true },
      }) as Promise<Array<{ eventType: string; duration: number | null; path: string | null }>>).then((events: Array<{ eventType: string; duration: number | null; path: string | null }>) => {
        const pageViews = events.filter((e) => e.eventType === "page_view");
        const pageViewsWithDuration = events.filter((e) => e.eventType === "page_view_end" && e.duration);
        const totalDuration = pageViewsWithDuration.reduce((sum, e) => sum + (e.duration || 0), 0);
        const avgTimeOnPage = pageViewsWithDuration.length > 0 ? totalDuration / pageViewsWithDuration.length : 0;
        
        // Bounce rate: sessions with only 1 page view
        const singlePageSessions = new Set();
        const multiPageSessions = new Set();
        // This is simplified - would need better session tracking
        const bounceRate = 0; // Placeholder
        
        return {
          totalPageViews: pageViews.length,
          avgTimeOnPage: Math.round(avgTimeOnPage / 1000), // Convert to seconds
          bounceRate: Math.round(bounceRate * 100) / 100,
        };
      }),
      
      // Detailed event type distribution with counts
      ((prisma as any).analyticsEvent.groupBy({
        by: ["eventType"],
        where,
        _count: { eventType: true },
        orderBy: { _count: { eventType: "desc" } },
      }) as Promise<Array<{ eventType: string; _count: { eventType: number } }>>),
    ])

    return NextResponse.json({
      period,
      overview: {
        totalEvents,
        pageViews,
        uniqueUsers,
        newUsers,
        activeUsers,
      },
      content: {
        totalLogs,
        totalProjects,
        totalTools,
        totalLists,
        totalFollows,
        },
        engagement: {
        ...engagementMetrics,
        ...sessionMetrics,
      },
      geographic: {
        countries: countryDistribution,
      },
      technical: {
        devices: deviceTypeDistribution,
        browsers: browserDistribution,
        os: osDistribution,
      },
      traffic: {
        referrers: referrerSources,
        hourly: hourlyDistribution,
      },
      eventsByType: (eventsByType as Array<{ eventType: string; _count: { eventType: number } }>).map((e) => ({
        type: e.eventType,
        count: e._count.eventType,
      })),
      eventsByDay: eventsByDay.map((e: { date: string; count: number }) => ({
        date: e.date,
        count: e.count,
      })),
      topPages: (topPages as Array<{ path: string | null; _count: { path: number } }>).map((p) => ({
        path: p.path,
        count: p._count.path,
      })),
      topUsers: (topUsers as Array<{ userId: string | null; _count: { userId: number }; user?: any }>)
        .filter((t) => t.user)
        .map((t) => ({
          user: t.user,
          count: t._count.userId,
        })),
    })
  } catch (error) {
    console.error("Error fetching admin analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
