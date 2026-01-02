"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"

interface BlurImageProps extends Omit<ImageProps, 'onLoad'> {
  wrapperClassName?: string
}

export function BlurImage({ 
  className, 
  wrapperClassName,
  alt,
  ...props 
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={cn("overflow-hidden", wrapperClassName)}>
      <Image
        {...props}
        alt={alt}
        className={cn(
          "duration-700 ease-in-out",
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
