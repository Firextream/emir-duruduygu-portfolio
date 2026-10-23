// The full-viewport skin-change curtain (README "Skin-change loading screen").
// variant="leave": shown by StyleProvider on the old page for 900 ms (animated in).
// variant="arrive": server-rendered first in <body>; only visible while <html data-switching> is set
// by the pre-paint script, then fades out over 400 ms.
// Copy, colours and fonts come from the skin registry (lib/skins.ts).
import type { CSSProperties } from 'react'
import { skinDef, type Skin } from '@/lib/skins'
import s from './curtain.module.css'

export default function SkinCurtain({ skin, variant }: { skin: Skin; variant: 'leave' | 'arrive' }) {
  const c = skinDef(skin).curtain
  const vars = {
    '--c-bg': c.bg,
    '--c-ink': c.ink,
    '--c-fill': c.fill,
    '--c-ui': c.ui,
    '--c-display': c.display,
    '--c-weight': c.weight,
    '--c-style': c.style ?? 'normal',
    '--c-track': c.track,
    '--c-ease': c.ease,
    '--c-round': c.round ?? '0',
  } as CSSProperties
  return (
    <div className={`${s.curtain} ${s[c.enter]} ${s[variant]}`} style={vars} aria-hidden="true">
      <div className={s.line}>{c.line}</div>
      <div className={s.name}>{c.name}</div>
      <div className={s.bar}>
        <div className={s.fill} />
      </div>
    </div>
  )
}
