// API route for individual theme operations
import { type NextRequest, NextResponse } from "next/server"
import { ThemeService } from "@/lib/theme-storage"

// GET - Retrieve single theme
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const theme = ThemeService.getThemeById(params.id)

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      theme,
    })
  } catch (error) {
    console.error("[API] Error fetching theme:", error)
    return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 })
  }
}

// PUT - Update theme
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const success = await ThemeService.updateTheme(params.id, body)

    if (!success) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 })
    }

    console.log("[API] Theme updated:", {
      id: params.id,
      name: body.name,
    })

    return NextResponse.json({
      success: true,
      message: "Theme updated successfully",
    })
  } catch (error) {
    console.error("[API] Error updating theme:", error)
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 })
  }
}

// DELETE - Delete theme
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = ThemeService.deleteTheme(params.id)

    if (!success) {
      return NextResponse.json({ error: "Theme not found or cannot be deleted" }, { status: 404 })
    }

    console.log("[API] Theme deleted:", {
      id: params.id,
    })

    return NextResponse.json({
      success: true,
      message: "Theme deleted successfully",
    })
  } catch (error) {
    console.error("[API] Error deleting theme:", error)
    return NextResponse.json({ error: "Failed to delete theme" }, { status: 500 })
  }
}
