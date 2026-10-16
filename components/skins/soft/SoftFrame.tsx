// Soft Club frame: header with the inline style switch, the case-like footer with vertical spines,
// and the floating mobile dock. Recreated from design_handoff_duruduygu/SoftFrame.dc.html.
// The Istanbul clock is not in the SoftFrame reference; it is added (small, Doto) because the README
// asks for the clock in every header.
import Link from 'next/link'
import type { ReactNode } from 'react'
import BackToTop from '@/components/site/BackToTop'
import IstanbulClock from '@/components/site/IstanbulClock'
import NavLink from '@/components/site/NavLink'
import { SITE_EMAIL, SITE_LINKS } from '@/lib/content/links'
import type { Section } from '@/lib/skins'
import SoftStyleMenu from './SoftStyleMenu'
import s from './SoftFrame.module.css'

const NAV: [Section, string, string][] = [
  ['home', 'Home', 'ホーム'],
  ['lab', 'Works', '作品'],
  ['gallery', 'Frames', '写真'],
  ['journal', 'Journal', '日記'],
  ['about', 'About', '人'],
]

export default function SoftFrame({ children }: { children: ReactNode }) {
  return (
    <div className={s.root}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header id="top" tabIndex={-1} className={s.header}>
        <Link href="/" className={s.brand} aria-label="duruduygu — home">
          <span className={s.wordmark}>duruduygu</span>
          <span className={s.kana} aria-hidden="true">
            ドゥルドゥイグ
          </span>
        </Link>
        <nav aria-label="Main" className={s.nav}>
          {NAV.map(([key, label]) => (
            <NavLink key={key} section={key} className={s.navLink}>
              {label}
            </NavLink>
          ))}
        </nav>
        <span className={s.clock}>
          <span className={s.clockLabel}>IST</span>
          <IstanbulClock className={s.clockTime} />
        </span>
        <SoftStyleMenu />
      </header>

      <main id="main" className={s.main}>
        {children}
      </main>

      <footer className={s.footer}>
        <span className={s.spine} aria-hidden="true">
          DURUDUYGU · DD-01 · ドゥルドゥイグ
        </span>
        <div className={s.footGrid}>
          <div className={s.footHead}>
            <p className={s.footKicker}>お問い合わせ · Contact</p>
            <p className={s.footTitle}>
              have a small,{' '}
              <br className={s.deskOnly} />
              strange idea?
            </p>
          </div>
          <div className={s.footMail}>
            <a href={`mailto:${SITE_EMAIL}`} className={s.mailBtn}>
              <span>{SITE_EMAIL}</span>
              <span aria-hidden="true">→</span>
            </a>
            <p className={s.reply}>Replies within a week.</p>
          </div>
          <div className={s.footBottom}>
            <span className={s.copy}>
              <span className={s.deskOnly}>© 2026 Emir Duruduygu · Made slowly in Istanbul</span>
              <span className={s.mobOnly}>DD-01 · © 2026 · Istanbul</span>
            </span>
            <ul className={s.footLinks}>
              {SITE_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <BackToTop className={s.topBtn}>↑ top</BackToTop>
          </div>
        </div>
        <span className={s.spine} aria-hidden="true">
          写真 · 機械 · 服 · 映像 · 2026
        </span>
      </footer>

      <nav aria-label="Main (mobile)" className={s.dock}>
        {NAV.map(([key, label, jp]) => (
          <NavLink key={key} section={key} className={s.dockLink}>
            <span>{label}</span>
            <span className={s.dockJp} aria-hidden="true">
              {jp}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
