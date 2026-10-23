// Original Gallery — OrigGallery.dc.html: COLLECTION / Gallery / intro, PHOTOGRAPHS · MOODBOARD tabs
// (underlined mono), 4-column masonry at native ratios (2 on mobile); hover lifts the photo 4px.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import GalleryTabs, { TabButton, TabPanel } from '@/components/site/GalleryTabs'
import { pad, type GalleryData } from '@/lib/routes/gallery'
import s from './OrigGallery.module.css'

export default function OrigGallery({ photos, mood }: GalleryData) {
  return (
    <GalleryTabs>
      <div className={s.page}>
        <p className={s.kicker}>COLLECTION</p>
        <h1 className={s.h1}>Gallery</h1>
        <p className={s.intro}>
          <span className={s.deskOnly}>
            A collection of photos from all around — moments, places, and things that caught my eye. Every frame at its own proportions.
          </span>
          <span className={s.mobOnly}>Moments, places, and things that caught my eye — every frame at its own proportions.</span>
        </p>

        <div className={s.tabs} role="tablist" aria-label="Gallery">
          <TabButton tab="photos" className={s.tab}>
            PHOTOGRAPHS <span className={s.count}>{pad(photos.length, 2)}</span>
          </TabButton>
          <TabButton tab="mood" className={s.tab}>
            MOODBOARD <span className={s.count}>{pad(mood.length, 2)}</span>
          </TabButton>
        </div>

        <TabPanel tab="photos">
          <ul className={s.masonry}>
            {photos.map((p, i) => (
              <li key={p.id} className={s.item}>
                <Link href={`/gallery/${p.id}`} className={s.photo}>
                  <span className={s.frame}>
                    {p.image ? (
                      <ContentImage
                        image={p.image}
                        className={s.img}
                        eager={i < 4}
                        sizes="(max-width: 760px) calc(50vw - 26px), (max-width: 1440px) 21vw, 282px"
                      />
                    ) : (
                      <span className={s.ph} style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                        {p.ratio}
                        <span className={s.deskOnly}>&nbsp;· placeholder</span>
                      </span>
                    )}
                  </span>
                  <span className={s.title}>{p.title}</span>
                  <span className={s.meta}>
                    {pad(i + 1, 2)} · <span className={s.deskOnly}>{p.place} · </span>
                    {p.ratio}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </TabPanel>

        <TabPanel tab="mood">
          <ul className={`${s.masonry} ${s.mood}`}>
            {mood.map((m) => (
              <li key={m.id} className={s.moodItem}>
                {m.image ? (
                  <ContentImage image={m.image} className={s.img} sizes="(max-width: 760px) calc(50vw - 26px), (max-width: 1440px) 21vw, 282px" />
                ) : (
                  <span className={s.ph} style={{ aspectRatio: `${m.w} / ${m.h}` }}>
                    {m.ratio}
                  </span>
                )}
                <span className={s.moodCap}>
                  <span className={s.deskOnly}>{m.title}</span>
                  <span>{m.source}</span>
                </span>
              </li>
            ))}
          </ul>
        </TabPanel>
      </div>
    </GalleryTabs>
  )
}
