import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for commissions, collaborations, or just to say hello.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">
            {/* Left - Title & Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="font-mono text-sm tracking-wider text-accent uppercase">
                  Contact
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
                  Let's work together
                </h1>
              </div>
              
              <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
                Interested in a commission, collaboration, or just want to say hello? I'd love to hear from you.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-6 pt-8 border-t border-border">
                <div>
                  <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-2">Social</p>
                  <div className="flex gap-6">
                    <a href="https://www.instagram.com/emir_duruduygu/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent transition-colors">
                      Instagram
                    </a>
                    <a href="https://www.linkedin.com/in/emir-duruduygu-90800a27a/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent transition-colors">
                      LinkedIn
                    </a>
                  </div>
                </div>
                
                <div>
                  <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-2">Based in</p>
                  <p className="text-foreground">Istanbul, Turkey</p>
                </div>
              </div>
            </div>
            
            {/* Right - Form */}
            <div className="lg:pt-12">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

