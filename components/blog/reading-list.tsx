"use client"

import { useState, useEffect } from "react"
import { Bookmark, BookmarkCheck, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ReadingListButtonProps {
  post: {
    slug: string
    title: string
    excerpt?: string
  }
  className?: string
  showLabel?: boolean
}

interface SavedPost {
  slug: string
  title: string
  excerpt?: string
  savedAt: string
}

export function ReadingListButton({ post, className, showLabel = false }: ReadingListButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("reading-list") || "[]")
    setIsSaved(saved.some((p: SavedPost) => p.slug === post.slug))
  }, [post.slug])

  const toggleSave = () => {
    const saved: SavedPost[] = JSON.parse(localStorage.getItem("reading-list") || "[]")
    
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    
    if (isSaved) {
      // Remove from list
      const newList = saved.filter(p => p.slug !== post.slug)
      localStorage.setItem("reading-list", JSON.stringify(newList))
      setIsSaved(false)
    } else {
      // Add to list
      const newPost: SavedPost = {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        savedAt: new Date().toISOString()
      }
      saved.unshift(newPost)
      localStorage.setItem("reading-list", JSON.stringify(saved))
      setIsSaved(true)
    }
    
    // Dispatch custom event for reading list updates
    window.dispatchEvent(new CustomEvent("reading-list-updated"))
  }

  return (
    <button
      onClick={toggleSave}
      className={cn(
        "flex items-center gap-2 transition-all duration-300",
        "text-muted-foreground hover:text-accent",
        isAnimating && "scale-110",
        className
      )}
      aria-label={isSaved ? "Remove from reading list" : "Add to reading list"}
      title={isSaved ? "Remove from reading list" : "Save for later"}
    >
      {isSaved ? (
        <BookmarkCheck className={cn(
          "w-5 h-5 text-accent",
          isAnimating && "animate-bounce-once"
        )} />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
      {showLabel && (
        <span className="text-sm">
          {isSaved ? "Saved" : "Save"}
        </span>
      )}
    </button>
  )
}

// Reading List Dropdown/Panel
export function ReadingListPanel({ className }: { className?: string }) {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const loadSaved = () => {
      const saved = JSON.parse(localStorage.getItem("reading-list") || "[]")
      setSavedPosts(saved)
    }
    
    loadSaved()
    window.addEventListener("reading-list-updated", loadSaved)
    return () => window.removeEventListener("reading-list-updated", loadSaved)
  }, [])

  const removePost = (slug: string) => {
    const newList = savedPosts.filter(p => p.slug !== slug)
    localStorage.setItem("reading-list", JSON.stringify(newList))
    setSavedPosts(newList)
    window.dispatchEvent(new CustomEvent("reading-list-updated"))
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`Reading list (${savedPosts.length} items)`}
      >
        <Bookmark className="w-5 h-5" />
        {savedPosts.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-background text-[10px] font-mono rounded-full flex items-center justify-center">
            {savedPosts.length}
          </span>
        )}
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-background border border-border rounded-lg shadow-xl z-50">
            <div className="p-4 border-b border-border">
              <h3 className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                Reading List ({savedPosts.length})
              </h3>
            </div>
            
            {savedPosts.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No saved posts yet</p>
                <p className="text-xs mt-1">Click the bookmark icon on any post to save it for later</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {savedPosts.map((post) => (
                  <li key={post.slug} className="group relative">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block p-4 hover:bg-muted/50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <h4 className="font-medium text-sm text-foreground line-clamp-2 pr-8">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {post.excerpt}
                        </p>
                      )}
                    </Link>
                    <button
                      onClick={() => removePost(post.slug)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove from reading list"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
