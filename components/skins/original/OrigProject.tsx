// Original Project — OrigProject.dc.html: ← LAB; number / kind + status pill; a 136px name (88px if
// long) and one-liner; STATUS / YEAR / KIND / TOOLS strip; the photo contained on a dark panel |
// ABOUT THE PROJECT; the drawing on a white card (Fig. 02); DESIGN LOG "How it's going"; NEXT PROJECT.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import Inlines from '@/components/site/Inlines'
import type { Block } from '@/lib/content/types'
import type { ProjectData } from '@/lib/routes/lab'
import s from './OrigProject.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

/** The About text: its first paragraph is the Playfair lede, the rest reads as body. */
function About({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'p')
          return (
            <p key={i} className={i === 0 ? s.lede : `${s.aboutP} ${s.deskOnly}`}>
              <Inlines>{b.children}</Inlines>
            </p>
          )
        if (b.type === 'h2' || b.type === 'h3')
          return (
            <h3 key={i} className={`${s.aboutH} ${s.deskOnly}`}>
              {b.text}
            </h3>
          )
        if (b.type === 'quote')
          return (
            <blockquote key={i} className={`${s.aboutP} ${s.deskOnly}`}>
              <Inlines>{b.children}</Inlines>
            </blockquote>
          )
        return null
      })}
    </>
  )
}

export default function OrigProject({ item: p, index, next, total }: ProjectData) {
  const ph = p.ph ?? { w: 1, h: 1 }
  const long = p.name.length > 12
  const cap = p.img ? `Fig. 01 — ${p.img.cap}` : 'Fig. 01 — [Photo — placeholder]'
  const spec: [string, string][] = [
    ['STATUS', p.status],
    ['YEAR', p.year],
    ['KIND', p.kind],
    ['TOOLS', p.tools],
  ]
  const extra = p.photos.filter((f) => f.image)
  return (
    <div className={s.page}>
      <Link href="/lab" className={s.back}>
        ← LAB
      </Link>
      <div className={s.metaRow}>
        <span className={s.no}>
          {pad(index + 1)} / {p.kind.toUpperCase()}
        </span>
        <span className={s.status}>{p.status}</span>
      </div>
      <h1 className={`${s.h1} ${long ? s.h1Long : ''}`}>{p.name}</h1>
      <p className={s.one}>{p.one}</p>

      <dl className={s.spec}>
        {spec.map(([k, v]) => (
          <div key={k} className={s.specCell}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <div className={s.main}>
        <div className={`${s.frame} ${p.img ? s.frameDark : ''}`}>
          {p.img ? (
            <ContentImage image={p.img} alt={p.img.cap} className={s.img} eager sizes="(max-width: 760px) calc(100vw - 80px), 620px" />
          ) : (
            <span className={s.ph} style={{ aspectRatio: `${ph.w} / ${ph.h}`, width: `min(100%, ${Math.round((520 * ph.w) / ph.h)}px)` }}>
              {ph.w}:{ph.h} · photo placeholder
            </span>
          )}
        </div>
        <div className={s.about}>
          <p className={`${s.aboutKicker} ${s.deskOnly}`}>ABOUT THE PROJECT</p>
          {p.about.length > 0 ? <About blocks={p.about} /> : <p className={s.lede}>[What it is, who it&apos;s for and why it exists — placeholder]</p>}
          <p className={`${s.figCap} ${s.deskOnly}`}>{cap}</p>
        </div>
      </div>

      {p.drawing && (
        <figure className={s.drawing}>
          <ContentImage image={p.drawing} alt={p.drawing.cap} className={s.drawImg} sizes="(max-width: 760px) calc(100vw - 72px), calc(100vw - 288px)" />
          <figcaption className={s.drawCap}>
            <span className={s.deskOnly}>Fig. 02 — </span>
            {p.drawing.cap}
          </figcaption>
        </figure>
      )}

      {extra.map((f, i) => (
        <figure key={i} className={s.drawing}>
          {f.image && <ContentImage image={f.image} className={s.drawImg} sizes="(max-width: 760px) calc(100vw - 72px), calc(100vw - 288px)" />}
          <figcaption className={s.drawCap}>
            Fig. {pad((p.drawing ? 3 : 2) + i)} — {f.caption}
          </figcaption>
        </figure>
      ))}

      {p.log.length > 0 && (
        <section className={s.log} aria-labelledby="design-log">
          <p className={s.logKicker}>DESIGN LOG</p>
          <h2 id="design-log" className={`${s.h2} ${s.deskOnly}`}>
            How it&apos;s going
          </h2>
          <ol className={s.logList}>
            {p.log.map((l, i) => (
              <li key={i} className={s.logRow}>
                <span className={s.logDate}>{l.date}</span>
                <span className={s.logTitle}>{l.title}</span>
                <span className={s.logText}>{l.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {total > 1 && (
        <Link href={`/lab/${next.slug}`} className={s.next}>
          <span className={s.nextLabel}>NEXT PROJECT</span>
          <span className={s.nextName}>
            {next.name}
            <span className={s.mobOnly}> →</span>
          </span>
          <span className={`${s.nextArrow} ${s.deskOnly}`} aria-hidden="true">
            →
          </span>
        </Link>
      )}
    </div>
  )
}
