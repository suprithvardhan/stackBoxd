import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://stackboxd.vercel.app";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/logs`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lists`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  try {
    // Fetch dynamic routes from database
    const [tools, projects, users, logs, lists] = await Promise.all([
      prisma.tool.findMany({
        select: { slug: true, updatedAt: true },
        take: 1000, // Limit to prevent timeout
      }),
      prisma.project.findMany({
        select: { id: true, updatedAt: true },
        take: 1000,
      }),
      prisma.user.findMany({
        select: { username: true, updatedAt: true },
        take: 1000,
      }),
      prisma.log.findMany({
        select: { id: true, updatedAt: true },
        take: 1000,
      }),
      prisma.list.findMany({
        where: { visibility: "public" },
        select: { id: true, updatedAt: true },
        take: 500,
      }),
    ]);

    // Build dynamic routes
    const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: tool.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: project.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const userRoutes: MetadataRoute.Sitemap = users.map((user) => ({
      url: `${baseUrl}/profile/${user.username}`,
      lastModified: user.updatedAt || new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));

    const logRoutes: MetadataRoute.Sitemap = logs.map((log) => ({
      url: `${baseUrl}/logs/${log.id}`,
      lastModified: log.updatedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

    const listRoutes: MetadataRoute.Sitemap = lists.map((list) => ({
      url: `${baseUrl}/lists/${list.id}`,
      lastModified: list.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    return [...staticRoutes, ...toolRoutes, ...projectRoutes, ...userRoutes, ...logRoutes, ...listRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static routes if database query fails
    return staticRoutes;
  }
}

