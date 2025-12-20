"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
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

interface PortfolioPreviewProps {
  images?: GalleryImage[]
}

const fallbackImages: GalleryImage[] = [
  {
    id: "1",
    src: "/modernist-concrete-building-with-geometric-shadows.png",
    alt: "Geometric Shadows",
    name: "Geometric Shadows",
    date: "2024",
    place: "Berlin",
    category: "Architecture",
  },
  {
    id: "2",
    src: "/brutalist-tower-with-dramatic-sky.png",
    alt: "Urban Monolith",
    name: "Urban Monolith", 
    date: "2024",
    place: "London",
    category: "Brutalist",
  },
  {
    id: "3",
    src: "/minimalist-interior-with-natural-light.png",
    alt: "Light Studies",
    name: "Light Studies",
    date: "2024", 
    place: "Copenhagen",
    category: "Interior",
  },
  {
    id: "4",
    src: "/abstract-architectural-detail-with-patterns.png",
    alt: "Pattern Language",
    name: "Pattern Language",
    date: "2024",
    place: "Tokyo", 
    category: "Details",
  },
  {
    id: "5",
    src: "/architectural-photography-light-shadow-modern-buil.png",
    alt: "Light & Shadow",
    name: "Light & Shadow",
    date: "2024",
    place: "Barcelona",
    category: "Modern",
  },
  {
    id: "6",
    src: "/brutalist-concrete-architecture-berlin-dramatic-li.png",
    alt: "Concrete Dreams",
    name: "Concrete Dreams",
    date: "2024",
    place: "Berlin",
    category: "Brutalist",
  },
]

export function PortfolioPreview({ images }: PortfolioPreviewProps) {
  // Use provided images or fallback, limit to 6
  const displayImages = (images && images.length > 0 ? images : fallbackImages)
    .slice(0, 6)
    .map(img => ({
      ...img,
      src: img.src?.startsWith('http') ? img.src : getAssetPath(img.src || '/placeholder.svg')
    }))

  return (
    <section className="py-24 md:py-32" id="work">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header - Minimal */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
          <div>
            <span className="text-[10px] font-light tracking-[0.3em] text-muted-foreground uppercase block mb-4">
              Selected Work
            </span>
            <h2 className="text-4xl md:text-5xl font-extralight text-foreground">
              Portfolio
            </h2>
          </div>
          <Link 
            href="/gallery"
            className="group inline-flex items-center gap-3 text-sm tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors mt-6 md:mt-0"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayImages.map((image, index) => (
            <Link
              key={image.id}
              href="/gallery"
              className={`group relative overflow-hidden bg-muted cursor-pointer ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`${index === 0 ? 'aspect-square md:aspect-[4/3]' : 'aspect-[4/3]'} relative`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  loading="lazy"
                />
                
                {/* Minimal Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />
                
                {/* Content on Hover */}
                <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="text-white">
                    <h3 className="text-lg font-light mb-1">{image.name}</h3>
                    <p className="text-xs tracking-widest uppercase text-white/70">
                      {image.place} — {image.date}
                    </p>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/0 group-hover:border-white/50 transition-all duration-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
