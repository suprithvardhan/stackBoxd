import { mockTools } from "@/lib/mock-data"
import { prisma } from "@/lib/prisma"

async function main() {
  console.log("Seeding database...")

  // Seed tools
  for (const tool of mockTools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {},
      create: {
        slug: tool.slug,
        name: tool.name,
        icon: tool.icon,
        site: tool.site,
        category: tool.category,
        color: tool.color,
        avgRating: tool.avgRating,
        ratingsCount: tool.ratingsCount,
        usedByCount: tool.usedByCount,
      },
    })
  }

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

