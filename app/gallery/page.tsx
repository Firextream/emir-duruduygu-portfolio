"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SectionHeader, FilterTabs } from "@/components/unified-design-system"

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

const fallbackImages: GalleryImage[] = [
  {
    id: "1",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-08-27%20205431-6Rvt0DBIBgDxSwcaru8NbwdGrNjKao.png",
    alt: "Masonry gallery layout with nature and architectural photography",
    aspectRatio: "4/3",
    name: "Nature & Architecture Collection",
    date: "March 2024",
    place: "Various Locations",
  },
  {
    id: "2",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-08-27%20205925-BGUiUcoAdniSzaUtOwWJVpymtDJNBu.png",
    alt: "Mixed aspect ratio photography gallery",
    aspectRatio: "16/9",
    name: "Mixed Ratio Gallery",
    date: "February 2024",
    place: "Urban Landscapes",
  },
  {
    id: "3",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-08-27%20205945-wt5jfqhC6wfHWJXpI2fVdj1BzKP0At.png",
    alt: "Architectural and landscape photography collection",
    aspectRatio: "3/4",
    name: "Architectural Landscapes",
    date: "January 2024",
    place: "Mediterranean Coast",
  },
]

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All Photos")

  const categories = ["All Photos", "Street", "Portrait", "Landscape", "Architecture"]

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        // For static export, use fallback images
        setGalleryImages(fallbackImages)
        setError(null)
        setLoading(false)
      } catch (error) {
        console.error("Error loading gallery images:", error)
        setError("Failed to load gallery images")
        setGalleryImages(fallbackImages)
        setLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  const openModal = (index: number) => setSelectedImageIndex(index)
  const closeModal = () => setSelectedImageIndex(null)

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? galleryImages.length - 1 : selectedImageIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === galleryImages.length - 1 ? 0 : selectedImageIndex + 1)
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
  }, [selectedImageIndex])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 py-12">
          <SectionHeader
            title="Photography"
            subtitle="A collection of moments captured through my lens, exploring the beauty in everyday life and extraordinary places."
            className="mb-16"
          />

          <div className="mb-12">
            <FilterTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              activeColor="green"
            />
          </div>

          {error && (
            <p className="text-sm text-muted-foreground/80 mb-6 text-center">
              {error} - Showing fallback images.
            </p>
          )}

          {loading ? (
            <div className="masonry-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="masonry-item animate-pulse"
                  style={{ aspectRatio: i % 2 === 0 ? "4/3" : "3/4" }}
                >
                  <div className="w-full h-full bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <div className="masonry-grid">
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className="masonry-item group cursor-pointer"
                  style={{ aspectRatio: image.aspectRatio }}
                  onClick={() => openModal(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedImageIndex !== null && galleryImages[selectedImageIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          <div className="relative flex-1 flex items-center justify-center p-4">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Page indicator at top */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-black/50 backdrop-blur-sm px-3 py-1">
                <span className="text-white text-sm font-medium">
                  {selectedImageIndex + 1} of {galleryImages.length}
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 max-h-full w-full">
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={galleryImages[selectedImageIndex].src}
                  alt={galleryImages[selectedImageIndex].alt}
                  className="max-w-full max-h-[70vh] lg:max-h-[75vh] object-contain"
                />
              </div>

              <div className="lg:w-80 bg-white/10 backdrop-blur-sm p-6 text-white">
                <h3 className="text-xl font-bold mb-4">{galleryImages[selectedImageIndex].name}</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-300">Date:</span>
                    <p className="font-medium">{galleryImages[selectedImageIndex].date}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-300">Location:</span>
                    <p className="font-medium">{galleryImages[selectedImageIndex].place}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-300">Description:</span>
                    <p className="text-sm leading-relaxed">{galleryImages[selectedImageIndex].alt}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation controls at bottom */}
          <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-t from-black/80 to-transparent">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
              onClick={goToPrevious}
              disabled={selectedImageIndex === 0}
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </Button>

            <div className="flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedImageIndex 
                      ? 'bg-white w-6' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
              onClick={goToNext}
              disabled={selectedImageIndex === galleryImages.length - 1}
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
