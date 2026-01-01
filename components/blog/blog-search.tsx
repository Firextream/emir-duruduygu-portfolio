"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  category?: string
}

interface BlogSearchProps {
  posts: Post[]
  onFilter: (filteredPosts: Post[]) => void
  className?: string
}

export function BlogSearch({ posts, onFilter, className }: BlogSearchProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (value: string) => {
    setQuery(value)
    
    if (!value.trim()) {
      onFilter(posts)
      return
    }

    const searchTerm = value.toLowerCase()
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt?.toLowerCase().includes(searchTerm) ||
        post.category?.toLowerCase().includes(searchTerm)
    )
    onFilter(filtered)
  }

  const clearSearch = () => {
    setQuery("")
    onFilter(posts)
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 border rounded-lg transition-all duration-200",
          isFocused
            ? "border-accent bg-background shadow-sm"
            : "border-border bg-muted/30 hover:border-muted-foreground/30"
        )}
      >
        <Search size={18} className="text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search articles..."
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Clear search"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        )}
      </div>
      
      {query && (
        <p className="mt-2 text-sm text-muted-foreground">
          {posts.filter(p => 
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.excerpt?.toLowerCase().includes(query.toLowerCase())
          ).length} results found
        </p>
      )}
    </div>
  )
}
