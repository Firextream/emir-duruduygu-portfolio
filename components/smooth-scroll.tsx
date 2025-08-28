"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface SmoothScrollProps {
  children: React.ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animationId: number

    const smoothScroll = () => {
      if (scrollRef.current) {
        const targetScroll = window.scrollY
        const currentScroll = scrollRef.current.scrollTop
        const diff = targetScroll - currentScroll

        scrollRef.current.scrollTop += diff * 0.1

        if (Math.abs(diff) > 0.1) {
          animationId = requestAnimationFrame(smoothScroll)
        }
      }
    }

    const handleScroll = () => {
      animationId = requestAnimationFrame(smoothScroll)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <div ref={scrollRef} className="overflow-hidden">
      {children}
    </div>
  )
}
