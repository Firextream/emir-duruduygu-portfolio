"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setFormData({ name: "", email: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section className="py-24 md:py-32 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column - Info */}
          <div>
            <span className="text-[10px] font-light tracking-[0.3em] text-muted-foreground uppercase block mb-6">
              Contact
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-foreground leading-tight mb-8">
              Let's work<br />together
            </h2>
            <p className="text-muted-foreground font-light leading-relaxed mb-12 max-w-md">
              Available for select architectural photography projects worldwide. 
              Let's discuss how we can capture your vision.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div>
                <span className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Email</span>
                <a href="mailto:edmesaj@outlook.com" className="text-foreground hover:text-muted-foreground transition-colors">
                  edmesaj@outlook.com
                </a>
              </div>
              <div>
                <span className="text-xs tracking-widest uppercase text-muted-foreground block mb-1">Location</span>
                <span className="text-foreground">Istanbul, Turkey</span>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-3">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 py-3 text-base focus-visible:ring-0 focus-visible:border-foreground transition-colors h-auto"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-3">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 py-3 text-base focus-visible:ring-0 focus-visible:border-foreground transition-colors h-auto"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-muted-foreground block mb-3">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="border-0 border-b border-border/50 rounded-none bg-transparent px-0 py-3 text-base focus-visible:ring-0 focus-visible:border-foreground transition-colors resize-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="group bg-foreground text-background hover:bg-foreground/90 px-8 py-6 font-light tracking-widest text-xs uppercase transition-all duration-300"
              >
                {isSubmitting ? "Sending..." : (
                  <>
                    Send Message
                    <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
