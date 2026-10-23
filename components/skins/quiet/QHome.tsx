// Quiet Home — recreated from design_handoff_duruduygu/QHome.dc.html.
// The first print in frames.dir is the admin-picked home photo (settings.homePhoto.quiet).
import Link from 'next/link'
import type { HomeData } from '@/lib/routes/home'
import Print from './Print'
import QuietPlayer from './QuietPlayer'
import Window from './Window'
import s from './QHome.module.css'

/** equal-area prints: width ∝ √(area · w/h), like the reference */
const basis = (w: number, h: number) => Math.round(Math.sqrt((150000 * w) / h))

export default function QHome({ hero, photos, others, posts, projects }: HomeData) {
  const prints = [hero, ...others].filter(Boolean).slice(0, 3) as NonNullable<typeof hero>[]
  const indexOf = (id: string) => photos.findIndex((p) => p.id === id)

  return (
    <div className={s.home}>
      <section className={s.intro}>
        <div>
          <span className={s.kicker}>■ ISTANBUL, TR / A PERSONAL DESKTOP</span>
          <h1 className={s.h1}>Collecting small signals.</h1>
          <p className={s.lede}>
            I&apos;m Emir Duruduygu, an electrical and electronics engineering student at İTÜ in Istanbul. I photograph the city,
            make small hardware and make clothes.
          </p>
        </div>
        <p className={s.aside}>
          <span className={s.mobOnly}>➤ </span>A place for things I notice, and things I’m figuring out.
        </p>
      </section>

      <div className={s.framesWrap}>
        <p className={`${s.label} ${s.framesLabel}`}>▭ a few things from the open tabs of my life ↓</p>
        <Window
          icon="▣"
          title="frames.dir"
          accentBar
          meta={<span className={s.deskOnly}>~/pictures / recent</span>}
          bodyClassName={s.framesBody}
          footer={
            <>
              <span>
                3 of {photos.length} files<span className={s.deskOnly}> · kept at their own proportions</span>
              </span>
              <Link href="/gallery" className={`${s.accLink} ${s.deskOnly}`}>
                open gallery →
              </Link>
            </>
          }
        >
          {prints.map((p, i) => (
            <Print
              key={p.id}
              photo={p}
              index={indexOf(p.id)}
              tape={i === 0 ? '24px' : undefined}
              basis={basis(p.w, p.h)}
              priority={i === 0}
              className={s[`print${i + 1}`]} /* tilt per breakpoint lives in QHome.module.css */
              sizes={`(max-width: 760px) calc(100vw - 64px), ${basis(p.w, p.h)}px`}
            />
          ))}
        </Window>
        <div className={`${s.mobOnly} ${s.btnRow}`}>
          <Link href="/gallery" className={s.btn}>
            open gallery →
          </Link>
        </div>
      </div>

      <div className={s.desk}>
        <div className={s.col}>
          <p className={s.label}>▤ latest from the journal ↓</p>
          <Window icon="▤" title="journal.txt" meta="latest 3" bodyClassName={s.journalBody}>
            <ul>
              {posts.slice(0, 3).map((e) => (
                <li key={e.slug}>
                  <Link href={`/blog/${e.slug}`} className={s.entry}>
                    <span className={s.entryMeta}>
                      <span>{e.date}</span>
                      <span>{e.read}</span>
                    </span>
                    <span className={s.entryRow}>
                      <span className={s.entryTitle}>{e.title}</span>
                      <span className={s.entryArrow} aria-hidden="true">
                        →
                      </span>
                    </span>
                    <span className={`${s.entryExcerpt} ${s.deskOnly}`}>{e.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className={s.more}>
              <Link href="/blog" className={s.moreLink}>
                all the notes →
              </Link>
            </div>
          </Window>
        </div>

        <div className={s.col}>
          <p className={`${s.label} ${s.right}`}>
            currently making / slowly ↓ <span className={s.accStar}>★</span>
          </p>
          <Window icon="⚙" title="lab.exe" meta={`${projects.length} projects`} bodyClassName={s.labBody}>
            <ul>
              {projects.map((j, i) => (
                <li key={j.slug}>
                  <Link href={`/lab/${j.slug}`} className={s.project}>
                    <span className={s.projectNo}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={s.projectText}>
                      <span className={s.projectHead}>
                        <span className={s.projectName}>{j.name}</span>
                        <span className={`${s.projectKind} ${s.deskOnly}`}>{j.kind}</span>
                      </span>
                      <span className={s.projectOne}>{j.one}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className={s.more}>
              <span className={`${s.labNote} ${s.deskOnly}`}>experiments, not products.</span>
              <Link href="/lab" className={s.moreLink}>
                enter lab →
              </Link>
            </div>
          </Window>
        </div>

        <div className={s.side}>
          <p className={`${s.label} ${s.deskOnly}`}>➤ not a portfolio. more like a windowsill.</p>
          <div className={s.sideStack}>
            <QuietPlayer />
            <div className={s.noteWrap}>
              <aside className={s.note} aria-label="Note to self">
                <span className={s.noteTape} aria-hidden="true" />
                <p className={s.noteLabel}>NOTE TO SELF</p>
                <p className={s.noteText}>Make it work. Then make it feel like something.</p>
                <p className={`${s.noteSign} ${s.deskOnly}`}>less polish, more presence. — e.</p>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
