import type { Metadata } from "next"
import { getPortfolioItems } from "@/lib/notion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid"
import { ArrowDown } from "lucide-react"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A curated collection of architectural, street, and travel photography projects.",
}

export const revalidate = 3600

export default async function PortfolioPage() {
  const items = await getPortfolioItems()
  
  // Filter out null items and ensure proper format
  const projects = (items || []).filter((item): item is NonNullable<typeof item> => item !== null)
  
  // Get unique categories
  const categories = [...new Set(
    projects
      .map(item => item.category)
      .filter((category): category is string => Boolean(category))
  )]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-end bg-foreground overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 100px, currentColor 100px, currentColor 101px)`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pb-16 lg:pb-24 w-full">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <span className="inline-flex items-center gap-3 text-background/50 mb-6">
                <span className="w-12 h-px bg-background/30" />
                <span className="font-mono text-xs tracking-[0.3em] uppercase">Portfolio</span>
              </span>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-background font-light leading-[0.9] tracking-tight">
                Selected
                <br />
                <span className="italic">Works</span>
              </h1>
            </div>
            <div className="col-span-12 lg:col-span-4 flex flex-col justify-end">
              <p className="text-background/60 text-lg leading-relaxed">
                A curated collection exploring architecture, urban landscapes, and the poetic spaces in between.
              </p>
              <div className="flex items-center gap-3 mt-8 text-background/40">
                <span className="font-mono text-xs tracking-wider">{projects.length} Projects</span>
                <span className="w-px h-4 bg-background/20" />
                <span className="font-mono text-xs tracking-wider">{categories.length} Categories</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-background/40">
          <ArrowDown size={20} className="animate-bounce" />
        </div>
      </section>

      {/* Portfolio Content */}
      <main className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <PortfolioGrid projects={projects} categories={categories} />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
