// API route for admin authentication

import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { dbService } from "@/lib/database-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    console.log("[API] Login attempt for username:", username)

    // Get admin user from database (uses JSON database fallback)
    const adminUser = await dbService.getAdminUserByUsername(username)

    if (!adminUser) {
      console.log("[API] User not found:", username)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    console.log("[API] User found, verifying password...")

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.passwordHash)

    if (!isValidPassword) {
      console.log("[API] Password verification failed")
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    console.log("[API] Admin login successful:", { username })

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role || 'admin',
      },
    })
  } catch (error) {
    console.error("[API] Error during login:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
