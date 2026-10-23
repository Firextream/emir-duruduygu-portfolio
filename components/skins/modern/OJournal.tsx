// Modernist Journal — OJournal.dc.html: grouped by year (red 56px sticky year in cols 1–2), entries in
// cols 3–12 (no., 34px title + excerpt, tag chips, date / read). Empty: "No posts yet." + RSS + Gallery.
import Link from 'next/link'
import { entries, type JournalData } from '@/lib/routes/journal'
import PageHead from './PageHead'
import s from './OJournal.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

export default function OJournal({ posts, years }: JournalData) {
  return (
    <div>
      <PageHead
        title="Journal"
        intro={
          <p>
            <span className={s.deskOnly}>New discoveries, projects, photography and thoughts along the way. Newest first.</span>
            <span className={s.mobOnly}>Discoveries, projects, photography and thoughts. Newest first.</span>
          </p>
        }
      >
        <div className={s.headActions}>
          <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={s.rss}>
            <span>RSS feed</span>
            <span aria-hidden="true">↗</span>
          </a>
          <span className={s.count}>{pad(posts.length)} entries</span>
        </div>
      </PageHead>

      {posts.length === 0 ? (
        <section className={s.empty}>
          <span className={s.emptyNo} aria-hidden="true">
            00
          </span>
          <div className={s.emptyBody}>
            <p className={s.emptyTitle}>
              No posts yet<span className={s.red}>.</span>
            </p>
            <p className={s.emptyText}>
              The first entry is on its way. Follow the RSS feed to see it when it lands
              <span className={s.deskOnly}>, or look at the photographs in the meantime</span>.
            </p>
            <div className={s.emptyActions}>
              <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={s.btnRed}>
                <span>RSS feed</span>
                <span aria-hidden="true">↗</span>
              </a>
              <Link href="/gallery" className={s.btnBox}>
                <span>Gallery</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        years.map((y) => (
          <section key={y.year} className={s.year} aria-label={y.year}>
            <div className={s.yearHead}>
              <h2 className={s.yearNo}>{y.year}</h2>
              <p className={s.yearCount}>{entries(y.posts.length)}</p>
            </div>
            <ul className={s.list}>
              {y.posts.map((e) => (
                <li key={e.slug}>
                  <Link href={`/blog/${e.slug}`} className={s.row}>
                    <span className={s.no}>
                      {pad(e.no)}
                      <span className={s.mobOnly}> · {e.date}</span>
                    </span>
                    <span className={s.text}>
                      <span className={s.title}>{e.title}</span>
                      <span className={`${s.excerpt} ${s.deskOnly}`}>{e.excerpt}</span>
                    </span>
                    <span className={`${s.tags} ${s.deskOnly}`}>
                      {e.tags.map((t, i) => (
                        <span key={i} className={s.tag}>
                          {t}
                        </span>
                      ))}
                    </span>
                    <span className={s.meta}>
                      <span className={s.deskOnly}>
                        {e.date}
                        <br />
                      </span>
                      {e.read}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
