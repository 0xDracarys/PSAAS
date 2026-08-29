import { NextRequest, NextResponse } from 'next/server'
import { checkLinkedInConnection } from '@/lib/linkedin'

/**
 * GET /api/admin/linkedin-status
 *
 * Returns the current LinkedIn connection status.
 * Used by the admin dashboard to show whether the integration is live.
 */
export async function GET(_request: NextRequest) {
  try {
    const status = await checkLinkedInConnection()
    return NextResponse.json(status)
  } catch (error: any) {
    console.error('[LinkedInStatus] Error:', error)
    return NextResponse.json(
      { connected: false, error: 'Failed to check LinkedIn status' },
      { status: 500 }
    )
  }
}
