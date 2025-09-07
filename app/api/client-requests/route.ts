// API route for handling client requests
// Connected to MongoDB Atlas

import { type NextRequest, NextResponse } from "next/server"
import type { ClientRequest } from "@/lib/mongodb"
import { dbService } from "@/lib/mongodb"

// POST - Create new client request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "name",
      "email",
      "phone",
      "projectType",
      "requirements",
      "budget",
      "timeline",
      "acceptedTerms",
    ]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Calculate payment terms based on budget
    let paymentTerms = ""
    const budgetValue = Number.parseInt(body.budget.replace(/[^0-9]/g, ""))

    if (budgetValue > 500) {
      paymentTerms = "25% upfront payment required"
    } else {
      paymentTerms = "35-40% upfront payment required"
    }

    // Create client request in database
    // Force MongoDB usage - bypass fallback
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const requestId = await mongoService.createClientRequest({
      ...body,
      paymentTerms
    })

    console.log("[API] Client request created:", {
      id: requestId,
      name: body.name,
      email: body.email,
      projectType: body.projectType,
      budget: body.budget,
      paymentTerms,
    })

    return NextResponse.json({
      success: true,
      requestId,
      message: "Client request submitted successfully",
      paymentTerms,
    })
  } catch (error) {
    console.error("[v0] Error creating client request:", error)
    return NextResponse.json({ error: "Failed to submit client request" }, { status: 500 })
  }
}

// GET - Retrieve client requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const skip = Number.parseInt(searchParams.get("skip") || "0")

    // TODO: Add authentication middleware for admin access
    // Force MongoDB usage - bypass fallback
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const requests = await mongoService.getClientRequests(limit, skip)

    return NextResponse.json({
      success: true,
      requests,
      total: requests.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching client requests:", error)
    return NextResponse.json({ error: "Failed to fetch client requests" }, { status: 500 })
  }
}
