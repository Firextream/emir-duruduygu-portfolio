'use client'

// Every content photo goes through here: next/image at its native ratio (width/height from the
// content model, height:auto in CSS — never cropped or filtered). Local files use the Next optimizer;
// Directus files use Directus asset transforms (format=webp, width, quality) as the srcset.
import Image, { type ImageLoader } from 'next/image'
import type { Img } from '@/lib/content/types'

const directusLoader: ImageLoader = ({ src, width, quality }) =>
  `${src}${src.includes('?') ? '&' : '?'}format=webp&width=${width}&quality=${quality ?? 75}`

export interface ContentImageProps {
  image: Img
  sizes: string
  className?: string
  alt?: string
  /** Home hero only. */
  priority?: boolean
  /** Above-the-fold images on inner pages: load eagerly without a preload. */
  eager?: boolean
  quality?: 75 | 85
}

export default function ContentImage({ image, sizes, className, alt, priority, eager, quality }: ContentImageProps) {
  return (
    <Image
      src={image.src}
      width={image.w}
      height={image.h}
      alt={alt ?? image.alt}
      sizes={sizes}
      className={className}
      priority={priority}
      // next/image's priority preloads but leaves the request at Low; the hero is the LCP, so ask for High
      fetchPriority={priority ? 'high' : undefined}
      loading={priority ? undefined : eager ? 'eager' : 'lazy'}
      quality={quality}
      loader={image.source === 'directus' ? directusLoader : undefined}
      unoptimized={image.src.split('?')[0].endsWith('.svg')}
    />
  )
}
