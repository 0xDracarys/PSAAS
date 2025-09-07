import { notFound } from "next/navigation"

async function getBlogDirect(id: string) {
  const { getDbService } = await import("@/lib/mongodb")
  const db = await getDbService()
  const blogs = await db.getBlogs(100, 0)
  return blogs.find((b: any) => (b._id || b.id) === id) || null
}

export default async function BlogDetail({ params }: { params: { id: string } }) {
  const blog = await getBlogDirect(params.id)
  if (!blog) return notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">{blog.title}</h1>
      {blog.excerpt && <p className="mb-6 text-muted-foreground">{blog.excerpt}</p>}
      <article className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: blog.content || '' }} />
      </article>
    </main>
  )
}


