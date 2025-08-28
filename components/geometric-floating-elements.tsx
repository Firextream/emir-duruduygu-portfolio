"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface GeometricFloat {
  id: string
  size: number
  x: number
  y: number
  rotation: number
  delay: number
  duration: number
  shape: 'circle' | 'square' | 'triangle' | 'line'
  opacity: number
}

interface GeometricFloatingElementsProps {
  count?: number
  className?: string
  animated?: boolean
}

export const GeometricFloatingElements: React.FC<GeometricFloatingElementsProps> = ({
  count = 8,
  className,
  animated = true
}) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Generate deterministic geometric elements to avoid hydration mismatch
  const elements: GeometricFloat[] = React.useMemo(() => {
    if (!mounted) {
      // Return empty array during SSR
      return []
    }
    
    return Array.from({ length: count }, (_, i) => {
      // Use index-based deterministic values to ensure consistency
      const seed = i * 1000
      return {
        id: `geometric-${i}`,
        size: (seed % 60) + 20, // 20-80px
        x: (seed * 1.1) % 100, // 0-100%
        y: (seed * 1.3) % 100, // 0-100%
        rotation: (seed * 1.7) % 360,
        delay: (seed * 1.9) % 5000, // 0-5s
        duration: ((seed * 2.1) % 10000) + 10000, // 10-20s
        shape: ['circle', 'square', 'triangle', 'line'][i % 4] as GeometricFloat['shape'],
        opacity: ((seed * 0.001) % 0.3) + 0.1 // 0.1-0.4
      }
    })
  }, [count, mounted])

  const getShapeElement = (element: GeometricFloat) => {
    const baseClasses = "absolute pointer-events-none"
    const style: React.CSSProperties = {
      width: element.shape === 'line' ? '2px' : `${element.size}px`,
      height: element.shape === 'line' ? `${element.size}px` : `${element.size}px`,
      left: `${element.x}%`,
      top: `${element.y}%`,
      opacity: element.opacity,
      transform: `rotate(${element.rotation}deg)`,
      animationDelay: `${element.delay}ms`,
      animationDuration: `${element.duration}ms`,
    }

    switch (element.shape) {
      case 'circle':
        return (
          <div
            key={element.id}
            className={cn(
              baseClasses,
              "rounded-full border border-accent/30",
              animated && "drift-moderate"
            )}
            style={style}
          />
        )
      
      case 'square':
        return (
          <div
            key={element.id}
            className={cn(
              baseClasses,
              "border border-accent/20 rotate-45",
              animated && "rotate-subtle"
            )}
            style={style}
          />
        )
      
      case 'triangle':
        return (
          <div
            key={element.id}
            className={cn(
              baseClasses,
              "w-0 h-0",
              animated && "float-gentle"
            )}
            style={{
              ...style,
              width: 0,
              height: 0,
              borderLeft: `${element.size / 2}px solid transparent`,
              borderRight: `${element.size / 2}px solid transparent`,
              borderBottom: `${element.size}px solid hsl(var(--accent) / 0.15)`,
            }}
          />
        )
      
      case 'line':
        return (
          <div
            key={element.id}
            className={cn(
              baseClasses,
              "bg-accent/20",
              animated && "drift-slight"
            )}
            style={style}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden layer-base", className)}>
      {mounted && elements.map(getShapeElement)}
    </div>
  )
}

export default GeometricFloatingElements
