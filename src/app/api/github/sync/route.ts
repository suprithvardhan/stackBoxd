import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

// Map common package.json dependencies to tool icons (must match database icon IDs)
const packageToIconMap: Record<string, string> = {
  // Frontend frameworks
  "react": "simple-icons:react",
  "next": "simple-icons:nextdotjs",
  "vue": "simple-icons:vuejs",
  "svelte": "simple-icons:svelte",
  "angular": "simple-icons:angular",
  "nuxt": "simple-icons:nuxtdotjs",
  "@nuxt/core": "simple-icons:nuxtdotjs",
  "@nuxt/vite-builder": "simple-icons:nuxtdotjs",
  "remix": "simple-icons:remix",
  "@remix-run/node": "simple-icons:remix",
  "astro": "simple-icons:astro",
  
  // Build tools
  "vite": "simple-icons:vite",
  "webpack": "simple-icons:webpack",
  "rollup": "simple-icons:rollupdotjs",
  "parcel": "simple-icons:parcel",
  "turbo": "simple-icons:turborepo",
  "@turbo/gen": "simple-icons:turborepo",
  
  // Styling
  "tailwindcss": "simple-icons:tailwindcss",
  "styled-components": "simple-icons:styledcomponents",
  "sass": "simple-icons:sass",
  "less": "simple-icons:less",
  "@emotion/react": "simple-icons:emotion",
  "@emotion/styled": "simple-icons:emotion",
  
  // State management
  "zustand": "simple-icons:zustand",
  "redux": "simple-icons:redux",
  "@reduxjs/toolkit": "simple-icons:redux",
  "mobx": "simple-icons:mobx",
  "recoil": "simple-icons:recoil",
  "@tanstack/react-query": "simple-icons:reactquery",
  "@tanstack/react-query-devtools": "simple-icons:reactquery",
  "jotai": "simple-icons:jotai",
  
  // Testing
  "jest": "simple-icons:jest",
  "vitest": "simple-icons:vitest",
  "cypress": "simple-icons:cypress",
  "@playwright/test": "simple-icons:playwright",
  "playwright": "simple-icons:playwright",
  "@testing-library/react": "simple-icons:testinglibrary",
  "@testing-library/jest-dom": "simple-icons:testinglibrary",
  "pytest": "simple-icons:pytest",
  "mocha": "simple-icons:mocha",
  "selenium-webdriver": "simple-icons:selenium",
  
  // Backend
  "express": "simple-icons:express",
  "fastify": "simple-icons:fastify",
  "koa": "simple-icons:koa",
  "@nestjs/core": "simple-icons:nestjs",
  "@nestjs/common": "simple-icons:nestjs",
  "fastapi": "simple-icons:fastapi",
  "django": "simple-icons:django",
  "flask": "simple-icons:flask",
  "rails": "simple-icons:rubyonrails",
  "@rails/rails": "simple-icons:rubyonrails",
  "@spring/boot": "simple-icons:springboot",
  "spring-boot": "simple-icons:springboot",
  "@microsoft/aspnetcore": "simple-icons:dotnet",
  "@aspnet/core": "simple-icons:dotnet",
  "gin": "simple-icons:go",
  "github.com/gin-gonic/gin": "simple-icons:go",
  "github.com/labstack/echo": "simple-icons:go",
  "actix-web": "simple-icons:rust",
  "actix": "simple-icons:rust",
  
  // Database
  "prisma": "simple-icons:prisma",
  "@prisma/client": "simple-icons:prisma",
  "mongoose": "simple-icons:mongoose",
  "typeorm": "simple-icons:typeorm",
  "sequelize": "simple-icons:sequelize",
  "pg": "simple-icons:postgresql",
  "postgres": "simple-icons:postgresql",
  "mysql2": "simple-icons:mysql",
  "mysql": "simple-icons:mysql",
  "mongodb": "simple-icons:mongodb",
  "redis": "simple-icons:redis",
  "ioredis": "simple-icons:redis",
  "@supabase/supabase-js": "simple-icons:supabase",
  "firebase": "simple-icons:firebase",
  "@firebase/app": "simple-icons:firebase",
  "cassandra-driver": "simple-icons:apachecassandra",
  "@elastic/elasticsearch": "simple-icons:elasticsearch",
  "elasticsearch": "simple-icons:elasticsearch",
  "@aws-sdk/client-dynamodb": "simple-icons:amazondynamodb",
  "aws-sdk": "simple-icons:amazonaws",
  "@aws-sdk/client-s3": "simple-icons:amazonaws",
  "better-sqlite3": "simple-icons:sqlite",
  "sqlite3": "simple-icons:sqlite",
  
  // Runtime
  "typescript": "simple-icons:typescript",
  "ts-node": "simple-icons:typescript",
  "@types/node": "simple-icons:typescript",
  "node": "simple-icons:nodedotjs",
  "deno": "simple-icons:deno",
  
  // Cloud & DevOps
  "vercel": "simple-icons:vercel",
  "@vercel/node": "simple-icons:vercel",
  "terraform": "simple-icons:terraform",
  "ansible": "simple-icons:ansible",
  "@actions/core": "simple-icons:githubactions",
  "@actions/github": "simple-icons:githubactions",
  "@gitlab/ci": "simple-icons:gitlab",
  "@circleci/circleci-config-sdk": "simple-icons:circleci",
  "@netlify/build": "simple-icons:netlify",
  "@cloudflare/workers-types": "simple-icons:cloudflare",
  "nginx": "simple-icons:nginx",
  
  // API & GraphQL
  "graphql": "simple-icons:graphql",
  "apollo-server": "simple-icons:apollographql",
  "@apollo/server": "simple-icons:apollographql",
  "@apollo/client": "simple-icons:apollographql",
  "@trpc/server": "simple-icons:trpc",
  "@trpc/client": "simple-icons:trpc",
  "@trpc/react": "simple-icons:trpc",
  "postman": "simple-icons:postman",
  "insomnia": "simple-icons:insomnia",
  
  // Authentication
  "next-auth": "simple-icons:nextdotjs",
  "nextauth": "simple-icons:nextdotjs",
  "@auth/core": "simple-icons:nextdotjs",
  "@clerk/nextjs": "simple-icons:clerk",
  "@clerk/clerk-sdk-node": "simple-icons:clerk",
  "auth0": "simple-icons:auth0",
  "@auth0/auth0-spa-js": "simple-icons:auth0",
  "passport": "simple-icons:passport",
  "passport-local": "simple-icons:passport",
  "jsonwebtoken": "simple-icons:jsonwebtokens",
  "jwt": "simple-icons:jsonwebtokens",
  
  // Payments
  "stripe": "simple-icons:stripe",
  "@stripe/stripe-js": "simple-icons:stripe",
  "paypal-rest-sdk": "simple-icons:paypal",
  "@paypal/payouts-sdk": "simple-icons:paypal",
  "@paddle/paddle-node-sdk": "simple-icons:paddle",
  
  // Mobile
  "react-native": "simple-icons:react",
  "expo": "simple-icons:expo",
  "@expo/metro-runtime": "simple-icons:expo",
  "flutter": "simple-icons:flutter",
  "@ionic/core": "simple-icons:ionic",
  "@ionic/react": "simple-icons:ionic",
  "@ionic/angular": "simple-icons:ionic",
  "xamarin": "simple-icons:xamarin",
  
  // UI Libraries (these won't have database entries, but we'll handle them)
  "lucide-react": "mdi:shape-outline",
  "@iconify/react": "mdi:code-tags",
  "@radix-ui/react-dialog": "mdi:package-variant",
  "@radix-ui/react-dropdown-menu": "mdi:package-variant",
  "@headlessui/react": "mdi:package-variant",
  "@mui/material": "mdi:package-variant",
  "@chakra-ui/react": "mdi:package-variant",
}

