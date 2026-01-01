"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  variant?: "default" | "minimal"
}

export function ThemeToggle({ className, variant = "default" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className={cn("w-9 h-9 flex items-center justify-center", className)}>
        <Sun size={18} className="opacity-50" />
      </button>
    )
  }

  const isDark = theme === "dark"

  if (variant === "minimal") {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-muted",
          className
        )}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative w-14 h-7 rounded-full bg-muted transition-colors",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div
        className={cn(
          "absolute top-1 w-5 h-5 rounded-full bg-foreground flex items-center justify-center transition-all duration-300",
          isDark ? "left-8" : "left-1"
        )}
      >
        {isDark ? (
          <Moon size={12} className="text-background" />
        ) : (
          <Sun size={12} className="text-background" />
        )}
      </div>
    </button>
  )
}
