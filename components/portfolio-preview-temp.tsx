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
]

export function PortfolioPreview() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    const loadImages = async () => {
      try {
        setImages(fallbackImages)
        setError(null)
      } catch (error) {
        console.error("Error loading images:", error)
        setError(error instanceof Error ? error.message : "Failed to load images")
        setImages(fallbackImages)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
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
    <section className="py-32 px-6 max-w-7xl mx-auto relative">
      <div className="mb-16">
        <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
          Visual Stories
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          A curated collection of architectural moments captured through a modernist lens.
        </p>
      </div>

      {loading ? (
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="w-96 h-64 bg-muted animate-pulse rounded-lg flex-shrink-0" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Unable to load gallery images</p>
          <p className="text-sm text-muted-foreground/70">{error}</p>
        </div>
      ) : (
        <div className="relative group">
          <div 
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {images.map((image, index) => (
              <div
                key={image.id}
                className="flex-shrink-0 group/item relative overflow-hidden rounded-lg bg-card border border-border hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-black/20 w-64 sm:w-80 md:w-96"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover/item:bg-black/40 transition-colors duration-500" />
                  
                  <div className="absolute inset-0 flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-light mb-2 leading-tight">{image.name}</h3>
                      <div className="flex items-center text-sm text-white/80 gap-4">
                        <span>{image.place}</span>
                        <span>•</span>
                        <span>{image.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-white/20 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 w-10 h-10 rounded-full"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </Button>
          )}

          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-white/20 shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 w-10 h-10 rounded-full"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </Button>
          )}
        </div>
      )}

      <div className="text-center mt-16">
        <div className="inline-flex">
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
