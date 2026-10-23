// Quiet Post — QPost.dc.html: the entry as a text file in a window. Header (meta, serif title,
// standfirst), optional player window, a details aside, the article with taped prints for figures
// (a single wide figure breaks out to the right; two sit side by side), a paper-note pull quote,
// the signature, then previous / next.
import Link from 'next/link'
import type { CSSProperties } from 'react'
import ContentImage from '@/components/site/ContentImage'
import Inlines from '@/components/site/Inlines'
import type { Figure } from '@/lib/content/types'
import type { PostData } from '@/lib/routes/journal'
import QuietVideo from './QuietVideo'
import Window from './Window'
import s from './QPost.module.css'

function QFigure({ f, tilt, tape, className, sizes }: { f: Figure; tilt: number; tape?: string; className?: string; sizes: string }) {
  return (
    <figure className={`${s.figure} ${className ?? ''}`} style={{ '--tilt': `${tilt}deg`, ...(tape ? { '--tape-left': tape } : {}) } as CSSProperties}>
      {tape && <span className={s.tape} aria-hidden="true" />}
      <div className={s.card}>
        {f.image ? (
          <ContentImage image={f.image} className={s.img} sizes={sizes} />
        ) : (
          <div className={s.ph} style={{ aspectRatio: `${f.w} / ${f.h}` }}>
            {f.ratio}
            {f.h > f.w ? ' portrait' : ''} · placeholder
          </div>
        )}
        <figcaption className={s.cap}>
          <span className={s.capText}>{f.caption}</span>
          <span className={s.capRatio}>{f.ratio}</span>
        </figcaption>
      </div>
    </figure>
  )
}

export default function QPost({ item: e, index, prev, next, total }: PostData) {
  const video = e.kind === 'video' ? e.video : null
  const readLabel = video ? `video · ${video.duration}` : `${e.read} read`
  return (
    <div className={s.page}>
      <div className={s.back}>
        <Link href="/blog" className={s.backLink}>
          ← journal.txt
        </Link>
        <span className={s.backRule} aria-hidden="true" />
        <span className={s.pos}>
          entry {index + 1} of {total}
        </span>
      </div>

      <Window
        icon="▤"
        accentBar
        as="article"
        title={
          <>
            <span className={s.deskOnly}>entry — </span>
            {e.slug}.txt
          </>
        }
        meta={<span className={s.deskOnly}>{readLabel}</span>}
      >
        <header className={s.header}>
          <p className={s.meta}>
            <span>{e.date}</span>
            <span className={s.deskOnly} aria-hidden="true">
              ·
            </span>
            <span className={s.deskOnly}>{e.place}</span>
            <span aria-hidden="true">·</span>
            <span>{e.read}</span>
          </p>
          <h1 className={s.h1}>{e.title}</h1>
          {e.standfirst && <p className={s.standfirst}>{e.standfirst}</p>}
        </header>

        {video && (
          <div className={s.videoWrap}>
            <QuietVideo video={video} slug={e.slug} />
          </div>
        )}

        <div className={s.body}>
          <aside className={s.aside}>
            <dl className={s.facts}>
              <div>
                <dt>Date</dt>
                <dd>{e.date}</dd>
              </div>
              <div>
                <dt>Read</dt>
                <dd>{e.read}</dd>
              </div>
              <div>
                <dt>Place</dt>
                <dd>{e.place}</dd>
              </div>
            </dl>
            <ul className={s.tags} aria-label="Tags">
              {e.tags.map((t, i) => (
                <li key={i} className={s.chip}>
                  {t}
                </li>
              ))}
            </ul>
          </aside>

          <div className={s.text}>
            {e.body.map((b, i) => {
              if (b.type === 'p')
                return (
                  <p key={i} className={s.p}>
                    <Inlines>{b.children}</Inlines>
                  </p>
                )
              if (b.type === 'h2' || b.type === 'h3')
                return (
                  <h2 key={i} id={b.id} className={s.h2}>
                    {b.text}
                  </h2>
                )
              if (b.type === 'quote')
                return (
                  <blockquote key={i} className={s.quote}>
                    <p>
                      <Inlines>{b.children}</Inlines>
                    </p>
                  </blockquote>
                )
              if (b.type !== 'figures') return null
              if (b.items.length === 1)
                return (
                  <div key={i} className={s.wide}>
                    <QFigure f={b.items[0]} tilt={-0.3} tape="40%" sizes="(max-width: 760px) 100vw, 820px" />
                  </div>
                )
              return (
                <div key={i} className={s.pair}>
                  {b.items.map((f, j) => (
                    <QFigure
                      key={j}
                      f={f}
                      tilt={j % 2 ? -0.6 : 0.8}
                      tape={j === 0 ? '30%' : undefined}
                      className={j === 0 ? s.pairFirst : undefined}
                      sizes={j === 0 ? '(max-width: 760px) 78vw, 260px' : '(max-width: 760px) 100vw, 420px'}
                    />
                  ))}
                </div>
              )
            })}
            <ul className={`${s.tags} ${s.mobTags}`} aria-label="Tags">
              {e.tags.map((t, i) => (
                <li key={i} className={s.chip}>
                  {t}
                </li>
              ))}
            </ul>
            <p className={s.sign}>— e. · {e.date}</p>
          </div>
        </div>

        <nav className={s.pager} aria-label="Entries">
          <Link href={`/blog/${prev.slug}`} className={s.prev}>
            <span className={s.pagerLabel}>← previous</span>
            <span className={s.pagerTitle}>{prev.title}</span>
          </Link>
          <Link href={`/blog/${next.slug}`} className={s.next}>
            <span className={s.pagerLabel}>next post →</span>
            <span className={s.pagerTitle}>{next.title}</span>
          </Link>
        </nav>
      </Window>
    </div>
  )
}
