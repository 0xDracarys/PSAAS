import { NextRequest, NextResponse } from 'next/server'

// Intelligent categorization based on repository analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { repos } = body

    if (!Array.isArray(repos)) {
      return NextResponse.json(
        { success: false, error: 'repos array is required' },
        { status: 400 }
      )
    }

    const categorizedRepos = repos.map((repo: any) => {
      const category = determineCategory(repo)
      return {
        ...repo,
        category,
      }
    })

    return NextResponse.json({
      success: true,
      repos: categorizedRepos,
    })
  } catch (error) {
    console.error('Error categorizing repos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to categorize repositories',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

function determineCategory(repo: any): string {
  const name = repo.name.toLowerCase()
  const description = (repo.description || '').toLowerCase()
  const topics = (repo.topics || []).map((t: string) => t.toLowerCase())
  const language = (repo.language || '').toLowerCase()

  // Combine all text for analysis
  const allText = `${name} ${description} ${topics.join(' ')}`

  // Security & Cybersecurity
  if (
    allText.includes('security') ||
    allText.includes('penetration') ||
    allText.includes('vulnerability') ||
    allText.includes('exploit') ||
    allText.includes('ctf') ||
    allText.includes('hack') ||
    allText.includes('bug') ||
    allText.includes('pentest') ||
    allText.includes('osint') ||
    allText.includes('malware') ||
    topics.includes('security') ||
    topics.includes('cybersecurity')
  ) {
    return 'Security & Cybersecurity'
  }

  // Web Development
  if (
    language === 'html' ||
    language === 'css' ||
    language === 'javascript' ||
    language === 'typescript' ||
    allText.includes('website') ||
    allText.includes('web app') ||
    allText.includes('frontend') ||
    allText.includes('backend') ||
    allText.includes('react') ||
    allText.includes('next') ||
    allText.includes('vue') ||
    allText.includes('angular') ||
    topics.includes('web') ||
    topics.includes('frontend') ||
    topics.includes('backend')
  ) {
    return 'Web Development'
  }

  // Mobile Development
  if (
    language === 'swift' ||
    language === 'kotlin' ||
    language === 'dart' ||
    allText.includes('android') ||
    allText.includes('ios') ||
    allText.includes('mobile') ||
    allText.includes('flutter') ||
    allText.includes('react native') ||
    topics.includes('mobile') ||
    topics.includes('android') ||
    topics.includes('ios')
  ) {
    return 'Mobile Development'
  }

  // AI & Machine Learning
  if (
    allText.includes('machine learning') ||
    allText.includes('deep learning') ||
    allText.includes('neural network') ||
    allText.includes('ai ') ||
    allText.includes('artificial intelligence') ||
    allText.includes('ml ') ||
    allText.includes('nlp') ||
    allText.includes('computer vision') ||
    allText.includes('tensorflow') ||
    allText.includes('pytorch') ||
    topics.includes('machine-learning') ||
    topics.includes('ai') ||
    topics.includes('deep-learning')
  ) {
    return 'AI & Machine Learning'
  }

  // Data Science & Analytics
  if (
    language === 'python' ||
    language === 'r' ||
    allText.includes('data science') ||
    allText.includes('analytics') ||
    allText.includes('data analysis') ||
    allText.includes('visualization') ||
    allText.includes('pandas') ||
    allText.includes('numpy') ||
    topics.includes('data-science') ||
    topics.includes('analytics')
  ) {
    return 'Data Science & Analytics'
  }

  // DevOps & Infrastructure
  if (
    allText.includes('devops') ||
    allText.includes('docker') ||
    allText.includes('kubernetes') ||
    allText.includes('ci/cd') ||
    allText.includes('deployment') ||
    allText.includes('infrastructure') ||
    allText.includes('cloud') ||
    allText.includes('aws') ||
    allText.includes('azure') ||
    topics.includes('devops') ||
    topics.includes('docker') ||
    topics.includes('kubernetes')
  ) {
    return 'DevOps & Infrastructure'
  }

  // Blockchain & Crypto
  if (
    allText.includes('blockchain') ||
    allText.includes('crypto') ||
    allText.includes('ethereum') ||
    allText.includes('bitcoin') ||
    allText.includes('web3') ||
    allText.includes('smart contract') ||
    allText.includes('solidity') ||
    topics.includes('blockchain') ||
    topics.includes('cryptocurrency')
  ) {
    return 'Blockchain & Web3'
  }

  // Game Development
  if (
    allText.includes('game') ||
    allText.includes('unity') ||
    allText.includes('unreal') ||
    allText.includes('godot') ||
    topics.includes('game') ||
    topics.includes('gamedev')
  ) {
    return 'Game Development'
  }

  // API & Backend Services
  if (
    allText.includes('api') ||
    allText.includes('rest') ||
    allText.includes('graphql') ||
    allText.includes('microservice') ||
    allText.includes('server') ||
    topics.includes('api') ||
    topics.includes('rest-api')
  ) {
    return 'API & Backend Services'
  }

  // Tools & Utilities
  if (
    allText.includes('tool') ||
    allText.includes('utility') ||
    allText.includes('script') ||
    allText.includes('automation') ||
    allText.includes('cli') ||
    topics.includes('cli') ||
    topics.includes('tool')
  ) {
    return 'Tools & Utilities'
  }

  // Educational & Tutorials
  if (
    allText.includes('tutorial') ||
    allText.includes('learning') ||
    allText.includes('course') ||
    allText.includes('example') ||
    allText.includes('demo') ||
    topics.includes('tutorial') ||
    topics.includes('education')
  ) {
    return 'Educational & Tutorials'
  }

  // Portfolio & Personal
  if (
    allText.includes('portfolio') ||
    allText.includes('personal') ||
    allText.includes('resume') ||
    allText.includes('cv') ||
    topics.includes('portfolio')
  ) {
    return 'Portfolio & Personal'
  }

  // Default category
  return 'Other'
}
