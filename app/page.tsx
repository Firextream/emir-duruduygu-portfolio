import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutJourneySection } from "@/components/about-journey-section"
import { BlogPreview } from "@/components/blog-preview"
import { PortfolioPreview } from "@/components/portfolio-preview"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { SmoothScroll } from "@/components/smooth-scroll"
import { FloatingElements } from "@/components/floating-elements"
import { getAllPosts, getGalleryImages } from "@/lib/notion"

export default async function HomePage() {
  // Fetch posts and gallery images on the server side
  const [posts, galleryImages] = await Promise.all([
    getAllPosts(),
    getGalleryImages()
  ])
  const blogPosts = posts.slice(0, 3) // Get first 3 posts for preview
  
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingElements />
      <SmoothScroll>
        <Navigation />
        <main className="relative z-10">
          <HeroSection />
          <section id="thoughts">
            <BlogPreview posts={blogPosts} />
          </section>
          <AboutJourneySection />
          <PortfolioPreview images={galleryImages} />
          <section id="contact">
            <ContactSection />
          </section>
        </main>
        <Footer />
      </SmoothScroll>
    </div>
  )
}
