// API route for updating client request status
// Admin only - requires authentication

import { type NextRequest, NextResponse } from "next/server"
import { dbService } from "@/lib/mongodb"

// PATCH - Update client request status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    if (!status || !["pending", "reviewed", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: pending, reviewed, approved, rejected" },
        { status: 400 }
      )
    }

    // TODO: Add authentication middleware for admin access
    // Force MongoDB usage - bypass fallback
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const success = await mongoService.updateClientRequestStatus(params.id, status)

    if (!success) {
      return NextResponse.json(
        { error: "Client request not found or update failed" },
        { status: 404 }
      )
    }

    console.log("[API] Client request status updated:", {
      id: params.id,
      status,
    })

    return NextResponse.json({
      success: true,
      message: "Client request status updated successfully",
    })
  } catch (error) {
    console.error("[API] Error updating client request status:", error)
    return NextResponse.json(
      { error: "Failed to update client request status" },
      { status: 500 }
    )
  }
}

// PUT - Update client request
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, email, phone, projectType, budget, timeline, requirements, referenceLinks, status } = body

    if (!name || !email || !projectType) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, projectType" },
        { status: 400 }
      )
    }

    const updateData = {
      name,
      email,
      phone: phone || '',
      projectType,
      budget: budget || '',
      timeline: timeline || '',
      requirements: requirements || '',
      referenceLinks: referenceLinks || [],
      status: status || 'pending',
      updatedAt: new Date(),
    }

    // Force MongoDB usage - bypass fallback
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const success = await mongoService.updateClientRequest(params.id, updateData)

    if (!success) {
      return NextResponse.json(
        { error: "Client request not found or update failed" },
        { status: 404 }
      )
    }

    console.log("[API] Client request updated:", {
      id: params.id,
      name,
      email,
    })

    return NextResponse.json({
      success: true,
      message: "Client request updated successfully",
    })
  } catch (error) {
    console.error("[API] Error updating client request:", error)
    return NextResponse.json(
      { error: "Failed to update client request" },
      { status: 500 }
    )
  }
}

// GET - Get specific client request
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication middleware for admin access
    // Force MongoDB usage - bypass fallback
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const requests = await mongoService.getClientRequests(1, 0)
    const request = requests.find(req => req._id === params.id)

    if (!request) {
      return NextResponse.json(
        { error: "Client request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      request,
    })
  } catch (error) {
    console.error("[API] Error fetching client request:", error)
    return NextResponse.json(
      { error: "Failed to fetch client request" },
      { status: 500 }
    )
  }
}
