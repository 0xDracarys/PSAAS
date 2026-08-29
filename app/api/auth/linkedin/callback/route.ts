import { NextRequest, NextResponse } from 'next/server'
import { getDbService } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  const origin = request.nextUrl.origin
  const redirectUri = `${origin}/api/auth/linkedin/callback`

  if (error) {
    console.error('[LinkedIn OAuth] Error from LinkedIn:', error, errorDescription)
    return NextResponse.redirect(`${origin}/admin?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/admin?error=no_code_provided`)
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID || '77z07fql7e91wg'
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET

  if (!clientSecret) {
    console.error('[LinkedIn OAuth] Missing LINKEDIN_CLIENT_SECRET in environment variables')
    return NextResponse.redirect(`${origin}/admin?error=missing_client_secret`)
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('[LinkedIn OAuth] Token exchange failed:', tokenResponse.status, errorText)
      return NextResponse.redirect(`${origin}/admin?error=token_exchange_failed`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      return NextResponse.redirect(`${origin}/admin?error=no_access_token`)
    }

    // Save token to DB
    const mongoService = await getDbService()
    const settings = await mongoService.getWebsiteSettings()
    
    await mongoService.updateWebsiteSettings({
      ...settings,
      integrations: {
        ...(settings?.integrations || {}),
        linkedInAccessToken: accessToken
      }
    })

    console.log('[LinkedIn OAuth] Successfully saved new access token.')
    
    // Redirect back to admin dashboard
    return NextResponse.redirect(`${origin}/admin?success=linkedin_connected`)

  } catch (err: any) {
    console.error('[LinkedIn OAuth] Unexpected error:', err)
    return NextResponse.redirect(`${origin}/admin?error=internal_error`)
  }
}
