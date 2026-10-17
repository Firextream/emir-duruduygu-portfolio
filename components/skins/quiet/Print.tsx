// A Quiet print: the photo at its native ratio on white card stock, slightly tilted, optional tape.
// Hover/focus (README "Photo hover"): the print straightens and lifts 3px, a dashed marquee sits 6px
// outside it, the caption title swaps to the file name on the accent, and the meta reads "open ↵".
// Moodboard prints are view-only (href={null}): no link, no hover, default cursor.
import Link from 'next/link'
import type { CSSProperties } from 'react'
import ContentImage from '@/components/site/ContentImage'
import type { Photo } from '@/lib/content/types'
import s from './Print.module.css'

/** A gallery photo or a moodboard reference. */
export type PrintItem = Pick<Photo, 'id' | 'image' | 'w' | 'h' | 'ratio' | 'title'> & { file?: string }

export default function Print({
  photo,
  index,
  tilt,
  tiltMobile,
  tape,
  sizes,
  priority,
  eager,
  basis,
  className,
  href,
  caption = true,
}: {
  photo: PrintItem
  /** position in the gallery (01, 02 …) */
  index: number
  /** degrees; tiltMobile applies at ≤ 760 px */
  tilt?: number
  tiltMobile?: number
  /** left offset of a strip of tape, e.g. "24px" */
  tape?: string
  sizes: string
  priority?: boolean
  /** above the fold: load eagerly without a preload */
  eager?: boolean
  /** flex-basis in px when prints share a row (equal-area layout) */
  basis?: number
  className?: string
  /** null = a view-only print (moodboard) */
  href?: string | null
  caption?: boolean
}) {
  const style = {
    ...(tilt !== undefined ? { '--tilt-d': `${tilt}deg` } : {}),
    ...(tiltMobile !== undefined ? { '--tilt-m': `${tiltMobile}deg` } : {}),
    ...(basis ? { '--basis': `${basis}px` } : {}),
    ...(tape ? { '--tape-left': tape } : {}),
  } as CSSProperties
  const meta = `${String(index + 1).padStart(2, '0')} · ${photo.ratio}`

  const body = (
    <>
      {tape && <span className={s.tape} aria-hidden="true" />}
      <span className={s.card}>
        {photo.image ? (
          <ContentImage image={photo.image} className={s.img} sizes={sizes} priority={priority} eager={eager} />
        ) : (
          <span className={s.ph} style={{ aspectRatio: `${photo.w} / ${photo.h}` }}>
            {photo.ratio} · placeholder
          </span>
        )}
        {caption && (
          <span className={s.caption}>
            <span className={s.title}>{photo.title}</span>
            <span className={s.file} aria-hidden="true">
              {photo.file ?? '[file]'}
            </span>
            <span className={s.meta}>
              <span className={s.metaRest}>{meta}</span>
              <span className={s.metaHover} aria-hidden="true">
                open ↵
              </span>
            </span>
          </span>
        )}
      </span>
    </>
  )

  const cls = `${s.print} ${basis ? s.basis : ''} ${className ?? ''}`
  if (href === null) {
    return (
      <div className={`${cls} ${s.still}`} style={style}>
        {body}
      </div>
    )
  }
  return (
    <Link href={href ?? `/gallery/${photo.id}`} className={cls} style={style}>
      {body}
    </Link>
  )
}
