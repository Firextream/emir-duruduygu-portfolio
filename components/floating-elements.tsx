"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Subtle geometric shapes that follow mouse */}
      <div
        className="absolute w-px h-20 bg-gradient-to-b from-transparent via-accent/10 to-transparent transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x * 0.1 + 100,
          top: mousePosition.y * 0.1 + 50,
        }}
      />
      <div
        className="absolute w-20 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x * 0.05 + 200,
          top: mousePosition.y * 0.05 + 100,
        }}
      />

      {/* Static minimal grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>
    </div>
  )
}
