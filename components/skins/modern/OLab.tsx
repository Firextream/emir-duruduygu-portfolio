// Modernist Lab — OLab.dc.html: head with a Projects / Areas facts table; three 2px-ruled cells
// (red number, kind, 4:5 surface with the image contained — never cropped, 44px name, one-liner,
// red status + "View project →"); "01 Lab notes", the latest design-log entries across projects.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import { areasOf, type LabData } from '@/lib/routes/lab'
import s from './OLab.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

/** next/image `sizes` for an image contained in the 4:5 surface (86% wide or 92% tall, whichever binds) */
const surfaceSizes = (w: number, h: number) => {
  const f = Math.min(0.86, 0.92 * 1.25 * (w / h))
  return `(max-width: 760px) ${Math.round(f * 100)}vw, ${Math.round(f * 420)}px`
}

export default function OLab({ projects, notes }: LabData) {
  return (
    <div>
      <section className={s.head}>
        <h1 className={s.title}>
          Lab<span className={s.red}>.</span>
        </h1>
        <p className={s.intro}>
          Small electronic objects and made-to-measure clothes, designed in Istanbul.
          <span className={s.deskOnly}> Experiments, not products.</span>
        </p>
        <dl className={`${s.facts} ${s.deskOnly}`}>
          <div className={s.fact}>
            <dt>Projects</dt>
            <dd>{pad(projects.length)}</dd>
          </div>
          <div className={s.fact}>
            <dt>Areas</dt>
            <dd>{areasOf(projects).join(' · ')}</dd>
          </div>
        </dl>
      </section>

      <ul className={s.cells}>
        {projects.map((p) => (
          <li key={p.slug} className={s.cellItem}>
            <Link href={`/lab/${p.slug}`} className={s.cell}>
              <span className={s.cellTop}>
                <span className={s.no}>{pad(p.no)}</span>
                <span className={s.kind}>{p.kind}</span>
              </span>
              <span className={s.surface}>
                {p.img ? (
                  <ContentImage image={p.img} alt={p.name} className={s.surfaceImg} sizes={surfaceSizes(p.img.w, p.img.h)} eager />
                ) : (
                  <span className={s.ph}>
                    <span className={s.deskOnly}>[Project photo — placeholder]</span>
                  </span>
                )}
              </span>
              <span className={s.name}>{p.name}</span>
              <span className={s.one}>{p.one}</span>
              <span className={s.cellFoot}>
                <span className={s.status}>{p.status}</span>
                <span className={s.view}>
                  <span className={s.deskOnly}>View project →</span>
                  <span className={s.mobOnly}>View →</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {notes.length > 0 && (
        <section className={s.notes} aria-labelledby="lab-notes">
          <span className={s.notesNo}>01</span>
          <div className={s.notesHead}>
            <h2 id="lab-notes" className={s.h2}>
              Lab notes
            </h2>
            <p className={`${s.notesIntro} ${s.deskOnly}`}>The latest entries from every project&apos;s design log.</p>
          </div>
          <ul className={s.noteList}>
            {notes.map((n, i) => (
              <li key={i}>
                <Link href={`/lab/${n.slug}`} className={s.note}>
                  <span className={s.noteDate}>{n.date}</span>
                  <span className={s.noteProject}>{n.project}</span>
                  <span className={s.noteText}>
                    <span className={s.noteTitle}>{n.title}</span>
                    <span className={`${s.noteWhy} ${s.deskOnly}`}>{n.text}</span>
                  </span>
                  <span className={`${s.noteArrow} ${s.deskOnly}`} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
