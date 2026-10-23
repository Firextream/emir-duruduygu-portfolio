'use client'

// Quiet video (README "Video posts"): a "player — slug.mp4" window, 16:9 screen #2a2b2c, accent square
// play button, 320px chapters column.
import ContentImage from '@/components/site/ContentImage'
import { useVideoPlayer } from '@/components/site/useVideoPlayer'
import type { Video } from '@/lib/content/types'
import s from './QPost.module.css'

export default function QuietVideo({ video, slug }: { video: Video; slug: string }) {
  const v = useVideoPlayer(video)
  return (
    <div className={s.player}>
      <div className={s.playerBar}>
        <span aria-hidden="true">▶</span>
        <span>player — {slug}.mp4</span>
        <span className={s.playerMeta}>
          {video.host} · {video.duration}
        </span>
      </div>
      <div className={s.playerGrid}>
        <div className={s.screen}>
          {video.poster && !v.loaded && (
            <ContentImage image={video.poster} alt="" className={s.poster} eager sizes="(max-width: 760px) 100vw, 60vw" />
          )}
          {v.player ?? (
            <>
              <button type="button" className={s.play} onClick={v.toggle} aria-label={v.playing ? 'Pause' : 'Play'}>
                {v.playing ? '❚❚' : '▶'}
              </button>
              <span className={s.clock}>{v.clock}</span>
              {!video.poster && <span className={s.posterLabel}>poster frame · placeholder</span>}
              <div className={s.track} aria-hidden="true">
                <div className={s.trackFill} style={{ width: `${v.progress}%` }} />
              </div>
            </>
          )}
        </div>
        <div className={s.chapters}>
          <div className={s.chapHead}>chapters</div>
          <ol>
            {video.chapters.map((c, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={s.chapter}
                  aria-current={v.active === i ? 'true' : undefined}
                  onClick={() => v.selectChapter(i)}
                >
                  <span className={s.chapTime}>{c.time}</span>
                  <span>{c.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
