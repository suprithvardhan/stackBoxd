import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const authorId = searchParams.get("authorId")
    const username = searchParams.get("username")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    if (id) {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          tools: {
            include: {
              tool: true,
            },
          },
          highlights: true,
        },
      })

      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      return NextResponse.json(
        {
          id: project.id,
          name: project.name,
          displayName: project.displayName,
          tagline: project.tagline,
          description: project.description,
          about: project.about,
          coverImage: project.coverImage,
          repoUrl: project.repoUrl,
          demoUrl: project.demoUrl,
          stars: project.stars,
          reflection: project.reflection,
          author: project.author.username,
          authorId: project.author.id,
          tools: project.tools.map((pt) => pt.tool.icon),
          highlights: project.highlights.map((h) => h.text),
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 min
          },
        }
      )
    }

    const where: any = {}
    if (authorId) {
      where.authorId = authorId
    }
    if (username) {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true },
      })
      if (user) {
        where.authorId = user.id
      } else {
        return NextResponse.json([])
      }
    }

    const projects = await prisma.project.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
            id: true,
          },
        },
        tools: {
          select: {
            tool: {
              select: {
                icon: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      projects.map((p) => ({
        id: p.id,
        name: p.name,
        displayName: p.displayName,
        tagline: p.tagline,
        description: p.description,
        about: p.about,
        coverImage: p.coverImage,
        repoUrl: p.repoUrl,
        demoUrl: p.demoUrl,
        stars: p.stars,
        reflection: p.reflection,
        author: p.author.username,
        authorId: p.author.id,
        tools: p.tools.map((pt) => pt.tool.icon),
        highlights: [],
      })),
      {
        headers: {
          'Cache-Control': authorId 
            ? 'private, s-maxage=60, stale-while-revalidate=120' // User-specific: 1 min cache
            : 'public, s-maxage=180, stale-while-revalidate=360', // Public: 3 min cache
        },
      }
    )
  } catch (error) {
    console.error("Error fetching projects:", error)
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
    const {
      name,
      displayName,
      tagline,
      description,
      about,
      coverImage,
      repoUrl,
      demoUrl,
      reflection,
      highlights,
      tools,
    } = body

    if (!name || !repoUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Batch fetch all tools first for better performance
    let toolMap = new Map<string, string>()
    if (tools && tools.length > 0) {
      const fetchedTools = await prisma.tool.findMany({
        where: {
          icon: { in: tools },
        },
        select: {
          id: true,
          icon: true,
        },
      })
      toolMap = new Map(fetchedTools.map((t) => [t.icon, t.id]))
      
      // Validate all tools exist
      for (const icon of tools) {
        if (!toolMap.has(icon)) {
          return NextResponse.json(
            { error: `Tool with icon ${icon} not found` },
            { status: 400 }
          )
        }
      }
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        displayName,
        tagline,
        description,
        about,
        coverImage,
        repoUrl,
        demoUrl,
        reflection,
        authorId: session.user.id,
        highlights: highlights
          ? {
              create: highlights.map((h: string) => ({ text: h })),
            }
          : undefined,
        tools: tools && tools.length > 0
          ? {
              create: tools.map((icon: string) => ({
                toolId: toolMap.get(icon)!,
              })),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        tools: {
          include: {
            tool: true,
          },
        },
        highlights: true,
      },
    })

    return NextResponse.json(
      {
        id: project.id,
        name: project.name,
        displayName: project.displayName,
        tagline: project.tagline,
        description: project.description,
        about: project.about,
        coverImage: project.coverImage,
        repoUrl: project.repoUrl,
        demoUrl: project.demoUrl,
        stars: project.stars,
        reflection: project.reflection,
        author: project.author.username,
        authorId: project.author.id,
        tools: project.tools.map((pt) => pt.tool.icon),
        highlights: project.highlights.map((h) => h.text),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

