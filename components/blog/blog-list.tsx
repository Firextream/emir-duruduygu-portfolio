"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { PostListItem } from "@/components/blog/post-list-item"
import { cn } from "@/lib/utils"

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  date?: string | null
  category?: string
  image?: string | null
  readTime?: string
}

interface BlogListProps {
  posts: Post[]
  categories: string[]
}

export function BlogList({ posts, categories }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter((p) => p.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          (p.excerpt || "").toLowerCase().includes(query) ||
          (p.category || "").toLowerCase().includes(query),
      )
    }

    return filtered
  }, [posts, activeCategory, searchQuery])

  return (
    <div>
      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12 pb-8 border-b border-border">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b border-border focus:border-accent pl-8 pb-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setActiveCategory(null)}
            className={cn(
              "font-mono text-sm tracking-wider uppercase transition-colors",
              activeCategory === null 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(activeCategory === category ? null : category)}
              className={cn(
                "font-mono text-sm tracking-wider uppercase transition-colors",
                activeCategory === category 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="divide-y divide-border">
        {filteredPosts.map((post, index) => (
          <PostListItem key={post.id} post={post} index={index} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-24">
          <p className="font-serif text-2xl text-muted-foreground mb-2">
            {searchQuery ? "No posts match your search" : "No posts found"}
          </p>
          <p className="text-muted-foreground">
            {searchQuery ? "Try adjusting your search terms." : "Check back soon for new content."}
          </p>
        </div>
      )}
    </div>
  )
}
