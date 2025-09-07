import { NextRequest, NextResponse } from 'next/server'
import { dbService } from '@/lib/mongodb'

// GET - Fetch single blog
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await dbService.getBlogById(params.id)

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await dbService.incrementBlogViews(params.id)

    return NextResponse.json({
      success: true,
      blog
    })
  } catch (error) {
    console.error('[API] Error fetching blog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

// PUT - Update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      tags,
      status,
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

    const updateData = {
      title,
      slug,
      excerpt: excerpt || '',
      content,
      featuredImage: featuredImage || '',
      tags: tags || [],
      status: status || 'draft',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      keywords: keywords || '',
      updatedAt: new Date()
    }

    const success = await dbService.updateBlog(params.id, updateData)

    if (!success) {
      return NextResponse.json(
        { error: 'Blog not found or update failed' },
        { status: 404 }
      )
    }

    console.log('[API] Blog updated:', { id: params.id, title })

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully'
    })
  } catch (error) {
    console.error('[API] Error updating blog:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await dbService.deleteBlog(params.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Blog not found or deletion failed' },
        { status: 404 }
      )
    }

    console.log('[API] Blog deleted:', { id: params.id })

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    })
  } catch (error) {
    console.error('[API] Error deleting blog:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}




