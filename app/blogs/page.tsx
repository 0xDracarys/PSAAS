import Link from "next/link"
import { BlogsPageClient } from "./blogs-page-client"

// Force dynamic rendering - don't try to fetch data at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getBlogsDirect() {
  const { getDbService } = await import("@/lib/mongodb")
  const db = await getDbService()
  const blogs = await db.getBlogs(50, 0)
  return blogs || []
}

export default async function BlogsPage() {
  const blogs = await getBlogsDirect()

  // Serialize blog data for client components
  const serializedBlogs = blogs.map((b: any) => ({
    id: (b._id || b.id)?.toString(),
    title: b.title,
    excerpt: b.excerpt,
    featuredImage: b.featuredImage,
    tags: b.tags,
    createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : null,
  }))

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <BlogsPageClient blogs={serializedBlogs} />
    </main>
  )
}
