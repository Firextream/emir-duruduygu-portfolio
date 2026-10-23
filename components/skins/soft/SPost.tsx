// Soft Club Post — SPost.dc.html. Essay: 680px reading column, Unbounded pull quote, breakout figure.
// Video essay: player + chapter list; the chapters become the transcript headings below.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import Inlines from '@/components/site/Inlines'
import type { Figure, PostKind } from '@/lib/content/types'
import type { PostData } from '@/lib/routes/journal'
import SoftVideo from './SoftVideo'
import s from './SPost.module.css'

const KIND: Record<PostKind, [string, string]> = { essay: ['ESSAY', '文'], video: ['VIDEO ESSAY', '映像'], note: ['NOTE', 'メモ'] }
const pad = (n: number, l = 2) => String(n).padStart(l, '0')

function SFigure({ f, sizes }: { f: Figure; sizes: string }) {
  return (
    <figure className={s.fig}>
      {f.image ? (
        <ContentImage image={f.image} className={s.img} sizes={sizes} />
      ) : (
        <div className={s.ph} style={{ aspectRatio: `${f.w} / ${f.h}` }}>
          {f.ratio} · placeholder
        </div>
      )}
      <figcaption className={s.cap}>
        {f.no && <span className={`${s.figNo} ${s.deskOnly}`}>DD-{pad(f.no, 3)}</span>}
        <span>
          {f.caption} · {f.ratio} · uncropped
        </span>
      </figcaption>
    </figure>
  )
}

export default function SPost({ item: e, index, prev, next, total }: PostData) {
  const video = e.kind === 'video' ? e.video : null
  // chapters become the transcript headings: the n-th heading takes the n-th chapter's time
  let heading = 0
  return (
    <div className={s.page}>
      <div className={s.top}>
        <Link href="/blog" className={s.back}>
          ← journal
        </Link>
        <span className={s.counter}>
          {pad(index + 1)} / {pad(total)}
        </span>
      </div>

      <header className={s.header}>
        <div>
          <p className={s.kicker}>
            DD-06 · {KIND[e.kind][0]} · {e.read}
          </p>
          <h1 className={s.h1}>{e.title}</h1>
          <p className={s.meta}>
            <span>{e.date}</span>
            <span>{e.place}</span>
            <span className={s.deskOnly}>{e.tags.join(' · ')}</span>
          </p>
        </div>
        <span className={s.obi} aria-hidden="true">
          {KIND[e.kind][1]}
        </span>
      </header>

      {video && <SoftVideo video={video} />}

      <section className={s.body}>
        <aside className={`${s.aside} ${s.deskOnly}`}>
          <div className={s.asideInner}>
            <span>liner notes · 解説</span>
            <span>{video ? 'essay & transcript' : `${e.read} read`}</span>
          </div>
        </aside>
        <article className={s.article}>
          {/* no separate standfirst slot: it opens the text at reading size; a video's intro does that job */}
          {e.standfirst && !video && <p className={s.p}>{e.standfirst}</p>}
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
                  {ch && <span className={s.h2Time}>{ch.time}</span>}
                  <span>{b.text}</span>
                </h2>
              )
            }
            if (b.type === 'quote')
              return (
                <blockquote key={i} className={s.quote}>
                  <Inlines>{b.children}</Inlines>
                </blockquote>
              )
            if (b.type !== 'figures') return null
            return (
              <div key={i} className={`${s.figs} ${b.items.length > 1 ? s.figPair : ''}`}>
                {b.items.map((f, j) => (
                  <SFigure key={j} f={f} sizes={b.items.length > 1 ? '(max-width: 760px) 100vw, 490px' : '(max-width: 760px) 100vw, 1000px'} />
                ))}
              </div>
            )
          })}
          <ul className={s.tags} aria-label="Tags">
            {e.tags.map((t, i) => (
              <li key={i} className={s.tag}>
                {t}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <nav className={s.pager} aria-label="Entries">
        <Link href={`/blog/${prev.slug}`} className={s.newer}>
          <span className={s.dir}>← newer</span>
          <span className={s.target}>{prev.title}</span>
        </Link>
        <Link href={`/blog/${next.slug}`} className={s.older}>
          <span className={s.dir}>older →</span>
          <span className={s.target}>{next.title}</span>
        </Link>
      </nav>
    </div>
  )
}
