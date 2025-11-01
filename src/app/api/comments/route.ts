import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const logId = searchParams.get("logId")

    if (!logId) {
      return NextResponse.json({ error: "Missing logId" }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: { logId },
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(
      comments.map((c) => ({
        id: c.id,
        content: c.content,
        user: c.user.username,
        userData: {
          username: c.user.username,
          displayName: c.user.displayName,
          avatarUrl: c.user.avatarUrl,
        },
        userId: c.user.username,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60', // Cache for 30 seconds
        },
      }
    )
  } catch (error) {
    console.error("Error fetching comments:", error)
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
    const { logId, content } = body

    if (!logId || !content || content.trim().length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        logId,
        content: content.trim(),
      },
      include: {
        user: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    })

    // Track analytics
    ;(prisma as any).analyticsEvent.create({
      data: {
        userId: session.user.id,
        eventType: "comment_create",
        eventData: { commentId: comment.id, logId, contentLength: content.trim().length },
        path: request.headers.get("referer") || `/logs/${logId}`,
      },
    }).catch(() => {})

    return NextResponse.json(
      {
        id: comment.id,
        content: comment.content,
        user: comment.user.username,
        userData: {
          username: comment.user.username,
          displayName: comment.user.displayName,
          avatarUrl: comment.user.avatarUrl,
        },
        userId: comment.user.username,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 })
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { logId: true, userId: true },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.comment.delete({
      where: { id },
    })

    // Track analytics
    if (comment) {
      ;(prisma as any).analyticsEvent.create({
        data: {
          userId: session.user.id,
          eventType: "comment_delete",
          eventData: { commentId: id, logId: comment.logId },
          path: request.headers.get("referer") || null,
        },
      }).catch(() => {})
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

