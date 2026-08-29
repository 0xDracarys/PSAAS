'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface SavedBlog {
  id: string
  title: string
  excerpt?: string
  featuredImage?: string
  savedAt: string
}

interface ReadingListContextType {
  savedBlogs: SavedBlog[]
  isSaved: (id: string) => boolean
  toggleSave: (blog: { id: string; title: string; excerpt?: string; featuredImage?: string }) => void
  removeSaved: (id: string) => void
  clearAll: () => void
}

const ReadingListContext = createContext<ReadingListContextType | undefined>(undefined)

const STORAGE_KEY = 'dracarys-reading-list'

export function ReadingListProvider({ children }: { children: React.ReactNode }) {
  const [savedBlogs, setSavedBlogs] = useState<SavedBlog[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSavedBlogs(JSON.parse(stored))
      }
    } catch {
      // Ignore parse errors
    }
    setLoaded(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBlogs))
    }
  }, [savedBlogs, loaded])

  const isSaved = useCallback(
    (id: string) => savedBlogs.some((b) => b.id === id),
    [savedBlogs]
  )

  const toggleSave = useCallback(
    (blog: { id: string; title: string; excerpt?: string; featuredImage?: string }) => {
      setSavedBlogs((prev) => {
        const exists = prev.some((b) => b.id === blog.id)
        if (exists) {
          return prev.filter((b) => b.id !== blog.id)
        }
        return [{ ...blog, savedAt: new Date().toISOString() }, ...prev]
      })
    },
    []
  )

  const removeSaved = useCallback((id: string) => {
    setSavedBlogs((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setSavedBlogs([])
  }, [])

  return (
    <ReadingListContext.Provider value={{ savedBlogs, isSaved, toggleSave, removeSaved, clearAll }}>
      {children}
    </ReadingListContext.Provider>
  )
}

export function useReadingList() {
  const context = useContext(ReadingListContext)
  if (!context) {
    throw new Error('useReadingList must be used within a ReadingListProvider')
  }
  return context
}
