"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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

interface GalleryApiImage {
  id: string
  name?: string
  alt?: string
  src: string
  srcFull?: string
  srcOriginal?: string
  width?: number
  height?: number
  category?: string
  selected?: boolean
}

interface GalleryApiResponse {
  success: boolean
  total: number
  images: GalleryApiImage[]
  error?: string
}

interface SelectedProjectsSectionProps {
  projects: GalleryImage[]
}

export function SelectedProjectsSection({ projects }: SelectedProjectsSectionProps) {
  const [projectItems, setProjectItems] = useState<GalleryImage[]>(projects)
  const [refreshToken, setRefreshToken] = useState(0)
  const refreshOnceRef = useRef(false)
  const refreshInFlightRef = useRef(false)

  useEffect(() => {
    setProjectItems(projects)
  }, [projects])

  const refreshProjects = useCallback(async () => {
    if (refreshInFlightRef.current) return
    refreshInFlightRef.current = true

    try {
      const response = await fetch("/api/gallery?limit=8&selected=1", {
        cache: "no-store",
      })
      if (!response.ok) {
        throw new Error(`Gallery refresh failed (${response.status})`)
      }
      const data = (await response.json()) as GalleryApiResponse
      if (!data?.images || data.images.length === 0) {
        throw new Error("Gallery refresh returned no images")
      }

      const mapped = data.images.map((img) => ({
        id: img.id,
        title: img.name || img.alt || "Untitled",
        imageUrl: img.src,
        fallbackUrl: img.srcOriginal || img.srcFull || undefined,
        width: img.width,
        height: img.height,
        category: img.category,
      }))

      setProjectItems(mapped)
      setRefreshToken((token) => token + 1)
    } catch (error) {
      console.warn("Gallery refresh failed:", error)
    } finally {
      refreshInFlightRef.current = false
    }
  }, [])

  if (projectItems.length === 0) return null

  // Show up to 8 selected images in a horizontal slider
  const displayProjects = projectItems.slice(0, 8)
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
            className="flex items-start gap-2 sm:gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth touch-pan-x"
          >
            {displayProjects.map((project, index) => (
              <Link
                key={`${project.id}-${refreshToken}`}
                href="/gallery"
                className="group flex-none snap-start w-[64vw] sm:w-[320px] md:w-[360px] lg:w-[400px] xl:w-[440px] 2xl:w-[480px]"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden bg-transparent"
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    loading={index < 6 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index < 3 ? "high" : "auto"}
                    referrerPolicy="no-referrer"
                    onError={(event) => {
                      const img = event.currentTarget
                      const stage = img.dataset.stage || "primary"
                      if (stage === "primary" && project.fallbackUrl) {
                        img.dataset.stage = "fallback"
                        img.src = project.fallbackUrl
                        return
                      }

                      if (!refreshOnceRef.current) {
                        refreshOnceRef.current = true
                        img.dataset.stage = "refresh"
                        void refreshProjects()
                        return
                      }

                      img.dataset.stage = "failed"
                      img.src = "/placeholder.jpg"
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
