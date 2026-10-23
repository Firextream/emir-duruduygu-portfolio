'use client'

// The palette button and the Style popover: the skin list and the live site's four accents.
// (No skin hints under the names — client decision, same as the other skins.)
import type { CSSProperties } from 'react'
import { useStyle } from '@/components/site/StyleProvider'
import { useMenu } from '@/components/site/useMenu'
import { ORIGINAL_ACCENTS, SKIN_INFO, SKINS } from '@/lib/skins'
import { Palette } from './icons'
import s from './OriginalFrame.module.css'

export default function OriginalStyleMenu() {
  const { skin, acc, setAcc, switchSkin } = useStyle()
  const { open, toggle, close, panel, trigger } = useMenu()
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={`${s.iconBtn} ${s.styleBtn}`}
        aria-expanded={open}
        aria-controls="style-menu"
        aria-label="Style"
        title="Style"
        onClick={toggle}
      >
        <Palette />
      </button>
      {open && (
        <div ref={panel} id="style-menu" role="dialog" aria-label="Style" className={`${s.pop} ${s.stylePop}`}>
          <div className={s.popHead}>
            <span className={s.popTitle}>Style</span>
            <button type="button" className={s.popClose} aria-label="Close" onClick={() => close()}>
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <p className={s.popLabel}>SKIN</p>
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
                <span>{SKIN_INFO[k].label}</span>
              </button>
            ))}
          </div>
          <p className={s.popLabel}>ACCENT COLOR · {ORIGINAL_ACCENTS[acc]?.name.toUpperCase()}</p>
          <div className={s.accRow}>
            {ORIGINAL_ACCENTS.map((a, i) => (
              <button
                key={a.name}
                type="button"
                className={s.accSwatch}
                style={{ '--swatch': a.value } as CSSProperties}
                title={a.name}
                aria-label={`Accent ${a.name}`}
                aria-pressed={i === acc}
                onClick={() => setAcc(i)}
              />
            ))}
          </div>
          <p className={s.popNote}>Picked at random on your first visit, then remembered.</p>
        </div>
      )}
    </>
  )
}
