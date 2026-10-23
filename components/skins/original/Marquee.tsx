// A looping tag marquee (CSS only): the list twice, translated by half its width. Decorative —
// the tags carry no links. Reduced motion stops it. "hero": Home, 40s, ink dots; "lab": 36s,
// tighter tracking, accent dots.
import s from './Marquee.module.css'

export default function Marquee({ tags, variant = 'hero', className }: { tags: readonly string[]; variant?: 'hero' | 'lab'; className?: string }) {
  return (
    <div className={`${s.marquee} ${s[variant]} ${className ?? ''}`} aria-hidden="true">
      <div className={s.track}>
        {[...tags, ...tags].map((t, i) => (
          <span key={i} className={s.item}>
            <span className={s.dot} />
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
