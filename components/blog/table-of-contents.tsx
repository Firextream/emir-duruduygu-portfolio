"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { List, ChevronDown, ChevronUp } from "lucide-react"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content?: string
  className?: string
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (!content) return

    // Extract headings from content (lines starting with # or ## or numbers followed by period)
    const lines = content.split('\n')
    const extractedHeadings: TOCItem[] = []
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      
      // Match markdown headings
      const h2Match = trimmedLine.match(/^##\s+(.+)/)
      const h3Match = trimmedLine.match(/^###\s+(.+)/)
      
      // Match numbered sections (1. Title, 2. Title, etc.)
      const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)/)
      
      // Match bold section titles (**Title**)
      const boldMatch = trimmedLine.match(/^\*\*(.+)\*\*$/)
      
      if (h2Match) {
        extractedHeadings.push({
          id: `heading-${index}`,
          text: h2Match[1],
          level: 2
        })
      } else if (h3Match) {
        extractedHeadings.push({
          id: `heading-${index}`,
          text: h3Match[1],
          level: 3
        })
      } else if (numberedMatch) {
        extractedHeadings.push({
          id: `heading-${index}`,
          text: `${numberedMatch[1]}. ${numberedMatch[2]}`,
          level: 2
        })
      } else if (boldMatch && trimmedLine.length < 60) {
        extractedHeadings.push({
          id: `heading-${index}`,
          text: boldMatch[1],
          level: 2
        })
      }
    })
    
    setHeadings(extractedHeadings)
  }, [content])

  // Set up intersection observer for active heading
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0px -80% 0px" }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  // Don't render if no headings found
  if (headings.length < 2) return null

  return (
    <nav 
      className={cn(
        "bg-muted/30 border border-border rounded-lg p-4",
        className
      )}
      aria-label="Table of contents"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-accent" />
          <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            Table of Contents
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      
      {isOpen && (
        <ul className="mt-4 space-y-2">
          {headings.map((heading) => (
            <li 
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  "text-left text-sm transition-all duration-200 hover:text-accent",
                  "border-l-2 pl-3 py-1 block w-full",
                  activeId === heading.id
                    ? "border-accent text-accent font-medium"
                    : "border-transparent text-muted-foreground hover:border-muted"
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
