"use client"

import { useRef, ReactNode } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

// Basic parallax - moves slower/faster than scroll
export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  )
}

// Parallax image that zooms slightly on scroll
export function ParallaxImage({ 
  src, 
  alt, 
  className 
}: { 
  src: string
  alt: string
  className?: string 
}) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1])
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50])

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        style={{ scale, y }}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

// Parallax section with depth layers
export function ParallaxSection({ 
  children, 
  backgroundImage,
  className 
}: { 
  children: ReactNode
  backgroundImage?: string
  className?: string 
}) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  const contentY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {backgroundImage && (
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <img 
            src={backgroundImage} 
            alt="" 
            className="w-full h-[120%] object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      )}
      
      <motion.div 
        className="relative z-10"
        style={{ y: contentY, opacity }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Horizontal parallax (moves sideways on scroll)
export function HorizontalParallax({ 
  children, 
  direction = "left",
  className 
}: { 
  children: ReactNode
  direction?: "left" | "right"
  className?: string 
}) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const multiplier = direction === "left" ? -1 : 1
  const x = useTransform(scrollYProgress, [0, 1], [0, 100 * multiplier])
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      style={{ x: smoothX }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  )
}

// Fade in on scroll
export function FadeInOnScroll({ 
  children, 
  className,
  delay = 0
}: { 
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
