"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface GalleryImage {
  id: string
  title: string
  imageUrl: string
  fallbackUrl?: string
  width?: number
  height?: number
  category?: string
  slug?: string
}

interface SelectedProjectsSectionProps {
  projects: GalleryImage[]
}

export function SelectedProjectsSection({ projects }: SelectedProjectsSectionProps) {
  if (projects.length === 0) return null

  // Show 8 images in compact grid
  const displayProjects = projects.slice(0, 8)

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Section Header - Minimal */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-lg md:text-xl text-foreground tracking-tight">
            Selected Work
          </h2>
          
          <Link
            href="/gallery"
            className="group flex items-center gap-2 text-[10px] font-mono tracking-wider text-muted-foreground hover:text-foreground uppercase transition-colors"
          >
            <span>View Gallery</span>
            <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </div>

        {/* Horizontal Slider - preserves original aspect ratios */}
        <div className="relative">
          <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {displayProjects.map((project, index) => (
              <Link key={project.id} href="/gallery" className="group flex-none snap-start">
                <div
                  className="relative h-[240px] sm:h-[280px] md:h-[320px] lg:h-[380px] overflow-hidden bg-secondary/50"
                  style={{
                    aspectRatio: project.width && project.height
                      ? `${project.width}/${project.height}`
                      : "4 / 3",
                  }}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    loading={index < 6 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index < 3 ? "high" : "auto"}
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      const img = event.currentTarget
                      if (img.dataset.fallback === "true") return
                      img.dataset.fallback = "true"
                      if (project.fallbackUrl) {
                        img.src = project.fallbackUrl
                      } else {
                        img.src = "/placeholder.jpg"
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight size={16} className="text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
