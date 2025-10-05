import { NextResponse } from "next/server"
import { dbService } from "@/lib/mongodb"

export async function GET() {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    env_check: {
      mongodb_uri: !!process.env.MONGODB_URI,
      mongodb_uri_length: process.env.MONGODB_URI?.length || 0,
      mongodb_db: process.env.MONGODB_DB || "N/A",
      node_env: process.env.NODE_ENV || "N/A",
    },
  }

  try {
    console.log("[DEBUG] Starting MongoDB connection test...")
    
    // Test MongoDB connection
    await dbService.init()
    debugInfo.mongodb_init = "success"
    
    console.log("[DEBUG] MongoDB initialized, fetching admin user...")
    
    // Try to get admin user
    const admin = await dbService.getAdminUser("admin")
    
    debugInfo.admin_check = {
      admin_exists: !!admin,
      admin_username: admin?.username || "N/A",
      admin_email: admin?.email || "N/A",
      has_password_hash: !!admin?.passwordHash,
      password_hash_length: admin?.passwordHash?.length || 0,
    }
    
    return NextResponse.json(debugInfo)
  } catch (error: any) {
    console.error("[DEBUG] Error occurred:", error)
    debugInfo.error = {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 5),
    }
    return NextResponse.json(debugInfo, { status: 500 })
  }
}
