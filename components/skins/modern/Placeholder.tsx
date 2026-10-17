// Striped stand-in for a photograph that has no file yet — kept at the photo's native ratio.
import s from './Placeholder.module.css'

export default function Placeholder({
  w,
  h,
  label,
  deskLabel,
  className,
}: {
  w: number
  h: number
  label: string
  /** optional longer label for desktop widths */
  deskLabel?: string
  className?: string
}) {
  return (
    <div className={`${s.ph} ${className ?? ''}`} style={{ aspectRatio: `${w} / ${h}` }} role="img" aria-label="Photograph placeholder">
      {deskLabel ? (
        <>
          <span className={s.desk}>{deskLabel}</span>
          <span className={s.mob}>{label}</span>
        </>
      ) : (
        label
      )}
    </div>
  )
}
