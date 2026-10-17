// Soft Club Photo — SPhoto.dc.html: uncropped, max 760px tall, ←/→/Esc, info strip, prev / next.
import Link from 'next/link'
import type { CSSProperties } from 'react'
import ContentImage from '@/components/site/ContentImage'
import PhotoKeys from '@/components/site/PhotoKeys'
import { pad, type PhotoData } from '@/lib/routes/gallery'
import s from './SPhoto.module.css'

export default function SPhoto({ item: p, index, prev, next, total, photos }: PhotoData) {
  const n = (id: string) => `DD-${pad(photos.findIndex((x) => x.id === id) + 1)}`
  const info: [string, string][] = [
    ['Place', p.place],
    ['Date', p.date],
    ['Camera', p.camera],
    ['Ratio', `${p.ratio} · uncropped`],
  ]
  // like the reference <img max-width/max-height>, a photo is never shown larger than its own pixels
  const ratio = { '--w': p.w, '--h': p.h, '--nw': p.image ? `${p.image.w}px` : '100%' } as CSSProperties
  return (
    <div className={s.page}>
      <PhotoKeys prev={`/gallery/${prev.id}`} next={`/gallery/${next.id}`} />
      <div className={s.top}>
        <Link href="/gallery" className={s.back}>
          ← frames
        </Link>
        <span className={s.hint}>← → to browse · esc to close</span>
        <span className={s.counter}>
          {pad(index + 1)} / {pad(total)}
        </span>
      </div>

      <div className={s.stageBox}>
        <div className={s.stage} style={ratio}>
          {p.image ? (
            <ContentImage
              image={p.image}
              className={s.img}
              eager
              quality={85}
              sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1440px) 92vw, 1328px"
            />
          ) : (
            <div className={s.ph}>{p.ratio} · placeholder</div>
          )}
        </div>
      </div>

      <div className={s.info}>
        <div className={s.titleCell}>
          <p className={s.no}>DD-{pad(index + 1)}</p>
          <h1 className={s.h1}>{p.title}</h1>
        </div>
        {info.map(([k, v]) => (
          <div key={k}>
            <p className={s.k}>{k}</p>
            <p className={s.v}>{v}</p>
          </div>
        ))}
      </div>

      <nav className={s.pager} aria-label="Photographs">
        <Link href={`/gallery/${prev.id}`} className={s.prev}>
          <span className={s.dir}>
            ← <span className={s.deskOnly}>previous</span>
            <span className={s.mobOnly}>prev</span>
          </span>
          <span className={s.target}>
            <span className={s.no}>{n(prev.id)}</span>
            <span>{prev.title}</span>
          </span>
        </Link>
        <Link href={`/gallery/${next.id}`} className={s.next}>
          <span className={s.dir}>next →</span>
          <span className={s.target}>
            <span>{next.title}</span>
            <span className={s.no}>{n(next.id)}</span>
          </span>
        </Link>
      </nav>
    </div>
  )
}
