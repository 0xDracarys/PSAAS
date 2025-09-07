import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  once?: boolean
  margin?: string
  threshold?: number
}

export function useInView(
  ref: React.RefObject<HTMLElement>,
  options: UseInViewOptions = {}
) {
  const [isInView, setIsInView] = useState(false)
  const { once = false, margin = '0px', threshold = 0 } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) {
            observer.disconnect()
          }
        } else if (!once) {
          setIsInView(false)
        }
      },
      {
        rootMargin: margin,
        threshold,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, once, margin, threshold])

  return isInView
}
