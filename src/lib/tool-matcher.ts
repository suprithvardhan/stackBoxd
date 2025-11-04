import { prisma } from "./prisma"

// Comprehensive package name to tool slug/name mapping
// This maps npm package names to database tool identifiers
export const PACKAGE_TO_TOOL_MAP: Record<string, string[]> = {
  // Frontend frameworks
  "react": ["react"],
  "next": ["nextdotjs"],
  "vue": ["vuejs"],
  "nuxt": ["nuxtdotjs"],
  "@nuxt/core": ["nuxtdotjs"],
  "@nuxt/vite-builder": ["nuxtdotjs"],
  "svelte": ["svelte"],
  "angular": ["angular"],
  "remix": ["remix"],
  "@remix-run/node": ["remix"],
  "astro": ["astro"],
  
  // Build tools
  "vite": ["vite"],
  "webpack": ["webpack"],
  "rollup": ["rollupdotjs"],
  "parcel": ["parcel"],
  "turbo": ["turborepo"],
  "@turbo/gen": ["turborepo"],
  
  // Styling
  "tailwindcss": ["tailwindcss"],
  "styled-components": ["styledcomponents"],
  "sass": ["sass"],
  "less": ["less"],
  "@emotion/react": ["emotion"],
  "@emotion/styled": ["emotion"],
  
  // State management
  "zustand": ["zustand"],
  "redux": ["redux"],
  "@reduxjs/toolkit": ["redux"],
  "mobx": ["mobx"],
  "recoil": ["recoil"],
  "@tanstack/react-query": ["reactquery"],
  "@tanstack/react-query-devtools": ["reactquery"],
  "jotai": ["jotai"],
  
  // Testing
  "jest": ["jest"],
  "vitest": ["vitest"],
  "cypress": ["cypress"],
  "@playwright/test": ["playwright"],
  "playwright": ["playwright"],
  "@testing-library/react": ["testinglibrary"],
  "@testing-library/jest-dom": ["testinglibrary"],
  "pytest": ["pytest"],
  "mocha": ["mocha"],
  "selenium-webdriver": ["selenium"],
  "ava": ["ava"],
  "karma": ["karma"],
  "qunit": ["qunit"],
  "nightwatch": ["nightwatch"],
  "tape": ["tape"],
  
  // Backend
  "express": ["express"],
  "fastify": ["fastify"],
  "koa": ["koa"],
  "@nestjs/core": ["nestjs"],
  "@nestjs/common": ["nestjs"],
  "fastapi": ["fastapi"],
  "django": ["django"],
  "flask": ["flask"],
  "rails": ["rubyonrails"],
  "@rails/rails": ["rubyonrails"],
  "@spring/boot": ["springboot"],
  "spring-boot": ["springboot"],
  "@microsoft/aspnetcore": ["dotnet"],
  "@aspnet/core": ["dotnet"],
  "gin": ["go"],
  "github.com/gin-gonic/gin": ["go"],
  "github.com/labstack/echo": ["go"],
  "actix-web": ["rust"],
  "actix": ["rust"],
  
  // Database
  "prisma": ["prisma"],
  "@prisma/client": ["prisma"],
  "mongoose": ["mongoose"],
  "typeorm": ["typeorm"],
  "sequelize": ["sequelize"],
  "pg": ["postgresql"],
  "postgres": ["postgresql"],
  "mysql2": ["mysql"],
  "mysql": ["mysql"],
  "mongodb": ["mongodb"],
  "redis": ["redis"],
  "ioredis": ["redis"],
  "@supabase/supabase-js": ["supabase"],
  "firebase": ["firebase"],
  "@firebase/app": ["firebase"],
  "cassandra-driver": ["apachecassandra"],
  "@elastic/elasticsearch": ["elasticsearch"],
  "elasticsearch": ["elasticsearch"],
  "@aws-sdk/client-dynamodb": ["amazondynamodb"],
  "aws-sdk": ["amazonaws"],
  "@aws-sdk/client-s3": ["amazonaws"],
  "better-sqlite3": ["sqlite"],
  "sqlite3": ["sqlite"],
  
  // Runtime & Languages
  "typescript": ["typescript"],
  "ts-node": ["typescript"],
  "@types/node": ["typescript"],
  "node": ["nodedotjs"],
  "deno": ["deno"],
  
  // Cloud & DevOps
  "vercel": ["vercel"],
  "@vercel/node": ["vercel"],
  "terraform": ["terraform"],
  "ansible": ["ansible"],
  "@actions/core": ["githubactions"],
  "@actions/github": ["githubactions"],
  "@gitlab/ci": ["gitlab"],
  "@circleci/circleci-config-sdk": ["circleci"],
  "@netlify/build": ["netlify"],
  "@cloudflare/workers-types": ["cloudflare"],
  "nginx": ["nginx"],
  
  // API & GraphQL
  "graphql": ["graphql"],
  "apollo-server": ["apollographql"],
  "@apollo/server": ["apollographql"],
  "@apollo/client": ["apollographql"],
  "@trpc/server": ["trpc"],
  "@trpc/client": ["trpc"],
  "@trpc/react": ["trpc"],
  
  // Authentication
  "next-auth": ["nextdotjs"],
  "nextauth": ["nextdotjs"],
  "@auth/core": ["nextdotjs"],
  "@clerk/nextjs": ["clerk"],
  "@clerk/clerk-sdk-node": ["clerk"],
  "auth0": ["auth0"],
  "@auth0/auth0-spa-js": ["auth0"],
  "passport": ["passport"],
  "passport-local": ["passport"],
  "jsonwebtoken": ["jsonwebtokens"],
  "jwt": ["jsonwebtokens"],
  
  // Payments
  "stripe": ["stripe"],
  "@stripe/stripe-js": ["stripe"],
  "paypal-rest-sdk": ["paypal"],
  "@paypal/payouts-sdk": ["paypal"],
  
  // Mobile
  "react-native": ["react"],
  "expo": ["expo"],
  "@expo/metro-runtime": ["expo"],
  "flutter": ["flutter"],
  "@ionic/core": ["ionic"],
  "@ionic/react": ["ionic"],
  "@ionic/angular": ["ionic"],
  
  // API tools
  "body-parser": ["express"],
  "bodyparser": ["express"],
  "cors": ["express"],
  "ws": ["websocket"],
  "websocket": ["websocket"],
  "socket.io": ["socketdotio"],
  "socketio": ["socketdotio"],
  "axios": ["axios"],
  "node-fetch": ["nodedotjs"],
  "fetch": ["nodedotjs"],
}

