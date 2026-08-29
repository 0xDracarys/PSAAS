"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LinkedInShareButtonProps {
  blog: {
    _id?: string
    title: string
    excerpt?: string
    slug: string
    tags?: string[] | string
  }
  className?: string
}

type ShareStatus = "idle" | "loading" | "success" | "error" | "setup-required"

export function LinkedInShareButton({ blog, className = "" }: LinkedInShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>("idle")
  const [message, setMessage] = useState("")
  const [postUrl, setPostUrl] = useState<string | undefined>()

  const handleShare = async () => {
    if (status === "loading") return

    setStatus("loading")
    setMessage("")
    setPostUrl(undefined)

    try {
      const response = await fetch("/api/admin/share-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: blog._id,
          title: blog.title,
          excerpt: blog.excerpt || "",
          slug: blog.slug,
          tags: blog.tags,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage("Shared to LinkedIn! 🎉")
        setPostUrl(data.postUrl)
        // Reset to idle after 6 seconds
        setTimeout(() => {
          setStatus("idle")
          setMessage("")
          setPostUrl(undefined)
        }, 6000)
      } else if (data.setupRequired) {
        setStatus("setup-required")
        setMessage("LinkedIn token not configured. See .env setup guide.")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to share to LinkedIn")
        setTimeout(() => {
          setStatus("idle")
          setMessage("")
        }, 5000)
      }
    } catch (error: any) {
      setStatus("error")
      setMessage("Network error. Please try again.")
      setTimeout(() => {
        setStatus("idle")
        setMessage("")
      }, 4000)
    }
  }

  const buttonConfig = {
    idle: {
      bg: "bg-[#0A66C2] hover:bg-[#004182]",
      text: "Share to LinkedIn",
      icon: (
        <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    loading: {
      bg: "bg-[#0A66C2]/70 cursor-wait",
      text: "Posting...",
      icon: (
        <div className="h-4 w-4 mr-2 flex-shrink-0 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ),
    },
    success: {
      bg: "bg-green-600 hover:bg-green-700",
      text: "Posted!",
      icon: (
        <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: "bg-red-600 hover:bg-red-700",
      text: "Failed",
      icon: (
        <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    "setup-required": {
      bg: "bg-amber-600 hover:bg-amber-700",
      text: "Setup Required",
      icon: (
        <svg className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  }

  const config = buttonConfig[status]

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <motion.button
        type="button"
        onClick={handleShare}
        disabled={status === "loading"}
        whileHover={{ scale: status === "loading" ? 1 : 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-white transition-all duration-300 shadow-lg ${config.bg} ${className}`}
        aria-label={`Share "${blog.title}" to LinkedIn`}
      >
        {config.icon}
        {config.text}
      </motion.button>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`text-xs max-w-xs leading-tight ${
              status === "success"
                ? "text-green-400"
                : status === "setup-required"
                ? "text-amber-400"
                : "text-red-400"
            }`}
          >
            {message}
            {postUrl && (
              <a
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline text-blue-400 hover:text-blue-300"
              >
                View post ↗
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
