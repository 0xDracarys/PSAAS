// API route for handling file uploads
import { type NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Starting file upload...")
    
    // Configure Cloudinary with explicit env vars
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    console.log("[API] Cloudinary config check:", {
      cloudName: cloudName ? '✓ Set' : '✗ Missing',
      apiKey: apiKey ? '✓ Set' : '✗ Missing',
      apiSecret: apiSecret ? '✓ Set' : '✗ Missing'
    })
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.error("[API] Missing Cloudinary credentials")
      return NextResponse.json({ 
        error: "Server configuration error",
        details: "Cloudinary credentials not configured properly. Please contact administrator."
      }, { status: 500 })
    }
    
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })
    
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
      name: error.name,
      cloudinaryError: error.http_code || error.error?.http_code
    })
    
    let errorMessage = "Failed to upload file"
    let errorDetails = error.message
    
    // Provide more specific error messages
    if (error.message?.includes('Invalid cloud_name')) {
      errorDetails = "Invalid Cloudinary cloud name. Please verify configuration."
    } else if (error.message?.includes('Invalid API key')) {
      errorDetails = "Invalid Cloudinary API credentials. Please verify configuration."
    } else if (error.http_code === 401 || error.error?.http_code === 401) {
      errorDetails = "Cloudinary authentication failed. Please verify API credentials."
    } else if (error.http_code === 420) {
      errorDetails = "Cloudinary rate limit exceeded. Please try again later."
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails
    }, { status: 500 })
  }
}