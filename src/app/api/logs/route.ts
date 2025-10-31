import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")
    const toolId = searchParams.get("toolId")
    const projectId = searchParams.get("projectId")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    if (id) {
      const log = await prisma.log.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          tool: true,
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              reactions: true,
              comments: true,
            },
          },
        },
      })

      if (!log) {
        return NextResponse.json({ error: "Log not found" }, { status: 404 })
      }

      return NextResponse.json({
        id: log.id,
        user: log.user.username,
        userId: log.user.id,
        tool: {
          slug: log.tool.slug,
          name: log.tool.name,
          icon: log.tool.icon,
        },
        rating: log.rating,
        review: log.review,
        tags: log.tags,
        project: log.project
          ? {
              id: log.project.id,
              name: log.project.name,
            }
          : null,
        createdAt: log.createdAt.toISOString(),
        reactions: log._count.reactions,
        comments: log._count.comments,
      })
    }

    const where: any = {}
    if (userId) where.userId = userId
    if (toolId) where.toolId = toolId
    if (projectId) where.projectId = projectId
    where.visibility = "public"

    const logs = await prisma.log.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        tool: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json(
      logs.map((log) => ({
        id: log.id,
        user: log.user.username,
        userId: log.user.id,
        tool: {
          slug: log.tool.slug,
          name: log.tool.name,
          icon: log.tool.icon,
        },
        rating: log.rating,
        review: log.review,
        tags: log.tags,
        project: log.project
          ? {
              id: log.project.id,
              name: log.project.name,
            }
          : null,
        createdAt: log.createdAt.toISOString(),
        reactions: log._count.reactions,
        comments: log._count.comments,
      }))
    )
  } catch (error) {
    console.error("Error fetching logs:", error)
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
    const { toolId, rating, review, tags, projectId, visibility } = body

    if (!toolId || !rating || !review || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 })
    }

    // Get tool by slug or ID
    const tool = await prisma.tool.findFirst({
      where: {
        OR: [{ id: toolId }, { slug: toolId }],
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    // Create log
    const log = await prisma.log.create({
      data: {
        userId: session.user.id,
        toolId: tool.id,
        rating,
        review,
        tags: tags || [],
        projectId: projectId || null,
        visibility: visibility || "public",
      },
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        tool: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
    })

    // Update tool stats
    const allLogs = await prisma.log.findMany({
      where: { toolId: tool.id },
      select: { rating: true },
    })
    const avgRating = allLogs.reduce((sum, l) => sum + l.rating, 0) / allLogs.length
    const uniqueUsers = await prisma.log.findMany({
      where: { toolId: tool.id },
      select: { userId: true },
      distinct: ["userId"],
    })

    await prisma.tool.update({
      where: { id: tool.id },
      data: {
        avgRating,
        ratingsCount: allLogs.length,
        usedByCount: uniqueUsers.length,
      },
    })

    return NextResponse.json(
      {
        id: log.id,
        user: log.user.username,
        userId: log.user.id,
        tool: {
          slug: log.tool.slug,
          name: log.tool.name,
          icon: log.tool.icon,
        },
        rating: log.rating,
        review: log.review,
        tags: log.tags,
        project: log.project
          ? {
              id: log.project.id,
              name: log.project.name,
            }
          : null,
        createdAt: log.createdAt.toISOString(),
        reactions: log._count.reactions,
        comments: log._count.comments,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating log:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

