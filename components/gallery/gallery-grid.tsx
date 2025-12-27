"use client"

import { useState, useEffect } from "react"
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
      <div className="flex flex-wrap gap-6 mb-12 pb-8 border-b border-border">
        <button 
          onClick={() => setActiveCategory(null)}
          className={cn(
            "font-mono text-sm tracking-wider uppercase transition-colors",
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
              "font-mono text-sm tracking-wider uppercase transition-colors",
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
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-6 z-50 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 z-50 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>

          {/* Image */}
          <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-auto p-4">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt || selectedImage.title || selectedImage.name || "Gallery image"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Image Info */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-white font-serif text-xl mb-2">
              {selectedImage.title || selectedImage.name}
            </p>
            <div className="flex items-center justify-center gap-4 text-white/60 font-mono text-sm">
              {selectedImage.category && <span>{selectedImage.category}</span>}
              {selectedImage.place && <span>• {selectedImage.place}</span>}
            </div>
          </div>
          
          {/* Counter */}
          <div className="absolute top-6 left-6 font-mono text-sm text-white/60">
            {selectedImageIndex !== null && `${selectedImageIndex + 1} / ${filteredImages.length}`}
          </div>
        </div>
      )}
    </div>
  )
}
