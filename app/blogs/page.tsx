import Link from "next/link"

async function getBlogsDirect() {
  const { getDbService } = await import("@/lib/mongodb")
  const db = await getDbService()
  const blogs = await db.getBlogs(50, 0)
  return blogs || []
}

export default async function BlogsPage() {
  const blogs = await getBlogsDirect()

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">Insights, notes, and updates.</p>
      </header>

      {blogs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="space-y-5">
          {blogs.map((b: any) => (
            <Link
              key={b._id || b.id}
              href={`/blogs/${b._id || b.id}`}
              className="block rounded-lg border border-border/50 bg-card/30 p-5 hover:border-primary/60 hover:bg-card/50 transition-colors"
            >
              <h2 className="text-xl md:text-2xl font-serif font-semibold leading-snug">{b.title}</h2>
              {b.excerpt && (
                <p className="mt-2 text-sm md:text-base leading-relaxed text-muted-foreground">
                  {b.excerpt}
                </p>
              )}
              <div className="mt-3 text-xs md:text-sm text-muted-foreground">
                {b.createdAt && <time>{new Date(b.createdAt).toLocaleDateString()}</time>}
                {Array.isArray(b.tags) && b.tags.length > 0 && (
                  <span className="ml-3">{b.tags.slice(0, 3).join(' • ')}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}


