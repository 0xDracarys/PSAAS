import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/database-service'

export async function GET(req: NextRequest) {
  try {
    const settings = await dbService.getWebsiteSettings()
    
    if (!settings || !settings.shaderBackground) {
      // Return default colors if not set
      return NextResponse.json({
        bgColor1: { r: 0.05, g: 0.05, b: 0.2, a: 1.0 },
        bgColor2: { r: 0.2, g: 0.05, b: 0.4, a: 1.0 },
        lineColor: { r: 0.5, g: 0.3, b: 0.9, a: 1.0 },
      })
    }

    return NextResponse.json(settings.shaderBackground)
  } catch (error) {
    console.error('Error fetching shader background settings:', error)
    return NextResponse.json(
      { 
        bgColor1: { r: 0.05, g: 0.05, b: 0.2, a: 1.0 },
        bgColor2: { r: 0.2, g: 0.05, b: 0.4, a: 1.0 },
        lineColor: { r: 0.5, g: 0.3, b: 0.9, a: 1.0 },
      },
      { status: 200 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { bgColor1, bgColor2, lineColor } = body

    // Validate colors
    const validateColor = (color: any) => {
      return (
        color &&
        typeof color.r === 'number' &&
        typeof color.g === 'number' &&
        typeof color.b === 'number' &&
        typeof color.a === 'number' &&
        color.r >= 0 && color.r <= 1 &&
        color.g >= 0 && color.g <= 1 &&
        color.b >= 0 && color.b <= 1 &&
        color.a >= 0 && color.a <= 1
      )
    }

    if (!validateColor(bgColor1) || !validateColor(bgColor2) || !validateColor(lineColor)) {
      return NextResponse.json({ error: 'Invalid color values. All RGBA values must be between 0 and 1.' }, { status: 400 })
    }

    const settings = await dbService.getWebsiteSettings()
    const updatedSettings = {
      ...settings,
      shaderBackground: { bgColor1, bgColor2, lineColor },
    }

    await dbService.updateWebsiteSettings(updatedSettings)

    return NextResponse.json({ success: true, shaderBackground: { bgColor1, bgColor2, lineColor } })
  } catch (error) {
    console.error('Error updating shader background settings:', error)
    return NextResponse.json({ error: 'Failed to update shader background settings' }, { status: 500 })
  }
}
