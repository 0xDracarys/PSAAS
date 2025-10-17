import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export interface GitHubProjectSettings {
  repoId: number
  repoName: string
  visibility: 'public' | 'private' | 'hidden' // public = show on site, private = admin only, hidden = don't show
  category: string // Auto-generated or manually set
  customTitle?: string
  customDescription?: string
  featured?: boolean
  displayOrder?: number
  tags?: string[]
  updatedAt: string
}

// GET - Retrieve GitHub project settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const repoId = searchParams.get('repoId')
    const visibilityFilter = searchParams.get('visibility')

    const { db } = await connectToDatabase()
    const collection = db.collection<GitHubProjectSettings>('github_projects')

    let query: any = {}
    if (repoId) {
      query.repoId = parseInt(repoId)
    }
    if (visibilityFilter) {
      query.visibility = visibilityFilter
    }

    const settings = repoId 
      ? await collection.findOne(query)
      : await collection.find(query).toArray()

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error) {
    console.error('Error fetching GitHub project settings:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch settings',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST - Create or update GitHub project settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { repoId, repoName, visibility, category, customTitle, customDescription, featured, displayOrder, tags } = body

    if (!repoId || !repoName) {
      return NextResponse.json(
        { success: false, error: 'repoId and repoName are required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<GitHubProjectSettings>('github_projects')

    const settings: GitHubProjectSettings = {
      repoId,
      repoName,
      visibility: visibility || 'public',
      category: category || 'Uncategorized',
      customTitle,
      customDescription,
      featured: featured || false,
      displayOrder: displayOrder || 0,
      tags: tags || [],
      updatedAt: new Date().toISOString(),
    }

    const result = await collection.updateOne(
      { repoId },
      { $set: settings },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: result.upsertedCount > 0 ? 'Settings created' : 'Settings updated',
      settings,
    })
  } catch (error) {
    console.error('Error saving GitHub project settings:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save settings',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// DELETE - Remove GitHub project settings (revert to default)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const repoId = searchParams.get('repoId')

    if (!repoId) {
      return NextResponse.json(
        { success: false, error: 'repoId is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<GitHubProjectSettings>('github_projects')

    const result = await collection.deleteOne({ repoId: parseInt(repoId) })

    return NextResponse.json({
      success: true,
      message: result.deletedCount > 0 ? 'Settings deleted' : 'No settings found',
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    console.error('Error deleting GitHub project settings:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete settings',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
