"use client"

import type React from "react"
import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"

interface FormData {
  name: string
  email: string
  message: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch {
      setStatus("error")
      setErrorMessage("Something went wrong. Please try again or email directly.")
    }
  }

  if (status === "success") {
    return (
      <div className="p-12 border border-accent/30 bg-accent/5 text-center">
        <div className="w-16 h-16 border-2 border-accent flex items-center justify-center mx-auto mb-6">
          <Check className="text-accent" size={28} />
        </div>
        <h3 className="font-serif text-2xl text-foreground mb-3">Message Sent</h3>
        <p className="text-muted-foreground mb-8">Thank you for reaching out. I'll get back to you soon.</p>
        <button 
          onClick={() => setStatus("idle")} 
          className="group inline-flex items-center gap-2 text-foreground font-medium"
        >
          <span className="relative">
            Send another message
            <span className="absolute -bottom-1 left-0 w-full h-px bg-accent" />
          </span>
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={status === "loading"}
          className="w-full bg-transparent border-b-2 border-border focus:border-accent py-3 text-lg text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-300"
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={status === "loading"}
          className="w-full bg-transparent border-b-2 border-border focus:border-accent py-3 text-lg text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-300"
        />
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Tell me about your project or inquiry..."
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          disabled={status === "loading"}
          className="w-full bg-transparent border-2 border-border focus:border-accent p-4 text-lg text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-300 resize-none"
        />
      </div>

      {/* Error Message */}
      {status === "error" && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="group inline-flex items-center gap-3 text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="relative">
          {status === "loading" ? "Sending..." : "Send Message"}
          <span className="absolute -bottom-1 left-0 w-full h-px bg-accent origin-left group-hover:scale-x-110 transition-transform duration-300" />
        </span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </form>
  )
}
