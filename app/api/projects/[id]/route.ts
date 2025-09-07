// API route for handling individual project operations
// Connected to MongoDB Atlas

import { type NextRequest, NextResponse } from "next/server"
import { dbService } from "@/lib/mongodb"

// GET - Retrieve single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`[API] Looking for project with ID: ${params.id}`)
    // Force MongoDB usage - bypass fallback
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const projects = await mongoService.getProjects(false)
    console.log(`[API] Found ${projects.length} projects`)
    console.log(`[API] Project IDs:`, projects.map(p => ({ _id: p._id, id: p.id })))
    
    const project = projects.find(p => 
      p._id === params.id || 
      p.id === params.id || 
      p._id?.toString() === params.id ||
      p.id?.toString() === params.id
    )

    if (!project) {
      console.log(`[API] Project not found for ID: ${params.id}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    console.log(`[API] Found project:`, project.title || 'untitled')
    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error("[API] Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

// PUT - Update project (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // TODO: Add authentication middleware for admin access
    // Force MongoDB usage - bypass fallback
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const success = await mongoService.updateProject(params.id, body)

    if (!success) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    console.log("[API] Project updated:", {
      id: params.id,
      title: body.title,
    })

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
    })
  } catch (error) {
    console.error("[API] Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE - Delete project (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication middleware for admin access
    // Force MongoDB usage - bypass fallback
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const success = await mongoService.deleteProject(params.id)

    if (!success) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    console.log("[API] Project deleted:", {
      id: params.id,
    })

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    })
  } catch (error) {
    console.error("[API] Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
