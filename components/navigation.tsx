"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { ColorThemePicker } from "@/components/color-theme-picker"

const navLinks = [
  { href: "/about", label: "About", num: "01" },
  { href: "/portfolio", label: "Portfolio", num: "02" },
  { href: "/gallery", label: "Gallery", num: "03" },
  { href: "/blog", label: "Blog", num: "04" },
  { href: "/contact", label: "Contact", num: "05" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Check if we're on pages with dark hero backgrounds
  const isHomePage = pathname === "/"
  const hasDarkHero = isHomePage
  const useWhiteText = hasDarkHero && !isScrolled
  const isPortfolioPage = false // Portfolio page no longer has dark hero

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled 
            ? "bg-background/95 backdrop-blur-md border-b border-border" 
            : "bg-transparent",
        )}
      >
        <nav className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className={cn(
                "font-serif text-xl lg:text-2xl font-medium tracking-tight transition-colors duration-300",
                isPortfolioPage && !isScrolled
                  ? "text-white hover:text-white/80" 
                  : "text-foreground hover:text-accent"
              )}
            >
              Duruduygu
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group relative"
                  >
                    <span className={cn(
                      "text-[10px] font-mono tracking-wider absolute -top-3 left-0 transition-colors duration-300",
                      isActive 
                        ? "text-accent" 
                        : useWhiteText 
                          ? "text-white/60 group-hover:text-accent" 
                          : "text-muted-foreground group-hover:text-accent"
                    )}>
                      {link.num}
                    </span>
                    <span className={cn(
                      "text-sm tracking-wide transition-colors duration-300",
                      isActive 
                        ? useWhiteText ? "text-white font-medium" : "text-foreground font-medium"
                        : useWhiteText 
                          ? "text-white/80 group-hover:text-white" 
                          : "text-muted-foreground group-hover:text-foreground",
                    )}>
                      {link.label}
                    </span>
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-px transition-all duration-300",
                      useWhiteText ? "bg-white" : "bg-accent",
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  </Link>
                )
              })}
              
              {/* Theme Toggle */}
              <div className="ml-2 flex items-center gap-1">
                <ColorThemePicker className={cn(
                  useWhiteText ? "text-white hover:bg-white/10" : ""
                )} />
                <ThemeToggle variant="minimal" className={cn(
                  useWhiteText ? "text-white hover:bg-white/10" : ""
                )} />
              </div>
            </div>

            {/* Mobile Menu Button - Animated Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span 
                  className={cn(
                    "absolute left-0 w-full h-0.5 rounded-full transition-all duration-300",
                    isMobileMenuOpen 
                      ? "bg-foreground" 
                      : isPortfolioPage && !isScrolled 
                        ? "bg-white" 
                        : "bg-foreground",
                    isMobileMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  )}
                />
                <span 
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 rounded-full transition-all duration-300",
                    isMobileMenuOpen 
                      ? "bg-foreground" 
                      : isPortfolioPage && !isScrolled 
                        ? "bg-white" 
                        : "bg-foreground",
                    isMobileMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                  )}
                />
                <span 
                  className={cn(
                    "absolute left-0 w-full h-0.5 rounded-full transition-all duration-300",
                    isMobileMenuOpen 
                      ? "bg-foreground" 
                      : isPortfolioPage && !isScrolled 
                        ? "bg-white" 
                        : "bg-foreground",
                    isMobileMenuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  )}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background transition-all duration-500 md:hidden",
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col justify-center items-start h-full px-6 py-20">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-baseline gap-4 transition-all duration-300",
                    isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                  )}
                  style={{ transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : '0ms' }}
                >
                  <span className={cn(
                    "font-mono text-sm tracking-wider transition-colors duration-300",
                    isActive ? "text-accent" : "text-muted-foreground group-hover:text-accent"
                  )}>
                    {link.num}
                  </span>
                  <span className={cn(
                    "font-serif text-3xl sm:text-4xl tracking-tight transition-colors duration-300",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </nav>
          
          {/* Mobile menu footer */}
          <div className="absolute bottom-8 left-6 right-6">
            <div className="flex flex-col gap-4 text-sm text-muted-foreground">
              <div className="flex gap-4">
                <a href="https://www.instagram.com/emir_duruduygu/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a>
                <a href="https://www.linkedin.com/in/emir-duruduygu-90800a27a/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
                <a href="https://github.com/Firextream" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle variant="minimal" />
                <span className="text-xs text-muted-foreground/80">Theme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
