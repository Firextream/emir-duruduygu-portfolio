"use client"

import { useState, useEffect, TouchEvent, useMemo, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react"
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
  srcSet?: string
  srcFull?: string
  srcOriginal?: string
  width?: number
  height?: number
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
  const [hasError, setHasError] = useState(false)
  const [useOriginal, setUseOriginal] = useState(false)

  // Hover'da full res versiyonu preload et
  const handleMouseEnter = useCallback(() => {
    if (image.srcFull && image.srcFull !== image.src) {
      preloadImage(image.srcFull)
    }
  }, [image.srcFull, image.src])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    setHasError(false)
  }, [])

  const handleError = useCallback(() => {
    // If proxy fails, try original URL
    if (!useOriginal && image.srcOriginal) {
      setUseOriginal(true)
    } else {
      setHasError(true)
      setIsLoaded(true)
    }
  }, [useOriginal, image.srcOriginal])

  // Use original URL as fallback if proxy fails
  const imageSrc = hasError ? null : (useOriginal ? image.srcOriginal : image.src)
  const imageSrcSet = useOriginal ? undefined : image.srcSet
  const imageSizes = imageSrcSet ? "(max-width: 640px) 100vw, 33vw" : undefined
  const hasRatio = Boolean(image.width && image.height)
  const aspectStyle: React.CSSProperties = {
    aspectRatio: hasRatio ? `${image.width}/${image.height}` : "4 / 3",
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onTouchStart={handleMouseEnter}
      className="group relative w-full overflow-hidden bg-transparent cursor-pointer block break-inside-avoid mb-4"
    >
      {/* Container reserves aspect ratio to prevent layout shift */}
      <div className="relative w-full overflow-hidden" style={aspectStyle}>
        {/* Blur placeholder - loads instantly */}
        {image.blurDataUrl && (
          <img
            src={image.blurDataUrl}
            alt=""
            className={cn(
              "absolute inset-0 w-full h-full object-cover scale-105 blur-lg transition-opacity duration-500",
              isLoaded ? "opacity-0" : "opacity-100"
            )}
            aria-hidden="true"
          />
        )}
        
        {/* Error state with retry */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800/30 text-neutral-600 text-xs">
            <button
              onClick={() => {
                // try original URL and reset load state
                setUseOriginal(true)
                setHasError(false)
                setIsLoaded(false)
              }}
              className="px-3 py-2 text-xs border border-neutral-600 rounded"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Main image - always in DOM to reserve space */}
        {imageSrc && !hasError && (
          <img
            src={imageSrc}
            srcSet={imageSrcSet}
            sizes={imageSizes}
            alt={image.alt || image.title || image.name || "Gallery image"}
            className={cn(
              "absolute inset-0 w-full h-full transition-[opacity,transform,filter] duration-500 ease-out group-hover:scale-[1.02] group-hover:saturate-[1.05]",
              "object-cover",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            loading={index < 6 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={index < 3 ? "high" : "auto"}
            referrerPolicy={useOriginal ? "no-referrer" : undefined}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>
      
      {/* Hover Overlay - subtle */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
    </button>
  )
}

export function GalleryGrid({ images, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [lightboxLoading, setLightboxLoading] = useState(false)

  // Memoize filtered images
  const filteredImages = useMemo(() => {
    return activeCategory 
      ? images.filter((img) => img.category === activeCategory) 
      : images
  }, [activeCategory, images])

  // Removed progressive loading to avoid CLS in masonry columns.

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

      {/* Images Grid - Masonry columns with true aspect ratios */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:balance]">
        {filteredImages.map((image, index) => (
          <GalleryImageCard 
            key={image.id} 
            image={image} 
            onClick={() => openLightbox(index)}
            priority={index < 8}
            index={index}
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
