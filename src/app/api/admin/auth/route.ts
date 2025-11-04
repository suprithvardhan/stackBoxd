import { NextRequest, NextResponse } from "next/server"

/**
 * Admin authentication API route
 * Validates admin credentials server-side
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      console.error("Admin credentials not configured in environment variables")
      return NextResponse.json(
        { error: "Admin authentication not configured" },
        { status: 500 }
      )
    }

    // Validate credentials
    if (email !== adminEmail) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // For now, use simple comparison (in production, use bcrypt)
    // If you want to use bcrypt, hash the password once and store the hash in .env
    // Then compare using: await compare(password, adminPassword)
    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate a simple session token (in production, use JWT or proper session management)
    const sessionToken = Buffer.from(`${email}:${Date.now()}`).toString("base64")
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    // Return success with session info (client will store in localStorage)
    return NextResponse.json({
      success: true,
      session: {
        token: sessionToken,
        expiresAt,
      },
    })
  } catch (error) {
    console.error("Admin auth error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

