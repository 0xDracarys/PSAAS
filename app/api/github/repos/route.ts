import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username') || '0xDracarys'
    const sort = searchParams.get('sort') || 'updated' // updated, stars, created
    const perPage = parseInt(searchParams.get('per_page') || '100')
    
    // Fetch repositories from GitHub API
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=${sort}&per_page=${perPage}&type=owner`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Optional: Add GitHub token for higher rate limits
          // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos = await response.json()

    // Transform GitHub data to our format
    const transformedRepos = repos
      .filter((repo: any) => !repo.fork) // Exclude forked repos
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        title: repo.name.split('-').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        description: repo.description || 'No description available',
        url: repo.html_url,
        homepage: repo.homepage,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        watchers: repo.watchers_count,
        language: repo.language,
        topics: repo.topics || [],
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        size: repo.size,
        isPrivate: repo.private,
      }))

    return NextResponse.json({
      success: true,
      repos: transformedRepos,
      count: transformedRepos.length,
      username: username,
    })
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch GitHub repositories',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
