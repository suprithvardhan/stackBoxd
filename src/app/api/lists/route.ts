import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

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

      return NextResponse.json({
        id: list.id,
        title: list.title,
        description: list.description,
        cover: list.cover,
        userId: list.userId,
        author: list.user.username,
        tools: list.items.map((item) => item.tool.slug),
        count: list.items.length,
      })
    }

    const where: any = {}
    if (userId) where.userId = userId

    const lists = await prisma.list.findMany({
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
        items: {
          include: {
            tool: true,
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
        userId: list.userId,
        author: list.user.username,
        tools: list.items.map((item) => item.tool.slug),
        count: list.items.length,
      }))
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
    const { title, description, cover, tools } = body

    if (!title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create list
    const list = await prisma.list.create({
      data: {
        title,
        description,
        cover,
        userId: session.user.id,
        items: tools
          ? {
              create: await Promise.all(
                tools.map(async (toolSlug: string, index: number) => {
                  const tool = await prisma.tool.findUnique({
                    where: { slug: toolSlug },
                  })
                  if (!tool) {
                    throw new Error(`Tool with slug ${toolSlug} not found`)
                  }
                  return {
                    toolId: tool.id,
                    order: index,
                  }
                })
              ),
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

    return NextResponse.json(
      {
        id: list.id,
        title: list.title,
        description: list.description,
        cover: list.cover,
        userId: list.userId,
        author: list.user.username,
        tools: list.items.map((item) => item.tool.slug),
        count: list.items.length,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

