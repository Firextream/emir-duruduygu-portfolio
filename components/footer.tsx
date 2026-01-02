"use client"

import Link from "next/link"
import { ArrowUpRight, ArrowUp, Github, Music } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="border-t border-border bg-background">
      {/* Large CTA Section */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm font-mono tracking-wider text-muted-foreground uppercase">
              Ready to collaborate?
            </p>
            <Link 
              href="/contact"
              className="group inline-flex items-baseline gap-2 sm:gap-4"
            >
              <span className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground group-hover:text-accent transition-colors duration-300">
                Let's create something together
              </span>
              <ArrowUpRight 
                className="w-8 h-8 md:w-10 md:h-10 text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" 
              />
            </Link>
          </div>
          
          <a 
            href="mailto:edmesaj@outlook.com"
            className="text-lg text-muted-foreground hover:text-foreground transition-colors link-underline"
          >
            edmesaj@outlook.com
          </a>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8">
            {/* Left: Logo & Copyright */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <Link href="/" className="font-serif text-xl font-medium text-foreground">
                Emir Duruduygu
              </Link>
              <span className="text-sm text-muted-foreground">
                © {currentYear} All rights reserved.
              </span>
            </div>
            
            {/* Center: Navigation */}
            <nav className="flex flex-wrap gap-4 sm:gap-6 text-sm">
              <Link 
                href="/about" 
                className="text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                About
              </Link>
              <Link 
                href="/portfolio" 
                className="text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                Portfolio
              </Link>
              <Link 
                href="/gallery" 
                className="text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                Gallery
              </Link>
              <Link 
                href="/blog" 
                className="text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                Blog
              </Link>
              <Link 
                href="/contact" 
                className="text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                Contact
              </Link>
            </nav>
            
            {/* Right: Social & Back to Top */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm">
                <a 
                  href="https://www.instagram.com/emir_duruduygu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ig
                </a>
                <a 
                  href="https://www.linkedin.com/in/emir-duruduygu-90800a27a/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Li
                </a>
                <a 
                  href="https://github.com/emirdogu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Gh
                </a>
              </div>
              
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="hidden sm:inline">Back to top</span>
                <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
