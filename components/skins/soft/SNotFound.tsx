// Soft Club 404 — SNotFound.dc.html: "ERR · 404", a 320px Unbounded 404 with the 空 (empty) obi,
// "This track isn't on the disc.", Back to home + Frames / Journal.
import Link from 'next/link'
import s from './SNotFound.module.css'

export default function SNotFound() {
  return (
    <div className={s.page}>
      <section className={s.head}>
        <div>
          <p className={s.kicker}>ERR · 404 · 見つかりません</p>
          <p className={s.big} aria-hidden="true">
            404
          </p>
          <h1 className={s.text}>This track isn’t on the disc.</h1>
        </div>
        <span className={s.obi} aria-hidden="true">
          空
        </span>
      </section>
      <nav className={s.actions} aria-label="Try one of these">
        <Link href="/" className={s.home}>
          <span>Back to home</span>
          <span aria-hidden="true">→</span>
        </Link>
        <span className={s.more}>
          <Link href="/gallery" className={s.link}>
            Frames
          </Link>
          <Link href="/blog" className={s.link}>
            Journal
          </Link>
        </span>
      </nav>
    </div>
  )
}
