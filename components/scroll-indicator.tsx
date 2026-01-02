"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      
      setScrollProgress(Math.min(100, Math.max(0, progress)))
      setShowButton(scrollTop > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Circular progress indicator */}
      <button
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-12 h-12 transition-all duration-300",
          showButton ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-secondary"
            strokeWidth="2"
          />
          {/* Progress circle */}
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-accent transition-all duration-150"
            strokeWidth="2"
            strokeDasharray={`${scrollProgress} 100`}
            strokeLinecap="round"
          />
        </svg>
        {/* Arrow icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ArrowUp className="w-4 h-4 text-foreground" />
        </div>
      </button>
    </>
  )
}
