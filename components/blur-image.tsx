"use client"

import { useState, useRef, useEffect } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface BlurImageProps extends Omit<ImageProps, 'onLoad' | 'lazyRoot'> {
  wrapperClassName?: string
  enableLazyRoot?: boolean
}

export function BlurImage({ 
  className, 
  wrapperClassName,
  alt,
  enableLazyRoot = true,
  priority,
  ...props 
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isInView, setIsInView] = useState(priority || !enableLazyRoot)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority || !enableLazyRoot) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '150px', threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [priority, enableLazyRoot])

  return (
    <div ref={containerRef} className={cn("overflow-hidden relative", wrapperClassName)}>
      {/* Skeleton placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-secondary animate-pulse" />
      )}
      
      {isInView && (
        <Image
          {...props}
          alt={alt}
          priority={priority}
          className={cn(
            "duration-500 ease-out",
            isLoading
              ? "scale-105 blur-lg opacity-0"
              : "scale-100 blur-0 opacity-100",
            className
          )}
          onLoad={() => setIsLoading(false)}
        />
      )}
    </div>
  )
}

// For external URLs
export function BlurExternalImage({ 
  src,
  alt,
  className,
  wrapperClassName,
}: {
  src: string
  alt: string
  className?: string
  wrapperClassName?: string
}) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn("overflow-hidden", wrapperClassName)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "duration-700 ease-in-out w-full h-full object-cover",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0",
          className
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}
