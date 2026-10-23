// The Soft Club jewel case — the only shared child component in the handoff (JewelCase.dc.html).
// Drawn on a 980×660 design grid and scaled with container-query units, so it fits any column.
// The cover is the one place a photo is cropped (square, object-fit: cover); SLAB-100 is contained.
// The case is decorative art: hidden from assistive tech, the release details are in the page text.
import type { CSSProperties } from 'react'
import ContentImage from '@/components/site/ContentImage'
import type { Img } from '@/lib/content/types'
import s from './JewelCase.module.css'

export type Release = 'dd01' | 'dd02' | 'dd03' | 'dd04' | 'dd05' | 'dd06' | 'about'

export const RELEASES: Record<Release, { no: string; jp: string; obi: string; count: string; unit: string; ring: string }> = {
  dd01: { no: 'DD-01', jp: '写真', obi: 'イスタンブールの写真', count: '09', unit: 'frames', ring: 'PHOTO SERIES · 写真' },
  dd02: { no: 'DD-02', jp: '写真', obi: '写真シリーズ', count: '—', unit: 'frames', ring: 'PHOTO SERIES · 写真' },
  dd03: { no: 'DD-03', jp: '機械', obi: 'ポケット音楽プレーヤー', count: '01', unit: 'prototype', ring: 'HARDWARE · SLAB-100' },
  dd04: { no: 'DD-04', jp: '機械', obi: 'カラー電子ペーパー', count: '01', unit: 'badge', ring: 'WEARABLE · CHARM' },
  dd05: { no: 'DD-05', jp: '服', obi: '仕立てのデニム', count: '01', unit: 'pattern', ring: 'CLOTHES · DENIM-001' },
  dd06: { no: 'DD-06', jp: '日記', obi: 'ゆっくり書く日記', count: '03', unit: 'entries', ring: 'WRITING · 日記' },
  about: { no: 'DD-00', jp: '人', obi: '作り手について', count: '01', unit: 'maker', ring: 'ABOUT · 自己紹介' },
}

/** The engraved ring around the disc, as an SVG image: decorative, so it isn't live (tiny) page text. */
function ringImage(text: string): string {
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'><defs><path id='r' d='M300,300 m-254,0 a254,254 0 1,1 508,0 a254,254 0 1,1 -508,0'/></defs>" +
    "<text fill='#5f6b7c' font-size='11' font-weight='500' letter-spacing='3' font-family='Zen Kaku Gothic New,Hiragino Sans,Yu Gothic,sans-serif'>" +
    `<textPath href='#r' textLength='1590' lengthAdjust='spacing'>${text}</textPath></text></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export type ReleaseInfo = (typeof RELEASES)[Release]

export default function JewelCase({
  release,
  info,
  cover,
  fit = 'cover',
  count,
  sizes,
  priority,
  eager,
  className,
}: {
  release: Release
  /** overrides the release's printed copy (catalogue number, obi, ring) */
  info?: Partial<ReleaseInfo>
  cover: Img | null
  fit?: 'cover' | 'contain'
  /** sticker count override (e.g. the real number of frames) */
  count?: string
  sizes: string
  priority?: boolean
  /** above the fold on an inner page: load eagerly without a preload */
  eager?: boolean
  className?: string
}) {
  const p = { ...RELEASES[release], ...info }
  const ring = `DURUDUYGU · ${p.no} · ${p.ring} · ISTANBUL 2026 · `
  return (
    <div className={`${s.case} ${className ?? ''}`} aria-hidden="true">
      <div className={s.stage}>
        {/* the disc slides back in whenever the release changes (key) */}
        <div key={release} className={s.disc}>
          <div className={s.discClip}>
            <div className={s.discFace}>
              <div className={s.ring} style={{ '--ring': ringImage(ring + ring) } as CSSProperties} />
            </div>
          </div>
          <div className={s.sheen} />
          <div className={s.glint} />
        </div>

        <div className={s.box}>
          <div className={s.hinge} />
          <div className={s.hingeRidges} />
          <div className={`${s.tab} ${s.tabTop}`} />
          <div className={`${s.tab} ${s.tabBottom}`} />
          <div className={`${s.clip} ${s.clipTop}`} />
          <div className={`${s.clip} ${s.clipBottom}`} />
          <div className={s.cover}>
            {cover ? (
              <ContentImage
                image={cover}
                alt=""
                sizes={sizes}
                priority={priority}
                eager={eager}
                className={fit === 'contain' ? s.coverContain : s.coverImg}
              />
            ) : (
              <div className={s.coverPh} />
            )}
          </div>
          <div className={s.glare} />
          <div className={s.obi}>
            <span className={s.obiName}>ドゥルドゥイグ</span>
            <span className={s.obiSub}>{p.obi}</span>
            <span className={s.obiNo}>
              <span>{p.no}</span>
              <span>{p.jp}</span>
            </span>
          </div>
          <div className={s.sticker}>
            <span>
              新作
              <br />
              <span className={s.stickerCount}>{count ?? p.count}</span>
              <br />
              <span className={s.stickerUnit}>{p.unit}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
