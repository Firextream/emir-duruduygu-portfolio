// Modernist Project — OProject.dc.html: 176px name (96px if long) + one-liner; 4-cell spec strip;
// dark image cols 1–7 (640px, contained); 01 Status (square markers, red "Now"), 02 About; the drawing
// on white in a 2px box; 03 Design log; "Next project" row.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import Prose from '@/components/site/Prose'
import type { Figure } from '@/lib/content/types'
import type { ProjectData } from '@/lib/routes/lab'
import { BackRow } from './PageHead'
import s from './OProject.module.css'

const pad = (n: number, l = 2) => String(n).padStart(l, '0')
const NOTE = { done: 'Done', now: 'Now', next: 'Next' } as const

/** `sizes` for an image contained in a box `bw` wide and `bh` tall */
const containSizes = (w: number, h: number, bw: number, bh: number, mobileVw: number, mobileH: number) =>
  `(max-width: 760px) ${Math.round(Math.min(mobileVw, ((mobileH * w) / h / 390) * 100))}vw, ${Math.round(Math.min(bw, (bh * w) / h))}px`

function Stage({ f, no }: { f: Figure; no: number }) {
  if (!f.image) return null
  return (
    <figure className={s.extra}>
      <div className={s.stage}>
        <ContentImage image={f.image} className={s.stageImg} sizes={containSizes(f.w, f.h, 1240, 600, 100, 390)} />
      </div>
      <figcaption className={s.cap}>
        <span className={s.figNo}>Fig. {pad(no)}</span>
        <span>{f.caption}</span>
      </figcaption>
    </figure>
  )
}

export default function OProject({ item: p, index, next, total }: ProjectData) {
  const long = p.name.length > 10
  const spec: [string, string][] = [
    ['Kind', p.kind],
    ['Status', p.status],
    ['Year', p.year],
    ['Tools', p.tools],
  ]
  // the real extra photos follow the drawing as Fig. 03…; placeholder prints are a Quiet thing
  const extra = p.photos.filter((f) => f.image)
  return (
    <div>
      <BackRow
        href="/lab"
        label="Lab"
        meta={
          <>
            <span className={s.deskOnly}>Project </span>
            {pad(index + 1)} / {pad(total)}
          </>
        }
      />
      <section className={s.head}>
        <h1 className={`${s.name} ${long ? s.nameLong : ''}`}>{p.name}</h1>
        <p className={s.one}>{p.one}</p>
      </section>

      <div className={s.body}>
        <dl className={s.spec}>
          {spec.map(([k, v]) => (
            <div key={k} className={s.specCell}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <div className={s.main}>
          <figure className={s.fig1}>
            <div className={s.stage}>
              {p.img ? (
                <ContentImage image={p.img} alt={p.name} className={s.stageImg} sizes={containSizes(p.img.w, p.img.h, 760, 600, 100, 390)} eager />
              ) : (
                <span className={s.ph}>
                  <span className={s.deskOnly}>[Project photo — placeholder]</span>
                </span>
              )}
            </div>
            <figcaption className={`${s.cap} ${s.deskOnlyFlex}`}>
              <span className={s.figNo}>Fig. 01</span>
              <span>{p.img?.cap ?? '[Caption — placeholder]'}</span>
            </figcaption>
          </figure>

          <div className={s.aside}>
            {p.stages.length > 0 && (
              <section aria-labelledby="p-status">
                <div className={s.secHead}>
                  <span className={s.secNo}>01</span>
                  <h2 id="p-status" className={s.secTitle}>
                    Status
                  </h2>
                </div>
                <ol className={s.stages}>
                  {p.stages.map((st, i) => (
                    <li key={i} className={s.stageRow} aria-current={st.state === 'now' ? 'step' : undefined}>
                      <span className={`${s.dot} ${st.state === 'next' ? '' : s.dotOn}`} aria-hidden="true" />
                      <span className={s.stageLabel}>{st.label}</span>
                      <span className={`${s.tag} ${st.state === 'now' ? s.tagNow : ''}`}>{NOTE[st.state]}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            {p.about.length > 0 && (
              // the reference leaves 02 About out of the 390 layout
              <section className={`${s.about} ${s.deskOnly}`} aria-labelledby="p-about">
                <div className={s.secHead}>
                  <span className={s.secNo}>02</span>
                  <h2 id="p-about" className={s.secTitle}>
                    About
                  </h2>
                </div>
                <Prose blocks={p.about} className={s.prose} />
              </section>
            )}
          </div>
        </div>

        {p.drawing && (
          <figure className={s.drawing}>
            <div className={s.drawBox}>
              <ContentImage image={p.drawing} alt="" className={s.drawImg} sizes="(max-width: 760px) calc(100vw - 72px), calc(100vw - 196px)" />
            </div>
            <figcaption className={s.cap}>
              <span className={s.figNo}>Fig. 02</span>
              <span>{p.drawing.cap}</span>
            </figcaption>
          </figure>
        )}

        {extra.map((f, i) => (
          <Stage key={i} f={f} no={(p.drawing ? 3 : 2) + i} />
        ))}

        {p.log.length > 0 && (
          <section className={s.log} aria-labelledby="p-log">
            <span className={s.logNo}>03</span>
            <h2 id="p-log" className={s.logTitle}>
              Design log
            </h2>
            <ol className={s.logList}>
              {p.log.map((l, i) => (
                <li key={i} className={s.logRow}>
                  <span className={s.logN}>{pad(i + 1, 3)}</span>
                  <span className={s.logDate}>{l.date}</span>
                  <span className={s.logText}>
                    <span className={s.logEntry}>{l.title}</span>
                    <span className={s.logWhy}>{l.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {total > 1 && (
        <Link href={`/lab/${next.slug}`} className={s.next}>
          <span className={s.nextLabel}>
            Next project<span className={s.mobOnly}> →</span>
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
