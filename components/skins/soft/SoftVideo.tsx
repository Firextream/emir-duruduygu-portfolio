'use client'

// Soft Club video (README "Video posts"): 16:9 #162033 screen, 112px aqua play disc, 360px chapter
// tracklist; "Watch on YouTube ↗" only when video.url is set.
import ContentImage from '@/components/site/ContentImage'
import { useVideoPlayer } from '@/components/site/useVideoPlayer'
import type { Video } from '@/lib/content/types'
import s from './SPost.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

export default function SoftVideo({ video }: { video: Video }) {
  const v = useVideoPlayer(video)
  return (
    <section className={s.video} aria-label="Video">
      <div className={s.screen}>
        {video.poster && !v.loaded && (
          <ContentImage image={video.poster} alt="" className={s.poster} eager sizes="(max-width: 760px) 100vw, 70vw" />
        )}
        {v.player ?? (
          <>
            <button type="button" className={s.disc} onClick={v.toggle} aria-label={v.playing ? 'Pause' : 'Play'}>
              {v.playing ? '❚❚' : '▶'}
            </button>
            <div className={s.screenFoot}>
              <span className={s.clock}>{v.clock}</span>
              <span className={s.deskOnly}>
                {v.playing ? `playing · chapter ${pad(v.chapter + 1)}` : `poster frame · placeholder · ${video.host}`}
              </span>
            </div>
            <div className={s.track} aria-hidden="true">
              <div className={s.trackFill} style={{ width: `${v.progress}%` }} />
            </div>
          </>
        )}
      </div>
      <div className={s.chapters}>
        <div className={`${s.chapHead} ${s.deskOnly}`}>
          <span>chapters · 章</span>
          <span>{pad(video.chapters.length)} chapters</span>
        </div>
        <ol className={s.chapList}>
          {video.chapters.map((c, i) => (
            <li key={i}>
              <button type="button" className={s.chapter} aria-current={v.active === i ? 'true' : undefined} onClick={() => v.selectChapter(i)}>
                <span className={s.chapTime}>{c.time}</span>
                <span className={s.chapTitle}>{c.title}</span>
              </button>
            </li>
          ))}
        </ol>
        {video.url && (
          <a href={video.url} target="_blank" rel="noopener noreferrer" className={s.watch}>
            <span>Watch on {video.host}</span>
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </section>
  )
}
