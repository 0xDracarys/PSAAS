/**
 * LinkedIn API Service
 *
 * Uses the LinkedIn REST API v2 to post UGC (User Generated Content) shares
 * on behalf of the authenticated user (Bhasker / Dracarys).
 *
 * Setup:
 *  1. Create a LinkedIn Developer App at https://www.linkedin.com/developers/
 *  2. Add the "Share on LinkedIn" + "Sign In with LinkedIn using OpenID Connect" products
 *  3. Copy Client ID & Secret into .env
 *  4. Generate an access token using the OAuth 2.0 Authorization Code flow
 *     (or use the Token Generator in the LinkedIn Developer portal for testing)
 *  5. Paste the token into LINKEDIN_ACCESS_TOKEN in .env
 */

import { getDbService } from './mongodb'

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2'

/**
 * Gets the LinkedIn access token. Prioritizes the token stored in the database
 * (via the admin dashboard) and falls back to process.env.
 */
async function getAccessToken(): Promise<string | undefined> {
  try {
    const mongoService = await getDbService()
    const settings = await mongoService.getWebsiteSettings()
    if (settings?.integrations?.linkedInAccessToken) {
      return settings.integrations.linkedInAccessToken
    }
  } catch (error) {
    console.error('[LinkedIn] Failed to fetch token from DB:', error)
  }
  return process.env.LINKEDIN_ACCESS_TOKEN
}

export interface LinkedInPostData {
  title: string
  excerpt: string
  blogUrl: string
  tags?: string[]
}

export interface LinkedInPostResult {
  success: boolean
  postId?: string
  postUrl?: string
  error?: string
}

/**
 * Fetches the LinkedIn member URN (user ID) for the authenticated user.
 * Required to create posts on their behalf.
 */
async function getLinkedInUserId(accessToken: string): Promise<string> {
  const response = await fetch(`${LINKEDIN_API_BASE}/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Failed to fetch LinkedIn user info: ${response.status} - ${err}`)
  }

  const data = await response.json()
  // sub is in "urn:li:person:XXXXX" format via OpenID Connect
  const sub: string = data.sub
  if (!sub) throw new Error('LinkedIn user sub not found in userinfo response')
  return `urn:li:person:${sub}`
}

/**
 * Creates a LinkedIn share post with a link to the blog post.
 * The post will contain:
 *   - A catchy intro referencing the blog
 *   - The blog URL (LinkedIn will auto-generate an Open Graph preview)
 *   - Relevant hashtags from the blog's tags
 */
export async function shareToLinkedIn(postData: LinkedInPostData): Promise<LinkedInPostResult> {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return {
      success: false,
      error:
        'LINKEDIN_ACCESS_TOKEN is not configured. Please set it in your .env file. ' +
        'You can generate one from the LinkedIn Developer portal.',
    }
  }

  try {
    // Step 1: Get the user's person URN
    const authorUrn = await getLinkedInUserId(accessToken)

    // Step 2: Build hashtags from blog tags
    const hashtags =
      postData.tags && postData.tags.length > 0
        ? postData.tags
            .slice(0, 5) // LinkedIn recommends max 5 hashtags
            .map((t) => `#${t.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '')}`)
            .join(' ')
        : '#WebDevelopment #Tech #Cybersecurity'

    // Step 3: Compose the post text (Human, organic tone)
    const cleanExcerpt = postData.excerpt.replace(/[\r\n]+/g, ' ').trim()
    const postText = `I recently put together some thoughts on ${postData.title}.\n\n${cleanExcerpt}\n\nIf you're interested in diving deeper, you can read the full piece on my blog here:\n${postData.blogUrl}\n\n${hashtags}`

    // Step 4: Create UGC Post via LinkedIn API
    const ugcPost = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: postText,
          },
          shareMediaCategory: 'ARTICLE',
          media: [
            {
              status: 'READY',
              description: {
                text: postData.excerpt || postData.title,
              },
              originalUrl: postData.blogUrl,
              title: {
                text: postData.title,
              },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }

    const response = await fetch(`${LINKEDIN_API_BASE}/ugcPosts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(ugcPost),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('[LinkedIn] Post creation failed:', response.status, errorBody)
      return {
        success: false,
        error: `LinkedIn API error ${response.status}: ${errorBody}`,
      }
    }

    const result = await response.json()
    // The ID looks like "urn:li:ugcPost:XXXXXXXX"
    const postId: string = result.id || ''
    const numericId = postId.split(':').pop() || ''

    console.log('[LinkedIn] Post created successfully:', postId)

    return {
      success: true,
      postId,
      postUrl: numericId
        ? `https://www.linkedin.com/feed/update/${encodeURIComponent(postId)}/`
        : undefined,
    }
  } catch (error: any) {
    console.error('[LinkedIn] Error sharing to LinkedIn:', error)
    return {
      success: false,
      error: error?.message || 'Unknown error while sharing to LinkedIn',
    }
  }
}

/**
 * Checks if the LinkedIn integration is configured and the token is valid.
 */
export async function checkLinkedInConnection(): Promise<{
  connected: boolean
  userName?: string
  error?: string
}> {
  const accessToken = await getAccessToken()

  if (!accessToken || accessToken === 'your-linkedin-access-token-here') {
    return {
      connected: false,
      error: 'Access token not configured',
    }
  }

  try {
    const response = await fetch(`${LINKEDIN_API_BASE}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      return {
        connected: false,
        error: `Token invalid or expired (${response.status})`,
      }
    }

    const data = await response.json()
    const name = [data.given_name, data.family_name].filter(Boolean).join(' ') || data.name || 'Unknown'

    return {
      connected: true,
      userName: name,
    }
  } catch (error: any) {
    return {
      connected: false,
      error: error?.message || 'Network error',
    }
  }
}
