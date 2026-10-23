// Quiet Journal — QJournal.dc.html: journal.txt window grouped by year, a tags window and a P.S. note.
// Empty: dashed icon, "No posts yet.", RSS + photographs.
import Link from 'next/link'
import { entries, tagCloud, type JournalData } from '@/lib/routes/journal'
import Window from './Window'
import s from './QJournal.module.css'

export default function QJournal({ posts, years }: JournalData) {
  const tags = tagCloud(posts)
  const count = `${posts.length} entries`
  return (
    <div className={s.page}>
      <section className={s.intro}>
        <div>
          <span className={s.kicker}>■ ~/journal</span>
          <h1 className={s.h1}>Journal</h1>
        </div>
        <div>
          <p className={s.lede}>
            <span className={s.deskOnly}>[One line about what the journal is for — placeholder]</span>
            <span className={s.mobOnly}>[One line about the journal — placeholder]</span>
          </p>
          <div className={`${s.actions} ${s.deskOnly}`}>
            <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={s.btn}>
              RSS feed
            </a>
            <a href="#journal-list" className={s.btn}>
              archive ↓
            </a>
          </div>
        </div>
      </section>

      <ul className={`${s.mobTags} ${s.mobOnlyFlex}`} aria-label="Tags">
        {tags.map((t, i) => (
          <li key={i} className={s.chip}>
            {t}
          </li>
        ))}
      </ul>

      <div id="journal-list" className={s.layout}>
        <Window
          icon="▤"
          title="journal.txt"
          meta={count}
          bodyClassName={posts.length ? s.listBody : undefined}
          footerClassName={s.deskOnlyFlex}
          footer={
            <>
              <span>{count} · newest first</span>
              <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={s.footLink}>
                RSS ↗
              </a>
            </>
          }
        >
          {posts.length === 0 ? (
            <div className={s.empty}>
              <span className={s.emptyIcon} aria-hidden="true">
                ▤
              </span>
              <span className={s.emptyCount}>0 entries</span>
              <p className={s.emptyTitle}>No posts yet.</p>
              <p className={s.emptyText}>The first entry is on its way. Follow the RSS feed to see it when it lands.</p>
              <div className={s.emptyActions}>
                <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s.btnAcc}`}>
                  RSS feed
                </a>
                <Link href="/gallery" className={s.btn}>
                  look at photographs →
                </Link>
              </div>
            </div>
          ) : (
            years.map((y) => (
              <section key={y.year} className={s.year} aria-label={y.year}>
                <div className={s.yearHead}>
                  <h2 className={s.yearNo}>{y.year}</h2>
                  <span className={s.yearCount}>{entries(y.posts.length)}</span>
                </div>
                <ul>
                  {y.posts.map((e) => (
                    <li key={e.slug}>
                      <Link href={`/blog/${e.slug}`} className={s.entry}>
                        <span className={s.entryMeta}>
                          <span>{e.date}</span>
                          <span>{e.read}</span>
                        </span>
                        <span className={s.entryRow}>
                          <span className={s.entryTitle}>{e.title}</span>
                          <span className={s.arrow} aria-hidden="true">
                            →
                          </span>
                        </span>
                        <span className={`${s.excerpt} ${s.deskOnly}`}>{e.excerpt}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </Window>

        <div className={`${s.side} ${s.deskOnlyFlex}`}>
          <Window icon="#" title="tags" bodyClassName={s.tagsBody}>
            <ul className={s.tagList}>
              {tags.map((t, i) => (
                <li key={i} className={s.chip}>
                  {t}
                </li>
              ))}
            </ul>
          </Window>
          <div className={s.psWrap}>
            <aside className={s.ps}>
              <span className={s.psTape} aria-hidden="true" />
              <p className={s.psLabel}>P.S.</p>
              <p className={s.psText}>Follow along by RSS. No newsletter, no algorithm.</p>
            </aside>
          </div>
        </div>
      </div>

      <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={`${s.btn} ${s.mobRss} ${s.mobOnlyFlex}`}>
        RSS feed
      </a>
    </div>
  )
}
