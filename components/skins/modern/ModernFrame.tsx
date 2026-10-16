// Modernist frame: header with 2px rule, status of the clock, style menu, red poster footer, mobile dock.
// Recreated from design_handoff_duruduygu/ModernFrame.dc.html.
import Link from 'next/link'
import type { ReactNode } from 'react'
import BackToTop from '@/components/site/BackToTop'
import Crumb from '@/components/site/Crumb'
import IstanbulClock from '@/components/site/IstanbulClock'
import NavLink from '@/components/site/NavLink'
import { SITE_EMAIL, SITE_LINKS } from '@/lib/content/links'
import type { PageKey, Section } from '@/lib/skins'
import ModernStyleMenu from './ModernStyleMenu'
import s from './ModernFrame.module.css'

const NAV: [Section, string, string][] = [
  ['home', 'Home', '⌂'],
  ['gallery', 'Gallery', '▣'],
  ['journal', 'Journal', '▤'],
  ['about', 'About', 'ⓘ'],
  ['lab', 'Lab', '⚙'],
]

const CRUMB: Record<PageKey, string> = {
  home: 'Home',
  gallery: 'Gallery',
  photo: 'Gallery / Photograph',
  journal: 'Journal',
  post: 'Journal / Entry',
  about: 'About',
  lab: 'Lab',
  project: 'Lab / Project',
  nf: 'Not found',
}

const COORDS = '41.01°N 28.98°E'

export default function ModernFrame({ children }: { children: ReactNode }) {
  return (
    <div className={s.root}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header id="top" tabIndex={-1} className={s.header}>
        <Link href="/" className={s.brand} aria-label="duruduygu — home">
          <span className={s.star} aria-hidden="true">
            ★
          </span>
          <span className={s.wordmark}>duruduygu</span>
        </Link>
        <nav aria-label="Main" className={s.nav}>
          {NAV.map(([key, label]) => (
            <NavLink key={key} section={key} className={s.navLink}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className={s.clock}>
          <span className={s.clockLabel}>IST</span>
          <IstanbulClock className={s.clockTime} />
          <span className={s.clockCoords}>{COORDS}</span>
        </div>
        <ModernStyleMenu />
      </header>
      <div className={s.crumbBar}>
        <span className={s.crumb}>
          <span className={s.square} aria-hidden="true" />
          <Crumb labels={CRUMB} />
        </span>
        <span>{COORDS}</span>
      </div>

      <main id="main" className={s.main}>
        {children}
      </main>

      <footer className={s.footer}>
        <div className={s.footTop}>
          <p className={s.footTitle}>Have a small, strange idea?</p>
          <a href={`mailto:${SITE_EMAIL}`} className={s.footEmail}>
            {SITE_EMAIL} →
          </a>
        </div>
        <div className={s.footBottom}>
          <span className={s.copy}>
            © 2026 Emir Duruduygu<span className={s.deskOnly}> · made slowly in Istanbul</span>
          </span>
          <ul className={s.footLinks}>
            {SITE_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <BackToTop className={s.topBtn}>
            ↑ <span className={s.deskOnly}>Back to </span>top
          </BackToTop>
        </div>
      </footer>

      <nav aria-label="Main (mobile)" className={s.dock}>
        {NAV.map(([key, label, icon]) => (
          <NavLink key={key} section={key} className={s.dockLink}>
            <span className={s.dockIcon} aria-hidden="true">
              {icon}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
