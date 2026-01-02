"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from "lucide-react"
import Image from "next/image"

interface LightboxImage {
  src: string
  alt?: string
  title?: string
  location?: string
}

interface LightboxProps {
  images: LightboxImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
}

export function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)

  const currentImage = images[currentIndex]

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setIsZoomed(false)
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious()
          break
        case "ArrowRight":
          goToNext()
          break
        case "Escape":
          onClose()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, goToPrevious, goToNext, onClose])

  // Reset index when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setIsZoomed(false)
    }
  }, [isOpen, initialIndex])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Image container */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`relative max-w-[90vw] max-h-[85vh] ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onClick={(e) => {
              e.stopPropagation()
              setIsZoomed(!isZoomed)
            }}
          >
            <div className={`relative transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}>
              {currentImage.src.startsWith('http') ? (
                <img
                  src={currentImage.src}
                  alt={currentImage.alt || 'Gallery image'}
                  className="max-w-[90vw] max-h-[85vh] object-contain"
                />
              ) : (
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt || 'Gallery image'}
                  width={1200}
                  height={800}
                  className="max-w-[90vw] max-h-[85vh] object-contain"
                  priority
                />
              )}
            </div>
          </motion.div>

          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="max-w-4xl mx-auto flex items-end justify-between">
              <div className="text-white">
                {currentImage.title && (
                  <h3 className="font-serif text-xl mb-1">{currentImage.title}</h3>
                )}
                {currentImage.location && (
                  <p className="text-white/60 text-sm font-mono">{currentImage.location}</p>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {/* Counter */}
                <span className="text-white/60 font-mono text-sm">
                  {currentIndex + 1} / {images.length}
                </span>
                
                {/* Zoom toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsZoomed(!isZoomed)
                  }}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                  aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                >
                  {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                </button>
                
                {/* Download */}
                <a
                  href={currentImage.src}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                  aria-label="Download image"
                >
                  <Download size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(index)
                    setIsZoomed(false)
                  }}
                  className={`relative w-16 h-16 flex-shrink-0 overflow-hidden rounded transition-all ${
                    index === currentIndex 
                      ? 'ring-2 ring-white opacity-100' 
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  {img.src.startsWith('http') ? (
                    <img
                      src={img.src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for managing lightbox state
export function useLightbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [initialIndex, setInitialIndex] = useState(0)

  const openLightbox = (index: number = 0) => {
    setInitialIndex(index)
    setIsOpen(true)
  }

  const closeLightbox = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    initialIndex,
    openLightbox,
    closeLightbox,
  }
}
