"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

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
    src: "/modernist-concrete-building-with-geometric-shadows.png",
    alt: "Geometric Shadows",
    name: "Geometric Shadows",
    date: "2024",
    place: "Architecture",
    category: "Architecture",
  },
  {
    id: "2",
    src: "/brutalist-tower-with-dramatic-sky.png",
    alt: "Urban Monolith",
    name: "Urban Monolith", 
    date: "2024",
    place: "Urban",
    category: "Urban",
  },
  {
    id: "3",
    src: "/minimalist-interior-with-natural-light.png",
    alt: "Light Studies",
    name: "Light Studies",
    date: "2024", 
    place: "Interior",
    category: "Interior",
  },
  {
    id: "4",
    src: "/abstract-architectural-detail-with-patterns.png",
    alt: "Pattern Language",
    name: "Pattern Language",
    date: "2024",
    place: "Details", 
    category: "Details",
  },
]

export function PortfolioPreview() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/gallery?limit=36")
        const data = await response.json()
        
        if (data.success && data.images?.length > 0) {
          // Shuffle and take last 36 images
          const shuffled = [...data.images].sort(() => Math.random() - 0.5)
          setGalleryImages(shuffled.slice(0, 36))
        } else {
          // Use fallback images repeated to fill 36 slots
          const repeated = Array(9).fill(fallbackImages).flat()
          setGalleryImages(repeated.slice(0, 36))
        }
      } catch (error) {
        console.error("Error fetching gallery images:", error)
        // Use fallback images repeated to fill 36 slots
        const repeated = Array(9).fill(fallbackImages).flat()
        setGalleryImages(repeated.slice(0, 36))
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryImages()
  }, [])

  return (
    <section className="py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <h2 className="font-heading font-extralight text-5xl md:text-6xl mb-6 text-foreground tracking-tight">
            Visual Stories
          </h2>
          <div className="w-16 h-px bg-accent mb-8"></div>
          <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-xl">
            Architectural photography exploring the relationship between form, light, and human experience
          </p>
        </div>

        {/* Side-scrolling gallery */}
        <div className="relative mb-16">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
              {loading ? (
                // Loading skeleton
                Array(12).fill(0).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-80 h-60 bg-muted animate-pulse rounded-none" />
                ))
              ) : (
                galleryImages.map((image, index) => (
                  <div 
                    key={`${image.id}-${index}`} 
                    className="flex-shrink-0 w-80 h-60 group cursor-pointer relative overflow-hidden bg-card hover:architectural-shadow transition-all duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt || image.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      sizes="320px"
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
          
          {/* Scroll hint */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-l from-background via-background/80 to-transparent w-32 h-full pointer-events-none" />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-light opacity-60">
            Scroll →
          </div>
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="ghost"
            className="group font-light tracking-wide uppercase text-sm hover:bg-transparent"
          >
            <Link href="/portfolio">
              <span className="border-b border-accent pb-1 group-hover:border-foreground transition-colors duration-300">
                View Portfolio
              </span>
              <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
