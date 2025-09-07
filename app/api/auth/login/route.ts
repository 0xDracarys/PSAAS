// API route for admin authentication

import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { dbService } from "@/lib/mongodb"

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

    // Ensure database service is initialized
    await dbService.init()

    // Get admin user from database
    const adminUser = await dbService.getAdminUser(username)

    if (!adminUser) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Update last login
    await dbService.updateLastLogin(username)

    console.log("[API] Admin login successful:", { username })

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
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
