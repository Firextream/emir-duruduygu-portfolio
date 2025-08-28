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
      const scrollAmount = 340 // Width of one card + gap (w-64 = 256px + larger gap)
      scrollContainerRef.current.scrollBy({ 
        left: -scrollAmount, 
        behavior: 'smooth' 
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340 // Width of one card + gap (w-64 = 256px + larger gap)
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
    <section className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 bg-background">
      <div className="max-w-8xl mx-auto">
        <div className="mb-20 sm:mb-24 lg:mb-28">
          <h2 className="font-heading font-extralight text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6 text-foreground tracking-tight">
            Visual Stories
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl opacity-80">
            Architectural photography exploring the relationship between form, light, and human experience
          </p>
        </div>

        {/* Enhanced side-scrolling gallery */}
        <div className="relative mb-20 sm:mb-24">
          {/* Enhanced scroll buttons */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-200 ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'} border border-border/20`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90 transition-all duration-200 ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'} border border-border/20`}
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
            <div className="flex gap-3 sm:gap-4 md:gap-5 pb-6 px-16" style={{ width: 'max-content' }}>
              {loading ? (
                // Enhanced loading skeleton
                Array(8).fill(0).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-64 sm:w-80 md:w-96 h-44 sm:h-56 md:h-64 bg-muted/50 animate-pulse rounded-sm" />
                ))
              ) : (
                galleryImages.slice(0, 8).map((image, index) => (
                  <div 
                    key={`${image.id}-${index}`} 
                    className="flex-shrink-0 w-64 sm:w-80 md:w-96 h-44 sm:h-56 md:h-64 group cursor-pointer relative overflow-hidden bg-card transition-all duration-300 hover:shadow-xl rounded-sm"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <img
                      src={image.src || getAssetPath("/placeholder.svg")}
                      alt={image.alt || image.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-300 ease-out">
                        <h3 className="font-light text-base tracking-wide mb-1">
                          {image.name}
                        </h3>
                        <p className="text-sm opacity-80">
                          {image.place}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Enhanced gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-[5]" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-[5]" />
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="ghost"
            className="group font-light tracking-wider text-sm uppercase hover:bg-transparent p-0"
          >
            <Link href="/gallery" className="inline-flex items-center">
              <span className="border-b border-muted-foreground/30 pb-1 group-hover:border-foreground transition-colors duration-300">
                View Gallery
              </span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
