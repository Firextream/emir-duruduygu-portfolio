// Modernist Photo — OPhoto.dc.html: image stage cols 1–9 (720px), aside cols 10–12 with [00N], title,
// PLACE/DATE/RATIO/SIZE/CAMERA, note, Prev / red Next; thumb strip below (current = 2px red outline).
import Link from 'next/link'
import type { CSSProperties } from 'react'
import ContentImage from '@/components/site/ContentImage'
import PhotoKeys from '@/components/site/PhotoKeys'
import { pad, type PhotoData } from '@/lib/routes/gallery'
import { BackRow } from './PageHead'
import s from './OPhoto.module.css'

export default function OPhoto({ item: p, index, prev, next, total, photos }: PhotoData) {
  const meta: [string, string][] = [
    ['PLACE', p.place],
    ['DATE', p.date],
    ['RATIO', p.ratio],
    ['SIZE', p.image ? `${p.w} × ${p.h}` : '[size]'],
    ['CAMERA', p.camera],
  ]
  const ratio = { '--w': p.w, '--h': p.h } as CSSProperties
  return (
    <div className={s.page}>
      <PhotoKeys prev={`/gallery/${prev.id}`} next={`/gallery/${next.id}`} />
      <BackRow href="/gallery" label="Gallery" meta={`${pad(index + 1, 2)} / ${pad(total, 2)}`} />

      <section className={s.grid}>
        <div className={s.stageBox}>
          <div className={s.stage} style={ratio}>
            {p.image ? (
              <ContentImage
                image={p.image}
                className={s.img}
                eager
                quality={85}
                sizes="(max-width: 760px) 100vw, (max-width: 1100px) 90vw, (max-width: 1440px) 68vw, 980px"
              />
            ) : (
              <div className={s.ph}>{p.ratio} · placeholder</div>
            )}
          </div>
        </div>

        <nav className={s.pager} aria-label="Photographs">
          <Link href={`/gallery/${prev.id}`} className={s.prev}>
            <span>← Prev</span>
          </Link>
          <Link href={`/gallery/${next.id}`} className={s.next}>
            <span>Next</span>
            <span aria-hidden="true">→</span>
          </Link>
        </nav>

        <aside className={s.aside}>
          <div className={s.no}>[{pad(index + 1)}]</div>
          <h1 className={s.title}>{p.title}</h1>
          <dl className={s.meta}>
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className={s.note}>{p.note ?? '[A line or two about the photograph — placeholder]'}</p>
        </aside>
      </section>

      <nav className={s.strip} aria-label="All photographs">
        {photos.map((q, k) => (
          <Link
            key={q.id}
            href={`/gallery/${q.id}`}
            className={s.thumb}
            style={{ aspectRatio: `${q.w} / ${q.h}` }}
            aria-label={`${q.title} (${pad(k + 1)})`}
            aria-current={q.id === p.id ? 'page' : undefined}
          >
            {q.image ? (
              <ContentImage image={q.image} alt="" className={s.thumbImg} sizes={`${Math.round((72 * q.w) / q.h)}px`} />
            ) : (
              <span className={s.thumbPh} />
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}
