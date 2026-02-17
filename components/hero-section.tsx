"use client"

import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { Typewriter } from "@/components/typewriter"

const categories = [
  "Architecture",
  "Urban",
  "Minimalist",
  "Light & Shadow",
  "Abstract",
  "Documentary",
  "Street",
  "Landscape",
  "Electronics",
  "Drawing",
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 pt-20 lg:pt-0">
        {/* Left Column - Typography */}
        <div className="flex flex-col justify-center px-5 sm:px-6 lg:px-12 py-8 lg:py-24">
          <div className="max-w-xl space-y-8">
            {/* Subtitle */}
            <div>
              <p className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
                Visual Storyteller & Photographer
              </p>
            </div>
            
            {/* Main Title */}
            <h1 className="space-y-1 sm:space-y-2">
              <span className="block font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight text-foreground">
                Capturing
              </span>
              {/* Fixed height container to prevent layout shift */}
              <span className="block font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight text-foreground min-h-[2.4em]">
                <Typewriter 
                  words={["Light & Shadow", "Urban Stories", "Quiet Moments", "Hidden Details"]}
                  className="text-accent"
                  typingSpeed={80}
                  deletingSpeed={40}
                  pauseTime={3000}
                />
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
              Amateur photographer and curious explorer. Capturing architecture, street moments, and anything that sparks inspiration - structure, light, and the unexpected.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex items-center gap-6 pt-4">
              <Link 
                href="/portfolio"
                className="group inline-flex items-center gap-3 text-foreground font-medium"
              >
                <span className="relative">
                  View Portfolio
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                </span>
                <span className="w-8 h-px bg-foreground group-hover:w-12 transition-all duration-300" />
              </Link>
              
              <Link 
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Column - Featured Image */}
        <div className="relative h-[50vh] lg:h-auto bg-white dark:bg-neutral-900">
          {/* subtle solid background to prevent bright 'pop' while loading */}
          <div className="absolute inset-0 bg-white dark:bg-neutral-900" aria-hidden="true" />
          <picture className="absolute inset-0 block">
            <source media="(max-width: 767px)" type="image/avif" srcSet="/2-IMG_3849-mobile.avif" />
            <source media="(max-width: 767px)" type="image/webp" srcSet="/2-IMG_3849-mobile.webp" />
            <source type="image/avif" srcSet="/2-IMG_3849-desktop.avif" />
            <source type="image/webp" srcSet="/2-IMG_3849-desktop.webp" />
            <img
              src="/2-IMG_3849-desktop.jpg"
              alt="Featured architectural photograph"
              className="w-full h-full object-cover bg-white dark:bg-neutral-900 brightness-[0.88] contrast-[1.08] saturate-[0.92]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={1920}
              height={1280}
            />
          </picture>
          
          {/* Top Gradient Overlay for Navigation Visibility */}
          <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/62 via-black/28 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/68 via-black/25 to-transparent pointer-events-none" />
          
          {/* Image Overlay Info */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white/95 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
            <div>
              <p className="font-mono text-xs tracking-wider uppercase text-white/80">Featured Work</p>
              <p className="font-serif text-lg mt-1">Urban Pleats</p>
            </div>
            <span className="font-mono text-sm text-white/90">2025</span>
          </div>
        </div>
      </div>
      
      {/* Marquee Categories Bar */}
      <div className="border-y border-border overflow-hidden py-4 bg-secondary/30">
        <div className="animate-marquee flex gap-12 whitespace-nowrap">
          {[...categories, ...categories].map((category, index) => (
            <span 
              key={index} 
              className="font-mono text-sm tracking-wider text-muted-foreground uppercase flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              {category}
            </span>
          ))}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-24 left-6 lg:left-12 flex flex-col items-center gap-2">
        <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase rotate-90 origin-center mb-8">
          Scroll
        </span>
        <ArrowDown size={16} className="text-muted-foreground animate-bounce" />
      </div>
    </section>
  )
}
