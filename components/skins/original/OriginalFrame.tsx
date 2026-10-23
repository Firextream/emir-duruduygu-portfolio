// Original frame — OriginalFrame.dc.html: serif wordmark + the floating white pill (numbered nav,
// IST clock, style / email / RSS buttons), the right rail, the "Let's create something together"
// CTA, footer and the 5-up mobile dock. Everything sits in normal flow or its own column — the
// live site's absolute positioning (and its overlaps at middle widths) is gone.
// One header for every width: below 1180px the nav collapses into the pages menu; ≤ 760px is the 390 layout.
import Link from 'next/link'
import type { ReactNode } from 'react'
import BackToTop from '@/components/site/BackToTop'
import IstanbulClock from '@/components/site/IstanbulClock'
import NavLink from '@/components/site/NavLink'
import { SITE_EMAIL, SITE_LINKS } from '@/lib/content/links'
import { ArrowUp, ArrowUpRight, Mail, Music, Rss } from './icons'
import { ORIGINAL_DOCK, ORIGINAL_NAV } from './nav'
import OriginalPagesMenu from './OriginalPagesMenu'
import OriginalRail from './OriginalRail'
import OriginalStyleMenu from './OriginalStyleMenu'
import ScrollState from './ScrollState'
import s from './OriginalFrame.module.css'

const SOCIAL = SITE_LINKS.filter((l) => l.label !== 'RSS')
const RSS = SITE_LINKS.find((l) => l.label === 'RSS')?.href ?? '/feed.xml'

export default function OriginalFrame({ children }: { children: ReactNode }) {
  return (
    <div className={s.root}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollState />
      <header id="top" tabIndex={-1} className={s.header}>
        <Link href="/" className={s.brand}>
          Duruduygu
        </Link>
        <div className={s.pill}>
          <nav aria-label="Main" className={s.nav}>
            {ORIGINAL_NAV.map((n) =>
              n.hash || !n.section ? (
                <Link key={n.label} href={n.href} className={s.navLink}>
                  <span className={s.navNo}>{n.no}</span>
                  <span>{n.label}</span>
                </Link>
              ) : (
                <NavLink key={n.label} section={n.section} className={s.navLink}>
                  <span className={s.navNo}>{n.no}</span>
                  <span>{n.label}</span>
                </NavLink>
              ),
            )}
          </nav>
          <span className={s.divider} aria-hidden="true" />
          <span className={s.clock} title="Istanbul">
            IST <IstanbulClock className={s.time} />
          </span>
          <OriginalStyleMenu />
          <a href={`mailto:${SITE_EMAIL}`} className={`${s.iconBtn} ${s.wideOnly}`} aria-label="Email" title={SITE_EMAIL}>
            <Mail />
          </a>
          <a href={RSS} target="_blank" rel="noopener noreferrer" className={`${s.iconBtn} ${s.wideOnly}`} aria-label="RSS" title="RSS feed">
            <Rss />
          </a>
          <OriginalPagesMenu />
        </div>
      </header>

      <OriginalRail />

      <main id="main" className={s.main}>
        {children}
      </main>

      <section className={s.cta} aria-label="Contact">
        <p className={s.ctaKicker}>READY TO COLLABORATE?</p>
        <Link href="/about#contact" className={s.ctaLink}>
          <span className={s.ctaText}>
            Let&apos;s create something together<span className={s.ctaArrowM}> ↗</span>
          </span>
          <ArrowUpRight size={40} className={s.ctaArrow} />
        </Link>
      </section>

      <footer className={s.footer}>
        <div className={s.footTop}>
          <div className={s.footBrand}>
            <span className={s.footWord}>Duruduygu</span>
            <span className={s.footCopy}>
              © 2026<span className={s.deskOnly}> All rights reserved.</span>
            </span>
          </div>
          <nav aria-label="Footer" className={s.footNav}>
            {ORIGINAL_NAV.map((n) => (
              <Link key={n.label} href={n.href} className={s.footLink}>
                {n.label}
              </Link>
            ))}
            {SITE_LINKS.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={`${s.footLink} ${s.mobOnly}`}>
                {l.label} ↗
              </a>
            ))}
          </nav>
        </div>
        <div className={s.footBottom}>
          <span className={s.playing}>
            <Music size={17} />
            Not playing
          </span>
          <span className={s.footSocial}>
            {SOCIAL.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={s.footSmall}>
                {l.label}
              </a>
            ))}
            <a href={RSS} target="_blank" rel="noopener noreferrer" className={s.footSmall}>
              RSS
            </a>
            <BackToTop className={s.footTop2}>Back to top ↑</BackToTop>
          </span>
          <BackToTop className={s.footTopM}>
            <ArrowUp size={18} />
            <span className="sr-only">Back to top</span>
          </BackToTop>
        </div>
      </footer>

      <nav aria-label="Main (mobile)" className={s.dock}>
        {ORIGINAL_DOCK.map((n) => (
          <NavLink key={n.label} section={n.section} className={s.dockLink}>
            <span className={s.dockNo}>{n.no}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
