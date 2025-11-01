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
    const { followingId } = body

    if (!followingId) {
      return NextResponse.json({ error: "Missing followingId" }, { status: 400 })
    }

    if (followingId === session.user.id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    // Optimized: Use upsert to handle both follow/unfollow in one query
    // First check if follow exists
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId,
        },
      },
      select: { id: true },
    })

    if (existing) {
      // Unfollow - delete
      await prisma.follow.delete({
        where: { id: existing.id },
      })
      // Track analytics
      ;(prisma as any).analyticsEvent.create({
        data: {
          userId: session.user.id,
          eventType: "follow_unfollow",
          eventData: { followingId, action: "unfollow" },
          path: request.headers.get("referer") || null,
        },
      }).catch(() => {})
      return NextResponse.json({ following: false })
    } else {
      // Follow - create (skip verification, let unique constraint handle it)
      try {
        await prisma.follow.create({
          data: {
            followerId: session.user.id,
            followingId,
          },
        })
        // Track analytics
        ;(prisma as any).analyticsEvent.create({
          data: {
            userId: session.user.id,
            eventType: "follow",
            eventData: { followingId, action: "follow" },
            path: request.headers.get("referer") || null,
          },
        }).catch(() => {})
        return NextResponse.json({ following: true }, { status: 201 })
      } catch (error: any) {
        if (error.code === "P2002") {
          // Already following (race condition)
          return NextResponse.json({ following: true })
        }
        if (error.code === "P2003") {
          // Foreign key constraint - user doesn't exist
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        throw error
      }
    }
  } catch (error: any) {
    console.error("Error toggling follow:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") || "followers" // "followers" or "following"

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    if (type === "followers") {
      const followers = await prisma.follow.findMany({
        where: { followingId: userId },
        orderBy: { createdAt: "desc" },
        select: {
          follower: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              bio: true,
            },
          },
          createdAt: true,
        },
      })

      return NextResponse.json(
        followers.map((f) => ({
          id: f.follower.id,
          username: f.follower.username,
          displayName: f.follower.displayName,
          avatarUrl: f.follower.avatarUrl,
          bio: f.follower.bio,
        })),
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', // Cache for 1 min
          },
        }
      )
    } else {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        orderBy: { createdAt: "desc" },
        select: {
          following: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              bio: true,
            },
          },
          createdAt: true,
        },
      })

      return NextResponse.json(
        following.map((f) => ({
          id: f.following.id,
          username: f.following.username,
          displayName: f.following.displayName,
          avatarUrl: f.following.avatarUrl,
          bio: f.following.bio,
        })),
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', // Cache for 1 min
          },
        }
      )
    }
  } catch (error) {
    console.error("Error fetching follows:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

