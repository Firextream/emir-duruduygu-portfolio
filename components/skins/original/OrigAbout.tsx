// Original About — OrigAbout.dc.html: "Hi, I'm Emir" with the about text and the portrait at its own
// ratio; Interests & Focus cards; four stats; Recent Milestones; Contact (#contact — the nav's
// "05 Contact" lands here) with the details and the form.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import Inlines from '@/components/site/Inlines'
import { ratio } from '@/lib/content/util'
import type { AboutData } from '@/lib/routes/about'
import OrigContactForm from './OrigContactForm'
import s from './OrigAbout.module.css'

// Original's design copy (the live site's cards and stats)
const FOCUS = [
  {
    title: 'Photography',
    desk: 'Capturing architecture, street moments, and the interplay of light and shadow.',
    mob: 'Architecture, street moments, light and shadow.',
    icon: (
      <>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
  },
  {
    title: 'Electronics',
    desk: 'Designing circuits and exploring the world of embedded systems and robotics.',
    mob: 'Circuits, embedded systems and robotics.',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2" />
      </>
    ),
  },
  {
    title: 'Architecture',
    desk: 'Fascinated by modernist structures, urban spaces, and the poetry of concrete.',
    mob: 'Modernist structures, urban spaces, concrete.',
    icon: (
      <>
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
      </>
    ),
  },
]

// the live site's numbers — update them here when they change
const STATS: [string, string][] = [
  ['500+', 'PHOTOS CAPTURED'],
  ['1', 'YEAR LEARNING'],
  ['15', 'CITIES EXPLORED'],
  ['1', 'CURIOSITY'],
]

export default function OrigAbout({ about: a, email, links }: AboutData) {
  const social = links.filter((l) => l.href.startsWith('http'))
  return (
    <div>
      <section className={s.intro}>
        <div className={s.introText}>
          <p className={s.kicker}>ABOUT</p>
          <h1 className={s.h1}>Hi, I&apos;m Emir</h1>
          {a.portrait && (
            <div className={s.mobOnlyBlock}>
              <ContentImage image={a.portrait} className={s.portraitImg} sizes="100vw" eager />
            </div>
          )}
          <div className={s.paras}>
            {a.body.map((b, i) =>
              b.type === 'p' ? (
                <p key={i}>
                  <Inlines>{b.children}</Inlines>
                </p>
              ) : null,
            )}
          </div>
          <p className={s.place}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {a.location}
          </p>
          <div className={s.links}>
            <Link href="#contact" className={s.touch}>
              Get in touch →
            </Link>
            <span className={`${s.rule} ${s.deskOnly}`} aria-hidden="true" />
            <Link href="/blog" className={`${s.journal} ${s.deskOnly}`}>
              Read the journal
            </Link>
          </div>
        </div>
        {a.portrait && (
          <figure className={`${s.portrait} ${s.deskOnly}`}>
            <ContentImage image={a.portrait} className={s.portraitImg} sizes="(max-width: 1100px) 100vw, 576px" eager />
            <figcaption className={s.portraitCap}>Portrait · {ratio(a.portrait.w, a.portrait.h)}</figcaption>
          </figure>
        )}
      </section>

      <section className={s.focus} aria-labelledby="focus">
        <p className={s.kicker2}>WHAT I DO</p>
        <h2 id="focus" className={s.h2}>
          Interests &amp; Focus
        </h2>
        <div className={s.cards}>
          {FOCUS.map((f) => (
            <div key={f.title} className={s.card}>
              <svg className={`${s.cardIcon} ${s.deskOnlyBlock}`} width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {f.icon}
              </svg>
              <h3 className={s.cardTitle}>{f.title}</h3>
              <p className={s.cardText}>
                <span className={s.deskOnly}>{f.desk}</span>
                <span className={s.mobOnly}>{f.mob}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={s.stats} aria-label="Numbers">
        {STATS.map(([n, label]) => (
          <div key={label}>
            <p className={s.statN}>{n}</p>
            <p className={s.statLabel}>{label}</p>
          </div>
        ))}
      </section>

      {a.milestones.length > 0 && (
        <section className={s.journey} aria-labelledby="milestones">
          <p className={s.kicker2}>JOURNEY</p>
          <h2 id="milestones" className={s.h2}>
            Recent Milestones
          </h2>
          <ol className={s.miles}>
            {a.milestones.map((m, i) => (
              <li key={i} className={s.mile}>
                <span className={s.mileYear}>{m.year}</span>
                <span>
                  {m.title && <span className={s.mileTitle}>{m.title}</span>}
                  <span className={s.mileText}>{m.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section id="contact" className={s.contact} aria-labelledby="contact-title">
        <div>
          <p className={s.kicker2}>CONTACT</p>
          <h2 id="contact-title" className={s.contactH2}>
            Let&apos;s work together
          </h2>
          <p className={`${s.contactText} ${s.deskOnly}`}>
            Interested in a commission, collaboration, or just want to say hello? I&apos;d love to hear from you.
          </p>
          <dl className={`${s.details} ${s.deskOnlyBlock}`}>
            <dt>SOCIAL</dt>
            <dd className={s.socialRow}>
              {social.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              ))}
            </dd>
            <dt>EMAIL</dt>
            <dd>
              <a href={`mailto:${email}`} className={s.mail}>
                {email}
              </a>
            </dd>
            <dt>BASED IN</dt>
            <dd>{a.location}</dd>
          </dl>
        </div>
        <OrigContactForm />
        <a href={`mailto:${email}`} className={`${s.mailM} ${s.mobOnlyBlock}`}>
          {email}
        </a>
      </section>
    </div>
  )
}
