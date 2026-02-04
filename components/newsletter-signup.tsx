"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewsletterSignupProps {
  title?: string
  description?: string
  className?: string
  variant?: "default" | "minimal" | "card"
}

export function NewsletterSignup({ 
  title = "Stay updated",
  description = "Get notified about new posts and projects. No spam, unsubscribe anytime.",
  className,
  variant = "default"
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return
    
    setStatus("loading")
    setMessage("")
    
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe")
      }
      
      setStatus("success")
      setMessage(data.message || "Thanks for subscribing!")
      setEmail("")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    }
  }

  if (variant === "minimal") {
    return (
      <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          disabled={status === "loading" || status === "success"}
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {status === "loading" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : status === "success" ? (
            <Check className="w-5 h-5" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    )
  }

  if (variant === "card") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cn(
          "bg-secondary/50 border border-border rounded-2xl p-8",
          className
        )}
      >
        <h3 className="font-serif text-2xl text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            disabled={status === "loading" || status === "success"}
          />
          
          <button
            type="submit"
            disabled={status === "loading" || status === "success" || !email}
            className="w-full px-6 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Subscribing...
              </>
            ) : status === "success" ? (
              <>
                <Check className="w-5 h-5" />
                Subscribed!
              </>
            ) : (
              <>
                Subscribe
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
          
          {message && (
            <p className={cn(
              "text-sm",
              status === "success" ? "text-green-500" : "text-red-500"
            )}>
              {message}
            </p>
          )}
        </form>
        
        <p className="text-xs text-muted-foreground mt-4">
          I respect your privacy. Unsubscribe at any time.
        </p>
      </motion.div>
    )
  }

  // Default variant
  return (
    <div className={cn("py-16 lg:py-24 bg-secondary/30", className)}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{title}</h2>
          <p className="text-muted-foreground text-lg mb-8">{description}</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              disabled={status === "loading" || status === "success"}
            />
            
            <button
              type="submit"
              disabled={status === "loading" || status === "success" || !email}
              className="px-8 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : status === "success" ? (
                <Check className="w-5 h-5" />
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          
          {message && (
            <p className={cn(
              "text-sm mt-4",
              status === "success" ? "text-green-500" : "text-red-500"
            )}>
              {message}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
