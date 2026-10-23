// Original 404 — OrigNotFound.dc.html: ERROR 404 kicker, the 260px serif "404", "This page isn't here."
// and Back home — Gallery / Blog. data-no-cta hides the frame's contact band on this page.
import Link from 'next/link'
import s from './OrigNotFound.module.css'

export default function OrigNotFound() {
  return (
    <section className={s.page} data-no-cta="">
      <p className={s.kicker}>ERROR 404</p>
      <p className={s.big} aria-hidden="true">
        404
      </p>
      <h1 className={s.title}>This page isn’t here.</h1>
      <p className={`${s.text} ${s.deskOnly}`}>It may have moved, or it never existed. The rest of the site is right where it was.</p>
      <nav className={s.links} aria-label="Try one of these">
        <Link href="/" className={s.home}>
          Back home
        </Link>
        <span className={`${s.rule} ${s.deskOnly}`} aria-hidden="true" />
        <Link href="/gallery" className={s.link}>
          Gallery
        </Link>
        <Link href="/blog" className={s.link}>
          Blog
        </Link>
      </nav>
    </section>
  )
}
