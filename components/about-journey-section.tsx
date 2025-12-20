"use client"

import Image from "next/image"
import Link from "next/link"
import { getAssetPath } from "@/lib/image-utils"
import { ArrowRight } from "lucide-react"

interface AboutData {
  name: string
  title: string
  bio: string
  location: string
  experience: string
}

// About content - minimal and focused
const aboutData: AboutData = {
  name: "Emir Duruduygu",
  title: "Architectural Photographer",
  bio: "Capturing the soul of modern and brutalist architecture through minimalist composition and dramatic interplay of light and shadow.",
  location: "Istanbul, Turkey",
  experience: "5+ Years"
}

export function AboutJourneySection() {
  return (
    <section className="py-16 md:py-24 px-6 bg-muted/20" id="about">
      <div className="max-w-7xl mx-auto">
        
        {/* Compact Horizontal Layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left - Small Image */}
          <div className="lg:col-span-3">
            <div className="relative aspect-square max-w-[200px] mx-auto lg:mx-0 overflow-hidden bg-muted">
              <Image
                src={getAssetPath("/placeholder-user.jpg")}
                alt={aboutData.name}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="200px"
              />
            </div>
          </div>

          {/* Right - Content */}
          <div className="lg:col-span-9">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              
              {/* Info */}
              <div className="flex-1">
                <span className="text-[10px] font-light tracking-[0.3em] text-muted-foreground uppercase block mb-3">
                  About
                </span>
                <h2 className="text-2xl md:text-3xl font-extralight text-foreground mb-2">
                  {aboutData.name}
                </h2>
                <p className="text-sm text-muted-foreground/80 font-light leading-relaxed max-w-lg">
                  {aboutData.bio}
                </p>
              </div>

              {/* Stats & CTA */}
              <div className="flex flex-row md:flex-col gap-6 md:gap-4 md:text-right">
                <div>
                  <span className="text-2xl font-extralight text-foreground">{aboutData.experience}</span>
                  <p className="text-[10px] tracking-widest text-muted-foreground uppercase">Experience</p>
                </div>
                <div>
                  <span className="text-sm font-light text-foreground">{aboutData.location}</span>
                  <p className="text-[10px] tracking-widest text-muted-foreground uppercase">Based In</p>
                </div>
                <Link 
                  href="/resume"
                  className="group inline-flex items-center gap-2 text-xs tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors mt-2"
                >
                  <span>Resume</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