// Analyze tech stack from package.json
function analyzeTechStack(packageJson: any): string[] {
  const icons: string[] = []
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
  
  for (const [pkg, version] of Object.entries(deps)) {
    if (packageToIconMap[pkg]) {
      icons.push(packageToIconMap[pkg])
    }
  }
  
  return Array.from(new Set(icons))
}

// Fetch GitHub repo data
async function fetchGitHubRepo(owner: string, repo: string, accessToken: string) {
  const [repoResponse, packageJsonResponse] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }).catch(() => null),
  ])

  if (!repoResponse.ok) {
    throw new Error(`GitHub API error: ${repoResponse.statusText}`)
  }

  const repoData = await repoResponse.json()
  
  let tools: string[] = []
  if (packageJsonResponse?.ok) {
    try {
      const packageJsonContent = await packageJsonResponse.json()
      if (packageJsonContent.content) {
        const packageJson = JSON.parse(
          Buffer.from(packageJsonContent.content, "base64").toString("utf-8")
        )
        tools = analyzeTechStack(packageJson)
      }
    } catch (e) {
      console.error("Error parsing package.json:", e)
    }
  }

  // Extract owner from repo URL
  const ownerMatch = repoData.html_url?.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  const repoOwner = ownerMatch ? ownerMatch[1] : owner
  const repoName = repoData.name

  // Generate cover image URL
  const coverImageUrl = `/api/og/project?username=${encodeURIComponent(repoOwner)}&repo=${encodeURIComponent(repoName)}&stars=${repoData.stargazers_count}`

  return {
    name: repoData.name,
    description: repoData.description,
    stars: repoData.stargazers_count,
    url: repoData.html_url,
    homepage: repoData.homepage,
    language: repoData.language,
    topics: repoData.topics || [],
    createdAt: repoData.created_at,
    updatedAt: repoData.updated_at,
    tools,
    coverImage: coverImageUrl,
  }
}

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

            // Fetch package.json only if needed (in parallel)
            let tools: string[] = []
            try {
              const packageJsonResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/package.json`, {
                headers: {
                  Authorization: `token ${account.access_token}`,
                  Accept: "application/vnd.github.v3+json",
                },
              }).catch(() => null)
              
              if (packageJsonResponse?.ok) {
                const packageJsonContent = await packageJsonResponse.json()
                if (packageJsonContent.content) {
                  const packageJson = JSON.parse(
                    Buffer.from(packageJsonContent.content, "base64").toString("utf-8")
                  )
                  tools = analyzeTechStack(packageJson)
                }
              }
            } catch (e) {
              // Silently skip if package.json doesn't exist or can't be parsed
            }

            // Map tools using cache
            const toolsToCreate = tools
              .map((icon: string) => {
                const toolId = toolCache.get(icon)
                return toolId ? { toolId } : null
              })
              .filter(Boolean) as any

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
              description: repo.description || `A project built with ${tools.length > 0 ? tools.length : 'various'} technologies.`,
              stars: repo.stargazers_count || 0,
              repoUrl: repo.html_url,
              demoUrl: repo.homepage || null,
              coverImage: coverImageUrl,
            }

            if (existingProject) {
              // Update existing project
              await prisma.project.update({
                where: { id: existingProject.id },
                data: {
                  ...projectData,
                  tools: toolsToCreate.length > 0 ? {
                    deleteMany: {},
                    create: toolsToCreate,
                  } : undefined,
                },
              })
              syncedProjects.push(existingProject.id)
            } else {
              // Create new project
              const newProject = await prisma.project.create({
                data: {
                  ...projectData,
                  authorId: session.user!.id,
                  tools: toolsToCreate.length > 0 ? {
                    create: toolsToCreate,
                  } : undefined,
                },
              })
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
    const repoData = await fetchGitHubRepo(owner, repo, account.access_token)

    return NextResponse.json(repoData)
  } catch (error) {
    console.error("Error fetching repo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

