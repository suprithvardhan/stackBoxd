"use client";

import { useEffect } from "react";

interface StructuredDataProps {
  data: Record<string, any>;
}

/**
 * Component to inject structured data (JSON-LD) for SEO
 */
export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // Create script tag with JSON-LD
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    script.id = "structured-data";

    // Remove existing structured data if any
    const existing = document.getElementById("structured-data");
    if (existing) {
      existing.remove();
    }

    // Append to head
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById("structured-data");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data]);

  return null;
}

/**
 * Generate structured data for a tool page
 */
export function generateToolStructuredData(tool: any, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description || `${tool.name} is a ${tool.category} developer tool.`,
    url: `${baseUrl}/tools/${tool.slug}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: tool.avgRating
      ? {
          "@type": "AggregateRating",
          ratingValue: tool.avgRating.toFixed(1),
          ratingCount: tool.ratingsCount || 0,
          bestRating: "5",
          worstRating: "1",
        }
      : undefined,
    category: tool.category,
    ...(tool.site && { provider: { "@type": "Organization", name: tool.name, url: tool.site } }),
  };
}

/**
 * Generate structured data for a project page
 */
export function generateProjectStructuredData(project: any, author: any, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.displayName || project.name,
    description: project.description || `A project by ${author?.displayName || author?.username}`,
    url: `${baseUrl}/projects/${project.id}`,
    codeRepository: project.repositoryUrl,
    author: {
      "@type": "Person",
      name: author?.displayName || author?.username,
      url: `${baseUrl}/profile/${author?.username}`,
    },
    ...(project.coverImage && {
      image: project.coverImage,
    }),
    programmingLanguage: project.tools?.map((icon: string) => {
      // Extract language/tool name from icon
      const toolName = icon.split(":")[1] || icon;
      return toolName.charAt(0).toUpperCase() + toolName.slice(1);
    }),
  };
}

/**
 * Generate structured data for a user profile
 */
export function generateUserStructuredData(user: any, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.displayName || user.username,
    url: `${baseUrl}/profile/${user.username}`,
    ...(user.bio && { description: user.bio }),
    ...(user.avatarUrl && { image: user.avatarUrl }),
    ...(user.githubUrl && {
      sameAs: [user.githubUrl, ...(user.websiteUrl ? [user.websiteUrl] : [])],
    }),
    jobTitle: "Developer",
    knowsAbout: "Software Development",
  };
}

/**
 * Generate structured data for the website
 */
export function generateWebsiteStructuredData(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "StackBoxd",
    url: baseUrl,
    description: "Log, rate, and reflect on your developer stack. Discover tools, share projects, and build your developer portfolio.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/discover?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

