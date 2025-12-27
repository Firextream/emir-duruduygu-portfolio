"use client"

import { Instagram, Linkedin } from "lucide-react"

export function SocialButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a
        href="https://www.instagram.com/emir_duruduygu/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-10 h-10 bg-background/80 backdrop-blur-sm border border-border rounded-full hover:border-accent hover:bg-accent/10 transition-all duration-300"
        aria-label="Instagram"
      >
        <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
      </a>
      <a
        href="https://www.linkedin.com/in/emir-duruduygu-90800a27a/"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center w-10 h-10 bg-background/80 backdrop-blur-sm border border-border rounded-full hover:border-accent hover:bg-accent/10 transition-all duration-300"
        aria-label="LinkedIn"
      >
        <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
      </a>
    </div>
  )
}
