"use client"

import { cn } from "@/lib/utils"

interface TagChipProps {
  label: string
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function TagChip({ label, isActive, onClick, className }: TagChipProps) {
  const Component = onClick ? "button" : "span"

  return (
    <Component
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent/10",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {label}
    </Component>
  )
}
