'use client'

import { useReadingList } from './reading-list-provider'
import Link from 'next/link'
import { useState } from 'react'

export function ReadingListSheet() {
  const { savedBlogs, removeSaved, clearAll } = useReadingList()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:border-primary/50 hover:bg-slate-800/80 text-sm text-slate-300 hover:text-white transition-all duration-300"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        My Reading List
        {savedBlogs.length > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-white">
            {savedBlogs.length}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sheet */}
      <div
        className={`fixed top-0 right-0 z-[100] h-full w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h2 className="text-lg font-semibold text-white">My Reading List</h2>
            <p className="text-xs text-slate-400 mt-1">
              {savedBlogs.length} {savedBlogs.length === 1 ? 'article' : 'articles'} saved
            </p>
          </div>
          <div className="flex items-center gap-2">
            {savedBlogs.length > 0 && (
              <button
                onClick={clearAll}
                className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-80px)] p-4">
          {savedBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-slate-400 text-sm">No articles saved yet.</p>
              <p className="text-slate-500 text-xs mt-1">
                Click the bookmark icon on any article to save it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="group relative flex gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/60 transition-all duration-200"
                >
                  {/* Thumbnail */}
                  {blog.featuredImage && (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                      <img
                        src={blog.featuredImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/blogs/${blog.id}`}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-white hover:text-primary transition-colors line-clamp-2"
                    >
                      {blog.title}
                    </Link>
                    {blog.excerpt && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{blog.excerpt}</p>
                    )}
                    <p className="text-[10px] text-slate-500 mt-1">
                      Saved {new Date(blog.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Remove */}
                  <button
                    onClick={() => removeSaved(blog.id)}
                    className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                    title="Remove"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
