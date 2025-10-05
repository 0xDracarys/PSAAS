import { NextResponse } from "next/server"
import { dbService } from "@/lib/mongodb"

export async function GET() {
  try {
    // Test MongoDB connection
    await dbService.init()
    
    // Try to get admin user
    const admin = await dbService.getAdminUser("admin")
    
    return NextResponse.json({
      mongodb_connected: !!admin,
      admin_exists: !!admin,
      admin_username: admin?.username || "N/A",
      admin_email: admin?.email || "N/A",
      has_password_hash: !!admin?.passwordHash,
      env_check: {
        mongodb_uri: !!process.env.MONGODB_URI,
        mongodb_db: !!process.env.MONGODB_DB,
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
