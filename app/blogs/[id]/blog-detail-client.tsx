'use client'

import { ReadingProgress } from '@/components/reading-progress'
import { BlogInteractions } from '@/components/blog-interactions'

interface BlogDetailClientProps {
  blogId: string
  title: string
  excerpt?: string
  featuredImage?: string
  blogUrl: string
}

export function BlogDetailClient({ blogId, title, excerpt, featuredImage, blogUrl }: BlogDetailClientProps) {
  return (
    <>
      <ReadingProgress />
      <BlogInteractions
        blogId={blogId}
        title={title}
        excerpt={excerpt}
        featuredImage={featuredImage}
        blogUrl={blogUrl}
      />
    </>
  )
}
