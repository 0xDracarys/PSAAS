// API route for reverting themes to previous versions
import { type NextRequest, NextResponse } from "next/server"
import { ThemeService } from "@/lib/theme-storage"

// POST - Revert theme to previous version
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { themeId, historyId } = body
    
    if (!themeId || !historyId) {
      return NextResponse.json({ error: "Theme ID and History ID are required" }, { status: 400 })
    }
    
    const success = ThemeService.revertTheme(themeId, historyId)
    
    if (!success) {
      return NextResponse.json({ error: "Failed to revert theme" }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: "Theme reverted successfully"
    })
  } catch (error) {
    console.error("Error reverting theme:", error)
    return NextResponse.json({ error: "Failed to revert theme" }, { status: 500 })
  }
}

