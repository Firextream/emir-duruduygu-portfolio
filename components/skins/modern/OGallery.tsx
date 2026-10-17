// Modernist Gallery — OGallery.dc.html: Photographs / Moodboard segmented control, 3-col native-ratio
// masonry (moodboard 4-col), captions "[00N] title … place · ratio", hover = red "Open →" tag.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import GalleryTabs, { TabButton, TabPanel } from '@/components/site/GalleryTabs'
import type { GalleryData } from '@/lib/routes/gallery'
import { pad } from '@/lib/routes/gallery'
import PageHead from './PageHead'
import Placeholder from './Placeholder'
import s from './OGallery.module.css'

const no = (i: number) => `[${pad(i + 1)}]`

export default function OGallery({ photos, mood }: GalleryData) {
  return (
    <GalleryTabs>
      <PageHead
        title="Gallery"
        intro={
          <p>
            <span className={s.deskOnly}>
              Photographs of Istanbul at their real proportions — nothing here is cropped. The moodboard holds references I collect.
            </span>
            <span className={s.mobOnly}>Photographs of Istanbul at their real proportions. Nothing is cropped.</span>
          </p>
        }
      >
        <div className={s.seg} role="tablist" aria-label="Gallery">
          <TabButton tab="photos" className={s.segOpt}>
            <span>Photographs</span>
            <span>{pad(photos.length, 2)}</span>
          </TabButton>
          <TabButton tab="mood" className={s.segOpt}>
            <span>Moodboard</span>
            <span>{pad(mood.length, 2)}</span>
          </TabButton>
        </div>
      </PageHead>

      <TabPanel tab="photos" className={s.panel}>
        <ul className={s.masonry}>
          {photos.map((p, i) => (
            <li key={p.id} className={s.item}>
              <Link href={`/gallery/${p.id}`} className={s.photo}>
                <span className={s.frame}>
                  {p.image ? (
                    <ContentImage
                      image={p.image}
                      className={s.img}
                      eager={i < 3}
                      sizes="(max-width: 760px) calc(100vw - 36px), (max-width: 1100px) 46vw, (max-width: 1440px) 30vw, 432px"
                    />
                  ) : (
                    <Placeholder w={p.w} h={p.h} label={`${p.ratio} · placeholder`} className={s.ph} />
                  )}
                  <span className={s.open} aria-hidden="true">
                    Open →
                  </span>
                </span>
                <span className={s.cap}>
                  <span className={s.no}>{no(i)}</span>
                  <span className={s.capTitle}>{p.title}</span>
                  <span className={s.capMeta}>
                    <span className={s.deskOnly}>{p.place} · </span>
                    {p.ratio}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </TabPanel>

      <TabPanel tab="mood" className={s.panel}>
        <ul className={`${s.masonry} ${s.mood}`}>
          {mood.map((m, i) => (
            <li key={m.id} className={s.moodItem}>
              {m.image ? (
                <ContentImage image={m.image} className={s.img} sizes="(max-width: 760px) calc(50vw - 24px), (max-width: 1440px) 22vw, 318px" />
              ) : (
                <Placeholder w={m.w} h={m.h} label={m.ratio} className={s.ph} />
              )}
              <p className={s.moodCap}>
                <span className={s.no}>{no(i)}</span>
                <span className={`${s.capTitle} ${s.deskOnly}`}>{m.title}</span>
                <span className={s.moodSource}>{m.source}</span>
              </p>
            </li>
          ))}
        </ul>
      </TabPanel>
    </GalleryTabs>
  )
}
