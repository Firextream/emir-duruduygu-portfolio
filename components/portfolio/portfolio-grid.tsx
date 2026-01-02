"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowUpRight, Eye } from "lucide-react"

interface PortfolioItem {
  id: string
  name?: string
  title?: string
  description?: string
  category?: string
  src?: string
  image?: string
  alt?: string
  date?: string
  place?: string
  technologies?: string[]
  link?: string
  github?: string
  featured?: boolean
}

interface PortfolioGridProps {
  projects: PortfolioItem[]
  categories: string[]
}

export function PortfolioGrid({ projects, categories }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filteredProjects = activeCategory 
    ? projects.filter((p) => p.category === activeCategory) 
    : projects

  return (
    <div>
      {/* Category Filters - Pill Style */}
      <div className="flex flex-wrap items-center gap-3 mb-16">
        <span className="font-mono text-xs text-muted-foreground tracking-wider mr-4">Filter:</span>
        <button 
          onClick={() => setActiveCategory(null)}
          className={cn(
            "px-4 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition-all duration-300",
            activeCategory === null 
              ? "bg-foreground text-background" 
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          )}
        >
          All Work
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition-all duration-300",
              activeCategory === category 
                ? "bg-foreground text-background" 
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry-style Grid */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {filteredProjects.map((project, index) => {
          const imageUrl = project.src || project.image || "/placeholder.svg"
          const title = project.title || project.name || "Untitled"
          const isHovered = hoveredId === project.id
          
          // Varied sizing for visual interest
          const sizePatterns = [
            "col-span-12 md:col-span-8 aspect-[16/10]",
            "col-span-12 md:col-span-4 aspect-[4/5]",
            "col-span-12 md:col-span-6 aspect-[4/3]",
            "col-span-12 md:col-span-6 aspect-[4/3]",
            "col-span-12 md:col-span-4 aspect-[4/5]",
            "col-span-12 md:col-span-8 aspect-[16/10]",
          ]
          const sizeClass = sizePatterns[index % sizePatterns.length]
          
          return (
            <Link 
              key={project.id}
              href={`/portfolio/${project.id}`}
              className={cn("group block relative", sizeClass.split(' ').slice(0, 3).join(' '))}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={cn("relative w-full h-full overflow-hidden bg-secondary", sizeClass.split(' ').slice(3).join(' '))}>
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className={cn(
                    "object-cover transition-all duration-700",
                    isHovered ? "scale-105 brightness-75" : "scale-100 brightness-100"
                  )}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Gradient Overlay */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500",
                  isHovered ? "opacity-100" : "opacity-0"
                )} />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 lg:p-6">
                  {/* Top - Category & View Icon */}
                  <div className={cn(
                    "flex items-start justify-between transition-all duration-500",
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                  )}>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full font-mono text-[10px] tracking-wider text-white uppercase">
                      {project.category || 'Photography'}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Eye size={16} className="text-white" />
                    </div>
                  </div>
                  
                  {/* Bottom - Title & Info */}
                  <div className={cn(
                    "transition-all duration-500",
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    <h3 className="font-serif text-xl lg:text-2xl xl:text-3xl text-white mb-2">
                      {title}
                    </h3>
                    {project.place && (
                      <p className="font-mono text-xs text-white/60 tracking-wider">
                        {project.place} {project.date && `· ${project.date}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Corner Accent */}
                <div className={cn(
                  "absolute bottom-0 right-0 w-16 h-16 transition-all duration-500",
                  isHovered ? "opacity-100" : "opacity-0"
                )}>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/30" />
                </div>
              </div>
              
              {/* Project Number - inside card on mobile, outside on desktop */}
              <div className="absolute left-3 top-3 md:-left-4 md:top-4 font-mono text-xs md:text-[10px] text-white/70 md:text-muted-foreground tracking-wider z-10 bg-black/30 md:bg-transparent px-2 py-1 md:p-0 rounded">
                {String(index + 1).padStart(2, '0')}
              </div>
            </Link>
          )
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-32">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <Eye size={24} className="text-muted-foreground" />
          </div>
          <p className="font-serif text-2xl text-foreground mb-2">No projects found</p>
          <p className="text-muted-foreground">Try selecting a different category.</p>
        </div>
      )}
    </div>
  )
}
