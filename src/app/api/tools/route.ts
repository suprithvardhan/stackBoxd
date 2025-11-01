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
      const [tool, ratingDistribution] = await Promise.all([
        prisma.tool.findUnique({
          where: { slug },
          select: {
            id: true,
            slug: true,
            name: true,
            icon: true,
            site: true,
            category: true,
            color: true,
            avgRating: true,
            ratingsCount: true,
            usedByCount: true,
          },
        }),
        // Get rating distribution in parallel
        prisma.log.groupBy({
          by: ['rating'],
          where: {
            tool: { slug },
            visibility: 'public',
          },
          _count: {
            rating: true,
          },
        }),
      ])

      if (!tool) {
        return NextResponse.json({ error: "Tool not found" }, { status: 404 })
      }

      // Create distribution map (1-5 stars)
      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      ratingDistribution.forEach((item) => {
        distribution[item.rating] = item._count.rating
      })

      return NextResponse.json(
        {
          ...tool,
          ratingDistribution: distribution,
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 min, serve stale for 10 min
          },
        }
      )
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
      select: {
        id: true,
        slug: true,
        name: true,
        icon: true,
        color: true,
        category: true,
        avgRating: true,
        ratingsCount: true,
        usedByCount: true,
      },
    })

    return NextResponse.json(tools, {
      headers: {
        'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=360', // Cache for 3 min
      },
    })
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

