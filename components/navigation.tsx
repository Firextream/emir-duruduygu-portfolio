"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X, Menu } from "lucide-react"

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
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
          scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
        }`}
      >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link
            href="/"
            className="group relative font-heading font-light text-lg sm:text-2xl tracking-wide text-foreground hover:text-accent transition-all duration-500 hover:tracking-wider touch-manipulation"
          >
            <span className="relative z-10">Emir Duruduygu</span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-500 group-hover:w-full"></span>
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

          {/* Mobile Menu Button - Hamburger/X Icon */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 hover:bg-accent/10 focus:bg-accent/10 active:bg-accent/20 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation rounded-lg transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground transition-transform duration-300" />
            ) : (
              <Menu className="w-6 h-6 text-foreground transition-transform duration-300" />
            )}
          </Button>
        </div>
      </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        aria-hidden={!isOpen}
        role="menu"
        aria-labelledby="mobile-menu-button"
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute top-0 right-0 w-full max-w-sm h-full bg-background/98 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close button */}
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-accent/10 rounded-lg"
            >
              <X className="w-6 h-6 text-foreground" />
            </Button>
          </div>
          
          {/* Menu Items */}
          <div className="px-6 py-8 space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center font-light text-xl tracking-wide transition-all duration-300 py-5 px-4 rounded-xl touch-manipulation focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                  pathname === item.href 
                    ? "text-accent bg-accent/10" 
                    : "text-foreground hover:text-accent hover:bg-accent/5 active:bg-accent/10"
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
                  transform: isOpen ? "translateX(0)" : "translateX(20px)",
                  opacity: isOpen ? 1 : 0,
                }}
                onClick={() => setIsOpen(false)}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
              >
                <span className="relative flex items-center gap-4 w-full">
                  <span 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      pathname === item.href ? "bg-accent" : "bg-muted-foreground/30 group-hover:bg-accent/50"
                    }`} 
                  />
                  <span className="flex-1">{item.label}</span>
                  <span 
                    className={`h-px bg-accent transition-all duration-300 ${
                      pathname === item.href ? "w-8" : "w-0 group-hover:w-8"
                    }`} 
                  />
                </span>
              </Link>
            ))}
          </div>
          
          {/* Footer in mobile menu */}
          <div className="absolute bottom-8 left-0 right-0 px-6">
            <div className="border-t border-border/20 pt-6">
              <p className="text-sm text-muted-foreground/60 text-center">
                Architectural Photography
              </p>
              <p className="text-xs text-muted-foreground/40 text-center mt-2">
                © 2025 Emir Duruduygu
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
