"use client"

import { cn } from "@/lib/utils"
import { Tag as TagIcon } from "lucide-react"
import Link from "next/link"

interface TagCloudProps {
  tags: { name: string; count: number }[]
  className?: string
  selectedTag?: string
  onTagClick?: (tag: string) => void
  linkToArchive?: boolean
}

export function TagCloud({ 
  tags, 
  className,
  selectedTag,
  onTagClick,
  linkToArchive = false
}: TagCloudProps) {
  // Calculate font sizes based on count
  const maxCount = Math.max(...tags.map(t => t.count))
  const minCount = Math.min(...tags.map(t => t.count))
  
  const getSize = (count: number) => {
    if (maxCount === minCount) return "text-sm"
    const ratio = (count - minCount) / (maxCount - minCount)
    if (ratio < 0.33) return "text-xs"
    if (ratio < 0.66) return "text-sm"
    return "text-base"
  }

  if (tags.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        <TagIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No tags found</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => {
        const isSelected = selectedTag === tag.name
        const sizeClass = getSize(tag.count)
        
        const TagElement = linkToArchive ? Link : "button"
        const tagProps = linkToArchive 
          ? { href: `/blog?tag=${encodeURIComponent(tag.name)}` }
          : { onClick: () => onTagClick?.(tag.name) }

        return (
          <TagElement
            key={tag.name}
            {...(tagProps as any)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200",
              "border",
              sizeClass,
              isSelected
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-muted/50 text-muted-foreground border-border hover:border-accent/50 hover:text-foreground"
            )}
          >
            <TagIcon className="w-3 h-3" />
            <span>{tag.name}</span>
            <span className="font-mono text-[10px] opacity-60">
              {tag.count}
            </span>
          </TagElement>
        )
      })}
    </div>
  )
}

// Simple inline tag list
interface TagListProps {
  tags: string[]
  className?: string
  size?: "sm" | "md"
  clickable?: boolean
  onTagClick?: (tag: string) => void
}

export function TagList({ 
  tags, 
  className, 
  size = "sm",
  clickable = false,
  onTagClick
}: TagListProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => {
        const Element = clickable ? "button" : "span"
        
        return (
          <Element
            key={tag}
            onClick={clickable ? () => onTagClick?.(tag) : undefined}
            className={cn(
              "inline-flex items-center gap-1 rounded-full font-mono uppercase tracking-wider",
              "bg-muted/50 text-muted-foreground",
              size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
              clickable && "hover:bg-accent/10 hover:text-accent cursor-pointer transition-colors"
            )}
          >
            {tag}
          </Element>
        )
      })}
    </div>
  )
}
