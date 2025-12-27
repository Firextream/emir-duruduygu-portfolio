"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"

const categories = [
  "Architecture",
  "Urban",
  "Minimalist",
  "Light & Shadow",
  "Abstract",
  "Documentary",
  "Street",
  "Landscape",
]

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 pt-24 lg:pt-0">
        {/* Left Column - Typography */}
        <div className="flex flex-col justify-center px-6 lg:px-12 py-12 lg:py-24">
          <div className="max-w-xl space-y-8">
            {/* Subtitle */}
            <div 
              className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <p className="font-mono text-sm tracking-wider text-muted-foreground uppercase">
                Visual Storyteller & Photographer
              </p>
            </div>
            
            {/* Main Title */}
            <h1 className="space-y-2">
              <span 
                className={`block font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight text-foreground transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                Capturing
              </span>
              <span 
                className={`block font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight text-foreground transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                Light & <span className="text-accent">Shadow</span>
              </span>
            </h1>
            
            {/* Description */}
            <p 
              className={`text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Architecture and street photography exploring the interplay of structure, light, and human experience.
            </p>
            
            {/* CTA Buttons */}
            <div 
              className={`flex items-center gap-6 pt-4 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
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
        <div 
          className={`relative h-[50vh] lg:h-auto transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          <Image
            src="/coastal-harbor-scene.jpg"
            alt="Featured architectural photograph"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          
          {/* Top Gradient Overlay for Navigation Visibility */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
          
          {/* Image Overlay Info */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white/80">
            <div>
              <p className="font-mono text-xs tracking-wider uppercase">Featured Work</p>
              <p className="font-serif text-lg mt-1">Coastal Serenity</p>
            </div>
            <span className="font-mono text-sm">2024</span>
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
      <div 
        className={`absolute bottom-24 left-6 lg:left-12 flex flex-col items-center gap-2 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase rotate-90 origin-center mb-8">
          Scroll
        </span>
        <ArrowDown size={16} className="text-muted-foreground animate-bounce" />
      </div>
    </section>
  )
}
