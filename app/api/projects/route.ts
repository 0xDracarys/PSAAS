// API route for handling projects
// Connected to MongoDB Atlas

import { type NextRequest, NextResponse } from "next/server"
import type { Project } from "@/lib/mongodb"
import { dbService } from "@/lib/mongodb"

// GET - Retrieve projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    // Force MongoDB usage - bypass fallback
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const projects = await mongoService.getProjects(activeOnly)

    return NextResponse.json({
      success: true,
      projects,
    })
  } catch (error) {
    console.error("[v0] Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

// POST - Create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Add authentication middleware for admin access
    const projectId = await dbService.createProject(body)

    console.log("[API] Project created:", {
      id: projectId,
      title: body.title,
    })

    return NextResponse.json({
      success: true,
      projectId,
      message: "Project created successfully",
    })
  } catch (error) {
    console.error("[v0] Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
