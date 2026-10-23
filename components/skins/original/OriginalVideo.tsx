'use client'

// Original video (README "Video posts"): a 16:9 #171614 screen with a white round play button, the
// current chapter · host bottom-left, the length bottom-right and a 3px accent progress line; a
// CHAPTERS list beside it (below on mobile) that seeks.
import ContentImage from '@/components/site/ContentImage'
import { useVideoPlayer } from '@/components/site/useVideoPlayer'
import type { Video } from '@/lib/content/types'
import s from './OrigPost.module.css'

export default function OriginalVideo({ video }: { video: Video }) {
  const v = useVideoPlayer(video)
  const current = video.chapters[v.chapter]
  return (
    <section className={s.video} aria-label="Video">
      <div className={s.screen}>
        {video.poster && !v.loaded && (
          <ContentImage image={video.poster} alt="" className={s.poster} eager sizes="(max-width: 760px) 100vw, 60vw" />
        )}
        {v.player ?? (
          <>
            <button type="button" className={s.play} onClick={v.toggle} aria-label={v.playing ? 'Pause' : 'Play'}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%" aria-hidden="true">
                {v.playing ? (
                  <>
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </>
                ) : (
                  <polygon points="7 4 20 12 7 20 7 4" />
                )}
              </svg>
            </button>
            <span className={`${s.screenLeft} ${s.deskOnly}`}>
              {current?.time ?? v.clock} · {video.host}
            </span>
            <span className={`${s.screenRight} ${s.deskOnly}`}>{video.duration}</span>
            <div className={s.track} aria-hidden="true">
              <div className={s.trackFill} style={{ width: `${v.progress}%` }} />
            </div>
          </>
        )}
      </div>
      <div className={s.chapters}>
        <p className={`${s.chapHead} ${s.deskOnly}`}>CHAPTERS</p>
        <ol className={s.chapList}>
          {video.chapters.map((c, i) => (
            <li key={i}>
              <button type="button" className={s.chapter} aria-current={v.chapter === i ? 'true' : undefined} onClick={() => v.selectChapter(i)}>
                <span className={s.chapTime}>{c.time}</span>
                <span className={s.chapTitle}>{c.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
