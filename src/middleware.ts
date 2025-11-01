import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Admin routes protection is handled client-side for now
  // Can add server-side verification later if needed
  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}

