// Modernist About — OAbout.dc.html: 176px two-line name; portrait cols 1–4 (at its own ratio), lede +
// body cols 5–9, facts + CURRENTLY + socials cols 10–12; "01 Along the way" timeline.
import type { ReactNode } from 'react'
import ContentImage from '@/components/site/ContentImage'
import Prose from '@/components/site/Prose'
import type { AboutData } from '@/lib/routes/about'
import s from './OAbout.module.css'

export default function OAbout({ about: a, email, links }: AboutData) {
  const facts: [string, ReactNode][] = [
    ['Name', 'Emir Duruduygu'],
    ['Loc', a.location],
    ['Study', a.study || '[Study — placeholder]'],
    ['Makes', 'Photographs · hardware · clothes'],
    ['Mail', <a key="mail" href={`mailto:${email}`} className={s.mail}>{email}</a>],
  ]
  return (
    <div>
      <section className={s.head}>
        <h1 className={s.name}>
          Emir
          <br />
          Duruduygu<span className={s.red}>.</span>
        </h1>
      </section>

      <section className={s.main}>
        <figure className={s.portrait}>
          {a.portrait ? (
            <ContentImage image={a.portrait} className={s.img} sizes="(max-width: 760px) 100vw, 432px" eager />
          ) : (
            <div className={s.ph}>4:5 · portrait placeholder</div>
          )}
          <figcaption className={`${s.cap} ${s.deskOnlyFlex}`}>
            <span className={s.capNo}>[000]</span>
            <span>{a.portrait ? a.portrait.alt : '[Portrait — placeholder]'}</span>
          </figcaption>
        </figure>

        <div className={s.text}>
          <p className={s.lede}>
            I photograph the city, make small hardware and make clothes.<span className={s.deskOnly}> This is where all three live.</span>
          </p>
          {a.body.length > 0 && <Prose blocks={a.body} className={s.body} />}
        </div>

        <aside className={s.aside}>
          <dl className={s.facts}>
            {facts.map(([k, v]) => (
              <div key={k} className={s.fact}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {a.currently && (
            <div className={s.currently}>
              <p className={s.curLabel}>
                <span className={s.square} aria-hidden="true" />
                Currently
              </p>
              <p className={s.curText}>{a.currently}</p>
            </div>
          )}
          <ul className={`${s.socials} ${s.deskOnly}`}>
            {links
              .filter((l) => l.href.startsWith('http'))
              .map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={s.social}>
                    <span>{l.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
          </ul>
        </aside>
      </section>

      {a.milestones.length > 0 && (
        <section className={s.steps} aria-labelledby="along">
          <span className={s.stepsNo}>01</span>
          <h2 id="along" className={s.h2}>
            Along the way
          </h2>
          <ol className={s.stepList}>
            {a.milestones.map((m, i) => (
              <li key={i} className={s.step}>
                <span className={s.year}>{m.year}</span>
                <span>{m.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
