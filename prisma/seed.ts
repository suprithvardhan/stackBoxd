import { mockTools } from "@/lib/mock-data"
import { prisma } from "@/lib/prisma"

async function main() {
  console.log("Seeding database...")

  // Seed tools - update colors and other fields if they exist
  for (const tool of mockTools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {
        name: tool.name,
        icon: tool.icon,
        site: tool.site,
        category: tool.category,
        color: tool.color, // This will update the color for existing tools
        // Note: We don't update avgRating, ratingsCount, usedByCount as those are calculated values
      },
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

