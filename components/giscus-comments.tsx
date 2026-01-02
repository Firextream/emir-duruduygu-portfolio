"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface GiscusCommentsProps {
  className?: string
}

export function GiscusComments({ className }: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!ref.current) return

    // Clear existing comments
    ref.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.async = true
    script.crossOrigin = "anonymous"
    
    // Configure Giscus - Update these with your repo details
    script.setAttribute("data-repo", "your-username/your-repo") // UPDATE THIS
    script.setAttribute("data-repo-id", "your-repo-id") // UPDATE THIS
    script.setAttribute("data-category", "Comments")
    script.setAttribute("data-category-id", "your-category-id") // UPDATE THIS
    script.setAttribute("data-mapping", "pathname")
    script.setAttribute("data-strict", "0")
    script.setAttribute("data-reactions-enabled", "1")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-input-position", "top")
    script.setAttribute("data-theme", resolvedTheme === "dark" ? "dark" : "light")
    script.setAttribute("data-lang", "en")
    script.setAttribute("data-loading", "lazy")

    ref.current.appendChild(script)
  }, [resolvedTheme])

  return (
    <section className={className} aria-label="Comments">
      <div className="border-t border-border pt-8 mt-8">
        <h2 className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-6">
          Comments & Discussion
        </h2>
        <div ref={ref} className="giscus" />
      </div>
    </section>
  )
}

// Placeholder component for when Giscus is not configured
export function CommentsPlaceholder({ className }: { className?: string }) {
  return (
    <section className={className}>
      <div className="border-t border-border pt-8 mt-8">
        <h2 className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-6">
          Comments & Discussion
        </h2>
        <div className="p-8 bg-muted/30 rounded-lg border border-border text-center">
          <p className="text-muted-foreground mb-2">
            Comments are coming soon!
          </p>
          <p className="text-sm text-muted-foreground">
            We're setting up GitHub Discussions for a better comment experience.
          </p>
        </div>
      </div>
    </section>
  )
}
