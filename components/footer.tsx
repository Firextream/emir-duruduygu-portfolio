import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-heading font-extralight text-4xl mb-8 tracking-wide">Emir Duruduygu</h3>
            <p className="text-white/70 font-light leading-relaxed text-lg max-w-lg">
              Architectural photographer exploring the intersection of space, light, and human experience through a
              modernist lens.
            </p>
          </div>

          {/* Contact - Minimalist approach */}
          <div>
            <h4 className="font-heading font-light text-xl mb-8 tracking-wide">Contact</h4>
            <div className="space-y-6">
              <div className="group">
                <div className="flex items-center gap-4 text-white/70 hover:text-white transition-colors duration-300">
                  <Mail className="h-4 w-4" />
                  <span className="font-light">alex@example.com</span>
                </div>
              </div>
              <div className="group">
                <div className="flex items-center gap-4 text-white/70 hover:text-white transition-colors duration-300">
                  <Phone className="h-4 w-4" />
                  <span className="font-light">+1 (555) 123-4567</span>
                </div>
              </div>
              <div className="group">
                <div className="flex items-center gap-4 text-white/70 hover:text-white transition-colors duration-300">
                  <MapPin className="h-4 w-4" />
                  <span className="font-light">New York, NY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-16 pb-8">
          <nav className="flex flex-wrap justify-center gap-12 mb-12">
            {[
              { href: "/", label: "Home" },
              { href: "/blog", label: "Blog" },
              { href: "/portfolio", label: "Portfolio" },
              { href: "/resume", label: "Resume" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-light text-sm tracking-widest uppercase text-white/70 hover:text-white transition-all duration-300 hover:tracking-wider"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="text-center">
            <p className="text-white/50 font-light text-sm tracking-wide">
              © 2024 — Built with modernist principles
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
