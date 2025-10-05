// API route for handling file uploads
import { type NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Starting file upload...")
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string || "uploads"

    console.log("[API] File details:", {
      name: file?.name,
      type: file?.type,
      size: file?.size,
      uploadType: type
    })

    if (!file) {
      console.error("[API] No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error(`[API] Invalid file type: ${file.type}`)
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error(`[API] File too large: ${file.size} bytes`)
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Convert file to base64
    console.log("[API] Converting file to base64...")
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    console.log("[API] Uploading to Cloudinary...")
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: type, // Organize images in folders by type
      resource_type: "auto",
      public_id: `${type}-${Date.now()}`, // Custom filename
    })

    console.log(`[API] File uploaded successfully: ${result.public_id}`, {
      url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height
    })

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (error: any) {
    console.error("[API] Error uploading file:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json({ 
      error: "Failed to upload file",
      details: error.message 
    }, { status: 500 })
  }
}