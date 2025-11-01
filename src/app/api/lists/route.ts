import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")
    const username = searchParams.get("username")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const session = await getSession()

    if (id) {
      const list = await prisma.list.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          items: {
            include: {
              tool: true,
            },
            orderBy: { order: "asc" },
          },
        },
      })

      if (!list) {
        return NextResponse.json({ error: "List not found" }, { status: 404 })
      }

      // Check if user can view private list
      if (list.visibility === "private" && list.userId !== session?.user?.id) {
        return NextResponse.json({ error: "List not found" }, { status: 404 })
      }

      return NextResponse.json(
        {
          id: list.id,
          title: list.title,
          description: list.description,
          cover: list.cover,
          visibility: list.visibility,
          userId: list.userId,
          author: list.user.username,
          tools: list.items.map((item) => item.tool.slug),
          count: list.items.length,
        },
        {
          headers: {
            'Cache-Control': list.visibility === 'public' 
              ? 'public, s-maxage=300, stale-while-revalidate=600' // Public: 5 min
              : 'private, s-maxage=60, stale-while-revalidate=120', // Private: 1 min
          },
        }
      )
    }

    const where: any = {}
    if (userId) {
      where.userId = userId
      // If viewing own lists, show all. Otherwise, only public
      if (session?.user?.id !== userId) {
        where.visibility = "public"
      }
    } else if (username) {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      })
      if (user) {
        where.userId = user.id
        // If viewing own lists, show all. Otherwise, only public
        if (session?.user?.id !== user.id) {
          where.visibility = "public"
        }
      } else {
        return NextResponse.json([])
      }
    } else {
      // Default: only show public lists
      where.visibility = "public"
    }

    const lists = await prisma.list.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        cover: true,
        visibility: true,
        userId: true,
        user: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        items: {
          select: {
            tool: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      lists.map((list) => ({
        id: list.id,
        title: list.title,
        description: list.description,
        cover: list.cover,
        visibility: list.visibility,
        userId: list.userId,
        author: list.user.username,
        tools: list.items.map((item) => item.tool.slug),
        count: list.items.length,
      })),
      {
        headers: {
          'Cache-Control': userId || username
            ? 'private, s-maxage=60, stale-while-revalidate=120' // User-specific: 1 min
            : 'public, s-maxage=180, stale-while-revalidate=360', // Public: 3 min
        },
      }
    )
  } catch (error) {
    console.error("Error fetching lists:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, cover, tools, visibility } = body

    if (!title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate visibility
    const validVisibility = visibility === "private" ? "private" : "public"

    // Batch fetch all tools first for better performance
    let toolMap = new Map<string, string>()
    if (tools && tools.length > 0) {
      const fetchedTools = await prisma.tool.findMany({
        where: {
          slug: { in: tools },
        },
        select: {
          id: true,
          slug: true,
        },
      })
      toolMap = new Map(fetchedTools.map((t) => [t.slug, t.id]))
      
      // Validate all tools exist
      for (const toolSlug of tools) {
        if (!toolMap.has(toolSlug)) {
          return NextResponse.json(
            { error: `Tool with slug ${toolSlug} not found` },
            { status: 400 }
          )
        }
      }
    }

    // Create list
    const list = await prisma.list.create({
      data: {
        title,
        description,
        cover,
        visibility: validVisibility,
        userId: session.user.id,
        items: tools && tools.length > 0
          ? {
              create: tools.map((toolSlug: string, index: number) => ({
                toolId: toolMap.get(toolSlug)!,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        items: {
          include: {
            tool: true,
          },
        },
      },
    })

    const responseData = {
      id: list.id,
      title: list.title,
      description: list.description,
      cover: list.cover,
      visibility: list.visibility,
      userId: list.userId,
      author: list.user.username,
      tools: list.items.map((item) => item.tool.slug),
      count: list.items.length,
    }

    // Track analytics
    ;(prisma as any).analyticsEvent.create({
      data: {
        userId: session.user.id,
        eventType: "list_create",
        eventData: { listId: list.id, toolsCount: list.items.length },
        path: `/lists/${list.id}`,
      },
    }).catch(() => {})

    return NextResponse.json(responseData, { status: 201 })
  } catch (error) {
    console.error("Error creating list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

