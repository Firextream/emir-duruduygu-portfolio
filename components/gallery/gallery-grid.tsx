"use client"

import { useState, useEffect, useRef, TouchEvent } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface GalleryImage {
  id: string
  src: string
  alt: string
  name?: string
  title?: string
  place?: string
  category?: string
  featured?: boolean
}

interface GalleryGridProps {
  images: GalleryImage[]
  categories: string[]
}

export function GalleryGrid({ images, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const filteredImages = activeCategory 
    ? images.filter((img) => img.category === activeCategory) 
    : images

  const openLightbox = (index: number) => setSelectedImageIndex(index)
  const closeLightbox = () => setSelectedImageIndex(null)

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? filteredImages.length - 1 : selectedImageIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === filteredImages.length - 1 ? 0 : selectedImageIndex + 1)
    }
  }

  // Swipe gesture handling
  const minSwipeDistance = 50

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImageIndex === null) return
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowLeft') goToPrevious()
      if (event.key === 'ArrowRight') goToNext()
    }

    if (selectedImageIndex !== null) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImageIndex, filteredImages.length])

  const selectedImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null

  return (
    <div>
      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 sm:gap-6 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-border overflow-x-auto">
        <button 
          onClick={() => setActiveCategory(null)}
          className={cn(
            "font-mono text-xs sm:text-sm tracking-wider uppercase transition-colors whitespace-nowrap py-1",
            activeCategory === null 
              ? "text-foreground" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "font-mono text-xs sm:text-sm tracking-wider uppercase transition-colors whitespace-nowrap py-1",
              activeCategory === category 
                ? "text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Images Grid - Masonry Style */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {filteredImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="group relative w-full overflow-hidden bg-secondary cursor-pointer break-inside-avoid mb-4 block"
          >
            <div className="relative">
              <Image
                src={image.src}
                alt={image.alt || image.title || image.name || "Gallery image"}
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-500" />
              
              {/* Hover Content */}
              <div className="absolute inset-0 flex items-end p-4 lg:p-6">
                <div className="flex items-end justify-between w-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <div className="text-white">
                    {image.category && (
                      <p className="font-mono text-[10px] tracking-wider uppercase mb-1">
                        {image.category}
                      </p>
                    )}
                    <h3 className="font-serif text-lg lg:text-xl">
                      {image.title || image.name}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-24">
          <p className="font-serif text-2xl text-muted-foreground mb-2">No images found</p>
          <p className="text-muted-foreground">Try selecting a different category.</p>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black flex flex-col"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Close Button - Mobile Optimized */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-14 h-14 md:w-12 md:h-12 flex items-center justify-center text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-all active:scale-95"
            aria-label="Close lightbox"
          >
            <X size={28} className="md:w-7 md:h-7" />
          </button>

          {/* Navigation Buttons - Hidden on mobile (use swipe instead) */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 md:left-6 z-50 w-12 h-12 md:w-16 md:h-16 hidden sm:flex items-center justify-center text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-all active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} className="md:w-10 md:h-10" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 md:right-6 z-50 w-12 h-12 md:w-16 md:h-16 hidden sm:flex items-center justify-center text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-all active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight size={32} className="md:w-10 md:h-10" />
          </button>

          {/* Swipe hint for mobile */}
          <div className="absolute bottom-36 left-1/2 -translate-x-1/2 sm:hidden text-white/40 text-xs font-mono">
            Swipe to navigate
          </div>

          {/* Keyboard hints for desktop */}
          <div className="absolute bottom-36 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-4 text-white/40 text-xs font-mono">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded">←</kbd>
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded">→</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded">ESC</kbd>
              close
            </span>
          </div>

          {/* Counter */}
          <div className="absolute top-6 left-6 font-mono text-sm text-white/60">
            {selectedImageIndex !== null && `${selectedImageIndex + 1} / ${filteredImages.length}`}
          </div>

          {/* Image Container - takes remaining space */}
          <div className="flex-1 flex items-center justify-center p-4 pt-16 pb-28">
            <div className="relative w-full h-full max-w-6xl">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt || selectedImage.title || selectedImage.name || "Gallery image"}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Image Info - fixed at bottom with background */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-6 text-center">
            <p className="text-white font-serif text-xl mb-2">
              {selectedImage.title || selectedImage.name}
            </p>
            <div className="flex items-center justify-center gap-4 text-white/60 font-mono text-sm">
              {selectedImage.category && <span>{selectedImage.category}</span>}
              {selectedImage.place && <span>• {selectedImage.place}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
