"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search as SearchIcon, X, ArrowRight, FileText, Image, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SearchResult {
  id: string
  type: "blog" | "gallery" | "portfolio" | "page"
  title: string
  excerpt?: string
  url: string
  category?: string
}

interface SearchProps {
  className?: string
}

// Mock search data - in production, this would come from an API
const searchableContent: SearchResult[] = [
  // Pages
  { id: "page-home", type: "page", title: "Home", url: "/" },
  { id: "page-about", type: "page", title: "About", excerpt: "Learn more about Duruduygu", url: "/about" },
  { id: "page-portfolio", type: "page", title: "Portfolio", excerpt: "A curated collection of projects", url: "/portfolio" },
  { id: "page-gallery", type: "page", title: "Gallery", excerpt: "Photography collection", url: "/gallery" },
  { id: "page-blog", type: "page", title: "Blog", excerpt: "Thoughts and stories", url: "/blog" },
  { id: "page-contact", type: "page", title: "Contact", excerpt: "Get in touch", url: "/contact" },
  { id: "page-resume", type: "page", title: "Resume", excerpt: "Professional background", url: "/resume" },
]

export function SearchButton({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground",
          "border border-border rounded-lg hover:border-accent/50 hover:text-foreground",
          "transition-all duration-200",
          className
        )}
        aria-label="Search (Ctrl+K)"
      >
        <SearchIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">
          <span>⌘</span>K
        </kbd>
      </button>

      {isOpen && <SearchModal onClose={() => setIsOpen(false)} />}
    </>
  )
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchQuery = query.toLowerCase()
    const filtered = searchableContent.filter(
      item =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.excerpt?.toLowerCase().includes(searchQuery) ||
        item.category?.toLowerCase().includes(searchQuery)
    )

    setResults(filtered)
    setSelectedIndex(0)
  }, [query])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault()
      window.location.href = results[selectedIndex].url
      onClose()
    }
  }, [results, selectedIndex, onClose])

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "blog": return <FileText className="w-4 h-4" />
      case "gallery": return <Image className="w-4 h-4" />
      case "portfolio": return <Folder className="w-4 h-4" />
      default: return <ArrowRight className="w-4 h-4" />
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-xl z-50">
        <div className="bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <SearchIcon className="w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search posts, pages, projects..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
            />
            <button
              onClick={onClose}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-80 overflow-y-auto">
            {query && results.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <SearchIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">Try different keywords</p>
              </div>
            ) : results.length > 0 ? (
              <ul className="py-2">
                {results.map((result, index) => (
                  <li key={result.id}>
                    <Link
                      href={result.url}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 transition-colors",
                        index === selectedIndex
                          ? "bg-accent/10 text-foreground"
                          : "text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {result.title}
                        </p>
                        {result.excerpt && (
                          <p className="text-sm text-muted-foreground truncate">
                            {result.excerpt}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-mono text-muted-foreground capitalize">
                        {result.type}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
                  Quick Links
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {searchableContent.filter(c => c.type === "page").map((page) => (
                    <Link
                      key={page.id}
                      href={page.url}
                      onClick={onClose}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {page.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">↑↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd> select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded">esc</kbd> close
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { SearchModal }
