import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { initializeToolMatcher } from "@/lib/tool-matcher"
import { detectToolsFromRepo } from "@/lib/github-tool-detector"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const owner = searchParams.get("owner")
    const repo = searchParams.get("repo")

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "owner and repo parameters required" },
        { status: 400 }
      )
    }

    // Try to get session - if it fails, try manual cookie validation
    let session = await getSession()
    
    if (!session?.user?.id) {
      const sessionToken = request.cookies.get("authjs.session-token")?.value ||
                          request.cookies.get("__Secure-authjs.session-token")?.value
      
      if (sessionToken) {
        const dbSession = await prisma.session.findUnique({
          where: { sessionToken },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                name: true,
                image: true,
              },
            },
          },
        })
        
        if (dbSession && dbSession.expires > new Date()) {
          session = {
            user: {
              id: dbSession.user.id,
              email: dbSession.user.email || undefined,
              name: dbSession.user.name || undefined,
              image: dbSession.user.image || undefined,
              username: (dbSession.user as any).username,
            },
            expires: dbSession.expires.toISOString(),
          } as any
        }
      }
    }

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
        expires_at: true,
        token_type: true,
      },
    })

    if (!account?.access_token) {
      return NextResponse.json(
        { error: "GitHub token not found. Please sign in with GitHub." },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (account.expires_at && new Date(account.expires_at) < new Date()) {
      return NextResponse.json(
        { 
          error: "GitHub token has expired. Please sign out and sign in again with GitHub.",
          code: "TOKEN_EXPIRED"
        },
        { status: 401 }
      )
    }

    // Initialize tool matcher
    await initializeToolMatcher()

    // Fetch repo info
    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: account.token_type 
          ? `${account.token_type} ${account.access_token}`
          : `token ${account.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!repoResponse.ok) {
      if (repoResponse.status === 401) {
        return NextResponse.json(
          { 
            error: "GitHub authentication failed. Your token may be invalid or expired. Please sign out and sign in again with GitHub.",
            code: "AUTH_FAILED"
          },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { error: `Failed to fetch repo: ${repoResponse.statusText}` },
        { status: repoResponse.status }
      )
    }

    const repoData = await repoResponse.json()

    // Use consistent auth header
    const authHeader = account.token_type 
      ? `${account.token_type} ${account.access_token}`
      : `token ${account.access_token}`

    // Get languages
    const languagesResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers: {
          Authorization: authHeader,
          Accept: "application/vnd.github.v3+json",
        },
      }
    )

    if (!languagesResponse.ok) {
      if (languagesResponse.status === 401) {
        return NextResponse.json(
          { 
            error: "GitHub authentication failed. Your token may be invalid or expired. Please sign out and sign in again with GitHub.",
            code: "AUTH_FAILED"
          },
          { status: 401 }
        )
      }
      console.error(`Languages API failed: ${languagesResponse.status} ${languagesResponse.statusText}`)
    }

    const languages: Record<string, number> = languagesResponse.ok
      ? await languagesResponse.json().catch((e) => {
          console.error("Error parsing languages:", e)
          return {}
        })
      : {}
    
    console.log(`Languages API returned: ${Object.keys(languages).length} languages`)

    // Calculate language percentages
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0)
    const threshold = totalBytes * 0.01

    const sortedLanguages = Object.entries(languages)
      .filter(([lang]) => lang !== "Other")
      .sort(([, a], [, b]) => b - a)
      .filter(([, bytes]) => bytes >= threshold)
      .slice(0, 3)
      .map(([lang, bytes]) => ({
        name: lang,
        bytes,
        percentage: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(2) : "0",
      }))

    // Detect tools (using the same authHeader defined earlier)
    const toolIds = await detectToolsFromRepo(owner, repo, authHeader)

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

    // Check for common dependency files
    const dependencyFiles: string[] = []
    const filesToCheck = [
      "package.json",
      "requirements.txt",
      "pyproject.toml",
      "Cargo.toml",
      "go.mod",
      "Gemfile",
      "composer.json",
      "pom.xml",
      "build.gradle",
      "pubspec.yaml",
      "Anchor.toml",
      "anchor.toml",
    ]

    const fileChecks = await Promise.all(
      filesToCheck.map(async (file) => {
        try {
          const response = await Promise.race([
            fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file}`, {
              headers: {
                Authorization: authHeader,
                Accept: "application/vnd.github.v3+json",
              },
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 500)),
          ]).catch(() => null) as Response | null

          return { file, exists: response?.ok || false }
        } catch {
          return { file, exists: false }
        }
      })
    )

    fileChecks.forEach(({ file, exists }) => {
      if (exists) dependencyFiles.push(file)
    })

    return NextResponse.json({
      repo: {
        name: repoData.name,
        description: repoData.description,
        stars: repoData.stargazers_count,
        url: repoData.html_url,
        language: repoData.language,
        topics: repoData.topics || [],
      },
      languages: sortedLanguages,
      tools,
      dependencyFiles,
      detection: {
        totalTools: tools.length,
        languagesDetected: sortedLanguages.length,
        filesFound: dependencyFiles.length,
      },
    })
  } catch (error) {
    console.error("Error in demo endpoint:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

