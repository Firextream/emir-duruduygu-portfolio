"use client"

import { useState, useEffect, TouchEvent } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExifData {
  camera?: string | null
  lens?: string | null
  aperture?: string | null
  shutterSpeed?: string | null
  iso?: string | null
  focalLength?: string | null
}

interface GalleryImage {
  id: string
  src: string
  alt: string
  name?: string
  title?: string
  place?: string
  category?: string
  featured?: boolean
  exif?: ExifData | null
}

interface GalleryGridProps {
  images: GalleryImage[]
  categories: string[]
}

// Optimized image component with loading state
function GalleryImageCard({ 
  image, 
  onClick 
}: { 
  image: GalleryImage
  onClick: () => void 
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden bg-secondary cursor-pointer break-inside-avoid mb-4 block"
    >
      <div className="relative">
        {/* Loading skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-secondary animate-pulse" />
        )}
        
        {/* Use regular img for external URLs (Notion) to avoid timeout */}
        {image.src.startsWith('http') ? (
          <img
            src={image.src}
            alt={image.alt || image.title || image.name || "Gallery image"}
            className={cn(
              "w-full h-auto object-cover transition-all duration-700 group-hover:scale-105",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          <Image
            src={image.src}
            alt={image.alt || image.title || image.name || "Gallery image"}
            width={800}
            height={600}
            className={cn(
              "w-full h-auto object-cover transition-all duration-700 group-hover:scale-105",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setIsLoaded(true)}
          />
        )}
        
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
  )
}

export function GalleryGrid({ images, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [lightboxLoading, setLightboxLoading] = useState(false)

  const filteredImages = activeCategory 
    ? images.filter((img) => img.category === activeCategory) 
    : images

  const openLightbox = (index: number) => {
    setLightboxLoading(true)
    setSelectedImageIndex(index)
  }
  const closeLightbox = () => {
    setSelectedImageIndex(null)
    setLightboxLoading(false)
  }

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setLightboxLoading(true)
      setSelectedImageIndex(selectedImageIndex === 0 ? filteredImages.length - 1 : selectedImageIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setLightboxLoading(true)
      setSelectedImageIndex(selectedImageIndex === filteredImages.length - 1 ? 0 : selectedImageIndex + 1)
    }
  }

  // Preload adjacent images
  useEffect(() => {
    if (selectedImageIndex === null) return
    
    const preloadImage = (src: string) => {
      const img = new window.Image()
      img.src = src
    }
    
    // Preload next and previous images
    const prevIndex = selectedImageIndex === 0 ? filteredImages.length - 1 : selectedImageIndex - 1
    const nextIndex = selectedImageIndex === filteredImages.length - 1 ? 0 : selectedImageIndex + 1
    
    if (filteredImages[prevIndex]) preloadImage(filteredImages[prevIndex].src)
    if (filteredImages[nextIndex]) preloadImage(filteredImages[nextIndex].src)
  }, [selectedImageIndex, filteredImages])

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
          <GalleryImageCard 
            key={image.id} 
            image={image} 
            onClick={() => openLightbox(index)} 
          />
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-24">
          <p className="font-serif text-2xl text-muted-foreground mb-2">No images found</p>
          <p className="text-muted-foreground">Try selecting a different category.</p>
        </div>
      )}

      {/* Lightbox - Minimal Design */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
            {/* Counter */}
            <span className="font-mono text-[11px] text-white/50 tracking-wider">
              {selectedImageIndex !== null && `${selectedImageIndex + 1} / ${filteredImages.length}`}
            </span>
            
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Navigation - Minimal arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 hidden sm:flex items-center justify-center text-white/30 hover:text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={28} strokeWidth={1} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 hidden sm:flex items-center justify-center text-white/30 hover:text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={28} strokeWidth={1} />
          </button>

          {/* Image Container */}
          <div 
            className="absolute inset-0 flex items-center justify-center px-4 sm:px-16"
            onClick={closeLightbox}
          >
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Loading */}
              {lightboxLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
              )}
              
              {selectedImage.src.startsWith('http') ? (
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt || selectedImage.title || selectedImage.name || "Gallery image"}
                  className={cn(
                    "max-w-full max-h-[calc(100vh-160px)] w-auto h-auto object-contain transition-opacity duration-500",
                    lightboxLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={() => setLightboxLoading(false)}
                />
              ) : (
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt || selectedImage.title || selectedImage.name || "Gallery image"}
                  fill
                  className={cn(
                    "object-contain transition-opacity duration-500",
                    lightboxLoading ? "opacity-0" : "opacity-100"
                  )}
                  sizes="100vw"
                  priority
                  onLoad={() => setLightboxLoading(false)}
                />
              )}
            </div>
          </div>

          {/* Bottom Info - Clean & Centered */}
          <div className="absolute bottom-0 left-0 right-0 z-50 pb-5 pt-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="text-center px-4">
              {/* Title */}
              <h3 className="font-serif text-base sm:text-lg text-white/90 mb-1">
                {selectedImage.title || selectedImage.name}
              </h3>
              
              {/* Category & Location */}
              <p className="font-mono text-[10px] sm:text-[11px] tracking-wider text-white/40 uppercase mb-2">
                {[selectedImage.category, selectedImage.place].filter(Boolean).join(' · ')}
              </p>
              
              {/* EXIF - Compact */}
              {selectedImage.exif && (
                <p className="font-mono text-[10px] text-white/30 tracking-wide">
                  {[
                    selectedImage.exif.camera,
                    selectedImage.exif.focalLength,
                    selectedImage.exif.aperture && `ƒ/${selectedImage.exif.aperture.replace('f/', '')}`,
                    selectedImage.exif.shutterSpeed,
                    selectedImage.exif.iso && `ISO ${selectedImage.exif.iso}`
                  ].filter(Boolean).join('  ·  ')}
                </p>
              )}
            </div>
          </div>

          {/* Mobile swipe indicator */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 sm:hidden">
            <div className="flex items-center gap-3 text-white/20">
              <ChevronLeft size={14} strokeWidth={1} />
              <span className="font-mono text-[9px] tracking-widest uppercase">swipe</span>
              <ChevronRight size={14} strokeWidth={1} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
