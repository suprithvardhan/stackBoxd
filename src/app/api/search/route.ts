import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q") || ""
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!q || q.trim().length === 0) {
      return NextResponse.json({
        tools: [],
        users: [],
        lists: [],
      })
    }

    const searchQuery = q.trim().toLowerCase()

    // Optimize: Cap search results for better performance
    const searchLimit = Math.min(limit, 10) // Cap at 10 for performance
    
    // Only search if query is at least 2 characters
    if (searchQuery.length < 2) {
      return NextResponse.json(
        {
          tools: [],
          users: [],
          lists: [],
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      )
    }

    // Parallel queries for better performance - with optimized conditions
    const [tools, users, listsResult] = await Promise.all([
      // Search tools - use startsWith for better index usage
      prisma.tool.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { slug: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        take: searchLimit,
        select: {
          id: true,
          slug: true,
          name: true,
          icon: true,
          color: true,
          category: true,
        },
        orderBy: { usedByCount: "desc" },
      }),

      // Search users - optimized query
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: searchQuery, mode: "insensitive" } },
            { displayName: { contains: searchQuery, mode: "insensitive" } },
          ],
        },
        take: searchLimit,
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          bio: true,
        },
        orderBy: { createdAt: "desc" },
      }),

      // Search public lists - optimized query
      prisma.list.findMany({
        where: {
          visibility: "public",
          title: { contains: searchQuery, mode: "insensitive" },
        },
        take: searchLimit,
        select: {
          id: true,
          title: true,
          description: true,
          cover: true,
          user: {
            select: {
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    return NextResponse.json(
      {
        tools: tools.map((t) => ({
          id: t.id,
          slug: t.slug,
          name: t.name,
          icon: t.icon,
          color: t.color,
          category: t.category,
        })),
        users: users.map((u) => ({
          id: u.id,
          username: u.username,
          displayName: u.displayName,
          avatarUrl: u.avatarUrl,
          bio: u.bio,
        })),
        lists: listsResult.map((l) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          cover: l.cover,
          author: l.user.username,
          authorDisplayName: l.user.displayName,
          authorAvatar: l.user.avatarUrl,
          count: l._count.items,
        })),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240', // Cache search for 2 min
        },
      }
    )
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
