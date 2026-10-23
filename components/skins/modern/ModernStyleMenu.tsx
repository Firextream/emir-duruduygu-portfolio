'use client'

// "Style ▾" button and the Style panel. Modernist has a single accent, so there is no accent row.
import type { CSSProperties } from 'react'
import { useStyle } from '@/components/site/StyleProvider'
import { useMenu } from '@/components/site/useMenu'
import { SKIN_INFO, SKINS } from '@/lib/skins'
import s from './ModernFrame.module.css'

export default function ModernStyleMenu() {
  const { skin, switchSkin } = useStyle()
  const { open, toggle, close, panel, trigger } = useMenu()
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={s.styleBtn}
        aria-expanded={open}
        aria-controls="style-menu"
        aria-label="Style: Modernist"
        onClick={toggle}
      >
        <span className={s.styleLabel} aria-hidden="true">
          Style ▾
        </span>
        <span className={s.styleStar} aria-hidden="true">
          ★
        </span>
      </button>
      {open && (
        <div ref={panel} id="style-menu" role="dialog" aria-label="Style" className={s.pop}>
          <div className={s.popBar}>
            <span>Style</span>
            <button type="button" className={s.popClose} aria-label="Close" onClick={() => close()}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className={s.popBody}>
            <div className={s.skinList}>
              {SKINS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={s.skinOpt}
                  aria-pressed={k === skin}
                  onClick={() => (k === skin ? close() : switchSkin(k))}
                >
                  <span className={s.swatch} style={{ '--swatch': SKIN_INFO[k].swatch } as CSSProperties} />
                  <span className={s.skinName}>{SKIN_INFO[k].label}</span>
                </button>
              ))}
            </div>
            <p className={s.popNote}>Picked at random on your first visit, then remembered.</p>
          </div>
        </div>
      )}
    </>
  )
}
