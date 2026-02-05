"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

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

  // Show up to 8 selected images in a horizontal slider
  const displayProjects = projects.slice(0, 8)
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = () => {
    const el = scrollerRef.current
    if (!el) return
    const maxScrollLeft = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 4)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    updateScrollState()
    const onScroll = () => updateScrollState()
    el.addEventListener("scroll", onScroll, { passive: true })
    const ro = new ResizeObserver(() => updateScrollState())
    ro.observe(el)
    return () => {
      el.removeEventListener("scroll", onScroll)
      ro.disconnect()
    }
  }, [displayProjects.length])

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.8)
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Section Header - Minimal */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-lg md:text-xl text-foreground tracking-tight">
            Selected Work
          </h2>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByAmount("left")}
                disabled={!canScrollLeft}
                className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount("right")}
                disabled={!canScrollRight}
                className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <Link
              href="/gallery"
              className="group flex items-center gap-2 text-[10px] font-mono tracking-wider text-muted-foreground hover:text-foreground uppercase transition-colors"
            >
              <span>View Gallery</span>
              <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Horizontal Slider - preserves original aspect ratios */}
        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex items-start gap-5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth touch-pan-x"
          >
            {displayProjects.map((project, index) => (
              <Link
                key={project.id}
                href="/gallery"
                className="group flex-none snap-start w-[78vw] sm:w-[68vw] md:w-[60vw] lg:w-[52vw] xl:w-[48vw] 2xl:w-[44vw]"
              >
                <div
                  className="relative overflow-hidden bg-secondary/50"
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
