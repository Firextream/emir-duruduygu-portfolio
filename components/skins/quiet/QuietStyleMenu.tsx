'use client'

// "★ Quiet ▾" button and the style.cfg window: skin list + Quiet's four accents.
import { useStyle } from '@/components/site/StyleProvider'
import { useMenu } from '@/components/site/useMenu'
import { QUIET_ACCENTS, SKIN_INFO, SKINS } from '@/lib/skins'
import s from './QuietFrame.module.css'

export default function QuietStyleMenu() {
  const { skin, acc, setAcc, switchSkin } = useStyle()
  const { open, toggle, close, panel, trigger } = useMenu()
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={s.styleBtn}
        aria-expanded={open}
        aria-controls="style-menu"
        aria-label="Style: Quiet"
        onClick={toggle}
      >
        <span aria-hidden="true">★</span>
        <span className={s.styleLabel} aria-hidden="true">
          Quiet ▾
        </span>
      </button>
      {open && (
        <div ref={panel} id="style-menu" role="dialog" aria-label="Style" className={s.pop}>
          <div className={s.popBar}>
            <span>★ style.cfg</span>
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
                  <span className={s.swatch} data-swatch={k} />
                  <span className={s.skinName}>{SKIN_INFO[k].label}</span>
                  <span className={s.skinHint}>{SKIN_INFO[k].hint}</span>
                </button>
              ))}
            </div>
            <div className={s.accRow}>
              <span className={s.accLabel}>accent · {QUIET_ACCENTS[acc]?.name}</span>
              {QUIET_ACCENTS.map((a, i) => (
                <button
                  key={a.name}
                  type="button"
                  className={s.accSwatch}
                  data-i={i}
                  title={a.name}
                  aria-label={`Accent ${a.name}`}
                  aria-pressed={i === acc}
                  onClick={() => setAcc(i)}
                />
              ))}
            </div>
            <p className={s.popNote}>Picked at random on your first visit, then remembered.</p>
          </div>
        </div>
      )}
    </>
  )
}
