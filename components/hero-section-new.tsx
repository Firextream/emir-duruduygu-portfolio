"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)
    setIsLoaded(true)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden layer-base bg-black">
      
      <div className="absolute inset-0 z-0">
        <Image
          src="/coastal-harbor-scene.jpg"
          alt="Coastal Harbor Scene"
          fill
          className="object-cover"
          priority
          quality={90}
          sizes="100vw"
          placeholder="empty"
        />
      </div>

      <div className="relative z-10 text-white max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-start h-full">
        <div className="max-w-2xl">
          <div className="mb-2 text-xs font-light tracking-[0.2em] text-white/80 uppercase ml-0 sm:ml-16">
            Architectural Photography
          </div>

          <h1 className="font-heading font-extralight text-3xl sm:text-4xl md:text-6xl mb-4 sm:mb-6 tracking-tighter leading-none">
            Duruduygu
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-16 text-white/70 font-light tracking-wide leading-relaxed px-2 sm:px-0">
            Capturing the essence of modernist architecture through minimalist composition and dramatic light
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <Link href="/portfolio">
              <Button
                size="lg"
                variant="outline"
                className="border border-white/20 text-white hover:bg-white hover:text-black bg-transparent backdrop-blur-sm transition-all duration-300 font-light tracking-wider px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base hover:architectural-shadow w-full sm:w-auto min-h-[48px]"
              >
                View Portfolio
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 backdrop-blur-sm transition-all duration-300 font-light tracking-wider px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base hover:architectural-shadow w-full sm:w-auto min-h-[48px]"
              >
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:text-accent transition-colors duration-300 animate-bounce touch-target"
        aria-label="Scroll to content"
      >
        <ArrowDown className="h-6 w-6" />
      </button>

      <div 
        className="absolute inset-0 pointer-events-none opacity-10 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
    </section>
  )
}
