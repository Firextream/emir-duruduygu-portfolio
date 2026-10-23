// A looping tag marquee (CSS only): the list twice, translated by half its width. Decorative —
// the tags carry no links. Reduced motion stops it.
import s from './Marquee.module.css'

export default function Marquee({ tags, className }: { tags: readonly string[]; className?: string }) {
  return (
    <div className={`${s.marquee} ${className ?? ''}`} aria-hidden="true">
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
