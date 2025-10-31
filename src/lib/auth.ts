import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      // This event fires after user is created by the adapter
      try {
        // Generate username from email or name
        const baseUsername = user.email?.split("@")[0] || user.name?.toLowerCase().replace(/\s+/g, "") || `user${Date.now()}`
        let username = baseUsername
        let counter = 1
        
        // Ensure username is unique
        while (await prisma.user.findUnique({ where: { username } })) {
          username = `${baseUsername}${counter}`
          counter++
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            username,
            displayName: user.name || username,
            avatarUrl: user.image || undefined,
          },
        })
      } catch (error) {
        console.error("Error setting up user:", error)
      }
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Get username from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { username: true },
        })
        if (dbUser) {
          (session.user as any).username = dbUser.username
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile && user.email) {
        try {
          // Update user with GitHub-specific info on each sign in
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (existingUser) {
            const githubUsername = (profile as any).login || user.name?.toLowerCase().replace(/\s+/g, "") || ""
            
            // Update fields
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                displayName: existingUser.displayName || user.name || githubUsername,
                avatarUrl: user.image || existingUser.avatarUrl,
                githubUrl: (profile as any).html_url || existingUser.githubUrl,
              },
            })
          }
        } catch (error) {
          console.error("Error in signIn callback:", error)
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
  },
}

