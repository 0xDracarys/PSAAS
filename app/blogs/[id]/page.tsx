import { notFound } from "next/navigation"

// Force dynamic rendering - don't try to fetch data at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getBlogDirect(id: string) {
  const { getDbService } = await import("@/lib/mongodb")
  const db = await getDbService()
  const blogs = await db.getBlogs(100, 0)
  return blogs.find((b: any) => (b._id?.toString() || b.id?.toString()) === id) || null
}

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'

export default async function BlogDetail({ params }: { params: { id: string } }) {
  const blog = await getBlogDirect(params.id)
  if (!blog) return notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {blog.featuredImage && (
        <div className="relative w-full h-64 md:h-80 mb-8 rounded-xl overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={blog.title || 'Blog cover image'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h1 className="mb-2 text-3xl font-bold">{blog.title}</h1>
      {blog.excerpt && <p className="mb-6 text-muted-foreground">{blog.excerpt}</p>}
      {Array.isArray(blog.tags) && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags.map((tag: string, i: number) => (
            <span key={i} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
              {tag}
            </span>
          ))}
        </div>
      )}
      <article className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {blog.content || ''}
        </ReactMarkdown>
      </article>
    </main>
  )
}


