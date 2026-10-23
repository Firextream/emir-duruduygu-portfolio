// Original Home — OrigHome.dc.html: a 720/720 hero (kicker, "Capturing" over the typewriter line,
// intro, Lab / contact links, SCROLL cue | the full-height home photo — no caption card, client decision)
// over a tag marquee; Selected Work; Latest Thoughts; Philosophy; Newsletter.
// Mobile stacks the hero: headline → text → 3:2 photo → marquee.
import Link from 'next/link'
import ContentImage from '@/components/site/ContentImage'
import type { HomeData } from '@/lib/routes/home'
import { ORIGINAL_TAGS } from '@/lib/skins'
import Marquee from './Marquee'
import OrigNewsletter from './OrigNewsletter'
import SelectedWork from './SelectedWork'
import Typewriter from './Typewriter'
import s from './OrigHome.module.css'

const PHRASES = ['Light & Shadow', 'Hidden Detail'] as const
const pad = (n: number) => String(n).padStart(2, '0')

export default function OrigHome({ hero, photos, posts }: HomeData) {
  return (
    <div>
      <section className={s.hero}>
        <div className={s.heroText}>
          <p className={s.kicker}>VISUAL STORYTELLER &amp; PHOTOGRAPHER</p>
          <h1 className={s.h1}>
            <span className={s.capturing}>Capturing</span>
            <Typewriter phrases={PHRASES} />
          </h1>
          <p className={s.intro}>
            Amateur photographer and curious explorer. Capturing architecture, street moments, and anything that sparks inspiration
            <span className={s.deskOnly}> — structure, light, and the unexpected</span>.
          </p>
          <div className={s.heroLinks}>
            <Link href="/lab" className={s.labLink}>
              Visit the Lab
            </Link>
            <span className={s.rule} aria-hidden="true" />
            <Link href="/about#contact" className={s.touchLink}>
              Get in touch
            </Link>
          </div>
          <a href="#selected-work" className={s.scroll}>
            <span className={s.scrollLabel}>SCROLL</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        {hero && (
          // the home photo is the one cover-cropped photo here (README: same exception as the other heroes)
          <Link href={`/gallery/${hero.id}`} className={s.heroPhoto} data-allow-crop="">
            <span className={s.heroFrame}>
              {hero.image ? (
                <ContentImage image={hero.image} className={s.heroImg} sizes="(max-width: 760px) 100vw, 50vw" priority />
              ) : (
                <span className={s.heroPh} />
              )}
            </span>
          </Link>
        )}

        <Marquee tags={ORIGINAL_TAGS} className={s.marquee} />
      </section>

      {photos.length > 0 && <SelectedWork photos={photos.slice(0, 7)} />}

      {posts.length > 0 && (
        <section className={s.thoughts} aria-labelledby="latest-thoughts">
          <div className={s.thoughtsHead}>
            <div>
              <p className={s.kicker2}>JOURNAL</p>
              <h2 id="latest-thoughts" className={s.bigH2}>
                Latest Thoughts
              </h2>
            </div>
            <Link href="/blog" className={`${s.viewAll} ${s.deskOnly}`}>
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className={s.posts}>
            {posts.slice(0, 3).map((e, i) => (
              <li key={e.slug}>
                <Link href={`/blog/${e.slug}`} className={s.post}>
                  <span className={`${s.postNo} ${i === 0 ? s.postNoFirst : ''}`}>{pad(i + 1)}</span>
                  <span className={s.postText}>
                    <span className={s.postTitle}>{e.title}</span>
                    <span className={s.postExcerpt}>{e.excerpt}</span>
                  </span>
                  <span className={s.postMeta}>
                    <span>{e.date}</span>
                    <span className={s.metaSep} aria-hidden="true">
                      ·
                    </span>
                    <span>{e.read}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/blog" className={`${s.viewAll} ${s.mobOnly}`}>
            View all <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}

      <section className={s.philosophy} aria-label="Philosophy">
        <p className={s.quoteMark} aria-hidden="true">
          &quot;
        </p>
        <p className={s.kicker2}>PHILOSOPHY</p>
        <blockquote className={s.quote}>Just capturing things that catch my eye.</blockquote>
        <p className={s.cite}>— Duruduygu</p>
      </section>

      <section className={s.newsletter} aria-labelledby="newsletter">
        <div>
          <p className={s.kicker2}>NEWSLETTER</p>
          <h2 id="newsletter" className={s.newsH2}>
            Join the journey — stories, updates, and new work
          </h2>
          <p className={`${s.newsText} ${s.deskOnly}`}>
            Occasional thoughts on photography, creative process, and the spaces in between. Based in Istanbul, exploring everywhere.
          </p>
        </div>
        <OrigNewsletter />
      </section>
    </div>
  )
}
