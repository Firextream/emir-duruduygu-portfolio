"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/blog", label: "Blog" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/gallery", label: "Gallery" },
    { href: "/resume", label: "Resume" },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
        scrolled ? "bg-background/95 backdrop-blur-xl border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="group relative font-heading font-light text-2xl tracking-wide text-foreground hover:text-accent transition-all duration-500 hover:tracking-wider"
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

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 hover:bg-transparent"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative w-5 h-5">
              <span
                className={`absolute top-1 left-0 w-5 h-px bg-foreground transition-all duration-300 ${isOpen ? "rotate-45 top-2" : ""}`}
              />
              <span
                className={`absolute top-2 left-0 w-5 h-px bg-foreground transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute top-3 left-0 w-5 h-px bg-foreground transition-all duration-300 ${isOpen ? "-rotate-45 top-2" : ""}`}
              />
            </div>
          </Button>
        </div>

        <div
          className={`md:hidden transition-all duration-500 ease-out ${
            isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="py-8 space-y-6">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block font-light text-lg tracking-wide transition-all duration-300 ${
                  pathname === item.href ? "text-accent pl-4" : "text-muted-foreground hover:text-foreground hover:pl-2"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  transform: isOpen ? "translateY(0)" : "translateY(-20px)",
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
