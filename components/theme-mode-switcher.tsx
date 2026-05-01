"use client"

import { useState, useEffect } from "react"
import { Monitor, Zap, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── UI MODE DEFINITIONS ───────────────────────────────────
// Each "uiMode" is a full visual identity, not just a color.
// Applied as data-ui="..." on <html>, CSS takes over from there.
const uiModes = [
  {
    id: "standard",
    label: "Standard",
    description: "Clean modernist portfolio",
    icon: Monitor,
    accent: "var(--accent)",
  },
  {
    id: "cyber",
    label: "Cyber",
    description: "Dark neon · single-page scroll",
    icon: Zap,
    accent: "#C1FF00",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Ultra clean · stripped back",
    icon: Minus,
    accent: "currentColor",
  },
]

export function ThemeModeSwitcher({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [activeMode, setActiveMode] = useState("standard")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("ui-mode") || "standard"
    setActiveMode(saved)
    applyMode(saved)
  }, [])

  const applyMode = (modeId: string) => {
    document.documentElement.setAttribute("data-ui", modeId)
    localStorage.setItem("ui-mode", modeId)

    // Cyber: force dark background, neon accent
    if (modeId === "cyber") {
      document.documentElement.setAttribute("data-theme", "cyber")
    } else if (modeId === "minimal") {
      document.documentElement.setAttribute("data-theme", "minimal")
    } else {
      // Standard: restore saved color-theme accent if any
      document.documentElement.setAttribute("data-theme", "standard")
    }
  }

  const handleSelect = (modeId: string) => {
    setActiveMode(modeId)
    applyMode(modeId)
    setOpen(false)
  }

  if (!mounted) return null

  const currentMode = uiModes.find(m => m.id === activeMode) ?? uiModes[0]
  const Icon = currentMode.icon

  return (
    <div className={cn("relative", className)}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 p-2 hover:bg-muted transition-colors"
        aria-label="Switch UI mode"
        title={`Current: ${currentMode.label}`}
      >
        <Icon className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              UI Mode
            </p>
          </div>

          {/* Mode Options */}
          <div className="p-2">
            {uiModes.map(mode => {
              const ModeIcon = mode.icon
              const isActive = activeMode === mode.id
              return (
                <button
                  key={mode.id}
                  onClick={() => handleSelect(mode.id)}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-3 text-left transition-all duration-150 group",
                    isActive
                      ? "bg-accent/10 border border-accent/40"
                      : "border border-transparent hover:border-border hover:bg-muted/50"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "mt-0.5 flex-shrink-0 w-7 h-7 flex items-center justify-center border",
                      isActive
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border text-muted-foreground group-hover:border-foreground/40"
                    )}
                  >
                    <ModeIcon className="w-3.5 h-3.5" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-mono text-xs font-semibold tracking-wider uppercase",
                      isActive ? "text-accent" : "text-foreground"
                    )}>
                      {mode.label}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground mt-0.5 leading-tight">
                      {mode.description}
                    </p>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2.5 border-t border-border">
            <p className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">
              {activeMode === "cyber" && "↓ Single-page scroll activated"}
              {activeMode === "minimal" && "□ Stripped-back mode active"}
              {activeMode === "standard" && "◈ Standard portfolio active"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
