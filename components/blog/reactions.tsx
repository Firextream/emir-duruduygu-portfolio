"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ReactionsProps {
  slug: string
  className?: string
}

const reactionEmojis = [
  { emoji: "❤️", label: "Love" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "👏", label: "Clap" },
  { emoji: "🤔", label: "Think" },
  { emoji: "🚀", label: "Rocket" },
]

export function Reactions({ slug, className }: ReactionsProps) {
  const [reactions, setReactions] = useState<Record<string, number>>({})
  const [userReactions, setUserReactions] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load reactions from localStorage
    const allReactions = JSON.parse(localStorage.getItem("blog-reactions") || "{}")
    const postReactions = allReactions[slug] || {}
    
    // Initialize with some random base reactions for visual appeal
    const initialReactions: Record<string, number> = {}
    reactionEmojis.forEach(({ emoji }) => {
      initialReactions[emoji] = postReactions[emoji] || Math.floor(Math.random() * 10)
    })
    
    setReactions(initialReactions)
    
    // Load user's reactions for this post
    const userReactionsKey = `user-reactions-${slug}`
    const savedUserReactions = JSON.parse(localStorage.getItem(userReactionsKey) || "[]")
    setUserReactions(savedUserReactions)
    
    setIsLoaded(true)
  }, [slug])

  const handleReaction = (emoji: string) => {
    const userReactionsKey = `user-reactions-${slug}`
    const hasReacted = userReactions.includes(emoji)
    
    let newUserReactions: string[]
    let newCount: number
    
    if (hasReacted) {
      // Remove reaction
      newUserReactions = userReactions.filter(e => e !== emoji)
      newCount = Math.max(0, (reactions[emoji] || 0) - 1)
    } else {
      // Add reaction
      newUserReactions = [...userReactions, emoji]
      newCount = (reactions[emoji] || 0) + 1
    }
    
    // Update state
    setUserReactions(newUserReactions)
    setReactions(prev => ({ ...prev, [emoji]: newCount }))
    
    // Save to localStorage
    localStorage.setItem(userReactionsKey, JSON.stringify(newUserReactions))
    
    const allReactions = JSON.parse(localStorage.getItem("blog-reactions") || "{}")
    allReactions[slug] = { ...allReactions[slug], [emoji]: newCount }
    localStorage.setItem("blog-reactions", JSON.stringify(allReactions))
  }

  if (!isLoaded) {
    return (
      <div className={cn("flex gap-2", className)}>
        {reactionEmojis.map(({ emoji }) => (
          <div key={emoji} className="h-10 w-14 bg-muted animate-pulse rounded-full" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {reactionEmojis.map(({ emoji, label }) => {
        const count = reactions[emoji] || 0
        const hasReacted = userReactions.includes(emoji)
        
        return (
          <button
            key={emoji}
            onClick={() => handleReaction(emoji)}
            className={cn(
              "group flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300",
              "text-sm border",
              hasReacted
                ? "bg-accent/20 border-accent text-foreground scale-105"
                : "bg-muted/50 border-border hover:border-accent/50 hover:bg-muted text-muted-foreground"
            )}
            aria-label={`${label} reaction: ${count}`}
            title={label}
          >
            <span className={cn(
              "text-lg transition-transform duration-300",
              hasReacted && "animate-bounce-once"
            )}>
              {emoji}
            </span>
            <span className="font-mono text-xs min-w-[1rem] text-center">
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
