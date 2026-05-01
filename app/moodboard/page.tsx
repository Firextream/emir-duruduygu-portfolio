import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MoodboardGallery } from "./MoodboardGallery"
import { getMoodboardCollectionsFromNotion } from "@/lib/notion-moodboard"
import { getMoodboardCollectionsFromDirectus } from "@/lib/directus-moodboard"

export const metadata: Metadata = {
  title: "Moodboard",
  description: "A curated gallery of architectural inspiration, color systems, and typographic experiments.",
}

// Revalidate every hour to refresh expired Notion/Directus URLs while keeping the page incredibly fast
export const revalidate = 3600

export default async function MoodboardPage() {
  // Try Directus first, then Notion, then fall back to static local data
  const directusCollections = await getMoodboardCollectionsFromDirectus()
  const notionCollections = await getMoodboardCollectionsFromNotion()
  
  const collections = (directusCollections && directusCollections.length > 0)
    ? directusCollections
    : (notionCollections && notionCollections.length > 0)
      ? notionCollections
      : []

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-24">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          <MoodboardGallery collections={collections} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
