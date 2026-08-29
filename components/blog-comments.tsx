'use client'

import { useState, useEffect, useCallback } from 'react'

interface Comment {
  id: string
  author: string
  message: string
  upvotes: number
  createdAt: string
}

interface BlogCommentsProps {
  blogId: string
}

// Sanitize user input client-side (defense in depth)
function sanitize(input: string, maxLen: number): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .substring(0, maxLen)
}

export function BlogComments({ blogId }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set())

  // Load upvoted IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`dracarys-upvotes-${blogId}`)
      if (stored) setUpvotedIds(new Set(JSON.parse(stored)))
    } catch {}
  }, [blogId])

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err)
    } finally {
      setLoading(false)
    }
  }, [blogId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    const cleanAuthor = sanitize(author, 50)
    const cleanMessage = sanitize(message, 2000)

    if (!cleanAuthor || cleanAuthor.length < 1) {
      setError('Please enter your name.')
      return
    }
    if (!cleanMessage || cleanMessage.length < 2) {
      setError('Please write a longer comment.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: cleanAuthor, message: cleanMessage }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to post comment.')
        return
      }

      const data = await res.json()
      setComments((prev) => [data.comment, ...prev])
      setAuthor('')
      setMessage('')
      setSuccessMsg('Comment posted!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpvote = async (commentId: string) => {
    if (upvotedIds.has(commentId)) return // Already upvoted

    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      })

      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c))
        )
        const newUpvoted = new Set(upvotedIds).add(commentId)
        setUpvotedIds(newUpvoted)
        localStorage.setItem(`dracarys-upvotes-${blogId}`, JSON.stringify([...newUpvoted]))
      }
    } catch {
      // Silently fail
    }
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <section className="mt-12 border-t border-slate-700/50 pt-10">
      <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Discussion
        <span className="text-sm font-normal text-muted-foreground">
          ({comments.length} {comments.length === 1 ? 'comment' : 'comments'})
        </span>
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-xl bg-slate-800/30 border border-slate-700/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="comment-author" className="text-xs text-slate-400 mb-1 block">Your Name</label>
            <input
              id="comment-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={50}
              placeholder="John Doe"
              className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/50 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
              disabled={submitting}
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="comment-message" className="text-xs text-slate-400 mb-1 block">Your Comment</label>
          <textarea
            id="comment-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Share your thoughts on this article..."
            className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/50 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            disabled={submitting}
          />
          <p className="text-[10px] text-slate-600 mt-1 text-right">{message.length}/2000</p>
        </div>

        {error && (
          <p className="text-xs text-red-400 mb-3 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </p>
        )}
        {successMsg && (
          <p className="text-xs text-green-400 mb-3 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {successMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:border-slate-600/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-purple-500/40 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {comment.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{comment.author}</p>
                    <p className="text-[10px] text-slate-500">{timeAgo(comment.createdAt)}</p>
                  </div>
                </div>

                {/* Upvote */}
                <button
                  onClick={() => handleUpvote(comment.id)}
                  disabled={upvotedIds.has(comment.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all ${
                    upvotedIds.has(comment.id)
                      ? 'bg-primary/15 text-primary cursor-default'
                      : 'bg-slate-700/30 text-slate-400 hover:bg-primary/10 hover:text-primary cursor-pointer'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill={upvotedIds.has(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {comment.upvotes > 0 && comment.upvotes}
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{comment.message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
