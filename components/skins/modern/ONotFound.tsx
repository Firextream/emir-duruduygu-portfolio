// Modernist 404 — ONotFound.dc.html: 420px "404.", a 2px rule, "This page isn't here.", a red Home
// button and Gallery / Journal rows.
import Link from 'next/link'
import s from './ONotFound.module.css'

export default function ONotFound() {
  return (
    <section className={s.page}>
      <p className={s.big} aria-hidden="true">
        404<span className={s.red}>.</span>
      </p>
      <div className={s.row}>
        <h1 className={s.title}>This page isn’t here.</h1>
        <p className={s.text}>
          The link may be old, or the page moved.<span className={s.deskOnly}> Try one of these.</span>
        </p>
        <nav className={s.links} aria-label="Try one of these">
          <Link href="/" className={`${s.link} ${s.home}`}>
            <span>Home</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/gallery" className={s.link}>
            <span>Gallery</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/blog" className={s.link}>
            <span>Journal</span>
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </section>
  )
}
