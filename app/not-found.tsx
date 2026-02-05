import Link from 'next/link'
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ArrowLeft, Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-2xl mx-auto py-24">
          {/* Large 404 */}
          <div className="relative mb-8">
            <span className="font-serif text-[120px] md:text-[180px] lg:text-[220px] font-bold text-muted/20 leading-none select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
            </div>
          </div>
          
          {/* Message */}
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground mb-4">
            Page not found
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a new location.
          </p>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors font-medium"
            >
              <Home size={18} />
              Go home
            </Link>
          </div>
          
          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">You might be looking for:</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link href="/about" className="text-sm text-foreground hover:text-accent transition-colors underline-offset-4 hover:underline">
                About
              </Link>
              <Link href="/portfolio" className="text-sm text-foreground hover:text-accent transition-colors underline-offset-4 hover:underline">
                Portfolio
              </Link>
              <Link href="/gallery" className="text-sm text-foreground hover:text-accent transition-colors underline-offset-4 hover:underline">
                Gallery
              </Link>
              <Link href="/blog" className="text-sm text-foreground hover:text-accent transition-colors underline-offset-4 hover:underline">
                Blog
              </Link>
              <Link href="/contact" className="text-sm text-foreground hover:text-accent transition-colors underline-offset-4 hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

