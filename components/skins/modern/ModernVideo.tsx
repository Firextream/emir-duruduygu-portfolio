'use client'

// Modernist video block (README "Video posts"): 16:9 #201e1d in cols 1–8, 4px progress rule on top,
// red flush-left Play bar bottom-left, chapter table in cols 9–12 with 2px rules.
import ContentImage from '@/components/site/ContentImage'
import { useVideoPlayer } from '@/components/site/useVideoPlayer'
import type { Video } from '@/lib/content/types'
import s from './OPost.module.css'

export default function ModernVideo({ video }: { video: Video }) {
  const v = useVideoPlayer(video)
  return (
    <section className={s.video} aria-label="Video">
      <div className={s.screen}>
        {video.poster && !v.loaded && (
          <ContentImage image={video.poster} alt="" className={s.poster} eager sizes="(max-width: 760px) 100vw, 66vw" />
        )}
        {v.player ?? (
          <>
            <div className={s.track} aria-hidden="true">
              <div className={s.trackFill} style={{ width: `${v.progress}%` }} />
            </div>
            {!video.poster && <span className={s.posterLabel}>POSTER FRAME · PLACEHOLDER</span>}
            <button type="button" className={s.play} onClick={v.toggle} aria-pressed={v.playing}>
              <span aria-hidden="true">{v.playing ? '❚❚' : '▶'}</span>
              <span>{v.playing ? 'Pause' : 'Play'}</span>
            </button>
            <span className={s.clock}>{v.clock}</span>
          </>
        )}
      </div>
      <div className={s.chapters}>
        <div className={s.chapHead}>
          <span>CHAPTERS</span>
          <span>
            {video.host} · {video.duration}
          </span>
        </div>
        <ol>
          {video.chapters.map((c, i) => (
            <li key={i}>
              <button type="button" className={s.chapter} aria-current={v.active === i ? 'true' : undefined} onClick={() => v.selectChapter(i)}>
                <span className={s.chapTime}>{c.time}</span>
                <span>{c.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
