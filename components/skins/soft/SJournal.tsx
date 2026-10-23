'use client'

// Soft Club Journal — SJournal.dc.html: filters All / Essays / Video essays / Notes, the latest video
// essay featured (16:9 poster, play, duration), rows by year where video rows show a 16:9 thumb.
import Link from 'next/link'
import { useState } from 'react'
import ContentImage from '@/components/site/ContentImage'
import type { PostKind } from '@/lib/content/types'
import type { PostSummary } from '@/lib/routes/journal'
import s from './SJournal.module.css'

const KIND: Record<PostKind, [string, string]> = { essay: ['Essay', '文'], video: ['Video essay', '映像'], note: ['Note', 'メモ'] }
type Filter = 'all' | PostKind
const FILTERS: [Filter, string, string][] = [
  ['all', 'All', ''],
  ['essay', 'Essays', '文'],
  ['video', 'Video essays', '映像'],
  ['note', 'Notes', 'メモ'],
]
const pad = (n: number) => String(n).padStart(2, '0')

function Thumb({ p, big }: { p: PostSummary; big?: boolean }) {
  const v = p.video
  return (
    <span className={big ? s.feature : s.thumb}>
      {v?.poster && <ContentImage image={v.poster} alt="" className={s.poster} sizes={big ? '(max-width: 760px) 100vw, 60vw' : '176px'} />}
      {big && (
        <span className={s.disc} aria-hidden="true">
          ▶
        </span>
      )}
      <span className={s.dur}>
        {big ? '' : '▶ '}
        {v?.duration}
      </span>
      {big && !v?.poster && <span className={s.posterLabel}>poster frame · placeholder</span>}
    </span>
  )
}

export default function SJournal({ posts }: { posts: PostSummary[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const empty = posts.length === 0
  const featured = posts.find((p) => p.kind === 'video') ?? null
  const showFeatured = !!featured && (filter === 'all' || filter === 'video')
  const visible = posts.filter((p) => (filter === 'all' || p.kind === filter) && p !== featured)
  const years: { year: string; rows: PostSummary[] }[] = []
  for (const p of visible) {
    const y = years.find((g) => g.year === p.year)
    if (y) y.rows.push(p)
    else years.push({ year: p.year, rows: [p] })
  }
  const count = (f: Filter) => pad(f === 'all' ? posts.length : posts.filter((p) => p.kind === f).length)

  return (
    <div className={s.page}>
      <section className={s.head}>
        <div className={s.headMain}>
          <h1 className={s.h1}>journal</h1>
          <div className={s.headText}>
            <p className={s.kicker}>DD-06 · {pad(posts.length)} ENTRIES · 解説</p>
            <p className={s.lede}>
              Essays, video essays and notes.<span className={s.deskOnly}> Written, and sometimes filmed, slowly.</span>
            </p>
          </div>
        </div>
        <span className={s.obi} aria-hidden="true">
          日記
        </span>
      </section>

      <div className={s.tabs}>
        <div className={s.chips} role="group" aria-label="Filter entries">
          {FILTERS.map(([k, label, jp]) => (
            <button key={k} type="button" className={s.chip} aria-pressed={filter === k} onClick={() => setFilter(k)}>
              <span>{label}</span>
              {jp && <span className={`${s.chipJp} ${s.deskOnly}`}>{jp}</span>}
              <span className={s.num}>{count(k)}</span>
            </button>
          ))}
        </div>
        <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={`${s.rss} ${s.deskOnly}`}>
          RSS ↗
        </a>
      </div>

      {empty && (
        <div className={s.empty}>
          <div>
            <p className={`${s.emptyPage} ${s.deskOnly}`}>p. 01 · 空</p>
            <p className={s.emptyTitle}>nothing here yet.</p>
            <p className={s.emptyText}>
              The first liner notes are being written.<span className={s.deskOnly}> Follow the feed to hear when they land.</span>
            </p>
          </div>
          <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={s.cta}>
            <span>Follow via RSS</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}

      {showFeatured && featured?.video && (
        <Link href={`/blog/${featured.slug}`} className={s.featured}>
          <Thumb p={featured} big />
          <span className={s.featText}>
            <span className={s.featKicker}>LATEST · VIDEO ESSAY · 映像</span>
            <span className={s.featTitle}>{featured.title}</span>
            <span className={`${s.featExcerpt} ${s.deskOnly}`}>{featured.excerpt}</span>
            <span className={`${s.featMeta} ${s.deskOnly}`}>
              <span>{featured.date}</span>
              <span>{pad(featured.video.chapters.length)} chapters</span>
              <span>{featured.video.host}</span>
            </span>
            <span className={`${s.cta} ${s.deskOnly}`}>
              <span>▶ Watch · {featured.video.duration}</span>
              <span aria-hidden="true">→</span>
            </span>
          </span>
        </Link>
      )}

      {years.map((y) => (
        <section key={y.year} className={s.year} aria-label={y.year}>
          <h2 className={s.yearNo}>{y.year}</h2>
          <ul className={s.rows}>
            {y.rows.map((e) => (
              <li key={e.slug}>
                <Link href={`/blog/${e.slug}`} className={s.row}>
                  <span className={s.no}>{pad(e.no)}</span>
                  <span className={s.meta}>
                    <span className={s.kind}>
                      {KIND[e.kind][0]} · {KIND[e.kind][1]}
                    </span>
                    <span>{e.read}</span>
                    <span className={s.deskOnly}>{e.date}</span>
                  </span>
                  <span className={s.text}>
                    <span className={s.title}>{e.title}</span>
                    <span className={`${s.excerpt} ${s.deskOnly}`}>{e.excerpt}</span>
                    <span className={`${s.mobDate} ${s.mobOnly}`}>{e.date}</span>
                  </span>
                  {e.kind === 'video' && e.video ? <Thumb p={e} /> : <span className={s.deskOnly} />}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
