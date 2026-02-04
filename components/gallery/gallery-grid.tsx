"use client"

import { useState, useEffect, useRef, TouchEvent, useMemo, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Download } from "lucide-react"
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
  srcFull?: string
  srcOriginal?: string
  alt: string
  name?: string
  title?: string
  place?: string
  category?: string
  featured?: boolean
  exif?: ExifData | null
  blurDataUrl?: string
}

interface GalleryGridProps {
  images: GalleryImage[]
  categories: string[]
}

// Preload helper function
const preloadImage = (src: string) => {
  if (typeof window === 'undefined' || !src) return
  const img = new window.Image()
  img.src = src
}

// Optimized image component with aggressive lazy loading
function GalleryImageCard({ 
  image, 
  onClick,
  priority = false,
  index = 0
}: { 
  image: GalleryImage
  onClick: () => void
  priority?: boolean
  index?: number
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  // İlk 6 resmi hemen yükle, diğerlerini lazy load yap
  const [isInView, setIsInView] = useState(priority || index < 6)
  const [hasError, setHasError] = useState(false)
  const cardRef = useRef<HTMLButtonElement>(null)

  // Hover'da full res versiyonı preload et
  const handleMouseEnter = useCallback(() => {
    if (image.srcFull && image.srcFull !== image.src) {
      preloadImage(image.srcFull)
    }
  }, [image.srcFull, image.src])

  useEffect(() => {
    // İlk 6 resim zaten yüklenecek
    if (priority || index < 6) {
      setIsInView(true)
      return
    }
    
    // IntersectionObserver yoksa direkt yükle
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      return
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { 
        // Viewport'a yaklaşınca yükle
        rootMargin: '400px 0px', 
        threshold: 0 
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [priority, index])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  const handleError = useCallback(() => {
    setHasError(true)
    setIsLoaded(true)
  }, [])
  
  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter}
      className="group relative w-full overflow-hidden bg-secondary/30 cursor-pointer break-inside-avoid mb-4 block rounded-sm"
      style={{ minHeight: '200px' }}
    >
      <div className="relative">
        {/* Skeleton placeholder */}
        {!isLoaded && !hasError && (
          <div 
            className="absolute inset-0 bg-secondary/50 animate-pulse"
            style={{ minHeight: '200px' }}
          />
        )}
        
        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 text-muted-foreground text-sm">
            Failed to load
          </div>
        )}
        
        {/* Image - Use native img for Notion URLs */}
        {image.src && !hasError && (
          <img
            src={image.src}
            alt={image.alt || image.title || image.name || "Gallery image"}
            className={cn(
              "w-full h-auto object-cover transition-all duration-300 group-hover:scale-105",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            loading={index < 6 ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
        
        {/* No src fallback */}
        {!image.src && (
          <div className="w-full h-48 flex items-center justify-center bg-secondary/30 text-muted-foreground text-sm">
            No image
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300" />
        
        {/* Hover Content */}
        <div className="absolute inset-0 flex items-end p-4 lg:p-6">
          <div className="flex items-end justify-between w-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <div className="text-white">
              {image.category && (
                <p className="font-mono text-[10px] tracking-wider uppercase">
                  {image.category}
                </p>
              )}
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
  const [visibleCount, setVisibleCount] = useState(12) // Start with 12 images for fast initial load

  // Memoize filtered images
  const filteredImages = useMemo(() => {
    return activeCategory 
      ? images.filter((img) => img.category === activeCategory) 
      : images
  }, [activeCategory, images])

  // Visible images for progressive loading
  const visibleImages = useMemo(() => {
    return filteredImages.slice(0, visibleCount)
  }, [filteredImages, visibleCount])

  // Load more images when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      if (visibleCount >= filteredImages.length) return
      
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      
      // Load more when 500px from bottom
      if (scrollTop + windowHeight >= docHeight - 500) {
        setVisibleCount(prev => Math.min(prev + 12, filteredImages.length))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleCount, filteredImages.length])

  // Reset visible count when category changes
  useEffect(() => {
    setVisibleCount(12)
  }, [activeCategory])

  const openLightbox = useCallback((index: number) => {
    setSelectedImageIndex(index)
    setLightboxLoading(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setSelectedImageIndex(null)
    setLightboxLoading(false)
  }, [])

  const goToPrevious = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? filteredImages.length - 1 : selectedImageIndex - 1)
      setLightboxLoading(true)
    }
  }, [selectedImageIndex, filteredImages.length])

  const goToNext = useCallback(() => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === filteredImages.length - 1 ? 0 : selectedImageIndex + 1)
      setLightboxLoading(true)
    }
  }, [selectedImageIndex, filteredImages.length])

  // Preload adjacent images aggressively
  useEffect(() => {
    if (selectedImageIndex === null) return
    
    // Preload next 3 and previous 3 images for smoother navigation
    const preloadOffsets = [-3, -2, -1, 1, 2, 3]
    preloadOffsets.forEach(offset => {
      const idx = (selectedImageIndex + offset + filteredImages.length) % filteredImages.length
      const image = filteredImages[idx]
      if (image) {
        preloadImage(image.srcFull || image.src)
      }
    })
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

      {/* Images Grid - Masonry Style with Progressive Loading */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {visibleImages.map((image, index) => (
          <GalleryImageCard 
            key={image.id} 
            image={image} 
            onClick={() => openLightbox(index)}
            priority={index < 6}
            index={index}
          />
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredImages.length && (
        <div className="text-center py-8">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + 24, filteredImages.length))}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono tracking-wider uppercase border border-border hover:border-foreground hover:bg-foreground/5 transition-all duration-200"
          >
            Load More ({filteredImages.length - visibleCount} remaining)
          </button>
        </div>
      )}

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
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Download Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (selectedImage) {
                    const filename = selectedImage.title || selectedImage.name || 'duruduygu-photo'
                    // Use original URL for download (not Cloudinary)
                    const originalUrl = (selectedImage as any).srcOriginal || selectedImage.src
                    const downloadUrl = `/api/download?url=${encodeURIComponent(originalUrl)}&filename=${encodeURIComponent(filename)}`
                    const link = document.createElement('a')
                    link.href = downloadUrl
                    link.download = `${filename}.jpg`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }
                }}
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                aria-label="Download"
                title="Download photo"
              >
                <Download size={18} strokeWidth={1.5} />
              </button>
              
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
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

          {/* Image Container - with proper spacing for bottom info */}
          <div 
            className="absolute inset-0 flex items-center justify-center px-4 sm:px-20 pt-16 pb-32"
            onClick={closeLightbox}
          >
            <div 
              className="relative flex items-center justify-center w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Thumbnail as immediate placeholder */}
              <img
                src={selectedImage.src}
                alt=""
                className={cn(
                  "absolute max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300",
                  lightboxLoading ? "opacity-100 blur-sm scale-[1.02]" : "opacity-0"
                )}
                loading="eager"
                aria-hidden="true"
              />
              
              {/* Main high-res image */}
              <img
                src={selectedImage.srcFull || selectedImage.src}
                alt={selectedImage.alt || selectedImage.title || selectedImage.name || "Gallery image"}
                className={cn(
                  "max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300",
                  lightboxLoading ? "opacity-0" : "opacity-100"
                )}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onLoad={() => setLightboxLoading(false)}
                onError={() => setLightboxLoading(false)}
              />
            </div>
          </div>

          {/* Bottom Info - Solid background */}
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-black py-4 px-4">
            <div className="text-center">
              {/* Category & Location */}
              <p className="font-mono text-[10px] tracking-wider text-white/40 uppercase">
                {[selectedImage.category, selectedImage.place].filter(Boolean).join(' · ')}
                {selectedImage.exif && (
                  <span className="hidden sm:inline">
                    {' · '}{[selectedImage.exif.camera, selectedImage.exif.focalLength, selectedImage.exif.aperture, selectedImage.exif.shutterSpeed, selectedImage.exif.iso && `ISO ${selectedImage.exif.iso}`].filter(Boolean).join(' · ')}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Mobile swipe indicator */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 sm:hidden">
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
