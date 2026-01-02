"use client"

import { useState } from "react"
import { Link2, Check, Twitter, Linkedin } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareButtonProps {
  title: string
  url?: string
  className?: string
}

export function ShareButton({ title, url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const shareUrl = typeof window !== "undefined" 
    ? url || window.location.href 
    : url || ""

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, "_blank", "noopener,noreferrer")
  }

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(linkedInUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Share this article"
      >
        <Link2 className="w-4 h-4" />
        <span>Share</span>
      </button>

      {/* Share Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Menu */}
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-card border border-border shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-2 space-y-1">
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-accent" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    <span>Copy link</span>
                  </>
                )}
              </button>
              
              <button
                onClick={shareToTwitter}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>Share on X</span>
              </button>
              
              <button
                onClick={shareToLinkedIn}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>Share on LinkedIn</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
