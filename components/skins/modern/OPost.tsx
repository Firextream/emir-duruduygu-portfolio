// Modernist Post — OPost.dc.html: 84px title, DATE/PLACE/READ/tags strip between 2px rules,
// Fig. 01, 28px/600 standfirst, body in cols 4–9 at 18px/1.7 with a margin note in cols 10–12,
// numbered figures, 56px pull quote between rules with red quote marks, "Next entry" row.
// Video posts: player + chapter table instead of Fig. 01; READ becomes LENGTH.
import Link from 'next/link'
import { Fragment } from 'react'
import ContentImage from '@/components/site/ContentImage'
import Inlines from '@/components/site/Inlines'
import type { Block, Figure } from '@/lib/content/types'
import type { PostData } from '@/lib/routes/journal'
import ModernVideo from './ModernVideo'
import { BackRow } from './PageHead'
import s from './OPost.module.css'

type Row = { kind: 'text'; blocks: Block[] } | { kind: 'quote'; block: Extract<Block, { type: 'quote' }> } | { kind: 'figures'; items: Figure[] }

/** Splits the body into text runs, pull quotes and figure groups (each laid out on the 12-col grid). */
function rows(body: Block[]): Row[] {
  const out: Row[] = []
  for (const b of body) {
    if (b.type === 'quote') out.push({ kind: 'quote', block: b })
    else if (b.type === 'figures') out.push({ kind: 'figures', items: b.items })
    else {
      const last = out[out.length - 1]
      if (last?.kind === 'text') last.blocks.push(b)
      else out.push({ kind: 'text', blocks: [b] })
    }
  }
  return out
}

const pad = (n: number) => String(n).padStart(2, '0')

function Fig({ f, n, sizes, wide }: { f: Figure; n: number; sizes: string; wide?: boolean }) {
  return (
    <figure className={`${s.fig} ${wide ? s.figWide : ''}`}>
      {f.image ? (
        <ContentImage image={f.image} className={s.img} sizes={sizes} />
      ) : (
        <div className={s.ph} style={{ aspectRatio: `${f.w} / ${f.h}` }}>
          {f.ratio} · placeholder
        </div>
      )}
      <figcaption className={s.cap}>
        <span className={s.figNo}>Fig. {pad(n)}</span>
        <span>{f.caption}</span>
        {wide && <span className={s.capRatio}>{f.ratio}</span>}
      </figcaption>
    </figure>
  )
}

export default function OPost({ item: e, index, next }: PostData) {
  const video = e.kind === 'video' ? e.video : null
  let figNo = e.cover && !video ? 1 : 0
  let noteShown = false
  return (
    <div className={s.page}>
      <BackRow href="/blog" label="Journal" meta={`Entry ${pad(index + 1)}`} />

      <section className={s.head}>
        <h1 className={s.h1}>{e.title}</h1>
        <dl className={s.strip}>
          <div className={s.date}>
            <dt>DATE</dt>
            <dd>{e.date}</dd>
          </div>
          <div className={s.place}>
            <dt>PLACE</dt>
            <dd>{e.place}</dd>
          </div>
          <div className={s.read}>
            <dt>{video ? 'LENGTH' : 'READ'}</dt>
            <dd>{e.read}</dd>
          </div>
          <div className={s.tags}>
            <dt className="sr-only">Tags</dt>
            {e.tags.map((t, i) => (
              <dd key={i} className={s.tag}>
                {t}
              </dd>
            ))}
          </div>
        </dl>
      </section>

      {video ? (
        <ModernVideo video={video} />
      ) : (
        e.cover && (
          <figure className={s.cover}>
            {e.cover.image ? (
              <ContentImage
                image={e.cover.image}
                className={s.img}
                eager
                sizes="(max-width: 760px) 100vw, (max-width: 1216px) calc(100vw - 96px), 1120px"
              />
            ) : (
              <div className={s.ph} style={{ aspectRatio: `${e.cover.w} / ${e.cover.h}` }}>
                {e.cover.ratio} · placeholder
              </div>
            )}
            <figcaption className={s.cap}>
              <span className={s.figNo}>Fig. 01</span>
              <span>{e.cover.caption}</span>
              <span className={s.capRatio}>{e.cover.ratio}</span>
            </figcaption>
          </figure>
        )
      )}

      <article className={s.article}>
        {e.standfirst && <p className={s.standfirst}>{e.standfirst}</p>}
        {rows(e.body).map((r, i) => {
          if (r.kind === 'quote')
            return (
              <blockquote key={i} className={s.quote}>
                <span className={s.red}>“</span>
                <Inlines>{r.block.children}</Inlines>
                <span className={s.red}>”</span>
              </blockquote>
            )
          if (r.kind === 'figures') {
            const start = figNo + 1
            figNo += r.items.length
            if (r.items.length === 1)
              return (
                <div key={i} className={s.figRow}>
                  <Fig f={r.items[0]} n={start} wide sizes="(max-width: 760px) 100vw, (max-width: 1216px) calc(100vw - 96px), 1120px" />
                </div>
              )
            return (
              <div key={i} className={`${s.figRow} ${s.figPair}`}>
                {r.items.map((f, j) => (
                  <Fig key={j} f={f} n={start + j} sizes={j === 0 ? '(max-width: 760px) 100vw, 30vw' : '(max-width: 760px) 100vw, 64vw'} />
                ))}
              </div>
            )
          }
          const withNote = !noteShown && !!e.marginNote
          if (withNote) noteShown = true
          return (
            <div key={i} className={s.textRow}>
              <div className={s.body}>
                {r.blocks.map((b, j) => (
                  <Fragment key={j}>
                    {b.type === 'p' && (
                      <p>
                        <Inlines>{b.children}</Inlines>
                      </p>
                    )}
                    {b.type === 'h2' && <h2 id={b.id}>{b.text}</h2>}
                    {b.type === 'h3' && <h3 id={b.id}>{b.text}</h3>}
                  </Fragment>
                ))}
              </div>
              {withNote && (
                <aside className={s.note}>
                  <span className={s.noteLabel}>NOTE</span>
                  {e.marginNote}
                </aside>
              )}
            </div>
          )
        })}
      </article>

      <Link href={`/blog/${next.slug}`} className={s.next}>
        <span className={s.nextLabel}>
          NEXT ENTRY<span className={s.mobOnly}> →</span>
        </span>
        <span className={s.nextTitle}>{next.title}</span>
        <span className={s.nextArrow} aria-hidden="true">
          →
        </span>
      </Link>
    </div>
  )
}
