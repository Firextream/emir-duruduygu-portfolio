// Quiet frame: header (wordmark, nav, LCD clock, style menu), footer and the mobile dock.
// Recreated from design_handoff_duruduygu/QuietFrame.dc.html; desktop ≥ 761 px, mobile ≤ 760 px.
import Link from 'next/link'
import type { ReactNode } from 'react'
import BackToTop from '@/components/site/BackToTop'
import Crumb from '@/components/site/Crumb'
import IstanbulClock from '@/components/site/IstanbulClock'
import NavLink from '@/components/site/NavLink'
import { SITE_EMAIL, SITE_LINKS } from '@/lib/content/links'
import type { PageKey, Section } from '@/lib/skins'
import PixelStar from './PixelStar'
import QuietStyleMenu from './QuietStyleMenu'
import s from './QuietFrame.module.css'

const NAV: [Section, string, string][] = [
  ['home', 'Home', '⌂'],
  ['gallery', 'Gallery', '▣'],
  ['journal', 'Journal', '▤'],
  ['about', 'About', 'ⓘ'],
  ['lab', 'Lab', '⚙'],
]

const CRUMB: Record<PageKey, string> = {
  home: '~/home',
  gallery: '~/pictures',
  photo: '~/pictures / viewer',
  journal: '~/journal',
  post: '~/journal / entry',
  about: '~/about',
  lab: '~/lab',
  project: '~/lab / project',
  nf: '~/error',
}

const COORDS = '41.01°N 28.98°E'

export default function QuietFrame({ children }: { children: ReactNode }) {
  return (
    <div className={s.root}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header id="top" tabIndex={-1} className={s.header}>
        <Link href="/" className={s.brand} aria-label="duruduygu — home">
          <PixelStar className={s.star} />
          <span className={s.wordmark}>duruduygu</span>
        </Link>
        <nav aria-label="Main" className={s.nav}>
          {NAV.map(([key, label]) => (
            <NavLink key={key} section={key} className={s.navLink}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className={s.lcd}>
          <span className={s.lcdLabel}>IST</span>
          <span className={s.lcdDigits}>
            <span className={s.lcdGhost} aria-hidden="true">
              88:88
            </span>
            <IstanbulClock className={s.lcdTime} />
          </span>
          <span className={s.lcdSep} aria-hidden="true" />
          <span className={s.lcdCoords}>{COORDS}</span>
        </div>
        <div className={s.menuWrap}>
          <QuietStyleMenu />
        </div>
      </header>
      <div className={s.crumbBar}>
        <span>
          ■ <Crumb labels={CRUMB} />
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
            ↑ <span className={s.deskOnly}>back to </span>top
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
