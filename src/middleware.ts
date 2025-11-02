import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protected routes that require authentication
  const protectedRoutes = [
    "/discover",
    "/stack-card",
    "/home",
    "/lists",
    "/projects",
    "/logs",
    "/profile",
    "/settings",
    "/onboarding",
  ]

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Check for NextAuth session cookie (doesn't require Prisma/Edge runtime)
    // NextAuth uses different cookie names depending on configuration
    const sessionToken = request.cookies.get("authjs.session-token") || 
                         request.cookies.get("__Secure-authjs.session-token") ||
                         request.cookies.get("next-auth.session-token") ||
                         request.cookies.get("__Secure-next-auth.session-token")

    // If no session cookie found, redirect to login
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    // Admin protection is handled client-side
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

