// Original Post — OrigPost.dc.html: ← BLOG; kind, 72px title, date / read (Length for videos) / place
// / tag pills; the video player + chapters, or Fig. 01; a 720px reading column (Playfair lede,
// chapter headings with their times, an accent-quoted pull quote, figures breaking out to the left);
// NEXT ENTRY.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import Inlines from '@/components/site/Inlines'
import type { Figure } from '@/lib/content/types'
import type { PostData } from '@/lib/routes/journal'
import OriginalVideo from './OriginalVideo'
import s from './OrigPost.module.css'

const KIND = { essay: 'ESSAY', video: 'VIDEO ESSAY', note: 'NOTE' } as const
const pad = (n: number) => String(n).padStart(2, '0')

function Fig({ f, n, sizes, eager }: { f: Figure; n: number; sizes: string; eager?: boolean }) {
  return (
    <figure className={s.fig}>
      {f.image ? (
        <ContentImage image={f.image} className={s.img} sizes={sizes} eager={eager} />
      ) : (
        <div className={s.ph} style={{ aspectRatio: `${f.w} / ${f.h}` }}>
          {f.ratio} · placeholder
        </div>
      )}
      <figcaption className={s.cap}>
        Fig. {pad(n)} — {f.caption}
        <span className={s.deskOnly}> · {f.ratio}</span>
      </figcaption>
    </figure>
  )
}

export default function OrigPost({ item: e, next }: PostData) {
  const video = e.kind === 'video' ? e.video : null
  // the transcript's headings are the chapters: the n-th heading takes the n-th chapter's time
  let heading = 0
  let fig = e.cover ? 1 : 0
  return (
    <article className={s.page}>
      <Link href="/blog" className={s.back}>
        ← BLOG
      </Link>
      <header className={s.header}>
        <p className={s.kind}>{KIND[e.kind]}</p>
        <h1 className={s.h1}>{e.title}</h1>
        <div className={s.meta}>
          <span>{e.date}</span>
          <span>
            <span className={s.deskOnly}>{video ? 'Length ' : ''}</span>
            {e.read}
          </span>
          <span>{e.place}</span>
          <span className={`${s.tags} ${s.deskOnlyFlex}`}>
            {e.tags.map((t, i) => (
              <span key={i} className={s.tag}>
                {t}
              </span>
            ))}
          </span>
        </div>
      </header>

      {video && <OriginalVideo video={video} />}
      {!video && e.cover && (
        <div className={s.cover}>
          <Fig f={e.cover} n={1} eager sizes="(max-width: 760px) 100vw, (max-width: 1232px) calc(100vw - 192px), 1040px" />
        </div>
      )}

      <div className={s.body}>
        {e.standfirst && <p className={s.lede}>{e.standfirst}</p>}
        {e.body.map((b, i) => {
          if (b.type === 'p')
            return (
              <p key={i} className={s.p}>
                <Inlines>{b.children}</Inlines>
              </p>
            )
          if (b.type === 'h2' || b.type === 'h3') {
            const ch = video?.chapters[heading++]
            return (
              <h2 key={i} id={b.id} className={s.h2}>
                {ch && <span className={`${s.h2Time} ${s.deskOnly}`}>{ch.time}</span>}
                {b.text}
              </h2>
            )
          }
          if (b.type === 'quote')
            return (
              <blockquote key={i} className={s.quote}>
                <span className={s.quoteMark} aria-hidden="true">
                  “
                </span>
                <Inlines>{b.children}</Inlines>
              </blockquote>
            )
          if (b.type !== 'figures') return null
          const pair = b.items.length > 1
          return (
            <div key={i} className={`${s.figs} ${pair ? s.figPair : ''}`}>
              {b.items.map((f, j) => (
                <Fig key={j} f={f} n={++fig} sizes={pair ? '(max-width: 760px) 100vw, 472px' : '(max-width: 760px) 100vw, 960px'} />
              ))}
            </div>
          )
        })}
      </div>

      <Link href={`/blog/${next.slug}`} className={s.next}>
        <span className={s.nextLabel}>NEXT ENTRY</span>
        <span className={s.nextTitle}>
          {next.title}
          <span className={s.mobOnly}> →</span>
        </span>
        <span className={`${s.nextArrow} ${s.deskOnly}`} aria-hidden="true">
          →
        </span>
      </Link>
    </article>
  )
}
