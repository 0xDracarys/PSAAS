'use client'

import { useReadingList } from './reading-list-provider'
import { useState } from 'react'

interface BlogInteractionsProps {
  blogId: string
  title: string
  excerpt?: string
  featuredImage?: string
  blogUrl: string
}

export function BlogInteractions({ blogId, title, excerpt, featuredImage, blogUrl }: BlogInteractionsProps) {
  const { isSaved, toggleSave } = useReadingList()
  const saved = isSaved(blogId)
  const [copied, setCopied] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(blogUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input')
      input.value = blogUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Check out this article: "${title}" `)
    const url = encodeURIComponent(blogUrl)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(blogUrl)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-slate-900/90 backdrop-blur-lg border border-slate-700/60 shadow-2xl shadow-black/40">
        {/* Bookmark Button */}
        <button
          onClick={() => toggleSave({ id: blogId, title, excerpt, featuredImage })}
          className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
            saved
              ? 'bg-amber-500/20 text-amber-400'
              : 'hover:bg-slate-700/60 text-slate-400 hover:text-white'
          }`}
          title={saved ? 'Remove from reading list' : 'Save to reading list'}
        >
          <svg
            className="w-5 h-5 transition-transform duration-200 group-active:scale-90"
            fill={saved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={saved ? 0 : 2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {/* Tooltip */}
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-slate-800 text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {saved ? 'Saved!' : 'Save'}
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-700/60" />

        {/* Share Menu */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="group relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-700/60 text-slate-400 hover:text-white transition-all duration-300"
            title="Share"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-slate-800 text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Share
            </span>
          </button>

          {/* Share Dropdown */}
          {showShareMenu && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col gap-1 p-2 rounded-xl bg-slate-900/95 backdrop-blur-lg border border-slate-700/60 shadow-xl min-w-[160px] animate-in slide-in-from-bottom-2">
              <button
                onClick={() => { handleCopyLink(); setShowShareMenu(false) }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 text-sm text-slate-300 hover:text-white transition-colors"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
                {copied ? 'Copied!' : 'Copy link'}
              </button>
              <button
                onClick={() => { shareToTwitter(); setShowShareMenu(false) }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 text-sm text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </button>
              <button
                onClick={() => { shareToLinkedIn(); setShowShareMenu(false) }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 text-sm text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Share on LinkedIn
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-700/60" />

        {/* Scroll to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-700/60 text-slate-400 hover:text-white transition-all duration-300"
          title="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-slate-800 text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Top
          </span>
        </button>
      </div>
    </div>
  )
}
