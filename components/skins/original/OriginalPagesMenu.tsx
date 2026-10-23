'use client'

// Below 1180px the pill's numbered nav collapses into this menu button and its PAGES sheet.
import Link from 'next/link'
import { useSection } from '@/components/site/NavLink'
import { useMenu } from '@/components/site/useMenu'
import { Close, Menu } from './icons'
import { ORIGINAL_NAV } from './nav'
import s from './OriginalFrame.module.css'

export default function OriginalPagesMenu() {
  const section = useSection()
  const { open, toggle, close, panel, trigger } = useMenu()
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={s.menuBtn}
        aria-expanded={open}
        aria-controls="pages-menu"
        aria-label="Menu"
        onClick={toggle}
      >
        <Menu size={18} />
      </button>
      {open && (
        <nav ref={panel} id="pages-menu" aria-label="Pages" className={`${s.pop} ${s.pagesPop}`}>
          <div className={s.pagesHead}>
            PAGES
            <button type="button" className={s.popClose} aria-label="Close" onClick={() => close()}>
              <Close size={18} />
            </button>
          </div>
          {ORIGINAL_NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className={s.pagesLink}
              aria-current={n.section && n.section === section && !n.hash ? 'page' : undefined}
              onClick={() => close(false)}
            >
              <span className={s.pagesNo}>{n.no}</span>
              <span className={s.pagesLabel}>{n.label}</span>
              <span className={s.pagesArrow} aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}
