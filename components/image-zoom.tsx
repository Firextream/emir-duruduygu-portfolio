"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { X, ZoomIn, ZoomOut } from "lucide-react"

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export function ImageZoom({ src, alt, className = "", width, height }: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 4))
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1))

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }, [scale, position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = () => setIsDragging(false)

  const handleClose = () => {
    setIsOpen(false)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleClose()
    if (e.key === '+' || e.key === '=') handleZoomIn()
    if (e.key === '-') handleZoomOut()
  }, [])

  return (
    <>
      {/* Thumbnail */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative cursor-zoom-in group ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className="rounded-lg"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={handleClose}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); handleZoomOut() }}
              disabled={scale <= 1}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
            <span className="text-white text-sm min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); handleZoomIn() }}
              disabled={scale >= 4}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors ml-2"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <Image
              src={src}
              alt={alt}
              width={1920}
              height={1080}
              className="max-w-full max-h-[90vh] object-contain transition-transform duration-200"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              }}
              priority
            />
          </div>

          {/* Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            Scroll to zoom • Drag to pan • ESC to close
          </div>
        </div>
      )}
    </>
  )
}
