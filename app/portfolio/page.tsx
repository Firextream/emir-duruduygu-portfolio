import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Construction } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A curated collection of architectural, street, and travel photography projects.",
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      {/* Coming Soon Section */}
      <main className="flex-1 pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            {/* Icon */}
            <div className="w-20 h-20 mb-8 border-2 border-accent/30 rounded-full flex items-center justify-center">
              <Construction className="w-10 h-10 text-accent" />
            </div>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Coming Soon
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              This section is currently under construction. Projects and works will be shared here soon.
            </p>

            {/* Subtitle */}
            <p className="font-mono text-sm text-muted-foreground/70 tracking-wider uppercase mb-12">
              Portfolio - Projects - Works
            </p>

            {/* CTA */}
            <Link
              href="/gallery"
              className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background font-medium rounded-sm hover:bg-foreground/90 transition-colors"
            >
              Browse Gallery
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
