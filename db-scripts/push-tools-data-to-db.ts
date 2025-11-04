import { PrismaClient } from "@prisma/client"
import { readFileSync } from "fs"
import { join } from "path"

const prisma = new PrismaClient()

interface ToolData {
  id: string
  slug: string
  name: string
  icon: string
  site: string | null
  category: string
  color: string | null
  packageNames: string[]
}

interface DbToolsJson {
  exportedAt: string
  totalTools: number
  tools: ToolData[]
}

/**
 * Push tools data from db-tools.json to database
 * This script upserts tools by slug, preserving existing packageNames if tool already exists
 */
async function pushToolsDataToDb() {
  console.log("📦 Pushing tools data from db-tools.json to database...\n")

  // Read the JSON file
  const filePath = join(process.cwd(), "data", "db-tools.json")
  let dbToolsData: DbToolsJson

  try {
    const fileContent = readFileSync(filePath, "utf-8")
    dbToolsData = JSON.parse(fileContent)
    console.log(`✅ Loaded ${dbToolsData.tools.length} tools from db-tools.json\n`)
  } catch (error) {
    console.error("❌ Error reading db-tools.json:")
    console.error(error)
    process.exit(1)
  }

  let created = 0
  let updated = 0
  let skipped = 0
  const errors: Array<{ slug: string; error: string }> = []

  // Process each tool
  for (const tool of dbToolsData.tools) {
    try {
      // Check if tool exists
      const existing = await prisma.tool.findUnique({
        where: { slug: tool.slug },
        select: { packageNames: true },
      })

      if (existing) {
        // Update existing tool, preserving existing packageNames if they exist
        const existingPackageNames = (existing.packageNames as string[]) || []
        const newPackageNames = tool.packageNames && tool.packageNames.length > 0 
          ? Array.from(new Set([...existingPackageNames, ...tool.packageNames]))
          : existingPackageNames

        await prisma.tool.update({
          where: { slug: tool.slug },
          data: {
            name: tool.name,
            icon: tool.icon,
            site: tool.site || null,
            category: tool.category,
            color: tool.color || null,
            packageNames: newPackageNames,
          },
        })
        updated++
      } else {
        // Create new tool
        await prisma.tool.create({
          data: {
            slug: tool.slug,
            name: tool.name,
            icon: tool.icon,
            site: tool.site || null,
            category: tool.category,
            color: tool.color || null,
            packageNames: tool.packageNames || [],
            avgRating: 0,
            ratingsCount: 0,
            usedByCount: 0,
          },
        })
        created++
      }
    } catch (error: any) {
      errors.push({ slug: tool.slug, error: error.message })
      skipped++
      console.error(`⚠️  Error processing ${tool.slug}: ${error.message}`)
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50))
  console.log("📊 Push Summary")
  console.log("=".repeat(50))
  console.log(`✅ Created: ${created} tools`)
  console.log(`🔄 Updated: ${updated} tools`)
  if (skipped > 0) {
    console.log(`⚠️  Skipped: ${skipped} tools (errors above)`)
  }
  console.log(`📦 Total processed: ${dbToolsData.tools.length} tools`)
  console.log("=".repeat(50))

  if (errors.length > 0) {
    console.log("\n❌ Errors encountered:")
    errors.forEach(({ slug, error }) => {
      console.log(`   - ${slug}: ${error}`)
    })
  }

  // Verify total tools in database
  const totalInDb = await prisma.tool.count()
  console.log(`\n💾 Total tools in database: ${totalInDb}`)
  console.log("\n✅ Push completed!")
}

pushToolsDataToDb()
  .catch((error) => {
    console.error("❌ Fatal error:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

