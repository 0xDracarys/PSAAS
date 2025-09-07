import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/mongodb'

// GET - Fetch all blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    let blogs
    if (status) {
      blogs = await dbService.getBlogs(limit, skip, { status })
    } else {
      blogs = await dbService.getBlogs(limit, skip)
    }

    console.log(`✅ Loaded ${blogs.length} blogs from database`)

    return NextResponse.json({
      success: true,
      blogs,
      pagination: {
        limit,
        skip,
        total: blogs.length
      }
    })
  } catch (error) {
    console.error('[API] Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// POST - Create new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      tags,
      status = 'draft',
      metaTitle,
      metaDescription,
      keywords
    } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 }
      )
    }

    const blogData = {
      title,
      slug,
      excerpt: excerpt || '',
      content,
      featuredImage: featuredImage || '',
      tags: tags || [],
      status,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      keywords: keywords || '',
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const blogId = await dbService.createBlog(blogData)

    console.log('[API] Blog created:', { id: blogId, title })

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      blogId
    })
  } catch (error) {
    console.error('[API] Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}




