"use client"

import { GalleryGrid } from "@/components/gallery/gallery-grid"

interface GalleryImage {
  id: string
  src: string
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
  return <GalleryGrid images={images} categories={categories} />
}
