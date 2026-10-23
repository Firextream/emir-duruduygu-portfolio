'use client'

// Soft Club Lab — SLab.dc.html: "works", releases DD-03 onwards; filters All / 機械 hardware / 服 clothes;
// rows with a square thumb (the image contained, never cropped), catalogue number, name, one-liner, status.
import Link from 'next/link'
import { useState } from 'react'
import ContentImage from '@/components/site/ContentImage'
import type { LabData } from '@/lib/routes/lab'
import { catNo, isClothes, kindJp } from './releases'
import s from './SLab.module.css'

type Filter = 'all' | 'hard' | 'cloth'
const FILTERS: [Filter, string][] = [
  ['all', 'All'],
  ['hard', '機械 hardware'],
  ['cloth', '服 clothes'],
]
const pad = (n: number) => String(n).padStart(2, '0')

export default function SLab({ projects }: Pick<LabData, 'projects'>) {
  const [filter, setFilter] = useState<Filter>('all')
  const cat = (p: { kind: string }): Filter => (isClothes(p) ? 'cloth' : 'hard')
  const count = (f: Filter) => pad(f === 'all' ? projects.length : projects.filter((p) => cat(p) === f).length)
  const range = projects.length > 1 ? `${catNo(0)} – ${catNo(projects.length - 1)}` : catNo(0)

  return (
    <div className={s.page}>
      <section className={s.head}>
        <div className={s.headMain}>
          <h1 className={s.h1}>works</h1>
          <div className={s.headText}>
            <p className={s.kicker}>
              {range} · {pad(projects.length)} PROJECTS
            </p>
            <p className={s.lede}>
              Small machines and clothes, built slowly<span className={s.deskOnly}> and documented as they go</span>.
            </p>
          </div>
        </div>
        <span className={s.obi} aria-hidden="true">
          作品
        </span>
      </section>

      <div className={s.chips} role="group" aria-label="Filter works">
        {FILTERS.map(([k, label]) => (
          <button key={k} type="button" className={s.chip} aria-pressed={filter === k} onClick={() => setFilter(k)}>
            <span>{label}</span>
            <span className={s.num}>{count(k)}</span>
          </button>
        ))}
      </div>

      <ul className={s.list}>
        {projects.map((p, i) =>
          filter === 'all' || cat(p) === filter ? (
            <li key={p.slug}>
              <Link href={`/lab/${p.slug}`} className={s.row}>
                <span className={s.thumb}>
                  {p.img ? (
                    <ContentImage image={p.img} alt={p.name} className={s.thumbImg} sizes="(max-width: 760px) 96px, 176px" />
                  ) : (
                    <span className={s.ph} />
                  )}
                </span>
                <span className={`${s.no} ${s.deskOnly}`}>{catNo(i)}</span>
                <span className={s.titleCol}>
                  <span className={`${s.kind} ${s.deskOnly}`}>
                    {kindJp(p)} · {p.kind.toLowerCase()}
                  </span>
                  <span className={`${s.mobNo} ${s.mobOnly}`}>
                    {catNo(i)} · {kindJp(p)}
                  </span>
                  <span className={s.name}>{p.name}</span>
                  <span className={`${s.one} ${s.mobOnly}`}>{p.one}</span>
                  <span className={`${s.mobStatus} ${s.mobOnly}`}>{p.status}</span>
                </span>
                <span className={`${s.one} ${s.deskOnly}`}>{p.one}</span>
                <span className={`${s.meta} ${s.deskOnly}`}>
                  <span className={s.status}>{p.status}</span>
                  <span>{p.year}</span>
                  <span className={s.open}>open →</span>
                </span>
              </Link>
            </li>
          ) : null,
        )}
      </ul>
    </div>
  )
}
