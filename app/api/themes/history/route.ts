// API route for theme history management
import { type NextRequest, NextResponse } from "next/server"
import { ThemeService } from "@/lib/theme-storage"

// GET - Retrieve theme history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const themeId = searchParams.get('themeId')
    
    const history = ThemeService.getThemeHistory(themeId || undefined)
    
    return NextResponse.json({
      success: true,
      history
    })
  } catch (error) {
    console.error("Error fetching theme history:", error)
    return NextResponse.json({ error: "Failed to fetch theme history" }, { status: 500 })
  }
}

