"use client"

import { GalleryGrid } from "@/components/gallery/gallery-grid"

interface GalleryImage {
  id: string
  src: string
  srcFull?: string
  srcOriginal?: string
  alt: string
  name?: string
  title?: string
  place?: string
  category?: string
  featured?: boolean
}

interface GalleryClientProps {
  images: GalleryImage[]
  categories: string[]
}

export function GalleryClient({ images, categories }: GalleryClientProps) {
  // Debug: log images in dev so we can verify they come from 'onsite' and include src/srcSet
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[GalleryClient] images sample:', images.slice(0,6))
  }

  return <GalleryGrid images={images} categories={categories} />
}
