// Modernist inner-page head: huge title with a red full stop in cols 1–8, intro in cols 9–12, 2px rule.
// Also the 56px back-link row that starts every sub-page.
import Link from 'next/link'
import type { ReactNode } from 'react'
import s from './inner.module.css'

export default function PageHead({
  title,
  intro,
  children,
  small,
}: {
  title: string
  intro: ReactNode
  /** extra content under the intro (tabs, facts table) */
  children?: ReactNode
  /** long titles step down (Project) */
  small?: boolean
}) {
  return (
    <section className={`${s.head} ${small ? s.headSmall : ''}`}>
      <h1 className={s.title}>
        {title}
        <span className={s.red}>.</span>
      </h1>
      <div className={s.headSide}>
        <div className={s.intro}>{intro}</div>
        {children}
      </div>
    </section>
  )
}

export function BackRow({ href, label, meta }: { href: string; label: string; meta?: ReactNode }) {
  return (
    <div className={s.back}>
      <Link href={href} className={s.backLink}>
        ← {label}
      </Link>
      {meta && <span className={s.backMeta}>{meta}</span>}
    </div>
  )
}
