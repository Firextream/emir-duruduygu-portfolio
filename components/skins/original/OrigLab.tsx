// Original Lab — OrigLab.dc.html: "Duruduygu Lab." head, a parts marquee (accent dots), one 50/50
// row per project (the photo contained on a dark or tinted panel | number / kind, status pill, name,
// one-liner, Kind / Year / Tools, View project), then ON THE BENCH: Lab notes.
import type { CSSProperties } from 'react'
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import type { LabData } from '@/lib/routes/lab'
import Marquee from './Marquee'
import s from './OrigLab.module.css'

const PARTS = ['SLAB-100', 'CHARM', 'E-ink', 'ESP32-S3', 'nRF52840', 'KiCad', 'RSVP', 'Denim', 'Seamly2D', 'Silk Road', 'Firmware', 'PCB'] as const
const pad = (n: number) => String(n).padStart(2, '0')

export default function OrigLab({ projects, notes }: LabData) {
  // each project's newest note first, then the next ones — four in all (the reference's order)
  const firsts = projects.map((p) => notes.find((n) => n.slug === p.slug)).filter((n): n is (typeof notes)[number] => !!n)
  const bench = [...firsts, ...notes.filter((n) => !firsts.includes(n))].slice(0, 4)
  return (
    <div>
      <section className={s.head}>
        <div>
          <p className={s.kicker}>01 / OBJECTS &amp; EXPERIMENTS</p>
          <h1 className={s.h1}>Duruduygu Lab.</h1>
        </div>
        <p className={s.intro}>
          Small electronic objects and made-to-measure clothes, designed in Istanbul.
          <span className={s.deskOnly}> These are prototypes; nothing is for sale yet.</span>
          <span className={s.mobOnly}> Prototypes — nothing is for sale yet.</span>
        </p>
      </section>

      <Marquee tags={PARTS} variant="lab" className={s.marquee} />

      <section className={s.items}>
        {projects.map((p) => {
          const ph = p.ph ?? { w: 1, h: 1 }
          return (
            <article key={p.slug} className={s.item}>
              <Link href={`/lab/${p.slug}`} className={`${s.frame} ${p.img ? s.frameDark : ''}`} aria-label={p.name}>
                {p.img ? (
                  <ContentImage image={p.img} alt="" className={s.img} sizes="(max-width: 760px) calc(100vw - 80px), 560px" />
                ) : (
                  <span className={s.ph} style={{ aspectRatio: `${ph.w} / ${ph.h}`, '--ph-d': `${Math.round((460 * ph.w) / ph.h)}px`, '--ph-m': `${Math.round((300 * ph.w) / ph.h)}px` } as CSSProperties}>
                    {ph.w}:{ph.h} · photo placeholder
                  </span>
                )}
              </Link>
              <div className={s.text}>
                <div className={s.metaRow}>
                  <span className={s.no}>
                    {pad(p.no)} / {p.kind.toUpperCase()}
                  </span>
                  <span className={s.status}>{p.status}</span>
                </div>
                <h2 className={s.name}>{p.name}</h2>
                <p className={s.one}>{p.one}</p>
                <dl className={`${s.specs} ${s.deskOnly}`}>
                  {[
                    ['Kind', p.kind],
                    ['Year', p.year],
                    ['Tools', p.tools],
                  ].map(([k, v]) => (
                    <div key={k} className={s.spec}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <Link href={`/lab/${p.slug}`} className={s.view}>
                  <span className={s.viewText}>View project</span> →
                </Link>
              </div>
            </article>
          )
        })}
      </section>

      {bench.length > 0 && (
        <section className={s.bench} aria-labelledby="lab-notes">
          <p className={s.benchKicker}>ON THE BENCH</p>
          <h2 id="lab-notes" className={s.h2}>
            Lab notes
          </h2>
          <ul className={s.notes}>
            {bench.map((n, i) => (
              <li key={i}>
                <Link href={`/lab/${n.slug}`} className={s.note}>
                  <span className={s.noteProject}>{n.project}</span>
                  <span className={s.noteTitle}>{n.title}</span>
                  <span className={s.noteText}>{n.text}</span>
                  <span className={s.noteDate}>{n.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
