"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, List } from "lucide-react"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  items: TOCItem[]
  className?: string
}

export function TableOfContents({ items, className = "" }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true)

  if (items.length === 0) return null

  return (
    <nav 
      aria-label="Table of contents"
      className={`bg-muted/30 rounded-lg border border-border p-4 ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium"
      >
        <span className="flex items-center gap-2">
          <List className="w-4 h-4" />
          Table of Contents
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      
      {isOpen && (
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}
            >
              <a
                href={`#${item.id}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block py-1 border-l-2 border-transparent hover:border-accent pl-3 -ml-3"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

// Helper function to extract headings from HTML content
export function extractTOCItems(content: string): TOCItem[] {
  const headingRegex = /<h([2-4])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[2-4]>/gi
  const items: TOCItem[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    items.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].trim(),
    })
  }

  return items
}
