'use client'

// Soft Club Home — recreated from design_handoff_duruduygu/SHome.dc.html.
// "works" are releases DD-01…DD-06; picking one swaps the jewel case (the disc slides back in).
// The DD-01 cover is the admin-picked home photo (settings.homePhoto.soft).
import Link from 'next/link'
import { useRef, useState } from 'react'
import ContentImage from '@/components/site/ContentImage'
import type { Img, Photo, Post, Project } from '@/lib/content/types'
import JewelCase, { type Release } from './JewelCase'
import s from './SHome.module.css'

const pad = (n: number, l: number) => String(n).padStart(l, '0')
const KIND = { essay: 'Essay', video: 'Video essay', note: 'Note' } as const

type Cat = 'all' | 'photo' | 'hard' | 'cloth' | 'write'
const CATS: [Cat, string][] = [
  ['all', 'All'],
  ['photo', '写真 photographs'],
  ['hard', '機械 hardware'],
  ['cloth', '服 clothes'],
  ['write', '日記 journal'],
]

interface Track {
  n: string
  t: string
  m: string
  href: string
}

interface ReleaseInfo {
  id: Release
  no: string
  type: string
  jp: string
  cat: Cat
  title: string
  one: string
  cta: string
  href: string
  tracks: Track[]
  cover: Img | null
  fit: 'cover' | 'contain'
}

export interface SHomeProps {
  photos: Photo[]
  posts: Post[]
  projects: Project[]
  heroId: string | null
}

function releases({ photos, posts, projects, heroId }: SHomeProps): ReleaseInfo[] {
  const hero = photos.find((p) => p.id === heroId) ?? photos.find((p) => p.image) ?? null
  const second = photos.find((p) => p.image && p.id !== hero?.id) ?? null
  const ph = (i: number): Track | null =>
    photos[i] ? { n: `DD-${pad(i + 1, 3)}`, t: photos[i].title, m: photos[i].ratio, href: `/gallery/${photos[i].id}` } : null
  const project = (i: number, id: Release): ReleaseInfo | null => {
    const p = projects[i]
    if (!p) return null
    const cloth = p.kind.toLowerCase() === 'clothes'
    const href = `/lab/${p.slug}`
    return {
      id,
      no: `DD-${pad(3 + i, 2)}`,
      type: p.kind.toLowerCase(),
      jp: cloth ? '服' : '機械',
      cat: cloth ? 'cloth' : 'hard',
      title: p.name,
      one: p.one,
      cta: 'Open project',
      href,
      tracks: [
        { n: '01', t: 'Status', m: p.status, href },
        { n: '02', t: 'Year', m: p.year, href },
        { n: '03', t: 'Tools', m: p.tools, href },
        { n: '04', t: 'Build log', m: `${pad(p.log.length, 2)} notes`, href },
      ],
      cover: p.img,
      fit: 'contain',
    }
  }
  const list: (ReleaseInfo | null)[] = [
    {
      id: 'dd01',
      no: 'DD-01',
      type: 'photo series',
      jp: '写真',
      cat: 'photo',
      title: 'the city, at its own proportions.',
      one: 'Istanbul, at native ratios. Nothing cropped.',
      cta: 'Open frames',
      href: '/gallery',
      tracks: [
        ...([0, 1, 2, 3].map(ph).filter(Boolean) as Track[]),
        ...(photos.length > 4 ? [{ n: `+${pad(photos.length - 4, 2)}`, t: 'more frames', m: '→', href: '/gallery' }] : []),
      ],
      cover: hero?.image ?? null,
      fit: 'cover',
    },
    {
      id: 'dd02',
      no: 'DD-02',
      type: 'photo series',
      jp: '写真',
      cat: 'photo',
      title: '[Series title — placeholder]',
      one: '[One line about this series — placeholder]',
      cta: 'Open frames',
      href: '/gallery',
      tracks: [4, 5, 6].map(ph).filter(Boolean) as Track[],
      cover: second?.image ?? null,
      fit: 'cover',
    },
    project(0, 'dd03'),
    project(1, 'dd04'),
    project(2, 'dd05'),
    {
      id: 'dd06',
      no: 'DD-06',
      type: 'journal',
      jp: '日記',
      cat: 'write',
      title: 'notes, written slowly.',
      one: 'Essays, video essays and notes.',
      cta: 'Open journal',
      href: '/blog',
      tracks: posts.slice(0, 4).map((e, i) => ({ n: pad(i + 1, 2), t: e.title, m: `${KIND[e.kind]} · ${e.read}`, href: `/blog/${e.slug}` })),
      cover: null,
      fit: 'cover',
    },
  ]
  return list.filter(Boolean) as ReleaseInfo[]
}

