// Quiet 404 — QNotFound.dc.html: an "error" window with a 404 on the LCD, "This frame isn't here.",
// Journal / Gallery / ← Home buttons, and a LOST? note with the email.
import Link from 'next/link'
import RequestedPath from '@/components/site/RequestedPath'
import { SITE_EMAIL } from '@/lib/content/links'
import Window from './Window'
import s from './QNotFound.module.css'

export default function QNotFound() {
  return (
    <div className={s.page}>
      <div className={s.stage}>
        <Window icon="⚠" title="error" accentBar className={s.win} bodyClassName={s.body}>
          <div className={s.main}>
            <div className={s.lcd} aria-hidden="true">
              <span className={s.digits}>
                888<span className={s.on}>404</span>
              </span>
            </div>
            <div>
              <h1 className={s.h1}>This frame isn’t here.</h1>
              <p className={s.text}>
                The page may have moved, or the link has a typo.
                <span className={s.deskOnly}>
                  {' '}
                  <RequestedPath className={s.path} />
                </span>
              </p>
            </div>
          </div>
          <nav className={s.actions} aria-label="Try one of these">
            <Link href="/blog" className={s.btn}>
              Journal
            </Link>
            <Link href="/gallery" className={s.btn}>
              Gallery
            </Link>
            <Link href="/" className={`${s.btn} ${s.btnAcc}`}>
              ← Home
            </Link>
          </nav>
        </Window>
        <div className={s.noteWrap}>
          <div className={s.note}>
            <span className={s.tape} aria-hidden="true" />
            <p className={s.noteLabel}>LOST?</p>
            <p className={s.noteText}>
              Write to me<span className={s.deskOnly}> — I’ll point you to it</span>.
            </p>
            <p className={s.noteMail}>{SITE_EMAIL}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
