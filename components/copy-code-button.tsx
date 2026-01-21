"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface CopyCodeButtonProps {
  code: string
  className?: string
}

export function CopyCodeButton({ code, className = "" }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`absolute top-2 right-2 p-2 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100 ${className}`}
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// Wrapper component for code blocks
export function CodeBlockWrapper({ children, code }: { children: React.ReactNode; code: string }) {
  return (
    <div className="relative group">
      {children}
      <CopyCodeButton code={code} />
    </div>
  )
}
