"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function CursorFollower() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointing, setIsPointing] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    // Only show on desktop
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isClickable = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer"
      
      setIsPointing(!!isClickable)
    }

    const handleMouseLeave = () => {
      setIsHidden(true)
    }

    const handleMouseEnter = () => {
      setIsHidden(false)
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  // Don't render on mobile/tablet
  if (typeof window !== "undefined" && window.innerWidth < 1024) {
    return null
  }

  return (
    <>
      {/* Main cursor dot */}
      <div
        className={cn(
          "fixed pointer-events-none z-[9999] mix-blend-difference transition-transform duration-75",
          isHidden && "opacity-0",
          isClicking && "scale-75"
        )}
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div 
          className={cn(
            "w-3 h-3 bg-white rounded-full transition-transform duration-200",
            isPointing && "scale-0"
          )}
        />
      </div>
      
      {/* Outer ring */}
      <div
        className={cn(
          "fixed pointer-events-none z-[9998] mix-blend-difference transition-all duration-300 ease-out",
          isHidden && "opacity-0",
          isPointing && "scale-150",
          isClicking && "scale-90"
        )}
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div 
          className={cn(
            "w-8 h-8 border border-white rounded-full transition-all duration-200",
            isPointing && "bg-white/20"
          )}
        />
      </div>
    </>
  )
}
