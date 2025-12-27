import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

interface GalleryImage {
  id: string
  title: string
  imageUrl: string
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
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
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

        {/* Compact 4x2 Grid */}
        <div className="grid grid-cols-4 gap-1">
          {displayProjects.map((project) => (
            <Link key={project.id} href="/gallery" className="group block">
              <div className="relative aspect-square overflow-hidden bg-secondary/50">
                <Image 
                  src={project.imageUrl} 
                  alt={project.title} 
                  fill 
                  className="object-cover transition-all duration-500 group-hover:scale-105" 
                  sizes="25vw" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight size={16} className="text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
