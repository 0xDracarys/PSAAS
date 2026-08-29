import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = '77z07fql7e91wg'
  
  // Use the origin of the current request so it works on both localhost and dracarys.space
  const origin = request.nextUrl.origin
  const redirectUri = `${origin}/api/auth/linkedin/callback`
  
  const scope = 'openid profile w_member_social email'
  const state = Math.random().toString(36).substring(7) // Simple CSRF protection
  
  const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`
  
  return NextResponse.redirect(linkedInAuthUrl)
}
