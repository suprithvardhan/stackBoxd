import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ following: false })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
    })

    return NextResponse.json(
      { following: !!follow },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60', // Cache for 30 seconds
        },
      }
    )
  } catch (error) {
    console.error("Error checking follow status:", error)
    return NextResponse.json({ following: false })
  }
}

