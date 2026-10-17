// Quiet Photo — QPhoto.dc.html: "viewer — title" window, prev/next toolbar, the print on a ruled
// desk (fits 820×640 at its own ratio), a details panel and a thumb strip.
import Link from 'next/link'
import type { CSSProperties } from 'react'
import ContentImage from '@/components/site/ContentImage'
import PhotoKeys from '@/components/site/PhotoKeys'
import { pad, type PhotoData } from '@/lib/routes/gallery'
import Window from './Window'
import s from './QPhoto.module.css'

export default function QPhoto({ item: p, index, prev, next, total, photos }: PhotoData) {
  const size = p.image ? `${p.w}×${p.h}` : '[size]'
  const rows: [string, string, boolean][] = [
    ['Place', p.place, true],
    ['Date', p.date, true],
    ['Ratio', p.ratio, true],
    ['Size', size, false],
    ['Camera', p.camera, false],
  ]
  const ratio = { '--w': p.w, '--h': p.h } as CSSProperties
  return (
    <div className={s.page}>
      <PhotoKeys prev={`/gallery/${prev.id}`} next={`/gallery/${next.id}`} />
      <div className={s.back}>
        <Link href="/gallery" className={s.backLink}>
          ← frames.dir
        </Link>
        <span className={s.backRule} aria-hidden="true" />
        <span className={s.file}>{p.file}</span>
        <span className={s.pos}>
          {pad(index + 1, 2)} / {pad(total, 2)}
        </span>
      </div>

      <Window
        icon="◫"
        accentBar
        lift={false}
        title={
          <>
            <span className={s.deskOnly}>viewer — {p.title}</span>
            <span className={s.mobOnly}>{p.file}</span>
          </>
        }
        meta={
          <span className={s.deskOnly}>
            {p.ratio} · {size}
          </span>
        }
      >
        <div className={s.toolbar}>
          <Link href={`/gallery/${prev.id}`} className={s.btn}>
            ← prev
          </Link>
          <Link href={`/gallery/${next.id}`} className={s.btn}>
            next →
          </Link>
          <span className={s.toolMeta}>{p.ratio} · uncropped</span>
        </div>

        <div className={s.body}>
          <div className={s.desk}>
            <div className={s.card}>
              <div className={s.stage} style={ratio}>
                {p.image ? (
                  <ContentImage
                    image={p.image}
                    className={s.img}
                    eager
                    quality={85}
                    sizes="(max-width: 760px) calc(100vw - 80px), (max-width: 1100px) 70vw, 820px"
                  />
                ) : (
                  <div className={s.ph}>{p.ratio} · placeholder</div>
                )}
              </div>
            </div>
          </div>

          <aside className={s.aside}>
            <div>
              <span className={`${s.label} ${s.deskOnly}`}>Title</span>
              <h1 className={s.h1}>{p.title}</h1>
            </div>
            <dl className={s.rows}>
              {rows.map(([k, v, mobile]) => (
                <div key={k} className={mobile ? undefined : s.deskOnly}>
                  <dt className={s.label}>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className={`${s.note} ${s.deskOnly}`}>{p.note ?? '[A line or two about the photograph — placeholder]'}</p>
          </aside>
        </div>

        <nav className={s.mobPager} aria-label="Photographs">
          <Link href={`/gallery/${prev.id}`}>← prev</Link>
          <Link href={`/gallery/${next.id}`}>next →</Link>
        </nav>

        <nav className={s.strip} aria-label="All photographs">
          {photos.map((q, k) => (
            <Link
              key={q.id}
              href={`/gallery/${q.id}`}
              className={s.thumb}
              style={{ aspectRatio: `${q.w} / ${q.h}` }}
              aria-label={`${q.title} (${pad(k + 1, 2)})`}
              aria-current={q.id === p.id ? 'page' : undefined}
            >
              {q.image ? (
                <ContentImage image={q.image} alt="" className={s.thumbImg} sizes={`${Math.round((58 * q.w) / q.h)}px`} />
              ) : (
                <span className={s.thumbPh} />
              )}
            </Link>
          ))}
        </nav>
      </Window>
    </div>
  )
}
