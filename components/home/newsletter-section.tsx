"use client"

import type React from "react"
import { useState } from "react"
import { ArrowRight } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setStatusMessage("")

    try {
      // Resend API ile email toplama
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        const data = await res.json()
        setStatus("success")
        setStatusMessage(data?.message || "Thanks for subscribing.")
        setEmail("")
      } else {
        const data = await res.json().catch(() => null)
        setStatus("error")
        setStatusMessage(data?.error || "Subscription failed. Please try again.")
      }
    } catch {
      setStatus("error")
      setStatusMessage("Connection problem. Please try again.")
    }
  }

  return (
    <section className="py-20 lg:py-32 border-t border-border">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6">
            <span className="font-mono text-sm tracking-wider text-foreground/70 uppercase">
              Newsletter
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
              Join the journey — stories, updates, and new work
            </h2>
            <p className="text-muted-foreground text-lg max-w-md">
              Occasional thoughts on photography, creative process, and the spaces in between. Based in Istanbul, exploring everywhere.
            </p>
          </div>
          
          {/* Right Column - Form */}
          <div>
            {status === "success" ? (
              <div className="p-8 border border-accent/30 bg-accent/5">
                <p className="font-serif text-2xl text-foreground mb-2">Welcome aboard.</p>
                <p className="text-muted-foreground">{statusMessage || "Thanks for subscribing. Check your inbox soon."}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === "loading"}
                    className="w-full bg-transparent border-b-2 border-border focus:border-accent py-4 text-lg text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-300"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group inline-flex items-center gap-3 text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative">
                    {status === "loading" ? "Subscribing..." : "Subscribe"}
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-accent origin-left group-hover:scale-x-110 transition-transform duration-300" />
                  </span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                <p className="text-sm text-muted-foreground">
                  No spam, unsubscribe anytime.
                </p>

                {status === "error" && (
                  <p className="text-sm text-red-600">
                    {statusMessage}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
