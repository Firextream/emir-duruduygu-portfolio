// Quiet About — QAbout.dc.html: the portrait as a taped print and a CURRENTLY note; about.txt (lede +
// text); readme (facts) and contact (email + links) windows.
import type { ReactNode } from 'react'
import ContentImage from '@/components/site/ContentImage'
import Prose from '@/components/site/Prose'
import { ratio } from '@/lib/content/util'
import type { AboutData } from '@/lib/routes/about'
import Window from './Window'
import s from './QAbout.module.css'

export default function QAbout({ about: a, email, links }: AboutData) {
  const now = a.currently || '[placeholder]'
  const facts: [string, ReactNode][] = [
    ['Name', 'Emir Duruduygu'],
    ['Loc', a.location],
    ['Study', a.study || '[placeholder]'],
    [
      'Makes',
      <>
        <span className={s.deskOnly}>photographs</span>
        <span className={s.mobOnly}>photos</span> · hardware · clothes
      </>,
    ],
    ['Now', now],
  ]
  return (
    <div className={s.page}>
      <section className={s.intro}>
        <div>
          <span className={s.kicker}>■ ~/about</span>
          <h1 className={s.h1}>About</h1>
        </div>
        <p className={s.lede}>Emir Duruduygu. Electrical and electronics engineering student at İTÜ, Istanbul.</p>
      </section>

      <div className={s.grid}>
        <div className={s.left}>
          <figure className={s.print}>
            <span className={s.tape} aria-hidden="true" />
            <div className={s.card}>
              {a.portrait ? (
                <ContentImage image={a.portrait} className={s.img} sizes="(max-width: 760px) 44vw, 322px" eager />
              ) : (
                <div className={s.ph}>4:5 · placeholder</div>
              )}
              <figcaption className={s.cap}>
                <span className={s.capTitle}>{a.portrait ? a.portrait.alt : '[Portrait — placeholder]'}</span>
                <span className={s.capRatio}>{a.portrait ? ratio(a.portrait.w, a.portrait.h) : '4:5'}</span>
              </figcaption>
            </div>
          </figure>
          <div className={s.noteWrap}>
            <div className={s.note}>
              <span className={s.noteTape} aria-hidden="true" />
              <p className={s.noteLabel}>
                <span className={s.deskOnly}>CURRENTLY</span>
                <span className={s.mobOnly}>NOW</span>
              </p>
              <p className={s.noteText}>{now}</p>
            </div>
          </div>
        </div>

        <Window icon="▤" title="about.txt" accentBar bodyClassName={s.textBody}>
          <p className={s.aboutLede}>I’m Emir Duruduygu. I photograph the city, make small hardware and make clothes.</p>
          <Prose blocks={a.body} className={s.prose} sizes="(max-width: 760px) calc(100vw - 64px), 560px" />
        </Window>

        <div className={s.right}>
          <Window icon="ⓘ" title="readme" bodyClassName={s.readmeBody}>
            <dl className={s.facts}>
              {facts.map(([k, v]) => (
                <div key={k} className={s.fact}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Window>
          <Window icon="✉" title="contact" bodyClassName={s.contactBody}>
            <p className={s.contactLine}>Photographs, hardware, a pair of jeans — write to me.</p>
            <a href={`mailto:${email}`} className={s.mail}>
              {email} →
            </a>
            <ul className={s.links}>
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={s.link}>
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </Window>
        </div>
      </div>
    </div>
  )
}
