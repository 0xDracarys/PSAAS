import { NextRequest, NextResponse } from 'next/server'
import { shareToLinkedIn } from '@/lib/linkedin'

/**
 * POST /api/admin/share-linkedin
 *
 * Shares a blog post to LinkedIn.
 *
 * Request body:
 * {
 *   blogId: string,       // The blog's MongoDB ID (for reference)
 *   title: string,        // Blog post title
 *   excerpt: string,      // Short description / summary
 *   slug: string,         // Blog URL slug
 *   tags: string[],       // Blog tags for hashtags
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { blogId, title, excerpt, slug, tags } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug' },
        { status: 400 }
      )
    }

    // Build the public URL of the blog post
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXTAUTH_URL ||
      'https://dracarys.space'

    const blogUrl = `${siteUrl}/blogs/${slug}`

    console.log(`[ShareLinkedIn] Sharing blog "${title}" to LinkedIn`)
    console.log(`[ShareLinkedIn] Blog URL: ${blogUrl}`)

    const result = await shareToLinkedIn({
      title,
      excerpt: excerpt || title,
      blogUrl,
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [],
    })

    if (!result.success) {
      console.error('[ShareLinkedIn] Failed:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          setupRequired: result.error?.includes('LINKEDIN_ACCESS_TOKEN'),
        },
        { status: 500 }
      )
    }

    console.log('[ShareLinkedIn] Successfully shared! Post ID:', result.postId)

    return NextResponse.json({
      success: true,
      message: 'Blog post shared to LinkedIn successfully!',
      postId: result.postId,
      postUrl: result.postUrl,
      blogUrl,
    })
  } catch (error: any) {
    console.error('[ShareLinkedIn] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error while sharing to LinkedIn' },
      { status: 500 }
    )
  }
}
