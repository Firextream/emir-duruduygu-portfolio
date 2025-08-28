"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <div
        className={`fixed inset-0 bg-background z-50 transition-all duration-500 ease-out ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-px bg-accent animate-pulse"></div>
        </div>
      </div>

      <div
        className={`transition-all duration-500 ease-out ${isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      >
        {children}
      </div>
    </>
  )
}
