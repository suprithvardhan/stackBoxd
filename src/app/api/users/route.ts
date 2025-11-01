import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    if (username) {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          _count: {
            select: {
              logs: true,
              projects: true,
              lists: true,
              followers: true,
            },
          },
        },
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json(
        {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          bio: user.bio,
          avatarUrl: user.avatarUrl,
          githubUrl: user.githubUrl,
          websiteUrl: user.websiteUrl,
          twitterUrl: user.twitterUrl,
          stats: {
            toolsLogged: user._count.logs,
            projects: user._count.projects,
            lists: user._count.lists,
            followers: user._count.followers,
          },
        },
        {
          headers: {
            'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60', // Cache for 30 seconds (shorter for follower counts)
          },
        }
      )
    }

    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            logs: true,
            projects: true,
            lists: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    return NextResponse.json(
      users.map((u) => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        bio: u.bio,
        avatarUrl: u.avatarUrl,
        githubUrl: u.githubUrl,
        websiteUrl: u.websiteUrl,
        twitterUrl: u.twitterUrl,
        stats: {
          toolsLogged: u._count.logs,
          projects: u._count.projects,
          lists: u._count.lists,
          followers: u._count.followers,
          following: u._count.following,
        },
      })),
      {
        headers: {
          'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=360', // Cache for 3 min
        },
      }
    )
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { bio, websiteUrl, twitterUrl, displayName } = body

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio,
        websiteUrl,
        twitterUrl,
        displayName,
      },
    })

    return NextResponse.json({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      githubUrl: user.githubUrl,
      websiteUrl: user.websiteUrl,
      twitterUrl: user.twitterUrl,
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

