import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// DuckDuckGo API helper with timeout (more reliable than Wikipedia direct API)
async function fetchDuckDuckGoDescription(searchQueries: string[]): Promise<string | null> {
  // Try each search query until we get a result
  for (const searchQuery of searchQueries) {
    if (!searchQuery || searchQuery.trim().length === 0) continue
    
    try {
      const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery.trim())}&format=json&no_html=1`
      
      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      try {
        const response = await fetch(searchUrl, {
          headers: {
            "User-Agent": "StackBoxd/1.0 (https://stackboxd.com)",
            "Accept": "application/json",
          },
          signal: controller.signal,
          next: { revalidate: 3600 }, // Cache for 1 hour to reduce API calls
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          continue // Try next query
        }

        const data = await response.json()
        
        // DuckDuckGo returns Abstract field with description (sourced from Wikipedia)
        if (data.Abstract && data.Abstract.trim().length > 0) {
          // Filter out disambiguation pages and short/no-content responses
          if (!data.Abstract.includes("may refer to:") && data.Abstract.length > 20) {
            return data.Abstract.substring(0, 500) // Limit to 500 chars
          }
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        // Handle timeout and network errors gracefully
        if (fetchError.name === 'AbortError' || fetchError.code === 'UND_ERR_CONNECT_TIMEOUT') {
          console.warn(`DuckDuckGo API timeout for query: ${searchQuery}`)
          continue // Try next query
        }
        // For other errors, continue to next query
        continue
      }
    } catch (error: any) {
      // Continue to next query on error
      continue
    }
  }
  return null
}

// GitHub API helper with timeout
async function fetchGitHubDescription(repoUrl: string): Promise<string | null> {
  try {
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) return null

    const [, owner, repo] = match
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "StackBoxd/1.0",
        },
        signal: controller.signal,
        next: { revalidate: 3600 }, // Cache for 1 hour
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        return null
      }

      const data = await response.json()
      return data.description || null
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError' || fetchError.code === 'UND_ERR_CONNECT_TIMEOUT') {
        console.warn(`GitHub API timeout for ${owner}/${repo}`)
        return null
      }
      throw fetchError
    }
  } catch (error: any) {
    if (error.name !== 'AbortError' && error.code !== 'UND_ERR_CONNECT_TIMEOUT') {
      console.error("GitHub API error:", error)
    }
  }
  return null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Get tool from database
    const tool = await prisma.tool.findUnique({
      where: { slug },
      select: { name: true, site: true },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    let description: string | null = null
    let source: string = "unknown"

    // Try GitHub API first if site is a GitHub URL
    if (tool.site && tool.site.includes("github.com")) {
      description = await fetchGitHubDescription(tool.site)
      if (description) {
        source = "github"
      }
    }

    // Try DuckDuckGo API as fallback (more reliable, sources from Wikipedia)
    // Build multiple search queries to try in order: tool name, slug, and variations
    if (!description) {
      const searchQueries: string[] = []
      
      // 1. Use the tool's actual name (most reliable)
      if (tool.name) {
        searchQueries.push(tool.name)
      }
      
      // 2. Try slug converted to readable format (replace hyphens/underscores with spaces)
      const slugAsName = slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
      if (slugAsName !== tool.name) {
        searchQueries.push(slugAsName)
      }
      
      // 3. Try original slug as fallback
      searchQueries.push(slug)
      
      // 4. Try slug with "software" or "framework" appended for better results
      if (!slug.includes('software') && !slug.includes('framework')) {
        searchQueries.push(`${tool.name || slugAsName} software`)
        searchQueries.push(`${tool.name || slugAsName} framework`)
      }
      
      description = await fetchDuckDuckGoDescription([...new Set(searchQueries)]) // Remove duplicates
      if (description) {
        source = "wikipedia" // Still mark as wikipedia since DuckDuckGo sources from Wikipedia
      }
    }

    return NextResponse.json({
      description: description || null,
      source: description ? source : null,
    })
  } catch (error) {
    console.error("Error fetching tool description:", error)
    return NextResponse.json(
      { error: "Failed to fetch description" },
      { status: 500 }
    )
  }
}

