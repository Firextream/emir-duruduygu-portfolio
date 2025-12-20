"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getAssetPath } from "@/lib/image-utils"

interface GalleryImage {
  id: string
  src: string
  alt: string
  aspectRatio: string
  name: string
  date: string
  place: string
  category?: string
  featured?: boolean
}

interface GalleryClientProps {
  images: GalleryImage[]
}

export default function GalleryClient({ images }: GalleryClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  // Process images to ensure correct src paths
  const galleryImages = images.map(img => ({
    ...img,
    src: img.src?.startsWith('http') ? img.src : getAssetPath(img.src || '/placeholder.svg')
  }))

  // Extract unique categories from images
  const categories = ["All", ...Array.from(new Set(
    galleryImages
      .map(img => img.category)
      .filter((category): category is string => Boolean(category))
  ))]

  // Filter images based on selected category
  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory)

  const openModal = (index: number) => setSelectedImageIndex(index)
  const closeModal = () => setSelectedImageIndex(null)

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImageIndex === null) return

      if (event.key === 'Escape') closeModal()
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Minimal Header */}
          <div className="mb-12 md:mb-16">
            <span className="text-[10px] font-light tracking-[0.3em] text-muted-foreground uppercase block mb-4">
              Photography
            </span>
            <h1 className="text-4xl md:text-5xl font-extralight text-foreground mb-4">
              Gallery
            </h1>
            <p className="text-muted-foreground font-light max-w-xl">
              A curated collection of architectural moments.
            </p>
          </div>

          {/* Minimal Filter Tabs */}
          <div className="mb-12 flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs tracking-widest uppercase transition-all pb-1 ${
                  selectedCategory === category
                    ? 'text-foreground border-b border-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group cursor-pointer break-inside-avoid relative overflow-hidden bg-muted"
                onClick={() => openModal(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end">
                  <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white">
                    <h3 className="text-sm font-light">{image.name}</h3>
                    <p className="text-xs text-white/70">{image.place}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No images in this category yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && filteredImages[selectedImageIndex] && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          <div className="relative flex-1 flex items-center justify-center p-4">
            {/* Close button */}
            <button
              className="absolute top-6 right-6 z-10 text-white/70 hover:text-white transition-colors"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 z-10">
              <span className="text-white/50 text-sm tracking-widest">
                {selectedImageIndex + 1} / {filteredImages.length}
              </span>
            </div>

            {/* Main content */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-h-full w-full max-w-6xl">
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={filteredImages[selectedImageIndex].src}
                  alt={filteredImages[selectedImageIndex].alt}
                  className="max-w-full max-h-[70vh] lg:max-h-[80vh] object-contain"
                />
              </div>

              {/* Info Panel */}
              <div className="lg:w-72 text-white">
                <h3 className="text-xl font-light mb-6">{filteredImages[selectedImageIndex].name}</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-white/50 text-xs tracking-widest uppercase block mb-1">Location</span>
                    <p className="font-light">{filteredImages[selectedImageIndex].place}</p>
                  </div>
                  <div>
                    <span className="text-white/50 text-xs tracking-widest uppercase block mb-1">Date</span>
                    <p className="font-light">{filteredImages[selectedImageIndex].date}</p>
                  </div>
                  {filteredImages[selectedImageIndex].category && (
                    <div>
                      <span className="text-white/50 text-xs tracking-widest uppercase block mb-1">Category</span>
                      <p className="font-light">{filteredImages[selectedImageIndex].category}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
