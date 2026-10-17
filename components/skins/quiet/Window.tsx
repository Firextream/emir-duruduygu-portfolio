// A Quiet desktop window: title bar (icon, name, meta, the two decorative buttons) and a body.
import type { ReactNode } from 'react'
import s from './Window.module.css'

export default function Window({
  icon,
  title,
  meta,
  accentBar = false,
  lift = true,
  className,
  bodyClassName,
  children,
  footer,
  as: Tag = 'section',
  labelledBy,
}: {
  icon: ReactNode
  title: ReactNode
  meta?: ReactNode
  /** frames.dir uses the accent-tinted bar */
  accentBar?: boolean
  /** hover lift (off for windows that only hold controls) */
  lift?: boolean
  className?: string
  bodyClassName?: string
  children: ReactNode
  footer?: ReactNode
  as?: 'section' | 'div' | 'article' | 'aside'
  labelledBy?: string
}) {
  return (
    <Tag className={`${s.window} ${lift ? s.lift : ''} ${className ?? ''}`} aria-labelledby={labelledBy}>
      <div className={`${s.bar} ${accentBar ? s.accentBar : ''}`}>
        <span aria-hidden="true">{icon}</span>
        <span className={s.title} id={labelledBy}>
          {title}
        </span>
        <span className={s.meta}>{meta}</span>
        <span className={s.buttons} aria-hidden="true">
          <span>_</span>
          <span>×</span>
        </span>
      </div>
      <div className={`${s.body} ${bodyClassName ?? ''}`}>{children}</div>
      {footer && <div className={s.footer}>{footer}</div>}
    </Tag>
  )
}
