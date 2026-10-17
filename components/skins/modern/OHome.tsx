// Modernist Home — recreated from design_handoff_duruduygu/OHome.dc.html (README "Modernist Home").
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import { catalogueNo, type HomeData } from '@/lib/routes/home'
import type { Photo } from '@/lib/content/types'
import ModernContactForm from './ModernContactForm'
import Placeholder from './Placeholder'
import s from './OHome.module.css'

const FRAME_SIZES = [
  '(max-width: 760px) calc(100vw - 36px), (max-width: 1440px) 38vw, 546px',
  '(max-width: 760px) calc(50vw - 24px), (max-width: 1440px) 30vw, 432px',
  '(max-width: 760px) calc(50vw - 24px), (max-width: 1440px) 22vw, 318px',
]

const clip = (t: string, n = 48) => (t.length > n ? `${t.slice(0, n - 1).trim()}…` : t)

export default function OHome({ hero, heroIndex, photos, others, posts, projects, moodCount }: HomeData) {
  const lab = projects[0]
  const status = [
    `Gallery · ${photos.length} frames`,
    posts[0] ? `Journal · ${clip(posts[0].title)}` : null,
    lab ? `Lab · ${lab.name}: ${lab.status}` : null,
    `Moodboard · ${moodCount} references`,
  ].filter(Boolean) as string[]
  const frames = others.slice(0, 3)
  const indexOf = (p: Photo) => photos.findIndex((x) => x.id === p.id)

  return (
    <div className={s.home}>
      <p className={s.status}>
        {status.map((t) => (
          <span key={t} className={s.statusItem}>
            <span className={s.square} aria-hidden="true" />
            <span className={s.statusText}>{t}</span>
          </span>
        ))}
        <span className={s.statusJoined}>{status.join('  ·  ')}</span>
      </p>

      {/* Masthead */}
      <section className={`${s.grid} ${s.masthead}`} aria-label="Introduction">
        <h1 className={s.wordmark}>
          duruduygu<span className={s.red}>.</span>
        </h1>
        <p className={s.tagline}>Istanbul in photographs, small hardware and clothes cut to measure.</p>
        <dl className={s.facts}>
          <div>
            <dt>LOC</dt>
            <dd>Istanbul, TR</dd>
          </div>
          <div>
            <dt>STUDY</dt>
            <dd>
              Electrical &amp; Electronics<span className={s.deskOnly}> Eng.</span>, İTÜ
            </dd>
          </div>
          <div>
            <dt>MAKES</dt>
            <dd>Photographs · hardware · clothes</dd>
          </div>
        </dl>
        <div className={s.player}>
          <div className={s.playerHead}>
            <span>NOW PLAYING</span>
            <span className={s.spotify}>
              <span className={s.square} aria-hidden="true" />
              SPOTIFY
            </span>
          </div>
          <div className={s.playerBody}>
            <span className={`${s.square} ${s.mobOnly}`} aria-hidden="true" />
            <div className={s.track}>
              <div className={s.trackTitle}>[Track title]</div>
              <div className={s.trackArtist}>[Artist]</div>
            </div>
            <div className={s.trackTime}>02:38</div>
          </div>
          <div className={s.progress} aria-hidden="true" />
        </div>
      </section>

      {/* Hero frame */}
      {hero && (
        <section className={`${s.grid} ${s.hero}`} aria-label="Home photograph">
          <Link href={`/gallery/${hero.id}`} className={s.heroLink}>
            {hero.image ? (
              <ContentImage
                image={hero.image}
                priority
                className={s.img}
                sizes="(max-width: 760px) 100vw, (max-width: 1440px) 70vw, 1002px"
              />
            ) : (
              <Placeholder w={hero.w} h={hero.h} label={`${hero.ratio} · placeholder`} />
            )}
            <span className={s.band} aria-hidden="true">
              Open photograph →
            </span>
            <span className={s.heroCaption}>
              <span className={s.no}>{catalogueNo(heroIndex)}</span>
              <span className={s.capTitle}>{hero.title}</span>
              <span className={s.capMeta}>{hero.ratio}</span>
            </span>
          </Link>
          <div className={s.details}>
            <div className={s.detailsNo}>{catalogueNo(heroIndex)}</div>
            <div className={s.detailsTitle}>{hero.title}</div>
            <dl className={s.detailsTable}>
              <div>
                <dt>PLACE</dt>
                <dd>{hero.place}</dd>
              </div>
              <div>
                <dt>DATE</dt>
                <dd>{hero.date}</dd>
              </div>
              <div>
                <dt>RATIO</dt>
                <dd>{hero.ratio} · uncropped</dd>
              </div>
            </dl>
            <Link href={`/gallery/${hero.id}`} className={s.boxLink}>
              <span>Open photograph</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* 01 A few recent frames */}
      <section className={s.section} aria-labelledby="h-frames">
        <div className={`${s.grid} ${s.head}`}>
          <span className={s.num}>01</span>
          <h2 id="h-frames" className={s.h2}>
            <span className={s.deskOnly}>A few recent frames</span>
            <span className={s.mobOnly}>Recent frames</span>
          </h2>
          <Link href="/gallery" className={`${s.headLink} ${s.deskOnly}`}>
            All photographs ↗
          </Link>
        </div>
        <div className={`${s.grid} ${s.frames}`}>
          {frames.map((p, i) => (
            <Link key={p.id} href={`/gallery/${p.id}`} className={`${s.frame} ${s[`f${i + 1}`]}`}>
              {p.image ? (
                <ContentImage image={p.image} className={s.img} sizes={FRAME_SIZES[i]} />
              ) : (
                <Placeholder w={p.w} h={p.h} label={p.ratio} deskLabel={`${p.ratio} · placeholder`} />
              )}
              <span className={s.frameCap}>
                <span className={s.no}>{catalogueNo(indexOf(p))}</span>
                <span className={s.capTitle}>{p.title}</span>
                <span className={`${s.capMeta} ${s.deskOnly}`}>{p.place}</span>
              </span>
            </Link>
          ))}
        </div>
        <Link href="/gallery" className={`${s.boxLink} ${s.mobOnly}`}>
          <span>All photographs</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </section>

      {/* 02 Journal | 03 Making */}
      <section className={`${s.grid} ${s.split}`}>
        <div className={s.half} aria-labelledby="h-journal" role="region">
          <div className={`${s.subgrid} ${s.head}`}>
            <span className={s.num}>02</span>
            <h2 id="h-journal" className={s.h2}>
              From the journal
            </h2>
            <Link href="/blog" className={`${s.headLink} ${s.deskOnly}`}>
              All ↗
            </Link>
          </div>
          <ul className={s.list}>
            {posts.slice(0, 3).map((e) => (
              <li key={e.slug}>
                <Link href={`/blog/${e.slug}`} className={s.entry}>
                  <span className={s.entryMeta}>
                    <span>{e.date}</span>
                    <span className={s.tag}>{e.tags[0] ?? '[tag]'}</span>
                  </span>
                  <span className={s.entryTitle}>{e.title} ↗</span>
                  <span className={`${s.entryExcerpt} ${s.deskOnly}`}>{e.excerpt}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={s.half} aria-labelledby="h-making" role="region">
          <div className={`${s.subgrid} ${s.head}`}>
            <span className={s.num}>03</span>
            <h2 id="h-making" className={s.h2}>
              Things I’m making
            </h2>
            <Link href="/lab" className={`${s.headLink} ${s.deskOnly}`}>
              All ↗
            </Link>
          </div>
          <ul className={s.list}>
            {projects.map((j) => (
              <li key={j.slug}>
                <Link href={`/lab/${j.slug}`} className={s.make}>
                  <span className={s.thumb}>
                    {j.img ? (
                      <ContentImage image={j.img} alt="" className={s.thumbImg} sizes="(max-width: 760px) 78px, 118px" />
                    ) : (
                      <span className={s.thumbPh} />
                    )}
                  </span>
                  <span className={s.makeText}>
                    <span className={s.kind}>{j.kind.toUpperCase()}</span>
                    <span className={s.makeName}>{j.name}</span>
                    <span className={s.makeOne}>{j.one}</span>
                    <span className={s.statusTag}>{j.status}</span>
                  </span>
                  <span className={`${s.arrow} ${s.deskOnly}`} aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Note to self */}
      <section className={`${s.grid} ${s.note}`} aria-label="Note to self">
        <p className={s.noteText}>
          Make it work. Then make it feel like something<span className={s.red}>.</span>
        </p>
        <p className={s.noteLabel}>
          <span>NOTE TO SELF</span>
          <span className={s.deskOnly}>— E.</span>
        </p>
      </section>

      {/* Two doors */}
      <section className={s.doors} aria-label="Lab and journal">
        <Link href="/lab" className={s.door}>
          <span className={s.doorHead}>
            <span className={s.square} aria-hidden="true" />
            04 / LAB
          </span>
          <span className={s.doorBody}>
            <span className={s.doorTitle}>Duruduygu Lab</span>
            <span className={s.doorText}>Small electronic objects and made-to-measure clothes, designed in Istanbul.</span>
            <span className={s.doorCta}>Visit the lab ↗</span>
          </span>
        </Link>
        <Link href="/blog" className={s.door}>
          <span className={s.doorHead}>
            <span className={s.square} aria-hidden="true" />
            05 / JOURNAL
          </span>
          <span className={s.doorBody}>
            <span className={s.doorTitle}>Thoughts &amp; stories</span>
            <span className={s.doorText}>New discoveries, projects, photography and thoughts along the way.</span>
            <span className={s.doorCta}>Read the journal ↗</span>
          </span>
        </Link>
      </section>

      {/* 06 Contact */}
      <section className={`${s.grid} ${s.contact}`} aria-labelledby="h-contact" id="contact">
        <span className={s.num}>06</span>
        <div className={s.contactHead}>
          <h2 id="h-contact" className={s.h2}>
            Contact
          </h2>
          <p className={s.contactText}>
            A commission, a collaboration, or just hello.<span className={s.deskOnly}> I reply within a week.</span>
          </p>
        </div>
        <ModernContactForm />
      </section>
    </div>
  )
}
