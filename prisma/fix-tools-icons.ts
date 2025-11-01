import { prisma } from "@/lib/prisma"

// Tools that need icon fixes (showing squares instead of logos)
const iconFixes: Record<string, { icon: string; color: string }> = {
  // Tools with missing/invalid icons
  "debug": { icon: "mdi:bug", color: "#FF6B6B" },
  "parser": { icon: "mdi:code-braces", color: "#4ECDC4" },
  "nodemailer": { icon: "mdi:email", color: "#FF6B9D" }, // node-mailer -> nodemailer
  "node-mailer": { icon: "mdi:email", color: "#FF6B9D" }, // Alternative slug
  "cross-env": { icon: "mdi:application-cog", color: "#FFA500" },
  "joi": { icon: "simple-icons:joi", color: "#00758F" },
  "cors": { icon: "mdi:web-network", color: "#00D4FF" },
  "winston": { icon: "simple-icons:winston", color: "#2F8FD7" },
  "click": { icon: "mdi:cursor-pointer", color: "#6C5CE7" },
  "node-mailer": { icon: "mdi:email", color: "#FF6B9D" },
  "cookie-parser": { icon: "mdi:cookie", color: "#FF9500" },
  "compression": { icon: "mdi:file-compress", color: "#4CAF50" },
  "ioredis": { icon: "simple-icons:redis", color: "#DC382D" },
  "concurrently": { icon: "mdi:multiplication", color: "#00BCD4" },
  "reflect-metadata": { icon: "mdi:mirror", color: "#9C27B0" },
  "express-validator": { icon: "mdi:check-circle", color: "#4CAF50" },
  "rack": { icon: "simple-icons:ruby", color: "#CC342D" },
  "helmet": { icon: "mdi:shield-check", color: "#00BCD4" },
  "node-cron": { icon: "mdi:clock-outline", color: "#2196F3" },
  "multer": { icon: "mdi:upload", color: "#FF9800" },
  "morgan": { icon: "mdi:chart-line", color: "#9C27B0" },
  "loguru": { icon: "mdi:file-document-outline", color: "#4CAF50" },
  "httpx": { icon: "mdi:http", color: "#00BCD4" },
  "bull": { icon: "mdi:bullseye", color: "#FF5722" },
  "jsdom": { icon: "mdi:dom", color: "#3F51B5" },
  "class-transformer": { icon: "mdi:refresh", color: "#00BCD4" },
  "tornado": { icon: "mdi:weather-tornado", color: "#4CAF50" },
  "schedule": { icon: "mdi:calendar-clock", color: "#2196F3" },
  "delayed-job": { icon: "mdi:clock-alert", color: "#FF9800" },
  "superagent": { icon: "mdi:rocket-launch", color: "#E91E63" },
  "node-schedule": { icon: "mdi:calendar-check", color: "#3F51B5" },
  "got": { icon: "mdi:download", color: "#4CAF50" },
  "unicorn": { icon: "mdi:unicorn", color: "#9C27B0" },
  "resquee": { icon: "mdi:queue", color: "#FF9800" },
  "koa": { icon: "simple-icons:koa", color: "#333333" },
  "bunyan": { icon: "mdi:book-open", color: "#795548" },
  "watchdogrq": { icon: "mdi:dog", color: "#FF5722" },
  "agenda": { icon: "mdi:calendar-month", color: "#2196F3" },
  "passenger": { icon: "mdi:passenger", color: "#00BCD4" },
  "akka": { icon: "mdi:lightning-bolt", color: "#FF6B00" },
  "structlog": { icon: "mdi:structure", color: "#3F51B5" },
  "tsyringe": { icon: "mdi:syringe", color: "#E91E63" },
  "inversifyjs": { icon: "mdi:refresh-circle", color: "#FF5722" },
  "apscheduler": { icon: "mdi:clock-start", color: "#4CAF50" },
  "playframework": { icon: "mdi:play", color: "#2E7D32" },
  "grape": { icon: "simple-icons:ruby", color: "#CC342D" },
  "whenever": { icon: "mdi:calendar-repeat", color: "#9C27B0" },
  "hapi": { icon: "mdi:circle-multiple", color: "#00BCD4" },
  "blacksheep": { icon: "mdi:sheep", color: "#FFD700" }, // Changed from black for dark mode
  "elysia": { icon: "mdi:lightning-bolt", color: "#6366F1" },
  "polka": { icon: "mdi:music-note", color: "#E91E63" },
  "bottle": { icon: "mdi:bottle-tonic", color: "#4CAF50" },
  "quart": { icon: "mdi:cube-outline", color: "#2196F3" },
  "starlette": { icon: "mdi:star", color: "#FFD700" },
  "undertow": { icon: "mdi:arrow-down", color: "#FF5722" },
  "clockwork": { icon: "mdi:clock", color: "#3F51B5" },
  "rate-limiter-flexible": { icon: "mdi:speedometer", color: "#FF9800" },
  "feathers": { icon: "mdi:feather", color: "#00BCD4" },
  "micronaut": { icon: "mdi:rocket", color: "#4CAF50" },
  "sucker-punch": { icon: "mdi:boxing-glove", color: "#FF5722" },
  "thin": { icon: "mdi:code-braces", color: "#00BCD4" },
  "dropwizard": { icon: "mdi:water", color: "#2196F3" },
  "dramatiq": { icon: "mdi:drama-masks", color: "#9C27B0" },
  "bullmq": { icon: "mdi:bullseye-arrow", color: "#FF5722" },
  "uwebsockets": { icon: "mdi:web", color: "#00BCD4" },
  "vert.x": { icon: "mdi:language-java", color: "#ED8B00" },
  "vertx": { icon: "mdi:language-java", color: "#ED8B00" }, // Alternative slug without dot
  "inversify": { icon: "mdi:refresh-circle", color: "#FF5722" }, // inversifyjs -> inversify
  "play": { icon: "mdi:play", color: "#2E7D32" }, // playframework -> play
  "rq": { icon: "mdi:queue", color: "#FF9800" }, // resquee -> rq
  "watchdog": { icon: "mdi:dog", color: "#FF5722" }, // watchdogrq -> watchdog
  
  // Tools with black colors that need alternative colors for dark mode
  "ws": { icon: "simple-icons:websocket", color: "#00D9FF" }, // Changed from black
  "bcrypt": { icon: "mdi:lock", color: "#FFD700" }, // Changed from black
  "sharp": { icon: "mdi:image", color: "#FF6B6B" }, // Changed from black
  "sinatra": { icon: "simple-icons:ruby", color: "#CC342D" }, // Changed from black
  "fastify": { icon: "simple-icons:fastify", color: "#FFF100" }, // Changed from black (bright yellow)
}

async function main() {
  console.log("Fixing tool icons and colors...")

  for (const [slug, fixes] of Object.entries(iconFixes)) {
    try {
      const tool = await prisma.tool.findUnique({
        where: { slug },
      })

      if (tool) {
        await prisma.tool.update({
          where: { slug },
          data: {
            icon: fixes.icon,
            color: fixes.color,
          },
        })
        console.log(`✓ Updated ${slug}: icon=${fixes.icon}, color=${fixes.color}`)
      } else {
        console.log(`⚠ Tool not found: ${slug}`)
      }
    } catch (error) {
      console.error(`✗ Error updating ${slug}:`, error)
    }
  }

  console.log("Fix completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

