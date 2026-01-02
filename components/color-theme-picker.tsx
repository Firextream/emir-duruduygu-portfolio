"use client"

import { useState, useEffect } from "react"
import { Check, Palette, Moon, Sun, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const colorThemes = [
  { 
    id: "default", 
    name: "Forest", 
    lightAccent: "#3d5a4c", 
    darkAccent: "#7eb896",
    description: "Calm green tones"
  },
  { 
    id: "ocean", 
    name: "Ocean", 
    lightAccent: "#2563eb", 
    darkAccent: "#60a5fa",
    description: "Deep blue waves"
  },
  { 
    id: "sunset", 
    name: "Sunset", 
    lightAccent: "#ea580c", 
    darkAccent: "#fb923c",
    description: "Warm orange glow"
  },
  { 
    id: "lavender", 
    name: "Lavender", 
    lightAccent: "#7c3aed", 
    darkAccent: "#a78bfa",
    description: "Soft purple hues"
  },
  { 
    id: "rose", 
    name: "Rose", 
    lightAccent: "#e11d48", 
    darkAccent: "#fb7185",
    description: "Elegant pink tones"
  },
  { 
    id: "amber", 
    name: "Amber", 
    lightAccent: "#d97706", 
    darkAccent: "#fbbf24",
    description: "Golden warmth"
  },
]

export function ColorThemePicker({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [colorTheme, setColorTheme] = useState("default")
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedColorTheme = localStorage.getItem("color-theme") || "default"
    setColorTheme(savedColorTheme)
    applyColorTheme(savedColorTheme)
  }, [])

  const applyColorTheme = (themeId: string) => {
    const selectedTheme = colorThemes.find(t => t.id === themeId)
    if (selectedTheme) {
      document.documentElement.style.setProperty("--accent-light", selectedTheme.lightAccent)
      document.documentElement.style.setProperty("--accent-dark", selectedTheme.darkAccent)
    }
  }

  const handleColorThemeChange = (themeId: string) => {
    setColorTheme(themeId)
    localStorage.setItem("color-theme", themeId)
    applyColorTheme(themeId)
  }

  if (!mounted) return null

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Theme settings"
      >
        <Palette className="w-5 h-5 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-72 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                Theme Settings
              </h3>
            </div>

            {/* Light/Dark Mode */}
            <div className="p-4 border-b border-border">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
                Appearance
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all",
                    resolvedTheme === "light"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all",
                    resolvedTheme === "dark"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-sm">Dark</span>
                </button>
              </div>
            </div>

            {/* Color Themes */}
            <div className="p-4">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
                Accent Color
              </p>
              <div className="grid grid-cols-3 gap-2">
                {colorThemes.map((colorThemeOption) => {
                  const accentColor = resolvedTheme === "dark" 
                    ? colorThemeOption.darkAccent 
                    : colorThemeOption.lightAccent
                  const isSelected = colorTheme === colorThemeOption.id

                  return (
                    <button
                      key={colorThemeOption.id}
                      onClick={() => handleColorThemeChange(colorThemeOption.id)}
                      className={cn(
                        "relative flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all",
                        "border-2",
                        isSelected
                          ? "border-accent bg-accent/10"
                          : "border-transparent bg-muted/50 hover:bg-muted"
                      )}
                      title={colorThemeOption.description}
                    >
                      <div 
                        className="w-6 h-6 rounded-full ring-2 ring-offset-2 ring-offset-background"
                        style={{ 
                          backgroundColor: accentColor,
                          boxShadow: isSelected ? `0 0 0 2px ${accentColor}` : "none"
                        }}
                      >
                        {isSelected && (
                          <Check className="w-full h-full p-1 text-white" />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {colorThemeOption.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
