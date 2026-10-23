// Quiet Lab — QLab.dc.html. Desktop: the lab.exe window, a table of projects (#, preview print,
// name + one-liner, kind, status chip, year). Mobile: one small window per project with an
// "open project" button. One DOM for both, so every preview image is requested once.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import { isPlaceholder } from '@/lib/routes/gallery'
import { areasOf, type LabData } from '@/lib/routes/lab'
import Window from './Window'
import w from './Window.module.css'
import s from './QLab.module.css'

const pad = (n: number) => String(n).padStart(2, '0')
const projectsLabel = (n: number) => `${n} ${n === 1 ? 'project' : 'projects'}`

export default function QLab({ projects }: LabData) {
  const areas = areasOf(projects).map((a) => a.toLowerCase())
  const placeholderStatus = projects.every((p) => isPlaceholder(p.status))
  return (
    <div className={s.page}>
      <section className={s.intro}>
        <div>
          <span className={s.kicker}>■ ~/lab</span>
          <h1 className={s.h1}>Lab</h1>
        </div>
        <div>
          <p className={s.lede}>
            <span className={s.deskOnly}>[Lab intro — placeholder. Small hardware and made-to-measure clothes.]</span>
            <span className={s.mobOnly}>[Lab intro — placeholder]</span>
          </p>
          <p className={`${s.aside} ${s.deskOnly}`}>➤ experiments, not products.</p>
        </div>
      </section>

      <Window
        icon="⚙"
        title="lab.exe"
        meta={projectsLabel(projects.length)}
        accentBar
        className={s.labWin}
        footerClassName={s.deskOnlyFlex}
        footer={
          <>
            <span>
              {projectsLabel(projects.length)} · {areas.join(' and ')}
            </span>
            {placeholderStatus && <span>status values are placeholders</span>}
          </>
        }
      >
        <div className={`${s.cols} ${s.deskOnlyGrid}`} aria-hidden="true">
          <span>#</span>
          <span>preview</span>
          <span>name</span>
          <span>kind</span>
          <span>status</span>
          <span>year</span>
        </div>
        <ul className={s.list}>
          {projects.map((p) => (
            <li key={p.slug} className={s.item}>
              {/* mobile: each project is its own window */}
              <div className={`${w.bar} ${s.itemBar}`} aria-hidden="true">
                <span>⚙</span>
                <span className={w.title}>
                  {pad(p.no)} · {p.slug}
                </span>
                <span className={w.meta}>{p.kind}</span>
                <span className={w.buttons}>
                  <span>_</span>
                  <span>×</span>
                </span>
              </div>
              <Link href={`/lab/${p.slug}`} className={s.row}>
                <span className={s.num}>{pad(p.no)}</span>
                <span className={`${s.prev} ${p.img ? '' : s.prevPh}`}>
                  <span className={s.card}>
                    {p.img ? (
                      <ContentImage image={p.img} alt={p.name} className={s.img} sizes="(max-width: 760px) 134px, 104px" />
                    ) : (
                      <span className={s.ph} style={{ aspectRatio: `${p.ph?.w ?? 4} / ${p.ph?.h ?? 5}` }}>
                        {p.name} · photo placeholder
                      </span>
                    )}
                  </span>
                </span>
                <span className={s.main}>
                  <span className={s.name}>{p.name}</span>
                  <span className={s.one}>{p.one}</span>
                  <span className={s.open}>open project →</span>
                </span>
                <span className={s.kind}>{p.kind}</span>
                <span className={s.statusCell}>
                  <span className={s.status}>
                    <span className={s.square} aria-hidden="true" />
                    {p.status}
                  </span>
                </span>
                <span className={s.year}>{p.year}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Window>
    </div>
  )
}
