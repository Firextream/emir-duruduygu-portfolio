import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { StatsSection } from "@/components/stats-section"

import { ArrowRight, Camera, Cpu, Building2, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Duruduygu - photographer, engineer, and visual storyteller.",
}

const interests = [
  {
    icon: Camera,
    title: "Photography",
    description: "Capturing architecture, street moments, and the interplay of light and shadow.",
  },
  {
    icon: Cpu,
    title: "Electronics",
    description: "Designing circuits and exploring the world of embedded systems and robotics.",
  },
  {
    icon: Building2,
    title: "Architecture",
    description: "Fascinated by modernist structures, urban spaces, and the poetry of concrete.",
  },
]

const timeline = [
  {
    year: "2025",
    title: "Photography Journey",
    description: "Started exploring photography, focusing on urban and architectural subjects.",
  },
  {
    year: "2024",
    title: "Joined ITU ROV Team",
    description: "Contributing to underwater robotics as an electronics team member.",
  },
  {
    year: "2023",
    title: "Started at ITU",
    description: "Began studying Electrical & Electronics Engineering.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 lg:pt-32">
        {/* Hero Section */}
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Text Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="font-mono text-sm tracking-wider text-accent uppercase">
                  About
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
                  Hi, I'm Emir
                </h1>
              </div>
              
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  I'm an Electrical & Electronics Engineering student at Istanbul Technical University, 
                  passionate about both technology and visual storytelling.
                </p>
                <p>
                  When I'm not working on circuits or coding, you'll find me wandering the streets 
                  of Istanbul with my camera, capturing the beauty in everyday moments—architecture, 
                  light, and the quiet poetry of urban life.
                </p>
                <p>
                  This space is where I share my journey: projects I'm working on, photographs 
                  that inspire me, and thoughts along the way.
                </p>
              </div>
              
              {/* Location */}
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="font-mono text-sm">Istanbul, Turkey</span>
              </div>
              
              {/* CTA */}
              <div className="flex items-center gap-6 pt-4">
                <Link 
                  href="/contact"
                  className="group inline-flex items-center gap-3 text-foreground font-medium"
                >
                  <span className="relative">
                    Get in touch
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                  </span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <Link 
                  href="/resume"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  View Resume
                </Link>
              </div>
            </div>
            
            {/* Image */}
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-square overflow-hidden bg-secondary rounded-lg">
                <Image
                  src="/emir-profile.jpg"
                  alt="Duruduygu"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Interests Section */}
        <section className="border-t border-border py-16 lg:py-24">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="mb-12">
              <span className="font-mono text-sm tracking-wider text-accent uppercase">
                What I Do
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4">
                Interests & Focus
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {interests.map((interest, index) => (
                <div 
                  key={interest.title}
                  className="group p-6 border border-border hover:border-accent/50 transition-colors duration-300"
                >
                  <interest.icon className="w-8 h-8 text-accent mb-6" />
                  <h3 className="font-serif text-xl text-foreground mb-3">
                    {interest.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {interest.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Timeline Section */}
        <section className="bg-secondary/30 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <div className="mb-12 text-center">
              <span className="font-mono text-sm tracking-wider text-accent uppercase">
                Journey
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-4">
                Recent Milestones
              </h2>
            </div>
            
            <div className="space-y-0">
              {timeline.map((item, index) => (
                <div 
                  key={index}
                  className="flex gap-8 py-8 border-b border-border last:border-0"
                >
                  <div className="w-20 flex-shrink-0">
                    <span className="font-mono text-2xl text-accent">{item.year}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
              Let's connect
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Whether you want to collaborate on a project, discuss photography, 
              or just say hello—I'd love to hear from you.
            </p>
            <Link 
              href="/contact"
              className="group inline-flex items-center gap-3 text-foreground font-medium text-lg"
            >
              <span className="relative">
                Send a message
                <span className="absolute -bottom-1 left-0 w-full h-px bg-accent" />
              </span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
