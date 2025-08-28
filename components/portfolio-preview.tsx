"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { getAssetPath } from "@/lib/image-utils"

interface GalleryImage {
  id: string
  src: string
  alt: string
  name: string
  date: string
  place: string
  category?: string
}

const fallbackImages = [
  {
    id: "1",
    src: getAssetPath("/modernist-concrete-building-with-geometric-shadows.png"),
    alt: "Geometric Shadows",
    name: "Geometric Shadows",
    date: "2024",
    place: "Berlin",
    category: "Architecture",
  },
  {
    id: "2",
    src: getAssetPath("/brutalist-tower-with-dramatic-sky.png"),
    alt: "Urban Monolith",
    name: "Urban Monolith", 
    date: "2024",
    place: "London",
    category: "Brutalist",
  },
  {
    id: "3",
    src: getAssetPath("/minimalist-interior-with-natural-light.png"),
    alt: "Light Studies",
    name: "Light Studies",
    date: "2024", 
    place: "Copenhagen",
    category: "Interior",
  },
  {
    id: "4",
    src: getAssetPath("/abstract-architectural-detail-with-patterns.png"),
    alt: "Pattern Language",
    name: "Pattern Language",
    date: "2024",
    place: "Tokyo", 
    category: "Details",
  },
  {
    id: "5",
    src: getAssetPath("/architectural-photography-light-shadow-modern-buil.png"),
    alt: "Light & Shadow",
    name: "Light & Shadow",
    date: "2024",
    place: "Barcelona",
    category: "Modern",
  },
  {
    id: "6",
    src: getAssetPath("/brutalist-concrete-architecture-berlin-dramatic-li.png"),
    alt: "Concrete Dreams",
    name: "Concrete Dreams",
    date: "2024",
    place: "Berlin",
    category: "Brutalist",
  },
  {
    id: "7",
    src: getAssetPath("/modern-glass-building-reflection.png"),
    alt: "Glass Reflections",
    name: "Glass Reflections",
    date: "2024",
    place: "New York",
    category: "Modern",
  },
  {
    id: "8",
    src: getAssetPath("/architectural-shadows-los-angeles-modern-building-.png"),
    alt: "Urban Shadows",
    name: "Urban Shadows",
    date: "2024",
    place: "Los Angeles",
    category: "Urban",
  },
  {
    id: "9",
    src: getAssetPath("/minimalist-modern-building-with-clean-lines-and-wh.png"),
    alt: "Clean Lines",
    name: "Clean Lines",
    date: "2024",
    place: "Zurich",
    category: "Minimal",
  },
  {
    id: "10",
    src: getAssetPath("/industrial-architecture-manchester-converted-wareh.png"),
    alt: "Industrial Heritage",
    name: "Industrial Heritage",
    date: "2024",
    place: "Manchester",
    category: "Industrial",
  },
  {
    id: "11",
    src: getAssetPath("/modern-geometric-building-tokyo-architecture.png"),
    alt: "Geometric Forms",
    name: "Geometric Forms",
    date: "2024",
    place: "Tokyo",
    category: "Geometric",
  },
  {
    id: "12",
    src: getAssetPath("/concrete-stairs-with-dramatic-lighting.png"),
    alt: "Dramatic Stairs",
    name: "Dramatic Stairs",
    date: "2024",
    place: "Oslo",
    category: "Details",
  },
]

export function PortfolioPreview() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 // Width of one card + gap
      scrollContainerRef.current.scrollBy({ 
        left: -scrollAmount, 
        behavior: 'smooth' 
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 // Width of one card + gap
      scrollContainerRef.current.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      })
    }
  }

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        // For static export, use fallback images
        setGalleryImages(fallbackImages)
        setLoading(false)
      } catch (error) {
        console.error("Error loading gallery images:", error)
        // Use fallback images
        setGalleryImages(fallbackImages)
        setLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [loading])

  return (
    <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <h2 className="font-heading font-extralight text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 text-foreground tracking-tight">
            Visual Stories
          </h2>
          <div className="w-16 h-px bg-accent mb-6 sm:mb-8"></div>
          <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed max-w-xl">
            Architectural photography exploring the relationship between form, light, and human experience
          </p>
        </div>

        {/* Side-scrolling gallery with navigation */}
        <div className="relative mb-12 sm:mb-16">
          {/* Left scroll button */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-300 ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Right scroll button */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-300 ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-3 sm:gap-4 pb-4 px-16" style={{ width: 'max-content' }}>
              {loading ? (
                // Loading skeleton
                Array(12).fill(0).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-64 sm:w-80 h-48 sm:h-60 bg-muted animate-pulse rounded-none" />
                ))
              ) : (
                galleryImages.map((image, index) => (
                  <div 
                    key={`${image.id}-${index}`} 
                    className="flex-shrink-0 w-64 sm:w-80 h-48 sm:h-60 group cursor-pointer relative overflow-hidden bg-card hover:architectural-shadow transition-all duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <img
                      src={image.src || getAssetPath("/placeholder.svg")}
                      alt={image.alt || image.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/0 via-black/0 to-black/10 group-hover:from-black/60 group-hover:via-black/20 group-hover:to-black/40 transition-all duration-700">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-700 ease-out">
                        <div className="text-xs font-light tracking-widest uppercase mb-2 opacity-80 transform translate-x-4 group-hover:translate-x-0 transition-transform duration-500 delay-100">
                          {image.category || image.place}
                        </div>
                        <h3 className="font-heading font-light text-xl tracking-wide transform translate-x-8 group-hover:translate-x-0 transition-transform duration-700 delay-200">
                          {image.name}
                        </h3>
                        <p className="text-xs opacity-70 mt-1 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-700 delay-300">
                          {image.place} • {image.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Gradient overlays for visual continuity */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-[5]" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-[5]" />
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="ghost"
            className="group font-light tracking-wide uppercase text-sm hover:bg-transparent"
          >
            <Link href="/gallery">
              <span className="border-b border-accent pb-1 group-hover:border-foreground transition-colors duration-300">
                View Gallery
              </span>
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
