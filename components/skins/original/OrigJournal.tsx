'use client'

// Original Journal — OrigJournal.dc.html: JOURNAL / "Thoughts & Stories" / RSS; the latest video
// essay FEATURED (desktop, when nothing is filtered); search + ALL · ESSAYS · VIDEO ESSAYS · NOTES;
// numbered rows (video rows show a 16:9 poster). Mobile keeps every entry in the list. Empty state.
import Link from 'next/link'
import { useState } from 'react'
import ContentImage from '@/components/site/ContentImage'
import type { PostKind } from '@/lib/content/types'
import type { PostSummary } from '@/lib/routes/journal'
import { Rss } from './icons'
import s from './OrigJournal.module.css'

const KIND: Record<PostKind, string> = { essay: 'ESSAY', video: 'VIDEO ESSAY', note: 'NOTE' }
type Filter = 'all' | PostKind
const FILTERS: [Filter, string][] = [
  ['all', 'ALL'],
  ['essay', 'ESSAYS'],
  ['video', 'VIDEO ESSAYS'],
  ['note', 'NOTES'],
]
const pad = (n: number) => String(n).padStart(2, '0')

function Poster({ p, big }: { p: PostSummary; big?: boolean }) {
  const poster = p.video?.poster
  return (
    <span className={big ? s.feature : s.thumb}>
      {poster && <ContentImage image={poster} alt="" className={s.poster} sizes={big ? '(max-width: 760px) 100vw, 46vw' : '(max-width: 760px) 100vw, 240px'} />}
      <span className={s.play} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
          <polygon points="7 4 20 12 7 20 7 4" />
        </svg>
      </span>
      {big && !poster && <span className={s.posterLabel}>16:9 · poster placeholder</span>}
    </span>
  )
}

export default function OrigJournal({ posts }: { posts: PostSummary[] }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const empty = posts.length === 0
  const featured = posts.find((p) => p.kind === 'video') ?? posts[0] ?? null
  const query = q.trim().toLowerCase()
  const plain = filter === 'all' && !query
  const match = posts.filter((p) => (filter === 'all' || p.kind === filter) && (!query || `${p.title} ${p.excerpt}`.toLowerCase().includes(query)))
  // desktop numbers skip the featured entry while it's shown above the list; mobile numbers count every row
  let deskN = 0

  return (
    <div className={s.page}>
      <p className={s.kicker}>JOURNAL</p>
      <h1 className={s.h1}>Thoughts &amp; Stories</h1>
      <p className={s.intro}>
        New discoveries, projects, photography, and thoughts<span className={s.deskOnly}> on various topics</span> along the way.
      </p>
      <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={s.rss}>
        <Rss size={17} className={s.deskOnlyIcon} />
        RSS Feed<span className={s.mobOnly}> ↗</span>
      </a>

      {empty ? (
        <section className={s.empty}>
          <p className={s.emptyTitle}>No posts yet.</p>
          <p className={s.emptyText}>
            The first entry is being written.<span className={s.deskOnly}> Subscribe to the feed, or look through the photographs meanwhile.</span>
          </p>
          <div className={s.emptyLinks}>
            <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className={s.emptyRss}>
              RSS Feed
            </a>
            <span className={s.rule} aria-hidden="true" />
            <Link href="/gallery" className={s.emptyGallery}>
              Gallery
            </Link>
          </div>
        </section>
      ) : (
        <>
          {plain && featured && (
            <div className={s.featBlock}>
              <p className={s.featLabel}>FEATURED</p>
              <Link href={`/blog/${featured.slug}`} className={s.featured}>
                <Poster p={featured} big />
                <span className={s.featText}>
                  <span className={s.kind}>{KIND[featured.kind]}</span>
                  <span className={s.featTitle}>{featured.title}</span>
                  <span className={s.featExcerpt}>{featured.excerpt}</span>
                  <span className={s.featMeta}>
                    <span>{featured.date}</span>
                    <span>{featured.read}</span>
                  </span>
                </span>
              </Link>
            </div>
          )}

          <div className={s.tools}>
            <label className={s.search}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts..." aria-label="Search posts" className={s.searchInput} />
            </label>
            <div className={s.filters} role="group" aria-label="Filter posts">
              {FILTERS.map(([k, label]) => (
                <button key={k} type="button" className={s.filter} aria-pressed={filter === k} onClick={() => setFilter(k)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {match.length === 0 && (
            <p className={s.none}>
              Nothing matches that.{' '}
              <button
                type="button"
                className={s.clear}
                onClick={() => {
                  setQ('')
                  setFilter('all')
                }}
              >
                Clear<span className={s.deskOnly}> search</span>
              </button>
            </p>
          )}

          <ul className={s.list}>
            {match.map((p, j) => {
              const isFeat = plain && p === featured
              if (!isFeat) deskN++
              return (
                <li key={p.slug} className={isFeat ? s.featRow : undefined}>
                  <Link href={`/blog/${p.slug}`} className={s.row}>
                    <span className={s.no} aria-hidden="true">
                      {pad(deskN)}
                    </span>
                    <span className={s.text}>
                      {p.kind === 'video' && (
                        <span className={s.mobThumb}>
                          <Poster p={p} />
                        </span>
                      )}
                      <span className={s.rowTop}>
                        <span>
                          <span className={s.mobOnly}>{pad(j + 1)} · </span>
                          {KIND[p.kind]}
                        </span>
                        <span className={s.mobOnly}>{p.read}</span>
                      </span>
                      <span className={s.title}>{p.title}</span>
                      <span className={s.excerpt}>{p.excerpt}</span>
                      <span className={`${s.mobDate} ${s.mobOnly}`}>{p.date}</span>
                    </span>
                    <span className={s.deskThumb}>{p.kind === 'video' && <Poster p={p} />}</span>
                    <span className={s.meta}>
                      <span>{p.date}</span>
                      <span>{p.read}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
