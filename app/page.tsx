"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { BlogPreview } from "@/components/blog-preview"
import { PortfolioPreview } from "@/components/portfolio-preview"
import { ResumePreview } from "@/components/resume-preview"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { SmoothScroll } from "@/components/smooth-scroll"
import { FloatingElements } from "@/components/floating-elements"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingElements />
      <SmoothScroll>
        <Navigation />
        <main className="relative z-10">
          <HeroSection />
          <AboutSection />
          <section id="thoughts">
            <BlogPreview />
          </section>
          <PortfolioPreview />
          <ResumePreview />
          <section id="contact">
            <ContactSection />
          </section>
        </main>
        <Footer />
      </SmoothScroll>
    </div>
  )
}
