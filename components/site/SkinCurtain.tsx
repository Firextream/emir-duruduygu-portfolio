// The full-viewport skin-change curtain (README "Skin-change loading screen").
// variant="leave": shown by StyleProvider on the old page for 900 ms (animated in).
// variant="arrive": server-rendered first in <body>; only visible while <html data-switching> is set
// by the pre-paint script, then fades out over 400 ms.
import type { Skin } from '@/lib/skins'
import s from './curtain.module.css'

const COPY: Record<Skin, { line: string; name: string }> = {
  quiet: { line: '~/style.cfg — mounting windows', name: 'Quiet' },
  soft: { line: '読み込み中 · LOADING MODEL DD-01', name: 'soft club' },
  modern: { line: 'SETTING THE GRID', name: 'Modernist' },
}

export default function SkinCurtain({ skin, variant }: { skin: Skin; variant: 'leave' | 'arrive' }) {
  const { line, name } = COPY[skin]
  return (
    <div className={`${s.curtain} ${s[skin]} ${s[variant]}`} aria-hidden="true">
      <div className={s.line}>{line}</div>
      <div className={s.name}>{name}</div>
      <div className={s.bar}>
        <div className={s.fill} />
      </div>
    </div>
  )
}