const CASE_SIZES = '(max-width: 760px) 240px, 560px'

export default function SHome(props: SHomeProps) {
  const { photos, posts } = props
  const all = releases(props)
  const [cur, setCur] = useState<Release>('dd01')
  const [cat, setCat] = useState<Cat>('all')
  const [f, setF] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const r = all.find((x) => x.id === cur) ?? all[0]
  const frame = photos[f]

  const pick = (id: Release) => {
    setCur(id)
    const el = heroRef.current
    if (el) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: reduce ? 'auto' : 'smooth' })
    }
  }

  return (
    <div className={s.home}>
      {/* hero: the current release */}
      <section ref={heroRef} className={s.hero} aria-labelledby="release-title">
        <div className={s.caseCol}>
          <JewelCase
            release={r.id}
            cover={r.cover}
            fit={r.fit}
            count={r.id === 'dd01' ? pad(photos.length, 2) : undefined}
            sizes={CASE_SIZES}
            priority={r.id === 'dd01'}
          />
        </div>
        <div className={s.heroText}>
          <p className={s.catNo}>
            {r.no} · {r.type.toUpperCase()} · {r.jp}
          </p>
          <h1 id="release-title" className={s.releaseTitle}>
            {r.title}
          </h1>
          <p className={s.releaseOne}>{r.one}</p>
          <ol className={s.tracks}>
            {r.tracks.map((t) => (
              <li key={t.n + t.t}>
                <Link href={t.href} className={s.track}>
                  <span className={s.trackNo}>{t.n}</span>
                  <span className={s.trackTitle}>{t.t}</span>
                  <span className={s.trackMeta}>{t.m}</span>
                </Link>
              </li>
            ))}
          </ol>
          <Link href={r.href} className={s.cta}>
            <span>▶ {r.cta}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* works */}
      <section className={s.section} aria-labelledby="h-works">
        <div className={s.head}>
          <h2 id="h-works" className={s.h2}>
            works
          </h2>
          <span className={s.kicker}>
            作品<span className={s.deskOnly}> · photographs, hardware, clothes, journal</span>
          </span>
          <div className={s.chips} role="group" aria-label="Filter works">
            {CATS.map(([k, label]) => (
              <button key={k} type="button" className={s.chip} aria-pressed={cat === k} onClick={() => setCat(k)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <ul className={s.works}>
          {all
            .filter((w) => cat === 'all' || w.cat === cat)
            .map((w) => (
              <li key={w.id}>
                <button type="button" className={s.work} aria-pressed={w.id === cur} onClick={() => pick(w.id)}>
                  <span className={s.workNo}>
                    {w.no}
                    <span className={s.mobOnly}> · {w.jp}</span>
                  </span>
                  <span className={`${s.workType} ${s.deskOnly}`}>
                    {w.jp} · {w.type}
                  </span>
                  <span className={s.workTitle}>{w.title}</span>
                  <span className={s.workOne}>{w.one}</span>
                  <span className={s.workMark}>{w.id === cur ? '▶ playing' : 'play'}</span>
                </button>
              </li>
            ))}
        </ul>
      </section>

      {/* frames */}
      <section className={s.section} aria-labelledby="h-frames">
        <div className={s.head}>
          <h2 id="h-frames" className={s.h2}>
            frames
          </h2>
          <span className={s.kicker}>
            写真<span className={s.deskOnly}> · every photograph, uncropped</span>
          </span>
          <Link href="/gallery" className={s.headLink}>
            <span className={s.deskOnly}>All photographs →</span>
            <span className={s.mobOnly}>All →</span>
          </Link>
        </div>

        {frame && (
          <div className={`${s.shelfRow} ${s.deskOnly}`}>
            <div>
              <div className={s.frameBox}>
                {frame.image ? (
                  <ContentImage
                    image={frame.image}
                    className={s.frameImg}
                    sizes={`(max-width: 960px) calc(100vw - 48px), min(60vw, ${Math.round((620 * frame.w) / frame.h)}px)`}
                  />
                ) : (
                  <span
                    className={`${s.framePh} ${frame.w / frame.h < 1.37 ? s.framePhTall : ''}`}
                    style={{ aspectRatio: `${frame.w} / ${frame.h}` }}
                  >
                    {frame.ratio} · placeholder
                  </span>
                )}
              </div>
              <div className={s.frameCap}>
                <span className={s.catNoInline}>DD-{pad(f + 1, 3)}</span>
                <span className={s.frameTitle}>{frame.title}</span>
                <span className={s.mut}>{frame.ratio} · uncropped</span>
                <Link href={`/gallery/${frame.id}`} className={s.openFrame}>
                  Open frame <span className={s.deep}>→</span>
                </Link>
              </div>
            </div>
            <div>
              <div className={s.spines} role="group" aria-label="Pull a spine to show a frame">
                {photos.map((x, i) => (
                  <button
                    key={x.id}
                    type="button"
                    className={`${s.spine} ${s[`spine${i % 3}`]}`}
                    aria-pressed={i === f}
                    aria-label={`${x.title}, ${x.ratio}`}
                    onClick={() => setF(i)}
                  >
                    <span className={s.spineCap} />
                    <span className={s.spineText}>
                      {x.title} · {x.ratio}
                    </span>
                    <span className={s.spineNo}>{pad(i + 1, 3)}</span>
                  </button>
                ))}
              </div>
              <div className={s.shelf} />
              <div className={s.shelfFoot}>
                <span>pull a spine</span>
                <span>{pad(photos.length, 2)} frames</span>
              </div>
            </div>
          </div>
        )}

        <ul className={`${s.strip} ${s.mobOnly}`}>
          {photos.slice(0, 6).map((x, i) => (
            <li key={x.id}>
              <Link href={`/gallery/${x.id}`} className={s.stripItem}>
                {x.image ? (
                  <ContentImage image={x.image} className={s.stripImg} sizes={`${Math.round((220 * x.w) / x.h)}px`} />
                ) : (
                  <span className={s.stripPh} style={{ aspectRatio: `${x.w} / ${x.h}` }} />
                )}
                <span className={s.stripCap}>
                  <span className={s.catNoInline}>DD-{pad(i + 1, 3)}</span>
                  <span className={s.mut}>{x.ratio}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* liner notes */}
      <section className={s.section} aria-labelledby="h-notes">
        <div className={s.head}>
          <h2 id="h-notes" className={s.h2}>
            liner notes
          </h2>
          <span className={s.kicker}>
            解説<span className={s.deskOnly}> · essays, video essays, notes</span>
          </span>
          <Link href="/blog" className={`${s.headLink} ${s.deskOnly}`}>
            All entries →
          </Link>
        </div>
        <div className={s.booklet}>
          <div className={s.page}>
            <p className={`${s.pageNo} ${s.deskOnly}`}>p. 02</p>
            <ul>
              {posts.slice(0, 3).map((e, i) => (
                <li key={e.slug}>
                  <Link href={`/blog/${e.slug}`} className={s.note}>
                    <span className={s.noteNo}>{pad(i + 1, 2)}</span>
                    <span>
                      <span className={s.noteMeta}>
                        {KIND[e.kind]} · {e.date} · {e.read}
                      </span>
                      <span className={s.noteTitle}>{e.title}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/blog" className={`${s.allEntries} ${s.mobOnly}`}>
              <span>All entries</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={`${s.page} ${s.pageRight} ${s.deskOnly}`}>
            <div className={s.memo}>
              <p className={s.mut}>メモ · note to self</p>
              <p className={s.memoText}>make it work. then make it feel like something.</p>
            </div>
            <p className={s.vertical} lang="ja">
              まず、動かす。
              <br />
              それから、何かを感じさせる。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
