"use client"

import type React from "react"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "minimal"
  size?: "sm" | "md" | "lg"
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:ring-offset-2",
          "before:absolute before:inset-0 before:bg-accent/5 before:scale-0 before:transition-transform before:duration-300",
          "hover:before:scale-100 active:scale-95",
          {
            "bg-foreground text-background hover:bg-foreground/90": variant === "default",
            "border border-border hover:bg-accent/5": variant === "outline",
            "hover:bg-accent/5": variant === "ghost",
            "text-muted-foreground hover:text-foreground underline-offset-4 hover:underline": variant === "minimal",
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2": size === "md",
            "px-6 py-3 text-lg": size === "lg",
          },
          className,
        )}
        ref={ref}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    )
  },
)

EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton }
