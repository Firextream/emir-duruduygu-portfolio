"use client"

import Image from "next/image"
import { getAssetPath } from "@/lib/image-utils"
import { Camera, MapPin, Award, Heart } from "lucide-react"

interface AboutData {
  name: string
  title: string
  bio: string
  location: string
  experience: string
  specialties: string[]
  philosophy: string
  image: string
}

// About content - can be updated from Notion manually or kept as static
const aboutData: AboutData = {
  name: "Duruduygu",
  title: "Architectural Photographer",
  bio: "I'm a passionate architectural photographer based in Istanbul, dedicated to capturing the soul of modern and brutalist architecture. With over 5 years of experience, I specialize in finding the perfect interplay of light, shadow, and geometric forms that define contemporary architectural design.",
  location: "Istanbul, Turkey",
  experience: "5+ Years",
  specialties: ["Modernist Architecture", "Brutalist Structures", "Interior Spaces", "Urban Landscapes"],
  philosophy: "Every building tells a story. My mission is to capture not just the structure, but the emotion and intent behind each architectural masterpiece. I believe in the power of minimalism and the beauty found in clean lines and dramatic contrasts.",
  image: "/placeholder-user.jpg"
}

export function AboutSection() {
  const about = aboutData

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-muted/30" id="about">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-xs font-light tracking-[0.3em] text-muted-foreground uppercase mb-4 block">
            Get to Know Me
          </span>
          <h2 className="font-heading font-light text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            About Me
          </h2>
          <div className="w-12 h-px bg-accent mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-muted max-w-md mx-auto lg:max-w-none">
              {about.image && about.image.startsWith('http') ? (
                <img
                  src={about.image}
                  alt={about.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={getAssetPath(about.image || "/placeholder-user.jpg")}
                  alt={about.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
              {/* Decorative elements - hidden on mobile */}
              <div className="hidden sm:block absolute -bottom-4 -right-4 w-24 h-24 border border-accent/30 rounded-lg -z-10" />
              <div className="hidden sm:block absolute -top-4 -left-4 w-24 h-24 border border-accent/30 rounded-lg -z-10" />
            </div>
            
            {/* Stats overlay */}
            <div className="mt-6 sm:mt-0 sm:absolute sm:-bottom-6 sm:left-4 sm:right-4 md:left-8 md:right-8 bg-background/95 backdrop-blur-xl rounded-lg p-4 sm:p-6 shadow-lg border border-border/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Camera className="w-4 h-4 text-accent" />
                    <span className="text-lg sm:text-xl font-light text-foreground">{about.experience}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Experience</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="text-sm sm:text-base font-light text-foreground">{about.location}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Based In</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 space-y-5 sm:space-y-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-light text-foreground mb-2">
                {about.name}
              </h3>
              <p className="text-accent font-light tracking-wide text-sm sm:text-base">
                {about.title}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {about.bio}
            </p>

            {/* Specialties */}
            <div>
              <h4 className="text-sm font-light tracking-wide text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-accent" />
                Specialties
              </h4>
              <div className="flex flex-wrap gap-2">
                {about.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-accent/10 text-foreground rounded-full text-xs sm:text-sm font-light tracking-wide border border-accent/20 hover:bg-accent/20 transition-colors"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Philosophy */}
            <div className="bg-background/50 rounded-lg p-4 sm:p-6 border border-border/50">
              <h4 className="text-sm font-light tracking-wide text-foreground mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-accent" />
                My Philosophy
              </h4>
              <p className="text-muted-foreground/80 text-sm leading-relaxed italic">
                "{about.philosophy}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
