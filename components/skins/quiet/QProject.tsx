// Quiet Project — QProject.dc.html: number + name + facts; status.log (the stages, "now" tinted);
// drawings.dir (taped prints of the photo, the drawing and more photos, each at its own ratio);
// notes.log (design log) and about.txt; a "next project" bar.
import Link from 'next/link'
import type { CSSProperties } from 'react'
import ContentImage from '@/components/site/ContentImage'
import Prose from '@/components/site/Prose'
import type { Figure, Img } from '@/lib/content/types'
import { isPlaceholder } from '@/lib/routes/gallery'
import type { ProjectData } from '@/lib/routes/lab'
import Window from './Window'
import s from './QProject.module.css'

const pad = (n: number, l = 2) => String(n).padStart(l, '0')

function ProjectPrint({
  image,
  w,
  h,
  ratio,
  caption,
  tilt = 0,
  tape,
  sizes,
  eager,
  className,
}: {
  image: Img | null
  w: number
  h: number
  ratio: string
  caption: string
  tilt?: number
  /** left offset of a strip of tape */
  tape?: string
  sizes: string
  eager?: boolean
  className?: string
}) {
  return (
    <figure className={`${s.print} ${className ?? ''}`} style={{ '--tilt': `${tilt}deg`, '--tape-left': tape } as CSSProperties}>
      {tape && <span className={s.tape} aria-hidden="true" />}
      <div className={s.card}>
        {image ? (
          <ContentImage image={image} className={s.img} sizes={sizes} eager={eager} />
        ) : (
          <div className={s.ph} style={{ aspectRatio: `${w} / ${h}` }}>
            {ratio} · placeholder
          </div>
        )}
        <figcaption className={s.cap}>
          <span className={s.capTitle}>{caption}</span>
          {!image && <span className={s.capRatio}>{ratio}</span>}
        </figcaption>
      </div>
    </figure>
  )
}

export default function QProject({ item: p, index, next, total }: ProjectData) {
  const ph = p.ph ?? { w: 4, h: 5 }
  const phRatio = `${ph.w}:${ph.h}`
  const placeholderStages = p.stages.length > 0 && p.stages.every((st) => isPlaceholder(st.label))
  const facts: [string, string, boolean][] = [
    ['Kind', p.kind, true],
    ['Status', p.status, false],
    ['Year', p.year, false],
    ['Tools', p.tools, false],
  ]
  const extra = (f: Figure, i: number) => (
    <ProjectPrint
      key={i}
      image={f.image}
      w={f.w}
      h={f.h}
      ratio={f.ratio}
      caption={f.caption}
      tilt={i % 2 ? 0.8 : -0.5}
      sizes="(max-width: 760px) calc(100vw - 80px), 340px"
      // placeholder prints are part of the desktop composition only
      className={f.image ? undefined : s.deskOnly}
    />
  )
  return (
    <div className={s.page}>
      <div className={s.top}>
        <Link href="/lab" className={s.back}>
          ← lab.exe
        </Link>
        <span className={s.topRule} aria-hidden="true" />
        <span className={s.topKind}>{p.kind}</span>
      </div>

      <section className={s.head}>
        <span className={s.num}>{pad(index + 1)}</span>
        <div>
          <h1 className={s.h1}>{p.name}</h1>
          <p className={s.one}>{p.one}</p>
        </div>
        <dl className={s.facts}>
          {facts.map(([k, v, deskOnly]) => (
            <div key={k} className={`${s.fact} ${deskOnly ? s.deskOnly : ''}`}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {p.stages.length > 0 && (
        <Window icon="◉" title="status.log" meta={placeholderStages ? <span className={s.deskOnly}>stages are placeholders</span> : null}>
          <ol className={s.stages}>
            {p.stages.map((st, i) => (
              <li key={i} className={`${s.stage} ${st.state === 'now' ? s.now : ''}`} aria-current={st.state === 'now' ? 'step' : undefined}>
                <span className={`${s.dot} ${st.state === 'next' ? '' : s.dotOn}`} aria-hidden="true" />
                <span className={s.stageLabel}>{st.label}</span>
                <span className={s.stageNote}>{st.state}</span>
              </li>
            ))}
          </ol>
        </Window>
      )}

      <div className={s.cols}>
        <Window icon="▣" title="drawings.dir" meta={<span className={s.deskOnly}>photos &amp; drawings</span>} accentBar>
          <div className={`${s.prints} ${p.img ? s.printsImg : s.printsPh}`}>
            {p.img ? (
              <ProjectPrint
                image={p.img}
                w={p.img.w}
                h={p.img.h}
                ratio=""
                caption={p.img.cap}
                tilt={-1}
                tape="34%"
                sizes="(max-width: 760px) 60vw, 260px"
                eager
                className={s.main}
              />
            ) : (
              <ProjectPrint
                image={null}
                w={ph.w}
                h={ph.h}
                ratio={phRatio}
                caption="[Project photo — placeholder]"
                tilt={-0.6}
                tape="30px"
                sizes="1px"
                className={s.mainPh}
              />
            )}
            {(p.drawing || p.photos.length > 0) && (
              <div className={s.printCol}>
                {p.drawing && (
                  <ProjectPrint
                    image={p.drawing}
                    w={p.drawing.w}
                    h={p.drawing.h}
                    ratio=""
                    caption={p.drawing.cap}
                    tilt={0.6}
                    sizes="(max-width: 760px) calc(100vw - 80px), 340px"
                    className={s.drawing}
                  />
                )}
                {p.photos.map(extra)}
              </div>
            )}
          </div>
        </Window>

        <div className={s.side}>
          {p.log.length > 0 && (
            <Window icon="▤" title="notes.log" meta={<span className={s.deskOnly}>design log</span>} bodyClassName={s.logBody}>
              <ol>
                {p.log.map((l, i) => (
                  <li key={i} className={s.logRow}>
                    <span className={s.logN}>{pad(i + 1, 3)}</span>
                    <span className={s.logDate}>{l.date}</span>
                    <span className={s.logText}>
                      <span className={s.logTitle}>{l.title}</span>
                      <span className={s.logWhy}>{l.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Window>
          )}
          {p.about.length > 0 && (
            // the reference leaves about.txt out of the 390 layout
            <Window icon="▤" title="about.txt" className={s.deskOnly} bodyClassName={s.aboutBody}>
              <Prose blocks={p.about} className={s.prose} sizes="(max-width: 760px) calc(100vw - 64px), 460px" />
            </Window>
          )}
        </div>
      </div>

      {total > 1 && (
        <Link href={`/lab/${next.slug}`} className={s.next}>
          <span className={s.nextLabel}>
            next project<span className={s.mobOnly}> →</span>
          </span>
          <span className={s.nextName}>{next.name}</span>
          <span className={`${s.nextArrow} ${s.deskOnly}`} aria-hidden="true">
            →
          </span>
        </Link>
      )}
    </div>
  )
}
