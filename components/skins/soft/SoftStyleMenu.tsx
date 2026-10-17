'use client'

// Soft Club style control: an inline segmented switch on desktop, "Style · スタイル" + an in-flow
// list on mobile. Soft Club has one aqua, so there is no accent row.
import { useStyle } from '@/components/site/StyleProvider'
import { useMenu } from '@/components/site/useMenu'
import { SKIN_INFO, SKINS } from '@/lib/skins'
import s from './SoftFrame.module.css'

export default function SoftStyleMenu() {
  const { skin, switchSkin } = useStyle()
  const { open, toggle, close, panel, trigger } = useMenu()
  return (
    <>
      <div className={s.seg} role="group" aria-label="Style">
        {SKINS.map((k) => (
          <button key={k} type="button" className={s.segOpt} aria-pressed={k === skin} onClick={() => switchSkin(k)}>
            {SKIN_INFO[k].label}
          </button>
        ))}
      </div>
      <button
        ref={trigger}
        type="button"
        className={s.styleBtn}
        aria-expanded={open}
        aria-controls="style-menu"
        onClick={toggle}
      >
        Style · スタイル
      </button>
      {open && (
        <div ref={panel} id="style-menu" className={s.menu} role="group" aria-label="Style">
          {SKINS.map((k) => (
            <button
              key={k}
              type="button"
              className={s.menuOpt}
              aria-pressed={k === skin}
              onClick={() => (k === skin ? close() : switchSkin(k))}
            >
              <span>{SKIN_INFO[k].label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
