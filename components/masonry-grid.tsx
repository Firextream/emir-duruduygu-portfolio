"use client"

import { useState, useEffect, useRef, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MasonryGridProps {
  children: ReactNode[]
  columns?: number
  gap?: number
  className?: string
}

export function MasonryGrid({ 
  children, 
  columns = 3, 
  gap = 16,
  className 
}: MasonryGridProps) {
  const [columnCount, setColumnCount] = useState(columns)
  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive columns
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 640) {
        setColumnCount(1)
      } else if (width < 1024) {
        setColumnCount(2)
      } else {
        setColumnCount(columns)
      }
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [columns])

  // Distribute children into columns
  const columnItems: ReactNode[][] = Array.from({ length: columnCount }, () => [])
  
  children.forEach((child, index) => {
    const columnIndex = index % columnCount
    columnItems[columnIndex].push(child)
  })

  return (
    <div 
      ref={containerRef}
      className={cn("flex", className)}
      style={{ gap: `${gap}px` }}
    >
      {columnItems.map((items, columnIndex) => (
        <div 
          key={columnIndex} 
          className="flex-1 flex flex-col"
          style={{ gap: `${gap}px` }}
        >
          {items.map((item, itemIndex) => (
            <div key={itemIndex} className="w-full">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// CSS-based Masonry (simpler, uses CSS columns)
export function CSSMasonryGrid({ 
  children, 
  columns = 3, 
  gap = 16,
  className 
}: MasonryGridProps) {
  return (
    <div 
      className={cn("", className)}
      style={{ 
        columnCount: columns,
        columnGap: `${gap}px`,
      }}
    >
      {children.map((child, index) => (
        <div 
          key={index} 
          className="break-inside-avoid"
          style={{ marginBottom: `${gap}px` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
