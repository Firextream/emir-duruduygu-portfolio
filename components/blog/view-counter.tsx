"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

interface ViewCounterProps {
  slug: string
  className?: string
}

// Local storage based view counter (no backend needed)
export function ViewCounter({ slug, className }: ViewCounterProps) {
  const [views, setViews] = useState<number>(0)
  const [hasViewed, setHasViewed] = useState(false)

  useEffect(() => {
    // Get all views from localStorage
    const allViews = JSON.parse(localStorage.getItem("blog-views") || "{}")
    const currentViews = allViews[slug] || Math.floor(Math.random() * 50) + 10 // Start with random initial views
    
    // Check if user has already viewed this post in this session
    const viewedPosts = JSON.parse(sessionStorage.getItem("viewed-posts") || "[]")
    const alreadyViewed = viewedPosts.includes(slug)
    
    if (!alreadyViewed) {
      // Increment view count
      const newViews = currentViews + 1
      allViews[slug] = newViews
      localStorage.setItem("blog-views", JSON.stringify(allViews))
      
      // Mark as viewed in this session
      viewedPosts.push(slug)
      sessionStorage.setItem("viewed-posts", JSON.stringify(viewedPosts))
      
      setViews(newViews)
    } else {
      setViews(currentViews)
    }
    
    setHasViewed(true)
  }, [slug])

  if (!hasViewed) {
    return (
      <span className={className}>
        <Eye className="w-4 h-4 inline mr-1" />
        <span className="animate-pulse">...</span>
      </span>
    )
  }

  return (
    <span className={className}>
      <Eye className="w-4 h-4 inline mr-1" />
      {views.toLocaleString()} views
    </span>
  )
}
