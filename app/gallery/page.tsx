"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SectionHeader, FilterTabs } from "@/components/unified-design-system"

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

const fallbackImages: GalleryImage[] = [
  {
    id: "1",
    src: getAssetPath("/modernist-concrete-building-with-geometric-shadows.png"),
    alt: "Geometric Shadows",
    aspectRatio: "4/3",
    name: "Geometric Shadows",
    date: "March 2024",
    place: "Berlin",
    category: "Architecture",
    featured: true,
  },
  {
    id: "2",
    src: getAssetPath("/brutalist-tower-with-dramatic-sky.png"),
    alt: "Urban Monolith",
    aspectRatio: "3/4",
    name: "Urban Monolith",
    date: "February 2024",
    place: "London",
    category: "Brutalist",
  },
  {
    id: "3",
    src: getAssetPath("/minimalist-interior-with-natural-light.png"),
    alt: "Light Studies",
    aspectRatio: "16/9",
    name: "Light Studies",
    date: "January 2024",
    place: "Copenhagen",
    category: "Interior",
  },
  {
    id: "4",
    src: getAssetPath("/abstract-architectural-detail-with-patterns.png"),
    alt: "Pattern Language",
    aspectRatio: "1/1",
    name: "Pattern Language",
    date: "December 2023",
    place: "Tokyo",
    category: "Details",
  },
  {
    id: "5",
    src: getAssetPath("/architectural-photography-light-shadow-modern-buil.png"),
    alt: "Light & Shadow",
    aspectRatio: "4/3",
    name: "Light & Shadow",
    date: "November 2023",
    place: "Barcelona",
    category: "Modern",
  },
  {
    id: "6",
    src: getAssetPath("/brutalist-concrete-architecture-berlin-dramatic-li.png"),
    alt: "Concrete Dreams",
    aspectRatio: "3/4",
    name: "Concrete Dreams",
    date: "October 2023",
    place: "Berlin",
    category: "Brutalist",
    featured: true,
  },
  {
    id: "7",
    src: getAssetPath("/modern-glass-building-reflection.png"),
    alt: "Glass Reflections",
    aspectRatio: "16/9",
    name: "Glass Reflections",
    date: "September 2023",
    place: "New York",
    category: "Modern",
  },
  {
    id: "8",
    src: getAssetPath("/architectural-shadows-los-angeles-modern-building-.png"),
    alt: "Urban Shadows",
    aspectRatio: "4/3",
    name: "Urban Shadows",
    date: "August 2023",
    place: "Los Angeles",
    category: "Urban",
  },
  {
    id: "9",
    src: getAssetPath("/minimalist-modern-building-with-clean-lines-and-wh.png"),
    alt: "Clean Lines",
    aspectRatio: "3/4",
    name: "Clean Lines",
    date: "July 2023",
    place: "Zurich",
    category: "Minimal",
  },
  {
    id: "10",
    src: getAssetPath("/industrial-architecture-manchester-converted-wareh.png"),
    alt: "Industrial Heritage",
    aspectRatio: "16/9",
    name: "Industrial Heritage",
    date: "June 2023",
    place: "Manchester",
    category: "Industrial",
  },
  {
    id: "11",
    src: getAssetPath("/modern-geometric-building-tokyo-architecture.png"),
    alt: "Geometric Forms",
    aspectRatio: "1/1",
    name: "Geometric Forms",
    date: "May 2023",
    place: "Tokyo",
    category: "Geometric",
    featured: true,
  },
  {
    id: "12",
    src: getAssetPath("/concrete-stairs-with-dramatic-lighting.png"),
    alt: "Dramatic Stairs",
    aspectRatio: "4/3",
    name: "Dramatic Stairs",
    date: "April 2023",
    place: "Oslo",
    category: "Details",
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