// Tool matcher class for efficient tool detection
export class ToolMatcher {
  private toolCache: Map<string, { id: string; slug: string; name: string; icon: string; packageNames?: string[]; category?: string }>
  public slugMap: Map<string, string> // slug -> tool id (public for use in github-tool-detector)
  private nameMap: Map<string, string> // lowercase name -> tool id
  private packageMap: Map<string, string[]> // package name -> tool slugs (from hardcoded map)
  private dbPackageMap: Map<string, string> // package name -> tool id (from DB packageNames field)
  private languageToolIds: Set<string> // Set of tool IDs that are languages (should not match from packages)
  
  constructor(tools: Array<{ id: string; slug: string; name: string; icon: string; packageNames?: string[]; category?: string }>) {
    this.toolCache = new Map()
    this.slugMap = new Map()
    this.nameMap = new Map()
    this.packageMap = new Map()
    this.dbPackageMap = new Map()
    this.languageToolIds = new Set()
    
    // Build lookup maps
    for (const tool of tools) {
      this.toolCache.set(tool.id, tool)
      this.slugMap.set(tool.slug, tool.id)
      this.nameMap.set(tool.name.toLowerCase(), tool.id)
      // Also add variations
      this.nameMap.set(tool.slug.toLowerCase(), tool.id)
      
      // Track language tools (they shouldn't match from dependency files)
      if (tool.category === "language") {
        this.languageToolIds.add(tool.id)
      }
      
      // Build DB package names map (only for non-language tools)
      if (tool.packageNames && tool.packageNames.length > 0 && tool.category !== "language") {
        for (const pkgName of tool.packageNames) {
          // Store both exact and lowercase versions
          this.dbPackageMap.set(pkgName.toLowerCase(), tool.id)
          this.dbPackageMap.set(pkgName, tool.id)
        }
      }
    }
    
    // Build package map from PACKAGE_TO_TOOL_MAP (hardcoded fallback)
    for (const [pkg, slugs] of Object.entries(PACKAGE_TO_TOOL_MAP)) {
      this.packageMap.set(pkg.toLowerCase(), slugs)
    }
  }
  
  // Match a package name to a tool ID - ONLY direct matches from database packageNames
  matchPackage(packageName: string): string | null {
    const pkgLower = packageName.toLowerCase().trim()
    if (!pkgLower) return null
    
    // Filter out invalid package names
    if (pkgLower.length <= 1) return null // Single letters
    if (/^v?\d+(\.\d+)*$/.test(pkgLower)) return null // Version numbers
    if (['go', 'module', 'require', 'replace', 'exclude', '(', ')', '[', ']'].includes(pkgLower)) return null
    
    // ONLY match against database packageNames - no pattern matching, no fuzzy matching, no regex
    const dbMatch = this.dbPackageMap.get(pkgLower)
    if (dbMatch) return dbMatch
    
    // That's it - if it's not in the database packageNames, return null
    return null
  }
  
  // Batch match multiple packages
  matchPackages(packageNames: string[]): string[] {
    const toolIds = new Set<string>()
    
    for (const pkg of packageNames) {
      const toolId = this.matchPackage(pkg)
      if (toolId) {
        toolIds.add(toolId)
      }
    }
    
    return Array.from(toolIds)
  }
  
  // Get tool by ID
  getTool(toolId: string) {
    return this.toolCache.get(toolId)
  }
}

// Singleton instance - loaded once and cached
let toolMatcherInstance: ToolMatcher | null = null

// Initialize tool matcher (call this once at startup or before first use)
export async function initializeToolMatcher() {
  if (toolMatcherInstance) return toolMatcherInstance
  
  const tools = await prisma.tool.findMany()
  
  // Map to the expected format (packageNames is a new field, may not be in types yet)
  const mappedTools = tools.map(tool => ({
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    icon: tool.icon,
    packageNames: (tool as any).packageNames || [],
    category: tool.category,
  }))
  
  toolMatcherInstance = new ToolMatcher(mappedTools)
  return toolMatcherInstance
}

// Get the singleton instance
export function getToolMatcher(): ToolMatcher {
  if (!toolMatcherInstance) {
    throw new Error("ToolMatcher not initialized. Call initializeToolMatcher() first.")
  }
  return toolMatcherInstance
}

