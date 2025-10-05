// API route for theme management
import { type NextRequest, NextResponse } from "next/server"
import { defaultThemes } from "@/lib/theme-storage"

// GET - Retrieve all themes
export async function GET() {
  try {
    // Use MongoDB service directly
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    
    let rawThemes = await mongoService.getThemes()
    
    // If no themes exist, seed default themes
    if (!rawThemes || rawThemes.length === 0) {
      console.log("[API] No themes found, seeding default themes...")
      
      for (const theme of defaultThemes) {
        try {
          await mongoService.createTheme(theme)
          console.log(`[API] Seeded theme: ${theme.name}`)
        } catch (error) {
          console.error(`[API] Error seeding theme ${theme.name}:`, error)
        }
      }
      
      // Fetch themes again after seeding
      rawThemes = await mongoService.getThemes()
      console.log(`[API] Seeded ${rawThemes.length} themes successfully`)
    }
    
    // Ensure each theme has an 'id' field for API consumers/tests
    const themes = rawThemes.map((t: any) => ({
      id: t.id || t._id,
      effects: t.effects || {
        backgroundParticles: false,
        glowEffects: false,
        glassmorphism: false,
        neonBorders: false,
        gradientBackgrounds: false,
        animatedElements: false,
        hoverEffects: false,
        scrollAnimations: false,
      },
      ...t,
    }))
    const activeTheme = themes.find((theme: any) => theme.isActive) || null

    return NextResponse.json({
      success: true,
      themes,
      activeTheme,
      count: themes.length,
    })
  } catch (error) {
    console.error("[API] Error fetching themes:", error)
    return NextResponse.json({ error: "Failed to fetch themes" }, { status: 500 })
  }
}

// POST - Create new theme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Use MongoDB service directly
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const themeId = await mongoService.createTheme(body)
    
    console.log("[API] Theme created:", {
      id: themeId,
      name: body.name,
    })

    return NextResponse.json({
      success: true,
      themeId,
      message: "Theme created successfully",
    })
  } catch (error) {
    console.error("[API] Error creating theme:", error)
    return NextResponse.json({ error: "Failed to create theme" }, { status: 500 })
  }
}
