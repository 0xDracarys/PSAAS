// API route for handling client requests / contact submissions
// Connected to MongoDB Atlas with memory fallback

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate essential required fields
    const name = body.name?.trim()
    const email = body.email?.trim()
    const requirements = (body.requirements || body.message || "").trim()

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required." },
        { status: 400 }
      )
    }

    if (!requirements && !body.projectType) {
      return NextResponse.json(
        { success: false, error: "Please provide project details or a message." },
        { status: 400 }
      )
    }

    // Build normalized request object
    const clientRequestData = {
      name,
      email,
      phone: body.phone || "Not provided",
      projectType: body.projectType || "General Inquiry",
      requirements: requirements || "No description provided",
      budget: body.budget || "Flexible",
      timeline: body.timeline || "Flexible",
      referenceLinks: Array.isArray(body.referenceLinks) ? body.referenceLinks : [],
      files: Array.isArray(body.files) ? body.files : [],
      acceptedTerms: body.acceptedTerms ?? true,
      status: "pending",
      createdAt: new Date(),
    }

    // Calculate payment terms based on budget if specified
    let paymentTerms = "Standard terms apply"
    if (body.budget) {
      const budgetValue = Number.parseInt(String(body.budget).replace(/[^0-9]/g, "")) || 0
      paymentTerms = budgetValue > 500 ? "25% upfront payment required" : "35-40% upfront payment required"
    }

    // Use mongoService with memory fallback safety
    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const requestId = await mongoService.createClientRequest({
      ...clientRequestData,
      paymentTerms,
    })

    console.log("[API] Client request created successfully:", {
      id: requestId,
      name,
      email,
      projectType: clientRequestData.projectType,
    })

    return NextResponse.json({
      success: true,
      requestId,
      message: "Your request has been submitted successfully! We will get back to you shortly.",
      paymentTerms,
    })
  } catch (error: any) {
    console.error("[API] Error creating client request:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit client request. Please try again." },
      { status: 500 }
    )
  }
}

// GET - Retrieve client requests (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const skip = Number.parseInt(searchParams.get("skip") || "0")

    const mongoService = await (await import("@/lib/mongodb")).getDbService()
    const requests = await mongoService.getClientRequests(limit, skip)

    return NextResponse.json({
      success: true,
      requests,
      total: requests.length,
    })
  } catch (error: any) {
    console.error("[API] Error fetching client requests:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch client requests" }, { status: 500 })
  }
}
