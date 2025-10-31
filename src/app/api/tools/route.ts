import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    if (slug) {
      const tool = await prisma.tool.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              logs: true,
            },
          },
        },
      })

      if (!tool) {
        return NextResponse.json({ error: "Tool not found" }, { status: 404 })
      }

      return NextResponse.json({
        id: tool.id,
        slug: tool.slug,
        name: tool.name,
        icon: tool.icon,
        site: tool.site,
        category: tool.category,
        color: tool.color,
        avgRating: tool.avgRating,
        ratingsCount: tool.ratingsCount,
        usedByCount: tool.usedByCount,
      })
    }

    const where: any = {}
    if (category) where.category = category
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ]
    }

    const tools = await prisma.tool.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { usedByCount: "desc" },
    })

    return NextResponse.json(tools)
  } catch (error) {
    console.error("Error fetching tools:", error)
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
    const { slug, name, icon, site, category, color } = body

    if (!slug || !name || !icon || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const tool = await prisma.tool.create({
      data: {
        slug,
        name,
        icon,
        site,
        category,
        color,
      },
    })

    return NextResponse.json(tool, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Tool with this slug already exists" }, { status: 409 })
    }
    console.error("Error creating tool:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

