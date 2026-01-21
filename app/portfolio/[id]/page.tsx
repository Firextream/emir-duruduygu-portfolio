import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPortfolioItems } from "@/lib/notion"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, ArrowRight, MapPin, Calendar, ArrowUpRight } from "lucide-react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PortfolioItem {
  id: string
  name?: string
  description?: string
  category?: string
  src?: string
  alt?: string
  date?: string
  place?: string
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params
  const items = await getPortfolioItems()
  const project = items.find((item: PortfolioItem) => item.id === id)
  
  if (!project) {
    return { title: "Project Not Found" }
  }

  const title = project.name || "Untitled"
  return {
    title: `${title} | Portfolio`,
    description: project.description || `${title} - Photography project`,
  }
}

export default async function PortfolioDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const items = await getPortfolioItems()
  const currentIndex = items.findIndex((item: PortfolioItem) => item.id === id)
  const project = items[currentIndex]

  if (!project) {
    notFound()
  }

  const title = project.name || "Untitled"
  const imageUrl = project.src || "/placeholder.svg"
  
  // Get prev/next projects for navigation
  const prevProject = currentIndex > 0 ? items[currentIndex - 1] : null
  const nextProject = currentIndex < items.length - 1 ? items[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full">
        {/* Background Image */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/70 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-16">
          <div className="max-w-3xl space-y-4">
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full font-mono text-[10px] tracking-[0.2em] text-amber-400 uppercase">
              {project.category || 'Photography'}
            </span>
            
            {/* Title */}
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
              {title}
            </h1>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              {project.place && (
                <div className="flex items-center gap-2 text-white/50">
                  <MapPin size={14} className="text-amber-500/70" />
                  <span className="text-sm">{project.place}</span>
                </div>
              )}
              {project.date && (
                <div className="flex items-center gap-2 text-white/50">
                  <Calendar size={14} className="text-amber-500/70" />
                  <span className="text-sm">{project.date}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      {project.description && (
        <section className="py-20 lg:py-28 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto px-8 lg:px-16">
            <div className="relative">
              {/* Decorative Line */}
              <div className="absolute -left-8 top-0 w-px h-full bg-gradient-to-b from-amber-500/50 to-transparent" />
              
              <span className="font-mono text-[10px] tracking-[0.3em] text-amber-500/70 uppercase mb-6 block">
                About This Project
              </span>
              <p className="text-xl lg:text-2xl text-white/70 leading-relaxed font-light">
                {project.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Project Navigation */}
      <section className="border-t border-white/10 bg-[#0a0a0a]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Previous */}
          <Link 
            href={prevProject ? `/portfolio/${prevProject.id}` : "/portfolio"}
            className="group relative p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/10 hover:bg-white/5 transition-all duration-300"
          >
            <div className="flex items-center gap-3 text-white/30 mb-3">
              <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform text-amber-500/50" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
                {prevProject ? "Previous" : "Back to"}
              </span>
            </div>
            <h3 className="font-serif text-xl lg:text-2xl text-white/80 group-hover:text-white transition-colors">
              {prevProject ? (prevProject.name || "Untitled") : "All Projects"}
            </h3>
          </Link>

          {/* Next */}
          <Link 
            href={nextProject ? `/portfolio/${nextProject.id}` : "/portfolio"}
            className="group relative p-8 lg:p-12 hover:bg-white/5 transition-all duration-300 text-right"
          >
            <div className="flex items-center justify-end gap-3 text-white/30 mb-3">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
                {nextProject ? "Next" : "View all"}
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform text-amber-500/50" />
            </div>
            <h3 className="font-serif text-xl lg:text-2xl text-white/80 group-hover:text-white transition-colors">
              {nextProject ? (nextProject.name || "Untitled") : "All Projects"}
            </h3>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 flex items-center justify-between">
          <Link 
            href="/"
            className="font-serif text-white/40 hover:text-white/70 transition-colors"
          >
            Duruduygu
          </Link>
          <Link 
            href="/portfolio"
            className="group flex items-center gap-2 font-mono text-[10px] tracking-wider text-white/30 hover:text-amber-500/70 uppercase transition-colors"
          >
            <span>Portfolio</span>
            <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </footer>
    </div>
  )
}

