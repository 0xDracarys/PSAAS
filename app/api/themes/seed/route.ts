// API route to manually seed/reseed default themes
import { type NextRequest, NextResponse } from "next/server"
import { defaultThemes } from "@/lib/theme-storage"

// POST - Seed or reseed default themes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const force = body.force || false // Force reseed even if themes exist
    
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    
    // Check existing themes
    const existingThemes = await mongoService.getThemes()
    
    if (!force && existingThemes && existingThemes.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Themes already exist. Use { force: true } to reseed.",
        existingCount: existingThemes.length
      }, { status: 400 })
    }
    
    console.log("[API] Seeding default themes...")
    
    let seededCount = 0
    let errorCount = 0
    const errors: any[] = []
    
    for (const theme of defaultThemes) {
      try {
        // Check if theme already exists by _id
        const existing = await mongoService.getThemeById(theme._id)
        
        if (existing && !force) {
          console.log(`[API] Theme ${theme.name} already exists, skipping...`)
          continue
        }
        
        if (existing && force) {
          // Update existing theme
          await mongoService.updateTheme(theme._id, theme)
          console.log(`[API] Updated theme: ${theme.name}`)
        } else {
          // Create new theme
          await mongoService.createTheme(theme)
          console.log(`[API] Created theme: ${theme.name}`)
        }
        
        seededCount++
      } catch (error: any) {
        console.error(`[API] Error seeding theme ${theme.name}:`, error)
        errorCount++
        errors.push({
          theme: theme.name,
          error: error.message
        })
      }
    }
    
    const finalThemes = await mongoService.getThemes()
    
    return NextResponse.json({
      success: true,
      message: `Seeded ${seededCount} themes${errorCount > 0 ? ` (${errorCount} errors)` : ''}`,
      seededCount,
      errorCount,
      totalThemes: finalThemes.length,
      errors: errors.length > 0 ? errors : undefined
    })
    
  } catch (error: any) {
    console.error("[API] Error seeding themes:", error)
    return NextResponse.json({ 
      error: "Failed to seed themes",
      details: error.message
    }, { status: 500 })
  }
}

// GET - Check seeding status
export async function GET() {
  try {
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const existingThemes = await mongoService.getThemes()
    
    return NextResponse.json({
      success: true,
      themesCount: existingThemes.length,
      defaultThemesCount: defaultThemes.length,
      needsSeeding: existingThemes.length === 0,
      themes: existingThemes.map((t: any) => ({ _id: t._id, name: t.name, isActive: t.isActive }))
    })
  } catch (error: any) {
    console.error("[API] Error checking themes:", error)
    return NextResponse.json({ 
      error: "Failed to check themes",
      details: error.message
    }, { status: 500 })
  }
}
