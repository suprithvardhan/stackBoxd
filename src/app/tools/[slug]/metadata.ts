import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateToolMetadata(slug: string): Promise<Metadata> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://stackboxd.vercel.app";

  try {
    const tool = await prisma.tool.findUnique({
      where: { slug },
      select: {
        name: true,
        description: true,
        category: true,
        icon: true,
        color: true,
        site: true,
        avgRating: true,
        ratingsCount: true,
        usedByCount: true,
      },
    });

    if (!tool) {
      return {
        title: "Tool Not Found",
        description: "The requested tool could not be found.",
      };
    }

    const description = tool.description || `Discover ${tool.name}, a ${tool.category} tool used by ${tool.usedByCount || 0} developers. Rate it ${tool.avgRating?.toFixed(1) || "0.0"}/5.0 based on ${tool.ratingsCount || 0} reviews.`;

    return {
      title: `${tool.name} - Developer Tool Reviews & Ratings`,
      description,
      keywords: [
        tool.name,
        tool.category,
        "developer tool",
        "software review",
        "tech stack",
        "programming",
        "framework",
      ],
      openGraph: {
        title: `${tool.name} - Developer Tool Reviews & Ratings`,
        description,
        type: "website",
        url: `${baseUrl}/tools/${slug}`,
        siteName: "StackBoxd",
        images: [
          {
            url: `${baseUrl}/api/og/tool?slug=${slug}`,
            width: 1200,
            height: 630,
            alt: `${tool.name} - Developer Tool`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${tool.name} - Developer Tool Reviews`,
        description,
        images: [`${baseUrl}/api/og/tool?slug=${slug}`],
      },
      alternates: {
        canonical: `${baseUrl}/tools/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating tool metadata:", error);
    return {
      title: "Tool",
      description: "Developer tool information.",
    };
  }
}

