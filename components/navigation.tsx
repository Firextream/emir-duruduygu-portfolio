"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Close menu on escape key and manage focus
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
      // Focus the first menu item when opened
      const firstMenuItem = mobileMenuRef.current?.querySelector('[role="menuitem"]') as HTMLElement
      if (firstMenuItem) {
        setTimeout(() => firstMenuItem.focus(), 100)
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen])

  const navItems = [
    { href: "/blog", label: "Blog" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/gallery", label: "Gallery" },
    { href: "/resume", label: "Resume" },
  ]

  return (
    <>
      <nav
        ref={mobileMenuRef}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
          scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
        }`}
      >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link
            href="/"
            className="group relative font-heading font-light text-xl sm:text-2xl tracking-wide text-foreground hover:text-accent transition-all duration-500 hover:tracking-wider touch-manipulation"
          >
            <span className="relative z-10">Emir Duruduygu</span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-500 group-hover:w-full"></span>
            <span className="absolute -top-1 -left-1 w-0 h-0 border-l border-t border-accent/20 transition-all duration-500 group-hover:w-3 group-hover:h-3"></span>
            <span className="absolute -bottom-1 -right-1 w-0 h-0 border-r border-b border-accent/20 transition-all duration-500 group-hover:w-3 group-hover:h-3"></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-light text-sm tracking-wide uppercase transition-all duration-300 hover:tracking-widest group ${
                  pathname === item.href ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-px bg-accent animate-line-draw" />
                )}
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-px bg-foreground/30 transition-all duration-300 group-hover:w-4" />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-3 hover:bg-accent/10 focus:bg-accent/10 active:bg-accent/20 min-h-[48px] min-w-[48px] flex items-center justify-center touch-manipulation rounded-lg transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <div className="relative w-6 h-5" aria-hidden="true">
              <span
                className={`absolute top-0 left-0 w-6 h-0.5 bg-foreground transition-all duration-300 ease-out rounded-full ${
                  isOpen ? "rotate-45 top-2" : ""
                }`}
              />
              <span
                className={`absolute top-2 left-0 w-6 h-0.5 bg-foreground transition-all duration-300 ease-out rounded-full ${
                  isOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`absolute top-4 left-0 w-6 h-0.5 bg-foreground transition-all duration-300 ease-out rounded-full ${
                  isOpen ? "-rotate-45 top-2" : ""
                }`}
              />
            </div>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden transition-all duration-500 ease-out ${
            isOpen ? "max-h-96 opacity-100 visible" : "max-h-0 opacity-0 invisible"
          } overflow-hidden bg-background/98 backdrop-blur-xl border-b border-border/50 shadow-lg`}
          aria-hidden={!isOpen}
          role="menu"
          aria-labelledby="mobile-menu-button"
        >
          <div className="py-4 sm:py-6 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center font-light text-lg tracking-wide transition-all duration-300 py-4 px-6 min-h-[56px] rounded-xl mx-4 touch-manipulation focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                  pathname === item.href 
                    ? "text-accent bg-accent/10 border border-accent/20 shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10 active:bg-accent/20 focus:bg-accent/10"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  transform: isOpen ? "translateY(0)" : "translateY(-10px)",
                  opacity: isOpen ? 1 : 0,
                }}
                onClick={() => setIsOpen(false)}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
              >
                <span className="relative flex items-center gap-3">
                  <span 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      pathname === item.href ? "bg-accent" : "bg-transparent group-hover:bg-accent/50"
                    }`} 
                  />
                  {item.label}
                  <span 
                    className={`absolute -bottom-1 left-6 h-0.5 bg-accent transition-all duration-300 ${
                      pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                    }`} 
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-all duration-300 animate-in fade-in-0"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
