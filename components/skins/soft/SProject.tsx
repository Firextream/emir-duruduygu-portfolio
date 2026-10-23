// Soft Club Project — SProject.dc.html: the release in its jewel case (the photo contained on the
// cover), spec + "Follow the build"; drawings at native ratio (FIG. 01 photo, FIG. 02 drawing on
// paper); the build log; "next release".
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import type { ProjectData } from '@/lib/routes/lab'
import JewelCase from './JewelCase'
import { catNo, kindJp, projectRelease } from './releases'
import s from './SProject.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

export default function SProject({ item: p, index, next, total }: ProjectData) {
  const { release, info } = projectRelease(p, index)
  const ph = p.ph ?? { w: 1, h: 1 }
  const nextIndex = (index + 1) % total
  const spec: [string, string][] = [
    ['Status', p.status],
    ['Year', p.year],
    ['Tools', p.tools],
  ]
  // further real photos join the drawings grid as FIG. 03…
  const extra = p.photos.filter((f) => f.image)
  return (
    <div className={s.page}>
      <div className={s.top}>
        <Link href="/lab" className={s.back}>
          ← works
        </Link>
        <span className={s.counter}>
          {catNo(index)} · {pad(index + 1)} / {pad(total)}
        </span>
      </div>

      <section className={s.hero}>
        <div className={s.caseCol}>
          <JewelCase release={release} info={info} cover={p.img} fit="contain" sizes="(max-width: 760px) 240px, 470px" eager />
        </div>
        <div className={s.heroText}>
          <p className={s.kicker}>
            {catNo(index)} · {p.kind.toUpperCase()} · {kindJp(p)}
          </p>
          <h1 className={s.h1}>{p.name}</h1>
          <p className={s.one}>{p.one}</p>
          <dl className={s.spec}>
            {spec.map(([k, v]) => (
              <div key={k} className={s.specRow}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {p.log.length > 0 && (
            <a href="#build-log" className={s.follow}>
              <span>Follow the build</span>
              <span aria-hidden="true">↓</span>
            </a>
          )}
        </div>
      </section>

      <section className={s.section} aria-labelledby="drawings">
        <div className={s.secHead}>
          <h2 id="drawings" className={s.h2}>
            drawings
          </h2>
          <span className={s.secJp}>
            図面<span className={s.deskOnly}> · at native ratio</span>
          </span>
        </div>
        <div className={s.figs}>
          <figure className={s.fig}>
            <div className={s.photoBox}>
              {p.img ? (
                <ContentImage image={p.img} className={s.photo} sizes="(max-width: 760px) 100vw, 600px" />
              ) : (
                <div className={s.ph} style={{ aspectRatio: `${ph.w} / ${ph.h}` }}>
                  <span className={s.deskOnly}>
                    {ph.w}:{ph.h} · placeholder
                  </span>
                </div>
              )}
            </div>
            <figcaption className={s.cap}>
              <span className={`${s.figNo} ${s.deskOnly}`}>FIG. 01</span>
              <span>{p.img?.cap ?? '[Photograph — placeholder]'}</span>
            </figcaption>
          </figure>
          <figure className={`${s.fig} ${p.drawing ? '' : s.deskOnly}`}>
            {p.drawing ? (
              <div className={s.paper}>
                <ContentImage image={p.drawing} alt={p.drawing.cap} className={s.drawing} sizes="(max-width: 760px) calc(100vw - 68px), 560px" />
              </div>
            ) : (
              <div className={s.drawPh}>[Drawing — placeholder]</div>
            )}
            <figcaption className={s.cap}>
              <span className={`${s.figNo} ${s.deskOnly}`}>FIG. 02</span>
              <span>{p.drawing?.cap ?? '[Drawing — placeholder]'}</span>
            </figcaption>
          </figure>
          {extra.map((f, i) => (
            <figure key={i} className={s.fig}>
              <div className={s.photoBox}>
                {f.image && <ContentImage image={f.image} className={s.photo} sizes="(max-width: 760px) 100vw, 600px" />}
              </div>
              <figcaption className={s.cap}>
                <span className={`${s.figNo} ${s.deskOnly}`}>FIG. {pad(3 + i)}</span>
                <span>{f.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {p.log.length > 0 && (
        <section id="build-log" className={s.section} aria-labelledby="build-log-title">
          <div className={s.secHead}>
            <h2 id="build-log-title" className={s.h2}>
              build log
            </h2>
            <span className={s.secJp}>
              記録<span className={s.deskOnly}> · liner notes</span>
            </span>
          </div>
          <ol className={s.log}>
            {p.log.map((l, i) => (
              <li key={i} className={s.logRow}>
                <span className={s.logLine}>
                  <span className={s.logN}>{pad(i + 1)}</span>
                  <span className={s.logDate}>{l.date}</span>
                </span>
                <span className={s.logTitle}>{l.title}</span>
                <span className={s.logText}>{l.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {total > 1 && (
        <Link href={`/lab/${next.slug}`} className={s.next}>
          <span className={s.nextLabel}>
            next<span className={s.deskOnly}> release</span>
          </span>
          <span className={s.nextName}>
            <span className={`${s.nextNo} ${s.deskOnly}`}>{catNo(nextIndex)}</span>
            <span>{next.name} →</span>
          </span>
        </Link>
      )}
    </div>
  )
}
