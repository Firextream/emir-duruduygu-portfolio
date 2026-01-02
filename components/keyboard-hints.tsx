"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function KeyboardHints() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Hide hints after 5 seconds or on first interaction
    const timer = setTimeout(() => setIsVisible(false), 5000)
    
    const hideOnInteraction = () => setIsVisible(false)
    window.addEventListener("keydown", hideOnInteraction)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener("keydown", hideOnInteraction)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden lg:flex items-center gap-6 px-6 py-3 bg-foreground/90 text-background text-sm backdrop-blur-sm transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="flex items-center gap-2">
        <kbd className="px-2 py-1 bg-background/20 rounded text-xs font-mono">←</kbd>
        <kbd className="px-2 py-1 bg-background/20 rounded text-xs font-mono">→</kbd>
        <span className="text-background/70">Navigate</span>
      </div>
      <div className="w-px h-4 bg-background/30" />
      <div className="flex items-center gap-2">
        <kbd className="px-2 py-1 bg-background/20 rounded text-xs font-mono">ESC</kbd>
        <span className="text-background/70">Close</span>
      </div>
    </div>
  )
}
