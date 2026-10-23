'use client'

// "Selected Work": a strip of photos at their native ratio (420px tall; 240 on mobile), scrolled
// sideways by the prev / next buttons.
import Link from 'next/link'
import { useRef } from 'react'
import ContentImage from '@/components/site/ContentImage'
import type { Photo } from '@/lib/content/types'
import { ChevronLeft, ChevronRight } from './icons'
import s from './OrigHome.module.css'

export default function SelectedWork({ photos }: { photos: Photo[] }) {
  const row = useRef<HTMLDivElement>(null)
  const scroll = (dx: number) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    row.current?.scrollBy({ left: dx, behavior: reduce ? 'auto' : 'smooth' })
  }
  return (
    <section id="selected-work" className={s.work} aria-labelledby="selected-work-title">
      <div className={s.workHead}>
        <h2 id="selected-work-title" className={s.h2}>
          Selected Work
        </h2>
        <div className={s.workCtl}>
          <button type="button" className={`${s.round} ${s.deskOnly}`} aria-label="Previous" onClick={() => scroll(-560)}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" className={`${s.round} ${s.deskOnly}`} aria-label="Next" onClick={() => scroll(560)}>
            <ChevronRight size={18} />
          </button>
          <Link href="/gallery" className={s.viewGallery}>
            <span className={s.deskOnly}>VIEW </span>GALLERY ↗
          </Link>
        </div>
      </div>
      <div ref={row} className={s.strip}>
        {photos.map((p) => (
          <Link key={p.id} href={`/gallery/${p.id}`} className={s.tile}>
            {p.image ? (
              <ContentImage
                image={p.image}
                className={s.tileImg}
                sizes={`(max-width: 760px) ${Math.round((240 * p.w) / p.h)}px, ${Math.round((420 * p.w) / p.h)}px`}
              />
            ) : (
              <span className={s.tilePh} style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                {p.ratio}
                <span className={s.deskOnly}>&nbsp;· placeholder</span>
              </span>
            )}
            <span className={s.tileCap}>
              <span className={s.tileTitle}>{p.title}</span>
              <span className={`${s.tileRatio} ${s.deskOnly}`}>{p.ratio}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
