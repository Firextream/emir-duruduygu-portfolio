// Quiet Gallery — QGallery.dc.html: frames.dir window with tabs, a ~/pictures tree + README note,
// prints in three columns (moodboard: four, view-only). The reference's "hover a frame to see it in
// ascii" hint is left out: the README removed the ASCII effect everywhere.
import GalleryTabs, { TabButton, TabPanel, WhenTab } from '@/components/site/GalleryTabs'
import type { GalleryData } from '@/lib/routes/gallery'
import Print from './Print'
import Window from './Window'
import s from './QGallery.module.css'

const KS = [-0.8, 0.6, -0.4, 1, -1, 0.5, -0.6, 0.8, -0.3, 0.9, -0.7, 0.4]
const k = (i: number) => KS[i % KS.length]

/** distribute items into n columns, keeping the index for mobile ordering */
const columns = <T,>(items: T[], n: number) =>
  Array.from({ length: n }, (_, c) => items.map((item, i) => ({ item, i })).filter(({ i }) => i % n === c))

export default function QGallery({ photos, mood }: GalleryData) {
  return (
    <div className={s.page}>
      <section className={s.intro}>
        <div>
          <p className={s.kicker}>■ ~/pictures</p>
          <h1 className={s.h1}>Gallery</h1>
        </div>
        <p className={s.lede}>
          <span className={s.deskOnly}>Photographs of Istanbul, shown uncropped at their real proportions. </span>
          <span className={s.mobOnly}>Photographs of Istanbul, uncropped. </span>
          The moodboard holds references I collect.
        </p>
      </section>

      <GalleryTabs>
        <div className={s.mobTabs} role="tablist" aria-label="Gallery">
          <TabButton tab="photos" className={s.mobTab}>
            Photographs
          </TabButton>
          <TabButton tab="mood" className={s.mobTab}>
            Moodboard
          </TabButton>
        </div>

        <Window
          icon="▣"
          accentBar
          title={
            <>
              <WhenTab tab="photos">frames.dir</WhenTab>
              <WhenTab tab="mood">
                <span className={s.mobOnly}>moodboard.board</span>
                <span className={s.deskOnly}>frames.dir</span>
              </WhenTab>
            </>
          }
          meta={
            <>
              <WhenTab tab="photos">{photos.length} items</WhenTab>
              <WhenTab tab="mood">{mood.length} items</WhenTab>
            </>
          }
          lift={false}
          footer={
            <>
              <WhenTab tab="photos">
                <span>{photos.length} photographs · kept at their own proportions</span>
                <span className={s.deskOnly}>click = open</span>
              </WhenTab>
              <WhenTab tab="mood">
                <span>{mood.length} references · found things, not my photographs</span>
              </WhenTab>
            </>
          }
        >
          <div className={s.tabRow} role="tablist" aria-label="Gallery">
            <TabButton tab="photos" className={s.tab}>
              Photographs
            </TabButton>
            <TabButton tab="mood" className={s.tab}>
              Moodboard
            </TabButton>
            <span className={s.sort}>sort: newest ▾</span>
          </div>

          <div className={s.body}>
            <aside className={s.tree}>
              <span className={s.treeHead}>~/pictures</span>
              <TabButton tab="photos" className={s.treeItem}>
                <span>▸ photographs</span>
                <span className={s.mut}>{photos.length}</span>
              </TabButton>
              <TabButton tab="mood" className={s.treeItem}>
                <span>▸ moodboard</span>
                <span className={s.mut}>{mood.length}</span>
              </TabButton>
              <div className={s.readme}>
                <span className={s.readmeTape} aria-hidden="true" />
                <p className={s.readmeLabel}>README</p>
                <p className={s.readmeText}>Nothing here is cropped.</p>
              </div>
            </aside>

            <div className={s.main}>
              <TabPanel tab="photos" className={s.cols3}>
                {columns(photos, 3).map((col, c) => (
                  <div key={c} className={s.col}>
                    {col.map(({ item: p, i }) => (
                      // order: on mobile the columns dissolve into one list in gallery order
                      <div key={p.id} className={s.cell} style={{ order: i }}>
                        <Print
                          photo={p}
                          index={i}
                          tilt={k(i)}
                          tiltMobile={k(i) * 0.7}
                          tape={i === 0 ? '28px' : i === 4 ? '40%' : undefined}
                          eager={i < 3}
                          sizes="(max-width: 760px) calc(100vw - 80px), (max-width: 1100px) 40vw, 300px"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </TabPanel>
              <TabPanel tab="mood">
                {/* four columns on desktop, two on mobile — each a small masonry */}
                {([4, 2] as const).map((n) => (
                  <div key={n} className={n === 4 ? s.cols4 : s.cols2}>
                    {columns(mood, n).map((col, c) => (
                      <div key={c} className={s.col}>
                        {col.map(({ item: m, i }) => (
                          <Print
                            key={m.id}
                            photo={m}
                            index={i}
                            href={null}
                            caption={false}
                            tilt={k(i) * (n === 4 ? 1.3 : 1)}
                            tape={n === 4 && i % 4 === 1 ? '30%' : undefined}
                            className={s.moodItem}
                            sizes={n === 4 ? '220px' : 'calc(50vw - 40px)'}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </TabPanel>
            </div>
          </div>
        </Window>
      </GalleryTabs>
    </div>
  )
}
