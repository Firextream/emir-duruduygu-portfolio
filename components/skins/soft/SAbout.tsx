// Soft Club About — SAbout.dc.html: the maker as release DD-00 (the portrait on the jewel-case cover),
// a mail button; "credits" and "now" (what's being built, the latest entry, shooting, listening).
import Link from 'next/link'
import type { AboutData } from '@/lib/routes/about'
import JewelCase from './JewelCase'
import s from './SAbout.module.css'

export default function SAbout({ about: a, email, links, building, latest }: AboutData) {
  const city = a.location.split(',')[0]
  const credits: [string, string, boolean][] = [
    ['Photography', 'Emir Duruduygu', false],
    ['Hardware', 'Emir Duruduygu', false],
    ['Clothes', 'Emir Duruduygu', false],
    ['Writing & video', 'Emir Duruduygu', false],
    ['Recorded in', city, true],
    ['Study', a.study || '[School — placeholder]', false],
  ]
  const now: { k: string; v: string; href: string | null }[] = [
    ...(building ? [{ k: 'Building', v: `${building.name} · ${building.status}`, href: building.href }] : []),
    ...(latest ? [{ k: 'Latest', v: latest.title, href: latest.href }] : []),
    { k: 'Shooting', v: a.shooting || '[Series — placeholder]', href: '/gallery' },
    { k: 'Listening', v: a.listening || '[Album — placeholder]', href: null },
  ]
  return (
    <div className={s.page}>
      <section className={s.hero}>
        <div className={s.caseCol}>
          <JewelCase release="about" cover={a.portrait} sizes="(max-width: 760px) 240px, 470px" eager />
        </div>
        <div>
          <p className={s.kicker}>DD-00 · ABOUT · 自己紹介</p>
          <h1 className={s.h1}>emir duruduygu</h1>
          <p className={s.lede}>
            Photographs of Istanbul, small hardware and clothes cut to measure, and essays on video.
            <span className={s.deskOnly}> One person, a few crafts.</span>
          </p>
          {a.summary && <p className={s.summary}>{a.summary}</p>}
          <a href={`mailto:${email}`} className={s.mail}>
            <span>{email}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <div className={s.cols}>
        <section aria-labelledby="credits">
          <div className={s.secHead}>
            <h2 id="credits" className={s.h2}>
              credits
            </h2>
            <span className={s.jp}>クレジット</span>
          </div>
          <dl className={s.list}>
            {credits.map(([k, v, deskOnly]) => (
              <div key={k} className={`${s.row} ${deskOnly ? s.deskOnly : ''}`}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="now">
          <div className={s.secHead}>
            <h2 id="now" className={s.h2}>
              now
            </h2>
            <span className={s.jp}>いま</span>
          </div>
          <ul className={s.list}>
            {now.map((x) => {
              const body = (
                <>
                  <span className={s.k}>{x.k}</span>
                  <span className={s.v}>{x.v}</span>
                  <span className={`${s.arrow} ${s.deskOnly}`} aria-hidden="true">
                    {x.href ? '→' : ''}
                  </span>
                </>
              )
              return (
                <li key={x.k}>
                  {x.href ? (
                    <Link href={x.href} className={`${s.row} ${s.nowRow}`}>
                      {body}
                    </Link>
                  ) : (
                    <div className={`${s.row} ${s.nowRow}`}>{body}</div>
                  )}
                </li>
              )
            })}
          </ul>
          <ul className={`${s.socials} ${s.deskOnly}`}>
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
