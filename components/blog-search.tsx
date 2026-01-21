"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, Loader2 } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  slug: string
  title: string
  excerpt?: string
  type: 'blog' | 'portfolio' | 'gallery'
}

interface BlogSearchProps {
  posts: SearchResult[]
  className?: string
}

export function BlogSearch({ posts, className = "" }: BlogSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const search = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    const lowerQuery = searchQuery.toLowerCase()
    
    const filtered = posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(lowerQuery)
      const excerptMatch = post.excerpt?.toLowerCase().includes(lowerQuery)
      return titleMatch || excerptMatch
    })

    setResults(filtered.slice(0, 5))
    setIsSearching(false)
  }, [posts])

  useEffect(() => {
    const debounce = setTimeout(() => {
      search(query)
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, search])

  // Keyboard shortcut: Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const getTypeHref = (result: SearchResult) => {
    switch (result.type) {
      case 'blog': return `/blog/${result.slug}`
      case 'portfolio': return `/portfolio/${result.slug}`
      case 'gallery': return `/gallery/${result.slug}`
      default: return `/blog/${result.slug}`
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-accent transition-colors text-muted-foreground hover:text-foreground"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-muted rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-x-4 top-[20%] max-w-xl mx-auto z-50 bg-background rounded-xl shadow-2xl border border-border overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts..."
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              {isSearching && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                <ul className="py-2">
                  {results.map((result) => (
                    <li key={`${result.type}-${result.slug}`}>
                      <Link
                        href={getTypeHref(result)}
                        onClick={() => setIsOpen(false)}
                        className="flex flex-col px-4 py-3 hover:bg-muted transition-colors"
                      >
                        <span className="text-xs text-accent uppercase tracking-wider">
                          {result.type}
                        </span>
                        <span className="font-medium">{result.title}</span>
                        {result.excerpt && (
                          <span className="text-sm text-muted-foreground line-clamp-1">
                            {result.excerpt}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : query.trim() ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No posts found
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  Type to search...
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
              <span className="flex items-center gap-4">
                <span><kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd> to select</span>
                <span><kbd className="px-1.5 py-0.5 bg-muted rounded">esc</kbd> to close</span>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
