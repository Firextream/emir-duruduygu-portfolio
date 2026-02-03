"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export function BrandLogo() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Link
      href="/"
      className="group relative inline-block font-heading font-light text-2xl tracking-wide text-foreground hover:text-accent transition-all duration-700 hover:tracking-wider"
    >
      <div className="relative">
        <span className="relative z-10 inline-block">Duruduygu</span>

        {/* Architectural frame elements */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
          <div className="absolute -top-2 -left-2 w-0 h-0 border-l-2 border-t-2 border-accent/40 transition-all duration-500 group-hover:w-6 group-hover:h-6"></div>
          <div className="absolute -bottom-2 -right-2 w-0 h-0 border-r-2 border-b-2 border-accent/40 transition-all duration-500 group-hover:w-6 group-hover:h-6"></div>
        </div>

        {/* Underline effect */}
        <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-accent to-accent/40 transition-all duration-500 group-hover:w-full"></div>

        {/* Subtitle */}
        <div className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
          <span className="text-xs font-light tracking-widest text-muted-foreground uppercase">
            Photography & Stories
          </span>
        </div>
      </div>
    </Link>
  )
}
