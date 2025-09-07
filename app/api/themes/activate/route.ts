// API route for activating themes
import { type NextRequest, NextResponse } from "next/server"
import { ThemeService } from "@/lib/theme-storage"

// POST - Activate theme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { themeId } = body

    if (!themeId) {
      return NextResponse.json({ error: "Theme ID is required" }, { status: 400 })
    }

    const success = await ThemeService.setActiveTheme(themeId)

    if (!success) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 })
    }

    const activeTheme = await ThemeService.getActiveTheme()
    let css = ''
    
    if (activeTheme) {
      try {
        // Ensure theme has all required properties before generating CSS
        const completeTheme = ThemeService.ensureCompleteTheme ? 
          ThemeService.ensureCompleteTheme(activeTheme) : activeTheme
        css = ThemeService.generateCSS(completeTheme)
      } catch (cssError) {
        console.error("[API] Error generating CSS:", cssError)
        // Return a basic CSS if generation fails
        css = ':root { --primary: #000000; --secondary: #666666; --background: #ffffff; --foreground: #000000; }'
      }
    }

    console.log("[API] Theme activated:", {
      id: themeId,
      name: activeTheme?.name,
    })

    return NextResponse.json({
      success: true,
      activeTheme,
      css,
      message: "Theme activated successfully",
    })
  } catch (error) {
    console.error("[API] Error activating theme:", error)
    return NextResponse.json({ error: "Failed to activate theme" }, { status: 500 })
  }
}
