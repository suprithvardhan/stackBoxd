import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"

// Custom adapter wrapper
const baseAdapter = PrismaAdapter(prisma) as any

// Create a custom adapter that adds username before user creation
const customAdapter = {
  ...baseAdapter,
  async createUser(user: any) {
    // Generate username before creating user
    const baseUsername = user.email?.split("@")[0] || user.name?.toLowerCase().replace(/\s+/g, "") || `user${Date.now()}`
    let username = baseUsername
    let counter = 1
    
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`
      counter++
    }

    // Create user with username - map NextAuth fields to our schema
    return await prisma.user.create({
      data: {
        id: user.id || undefined,
        name: user.name || null, // NextAuth field
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image || null, // NextAuth expects 'image' field
        username,
        displayName: user.name || username, // Our custom field
        avatarUrl: user.image || undefined, // Our custom field (same as image)
      },
    })
  },
}

export const { handlers, auth } = NextAuth({
  adapter: customAdapter as any,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile: any) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id
        // Use username from user object if available (from adapter), otherwise fetch
        // This avoids an extra DB query when username is already in the user object
        if ((user as any).username) {
          (session.user as any).username = (user as any).username
        } else {
          // Fallback: only query if username is not available
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { username: true },
          })
          if (dbUser) {
            (session.user as any).username = dbUser.username
          }
        }
      }
      return session
    },
    async signIn({ user, account, profile }: { user: any; account?: any; profile?: any }) {
      if (account?.provider === "github" && profile && user.email) {
        // Run user update in background to not block login flow
        // This improves perceived login speed
        prisma.user
          .findUnique({
            where: { email: user.email },
          })
          .then((existingUser) => {
            if (existingUser) {
              const githubUsername = (profile as any).login || user.name?.toLowerCase().replace(/\s+/g, "") || ""
              
              return prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  name: user.name || existingUser.name, // Update NextAuth field
                  image: user.image || existingUser.image, // Update NextAuth field
                  displayName: existingUser.displayName || user.name || githubUsername,
                  avatarUrl: user.image || existingUser.avatarUrl,
                  githubUrl: (profile as any).html_url || existingUser.githubUrl,
                },
              })
            }
          })
          .catch((error) => {
            console.error("Error in signIn callback (non-blocking):", error)
          })
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database" as const,
  },
})
