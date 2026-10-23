// Original Photo — OrigPhoto.dc.html: ← GALLERY + counter; the photo uncropped on a white card
// (max 720px tall) | a sticky aside: FRAME 0N, title, PLACE / DATE / RATIO / SIZE / CAMERA, a note,
// ← Previous — Next →, the key hint; thumbnails below (current = accent outline). ←/→/Esc browse.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import PhotoKeys from '@/components/site/PhotoKeys'
import { pad, type PhotoData } from '@/lib/routes/gallery'
import s from './OrigPhoto.module.css'

export default function OrigPhoto({ item: p, index, prev, next, total, photos }: PhotoData) {
  const facts: [string, string][] = [
    ['PLACE', p.place],
    ['DATE', p.date],
    ['RATIO', `${p.ratio} · uncropped`],
    ['SIZE', p.image ? `${p.w} × ${p.h}` : '[W × H]'],
    ['CAMERA', p.camera],
  ]
  const no = pad(index + 1, 2)
  return (
    <div className={s.page}>
      <PhotoKeys prev={`/gallery/${prev.id}`} next={`/gallery/${next.id}`} />
      <div className={s.top}>
        <Link href="/gallery" className={s.back}>
          ← GALLERY
        </Link>
        <span className={s.counter}>
          {no} / {pad(total, 2)}
        </span>
      </div>

      <div className={s.grid}>
        <div className={s.stage}>
          {p.image ? (
            <ContentImage
              image={p.image}
              className={s.img}
              eager
              quality={85}
              sizes="(max-width: 760px) 100vw, (max-width: 1440px) calc(100vw - 660px), 780px"
            />
          ) : (
            <div className={s.ph} style={{ aspectRatio: `${p.w} / ${p.h}`, width: `min(100%, ${Math.round((720 * p.w) / p.h)}px)` }}>
              {p.ratio} · placeholder
            </div>
          )}
        </div>

        <aside className={s.aside}>
          <p className={`${s.frameNo} ${s.deskOnly}`}>FRAME {no}</p>
          <h1 className={s.h1}>{p.title}</h1>
          <dl className={s.facts}>
            {facts.map(([k, v]) => (
              <div key={k} className={s.fact}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className={`${s.note} ${s.deskOnly}`}>{p.note ?? '[A sentence about the moment — placeholder]'}</p>
          <nav className={s.pager} aria-label="Photographs">
            <Link href={`/gallery/${prev.id}`} className={s.prev}>
              ← Previous
            </Link>
            <span className={s.rule} aria-hidden="true" />
            <Link href={`/gallery/${next.id}`} className={s.next}>
              Next →
            </Link>
          </nav>
          <p className={`${s.hint} ${s.deskOnly}`}>← → to browse · Esc to close</p>
        </aside>
      </div>

      <nav className={s.thumbs} aria-label="All photographs">
        {photos.map((q, k) => (
          <Link
            key={q.id}
            href={`/gallery/${q.id}`}
            className={s.thumb}
            aria-label={`${q.title} (${pad(k + 1, 2)})`}
            aria-current={q.id === p.id ? 'page' : undefined}
          >
            {q.image ? (
              <ContentImage image={q.image} alt="" className={s.thumbImg} sizes={`${Math.round((72 * q.w) / q.h)}px`} />
            ) : (
              <span className={s.thumbPh} style={{ aspectRatio: `${q.w} / ${q.h}` }} />
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}
