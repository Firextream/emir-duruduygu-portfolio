"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-light tracking-tight mb-4">Get in Touch</h2>
          <p className="text-muted-foreground font-light">hello@alexchen.com</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border-0 border-b border-border rounded-none bg-transparent px-0 py-4 text-base focus-visible:ring-0 focus-visible:border-foreground transition-colors"
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border-0 border-b border-border rounded-none bg-transparent px-0 py-4 text-base focus-visible:ring-0 focus-visible:border-foreground transition-colors"
            />
            <Textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="border-0 border-b border-border rounded-none bg-transparent px-0 py-4 text-base focus-visible:ring-0 focus-visible:border-foreground transition-colors resize-none"
            />
          </div>

          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="outline"
              className="px-8 py-3 font-light tracking-wide transition-all duration-300 hover:bg-foreground hover:text-background bg-transparent"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
