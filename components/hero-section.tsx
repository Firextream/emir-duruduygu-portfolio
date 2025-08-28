"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Link from "next/link"
import ScrollReveal from "./scroll-reveal-enhanced"

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
    window.addEventListener("scroll", handleScroll, { passive: true })
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
    <section className="relative h-screen flex items-center justify-center overflow-hidden layer-base">
      
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full">
          <img
            src="/coastal-harbor-scene.jpg"
            alt="Coastal Harbor Scene"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>

      <div className="relative z-10 text-white max-w-4xl mx-auto px-6 flex items-center justify-start h-full">
        <div className="max-w-2xl">
          <div className="mb-2 text-xs font-light tracking-[0.2em] text-white/80 uppercase ml-16">
            Architectural Photography
          </div>

          <h1 className="font-heading font-extralight text-4xl md:text-6xl mb-6 tracking-tighter leading-none">
            Emir Duruduygu
          </h1>

          <p className="text-xl md:text-2xl mb-16 text-white/70 font-light tracking-wide leading-relaxed">
            Capturing the essence of modernist architecture through minimalist composition and dramatic light
          </p>

          <div className="flex gap-8">
            <Link href="/portfolio">
              <Button
                size="lg"
                variant="outline"
                className="border border-white/20 text-white hover:bg-white hover:text-black bg-transparent backdrop-blur-sm transition-all duration-300 font-light tracking-wider px-8 py-6 text-base hover:architectural-shadow"
              >
                View Portfolio
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 backdrop-blur-sm transition-all duration-300 font-light tracking-wider px-8 py-6 text-base hover:architectural-shadow"
              >
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToContent}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/40 hover:text-white transition-all duration-500 group animate-in fade-in delay-1100"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-light tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            Scroll
          </span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </button>
    </section>
  )
}
