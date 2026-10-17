// Soft Club Gallery — SGallery.dc.html: "frames" head with the vertical obi tab, Photographs /
// Moodboard chips, 3-col native-ratio masonry (moodboard 4-col). Hover lifts the photo 4px and the
// catalogue number takes the obi; the photo itself is never altered.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import GalleryTabs, { TabButton, TabPanel, WhenTab } from '@/components/site/GalleryTabs'
import { pad, type GalleryData } from '@/lib/routes/gallery'
import s from './SGallery.module.css'

export default function SGallery({ photos, mood }: GalleryData) {
  return (
    <div className={s.page}>
      <section className={s.head}>
        <div className={s.headMain}>
          <h1 className={s.h1}>frames</h1>
          <div className={s.headText}>
            <p className={s.kicker}>DD-01 · {pad(photos.length, 2)} FRAMES · 写真</p>
            <p className={s.lede}>
              Every photograph at its own proportions.<span className={s.deskOnly}> Nothing cropped, nothing filtered.</span>
            </p>
          </div>
        </div>
        <span className={s.obi} aria-hidden="true">
          写真
        </span>
      </section>

      <GalleryTabs>
        <div className={s.tabs}>
          <div className={s.chips} role="tablist" aria-label="Gallery">
            <TabButton tab="photos" className={s.chip}>
              <span>Photographs</span>
              <span className={s.num}>{pad(photos.length, 2)}</span>
            </TabButton>
            <TabButton tab="mood" className={s.chip}>
              <span>Moodboard</span>
              <span className={s.num}>{pad(mood.length, 2)}</span>
            </TabButton>
          </div>
          <span className={s.status}>
            <WhenTab tab="photos">click a frame to open it</WhenTab>
            <WhenTab tab="mood">found things, not my photographs</WhenTab>
          </span>
        </div>

        <TabPanel tab="photos">
          <ul className={s.masonry}>
            {photos.map((p, i) => (
              <li key={p.id} className={s.item}>
                <Link href={`/gallery/${p.id}`} className={s.frame}>
                  <span className={s.lift}>
                    {p.image ? (
                      <ContentImage
                        image={p.image}
                        className={s.img}
                        eager={i < 3}
                        sizes="(max-width: 760px) calc(50vw - 23px), (max-width: 1100px) 46vw, (max-width: 1440px) 29vw, 420px"
                      />
                    ) : (
                      <span className={s.ph} style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                        <span className={s.deskOnly}>{p.ratio} · placeholder</span>
                      </span>
                    )}
                  </span>
                  <span className={s.cap}>
                    <span className={s.no}>DD-{pad(i + 1)}</span>
                    <span className={`${s.title} ${s.deskOnly}`}>{p.title}</span>
                    <span className={s.rest}>
                      <span className={s.deskOnly}>{p.place} · </span>
                      {p.ratio}
                    </span>
                    <span className={s.hover} aria-hidden="true">
                      開く · open →
                    </span>
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
                  <ContentImage image={m.image} className={s.img} sizes="(max-width: 760px) calc(50vw - 23px), 310px" />
                ) : (
                  <span className={s.ph} style={{ aspectRatio: `${m.w} / ${m.h}` }}>
                    <span className={s.deskOnly}>{m.ratio}</span>
                  </span>
                )}
                <p className={s.moodCap}>
                  <span className={s.moodTitle}>{m.title}</span>
                  <span className={s.mut}>
                    <span className={s.mobOnly}> · </span>
                    {m.source}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </TabPanel>
      </GalleryTabs>
    </div>
  )
}
