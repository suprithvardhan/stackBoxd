import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { initializeToolMatcher } from "@/lib/tool-matcher"
import { detectToolsFromRepo } from "@/lib/github-tool-detector"


// Sync user's GitHub repos
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's GitHub access token
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: "github",
      },
      select: {
        access_token: true,
      },
    })

    if (!account?.access_token) {
      return NextResponse.json({ error: "GitHub token not found" }, { status: 400 })
    }

    // Fetch GitHub user info to get username
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${account.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch GitHub user" }, { status: userResponse.status })
    }

    const githubUser = await userResponse.json()
    const githubUsername = githubUser.login

    // Fetch user's repos from GitHub
    const reposResponse = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        Authorization: `token ${account.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!reposResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch repos" }, { status: reposResponse.status })
    }

    const repos = await reposResponse.json()
    
    // Filter repos upfront
    const validRepos = repos.filter((repo: any) => !repo.fork && !repo.archived)

    // Pre-fetch all tools to cache them
    const allTools = await prisma.tool.findMany({
      select: { id: true, icon: true },
    })
    const toolCache = new Map<string, string>(allTools.map((t: { id: string; icon: string }) => [t.icon, t.id]))

    // Process repos in parallel batches (10 at a time)
    const batchSize = 10
    const syncedProjects: string[] = []
    
    for (let i = 0; i < validRepos.length; i += batchSize) {
      const batch = validRepos.slice(i, i + batchSize)
      
      await Promise.all(
        batch.map(async (repo: any) => {
          try {
            // Use repo data directly from GitHub API response (already fetched)
            const repoOwner = repo.owner?.login || githubUsername
            const repoName = repo.name
            const coverImageUrl = `/api/og/project?username=${encodeURIComponent(repoOwner)}&repo=${encodeURIComponent(repoName)}&stars=${repo.stargazers_count || 0}`

            // Use new detection algorithm with database packageNames
            let toolIds: string[] = []
            try {
              const authHeader = (account as any)?.token_type 
                ? `${(account as any).token_type} ${account.access_token}`
                : `token ${account.access_token}`
              
              if (!authHeader || !account?.access_token) {
                throw new Error("No access token available")
              }
              
              // Initialize tool matcher if not already done
              await initializeToolMatcher()
              
              // Use the new comprehensive detection algorithm
              toolIds = await detectToolsFromRepo(repoOwner, repoName, authHeader)
            } catch (e) {
              console.error(`Error detecting tools for ${repoName}:`, e)
              // Silently skip if detection fails
            }

            // Map tool IDs to ProjectTool relations
            const toolsToCreate = toolIds
              .map((toolId: string) => {
                return { toolId }
              })
              .filter(Boolean) as any
            
            console.log(`✓ ${repoName}: Detected ${toolIds.length} tools, saving ${toolsToCreate.length} ProjectTool relations`)

            // Check if project already exists (batch check could be optimized further)
            const existingProject = await prisma.project.findFirst({
              where: {
                repoUrl: repo.html_url,
                authorId: session.user!.id,
              },
              select: { id: true },
            })

            const projectData = {
              name: repo.name,
              displayName: repo.name.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
              tagline: repo.description || repo.name,
              description: repo.description || `A project built with ${toolIds.length > 0 ? toolIds.length : 'various'} technologies.`,
              stars: repo.stargazers_count || 0,
              repoUrl: repo.html_url,
              demoUrl: repo.homepage || null,
              coverImage: coverImageUrl,
            }

            if (existingProject) {
              // Update existing project
              const updatedProject = await prisma.project.update({
                where: { id: existingProject.id },
                data: {
                  ...projectData,
                  tools: toolsToCreate.length > 0 ? {
                    deleteMany: {},
                    create: toolsToCreate,
                  } : undefined,
                },
                include: {
                  tools: {
                    include: {
                      tool: {
                        select: { name: true, icon: true },
                      },
                    },
                  },
                },
              })
              console.log(`✓ ${repoName}: Updated project with ${updatedProject.tools.length} tools saved`)
              syncedProjects.push(existingProject.id)
            } else {
              // Create new project
              const newProject = await prisma.project.create({
                data: {
                  ...projectData,
                  authorId: session.user!.id!,
                  tools: toolsToCreate.length > 0 ? {
                    create: toolsToCreate,
                  } : undefined,
                },
                include: {
                  tools: {
                    include: {
                      tool: {
                        select: { name: true, icon: true },
                      },
                    },
                  },
                },
              })
              console.log(`✓ ${repoName}: Created project with ${newProject.tools.length} tools saved`)
              syncedProjects.push(newProject.id)
            }
          } catch (error) {
            console.error(`Error syncing repo ${repo.name}:`, error)
          }
        })
      )
    }

    return NextResponse.json({ 
      success: true, 
      synced: syncedProjects.length,
      projects: syncedProjects,
    })
  } catch (error) {
    console.error("Error syncing GitHub repos:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Get a single repo's tech stack
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const repoUrl = searchParams.get("repoUrl")

    if (!repoUrl) {
      return NextResponse.json({ error: "repoUrl parameter required" }, { status: 400 })
    }

    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's GitHub access token
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        provider: "github",
      },
      select: {
        access_token: true,
      },
    })

    if (!account?.access_token) {
      return NextResponse.json({ error: "GitHub token not found" }, { status: 400 })
    }

    // Extract owner/repo from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 })
    }

    const [, owner, repo] = match
    
    // Use new detection algorithm
    await initializeToolMatcher()
    const authHeader = (account as any)?.token_type 
      ? `${(account as any).token_type} ${account.access_token}`
      : `token ${account.access_token}`
    
    const toolIds = await detectToolsFromRepo(owner, repo, authHeader)
    
    // Fetch repo metadata
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: authHeader,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!repoResponse.ok) {
      return NextResponse.json({ error: `Failed to fetch repo: ${repoResponse.statusText}` }, { status: repoResponse.status })
    }

    const repoData = await repoResponse.json()
    const coverImageUrl = `/api/og/project?username=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&stars=${repoData.stargazers_count || 0}`

    // Fetch tool details
    const tools = await prisma.tool.findMany({
      where: {
        id: { in: toolIds },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        color: true,
        category: true,
      },
    })

    return NextResponse.json({
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      url: repoData.html_url,
      homepage: repoData.homepage,
      language: repoData.language,
      topics: repoData.topics || [],
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      tools: tools.map(t => t.icon),
      toolIds: toolIds,
      coverImage: coverImageUrl,
    })
  } catch (error) {
    console.error("Error fetching repo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

