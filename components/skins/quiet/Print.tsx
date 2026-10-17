// A Quiet print: the photo at its native ratio on white card stock, slightly tilted, optional tape.
// Hover/focus (README "Photo hover"): the print straightens and lifts 3px, a dashed marquee sits 6px
// outside it, the caption title swaps to the file name on the accent, and the meta reads "open ↵".
import Link from 'next/link'
import type { CSSProperties } from 'react'
import ContentImage from '@/components/site/ContentImage'
import type { Photo } from '@/lib/content/types'
import s from './Print.module.css'

export default function Print({
  photo,
  index,
  tilt,
  tape,
  sizes,
  priority,
  basis,
  className,
  href,
}: {
  photo: Photo
  /** position in the gallery (01, 02 …) */
  index: number
  tilt?: number
  /** left offset of a strip of tape, e.g. "24px" */
  tape?: string
  sizes: string
  priority?: boolean
  /** flex-basis in px when prints share a row (equal-area layout) */
  basis?: number
  className?: string
  href?: string
}) {
  const style = {
    ...(tilt !== undefined ? { '--tilt': `${tilt}deg` } : {}),
    ...(basis ? { '--basis': `${basis}px` } : {}),
    ...(tape ? { '--tape-left': tape } : {}),
  } as CSSProperties
  const meta = `${String(index + 1).padStart(2, '0')} · ${photo.ratio}`
  return (
    <Link href={href ?? `/gallery/${photo.id}`} className={`${s.print} ${basis ? s.basis : ''} ${className ?? ''}`} style={style}>
      {tape && <span className={s.tape} aria-hidden="true" />}
      <span className={s.card}>
        {photo.image ? (
          <ContentImage image={photo.image} className={s.img} sizes={sizes} priority={priority} />
        ) : (
          <span className={s.ph} style={{ aspectRatio: `${photo.w} / ${photo.h}` }}>
            {photo.ratio} · placeholder
          </span>
        )}
        <span className={s.caption}>
          <span className={s.title}>{photo.title}</span>
          <span className={s.file} aria-hidden="true">
            {photo.file}
          </span>
          <span className={s.meta}>
            <span className={s.metaRest}>{meta}</span>
            <span className={s.metaHover} aria-hidden="true">
              open ↵
            </span>
          </span>
        </span>
      </span>
    </Link>
  )
}
