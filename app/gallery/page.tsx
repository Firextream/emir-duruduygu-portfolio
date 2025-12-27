import type { Metadata } from "next"
import { getGalleryImages } from "@/lib/notion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GalleryClient } from "./GalleryClient"

export const metadata: Metadata = {
  title: "Gallery",
  description: "A curated collection of architectural and street photography.",
}

// Force dynamic rendering to ensure env vars are available at runtime
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function GalleryPage() {
  const images = await getGalleryImages()
  
  // Get unique categories
  const categories = [...new Set(
    images
      .map(img => img.category)
      .filter((category): category is string => Boolean(category))
  )]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Page Header */}
          <div className="mb-16 lg:mb-24">
            <span className="font-mono text-sm tracking-wider text-accent uppercase block mb-4">
              Collection
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Gallery
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              A collection of photos from all around — moments, places, and things that caught my eye.
            </p>
          </div>

          <GalleryClient images={images} categories={categories} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
