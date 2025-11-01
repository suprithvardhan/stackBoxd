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

    // Check if already following
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId,
        },
      },
    })

    if (existing) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          id: existing.id,
        },
      })
      return NextResponse.json({ following: false })
    }

    // Create follow
    await prisma.follow.create({
      data: {
        followerId: session.user.id,
        followingId,
      },
    })

    return NextResponse.json({ following: true }, { status: 201 })
  } catch (error) {
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
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      })

      return NextResponse.json(
        followers.map((f) => ({
          id: f.follower.id,
          username: f.follower.username,
          displayName: f.follower.displayName,
          avatarUrl: f.follower.avatarUrl,
        }))
      )
    } else {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      })

      return NextResponse.json(
        following.map((f) => ({
          id: f.following.id,
          username: f.following.username,
          displayName: f.following.displayName,
          avatarUrl: f.following.avatarUrl,
        }))
      )
    }
  } catch (error) {
    console.error("Error fetching follows:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

