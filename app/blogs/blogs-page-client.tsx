'use client'

import Link from "next/link"
import { useReadingList } from "@/components/reading-list-provider"
import { ReadingListSheet } from "@/components/reading-list-sheet"
import { useState } from "react"

interface BlogItem {
  id: string
  title: string
  excerpt?: string
  featuredImage?: string
  tags?: string[]
  createdAt: string | null
}

export function BlogsPageClient({ blogs }: { blogs: BlogItem[] }) {
  const { isSaved, toggleSave } = useReadingList()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Collect all unique tags
  const allTags = Array.from(
    new Set(blogs.flatMap((b) => (Array.isArray(b.tags) ? b.tags : [])))
  ).slice(0, 10)

  // Filter blogs
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTag = !selectedTag ||
      (Array.isArray(b.tags) && b.tags.includes(selectedTag))
    return matchesSearch && matchesTag
  })

  return (
    <>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Blog</h1>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">Insights, notes, and updates.</p>
          </div>
          <ReadingListSheet />
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                !selectedTag
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-slate-800/40 border-slate-700/30 text-slate-400 hover:border-slate-600/50 hover:text-slate-300'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                  selectedTag === tag
                    ? 'bg-primary/20 border-primary/40 text-primary'
                    : 'bg-slate-800/40 border-slate-700/30 text-slate-400 hover:border-slate-600/50 hover:text-slate-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Blog cards */}
      {filteredBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-sm text-slate-400">No articles match your filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedTag(null) }}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBlogs.map((b) => (
            <div
              key={b.id}
              className="group relative rounded-lg border border-border/50 bg-card/30 hover:border-primary/60 hover:bg-card/50 transition-colors overflow-hidden"
            >
              <Link href={`/blogs/${b.id}`} className="block">
                {b.featuredImage && (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={b.featuredImage}
                      alt={b.title || 'Blog cover'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-xl md:text-2xl font-serif font-semibold leading-snug">{b.title}</h2>
                  {b.excerpt && (
                    <p className="mt-2 text-sm md:text-base leading-relaxed text-muted-foreground line-clamp-2">
                      {b.excerpt}
                    </p>
                  )}
                  <div className="mt-3 text-xs md:text-sm text-muted-foreground">
                    {b.createdAt && <time>{new Date(b.createdAt).toLocaleDateString()}</time>}
                    {Array.isArray(b.tags) && b.tags.length > 0 && (
                      <span className="ml-3">{b.tags.slice(0, 3).join(' • ')}</span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Bookmark button on card */}
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleSave({ id: b.id, title: b.title, excerpt: b.excerpt, featuredImage: b.featuredImage })
                }}
                className={`absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-md transition-all duration-200 ${
                  isSaved(b.id)
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-black/40 text-white/70 border border-white/10 opacity-0 group-hover:opacity-100 hover:bg-black/60'
                }`}
                title={isSaved(b.id) ? 'Remove from reading list' : 'Save to reading list'}
              >
                <svg
                  className="w-4 h-4"
                  fill={isSaved(b.id) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={isSaved(b.id) ? 0 : 2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
