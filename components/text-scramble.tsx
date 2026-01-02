"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { cn } from "@/lib/utils"

interface TextScrambleProps {
  text: string
  className?: string
  scrambleOnHover?: boolean
  duration?: number
}

const chars = "!<>-_\\/[]{}—=+*^?#________"

export function TextScramble({ 
  text, 
  className, 
  scrambleOnHover = true,
  duration = 800 
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isScrambling, setIsScrambling] = useState(false)
  const frameRef = useRef<number | undefined>(undefined)
  const resolveRef = useRef<((value: void) => void) | undefined>(undefined)

  const scramble = useCallback(() => {
    if (isScrambling) return

    setIsScrambling(true)
    
    let frame = 0
    const totalFrames = Math.ceil(duration / 16) // 60fps
    const revealAt = Math.floor(totalFrames / 2)
    
    const update = () => {
      let output = ""
      const progress = frame / totalFrames
      
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          output += " "
          continue
        }
        
        const charProgress = (progress * text.length - i) / 2
        
        if (charProgress > 1) {
          output += text[i]
        } else if (charProgress > 0) {
          output += chars[Math.floor(Math.random() * chars.length)]
        } else {
          output += chars[Math.floor(Math.random() * chars.length)]
        }
      }
      
      setDisplayText(output)
      
      if (frame < totalFrames) {
        frame++
        frameRef.current = requestAnimationFrame(update)
      } else {
        setDisplayText(text)
        setIsScrambling(false)
        resolveRef.current?.()
      }
    }
    
    update()
  }, [text, duration, isScrambling])

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  // Initial scramble
  useEffect(() => {
    if (!scrambleOnHover) {
      scramble()
    }
  }, [])

  return (
    <span
      className={cn("inline-block font-mono", className)}
      onMouseEnter={scrambleOnHover ? scramble : undefined}
    >
      {displayText}
    </span>
  )
}

// Text that types out character by character
export function TypewriterText({ 
  text, 
  className,
  speed = 50,
  delay = 0,
  cursor = true
}: { 
  text: string
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
}) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let charIndex = 0
    
    const startTyping = () => {
      const type = () => {
        if (charIndex < text.length) {
          setDisplayText(text.slice(0, charIndex + 1))
          charIndex++
          timeout = setTimeout(type, speed)
        } else {
          setIsComplete(true)
        }
      }
      type()
    }
    
    timeout = setTimeout(startTyping, delay)
    
    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  // Cursor blink effect
  useEffect(() => {
    if (!cursor) return
    
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    
    return () => clearInterval(interval)
  }, [cursor])

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span className={cn(
          "inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle",
          showCursor ? "opacity-100" : "opacity-0"
        )} />
      )}
    </span>
  )
}

// Text that reveals word by word
export function WordReveal({ 
  text, 
  className,
  delay = 100
}: { 
  text: string
  className?: string
  delay?: number
}) {
  const words = text.split(" ")
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (visibleCount < words.length) {
      const timeout = setTimeout(() => {
        setVisibleCount(prev => prev + 1)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [visibleCount, words.length, delay])

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={cn(
            "inline-block mr-[0.25em] transition-all duration-500",
            index < visibleCount 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-2"
          )}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
