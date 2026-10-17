// Data, static params and metadata for /gallery and /gallery/[id] in every skin.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMood, getPhoto, getPhotos } from '@/lib/content'

export async function getGalleryData() {
  const [photos, mood] = await Promise.all([getPhotos(), getMood()])
  return { photos, mood }
}

export type GalleryData = Awaited<ReturnType<typeof getGalleryData>>

export async function getPhotoData(id: string) {
  const [seq, photos] = await Promise.all([getPhoto(decodeURIComponent(id)), getPhotos()])
  if (!seq) notFound()
  return { ...seq, photos }
}

export type PhotoData = Awaited<ReturnType<typeof getPhotoData>>

export async function photoStaticParams() {
  const photos = await getPhotos()
  return photos.map((p) => ({ id: p.id }))
}

/** Bracketed placeholder copy shouldn't become a page title. */
export const isPlaceholder = (text: string) => /^\[.*\]$/.test(text.trim())

export const galleryMetadata: Metadata = {
  title: 'Gallery',
  description: 'Photographs of Istanbul at their real proportions — nothing cropped — and a moodboard of references.',
  alternates: { canonical: '/gallery' },
}

export async function photoMetadata(id: string): Promise<Metadata> {
  const seq = await getPhoto(decodeURIComponent(id))
  if (!seq) return { title: 'Not found' }
  const p = seq.item
  const title = isPlaceholder(p.title) ? 'Photograph' : p.title
  return {
    title,
    description: `${title}${isPlaceholder(p.place) ? '' : `, ${p.place}`} — shown uncropped at ${p.ratio}.`,
    alternates: { canonical: `/gallery/${p.id}` },
    openGraph: p.image ? { images: [{ url: p.image.src, width: p.image.w, height: p.image.h, alt: p.image.alt }] } : undefined,
  }
}

export const pad = (n: number, l = 3) => String(n).padStart(l, '0')
