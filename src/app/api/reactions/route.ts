import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { logId } = body

    if (!logId) {
      return NextResponse.json({ error: "Missing logId" }, { status: 400 })
    }

    // Check if reaction already exists
    const existing = await prisma.reaction.findUnique({
      where: {
        userId_logId: {
          userId: session.user.id,
          logId,
        },
      },
    })

    if (existing) {
      // Remove reaction
      await prisma.reaction.delete({
        where: {
          id: existing.id,
        },
      })
      // Track analytics
      ;(prisma as any).analyticsEvent.create({
        data: {
          userId: session.user.id,
          eventType: "reaction_remove",
          eventData: { logId, action: "unlike" },
          path: request.headers.get("referer") || null,
        },
      }).catch(() => {})
      return NextResponse.json({ reacted: false })
    }

    // Create reaction
    await prisma.reaction.create({
      data: {
        userId: session.user.id,
        logId,
      },
    })
    
    // Track analytics
    ;(prisma as any).analyticsEvent.create({
      data: {
        userId: session.user.id,
        eventType: "reaction",
        eventData: { logId, action: "like" },
        path: request.headers.get("referer") || null,
      },
    }).catch(() => {})

    return NextResponse.json({ reacted: true }, { status: 201 })
  } catch (error) {
    console.error("Error toggling reaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const logId = searchParams.get("logId")
    const userId = searchParams.get("userId")

    if (logId) {
      const reactions = await prisma.reaction.findMany({
        where: { logId },
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      })

      return NextResponse.json(
        reactions.map((r) => ({
          id: r.id,
          user: r.user.username,
          createdAt: r.createdAt.toISOString(),
        })),
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60', // Cache for 30 seconds
          },
        }
      )
    }

    if (userId) {
      const reactions = await prisma.reaction.findMany({
        where: { userId },
        select: {
          log: {
            select: {
              id: true,
            },
          },
        },
      })

      return NextResponse.json(
        reactions.map((r) => r.log.id),
        {
          headers: {
            'Cache-Control': 'private, s-maxage=60, stale-while-revalidate=120', // User-specific: 1 min
          },
        }
      )
    }

    return NextResponse.json({ error: "Missing logId or userId" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching reactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

