'use client'

// Headless video player shared by every skin's video posts (README "Video posts").
// Without a URL (placeholder data) it behaves like the references: Play toggles, chapters highlight
// and move the clock. With a URL it loads a click-to-play embed — privacy-enhanced YouTube, Vimeo
// (do-not-track) or a self-hosted file — and the chapter list seeks it.
import { useCallback, useRef, useState } from 'react'
import type { Video } from '@/lib/content/types'

type Embed = { type: 'youtube' | 'vimeo'; id: string } | { type: 'file'; src: string }

export function parseEmbed(video: Video): Embed | null {
  const url = video.url?.trim()
  if (!url) return null
  const yt = /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(url)
  if (yt) return { type: 'youtube', id: yt[1] }
  const vm = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url)
  if (vm) return { type: 'vimeo', id: vm[1] }
  if (/\.(mp4|webm|ogg|m3u8)(\?|$)/i.test(url) || video.host.toLowerCase() === 'file') return { type: 'file', src: url }
  return null
}

export function useVideoPlayer(video: Video) {
  const embed = parseEmbed(video)
  const chapters = video.chapters
  const [playing, setPlaying] = useState(false)
  const [chapter, setChapter] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [start, setStart] = useState(0)
  const frame = useRef<HTMLIFrameElement>(null)
  const media = useRef<HTMLVideoElement>(null)

  const post = useCallback(
    (message: object) => {
      const win = frame.current?.contentWindow
      if (!win || !embed) return
      const origin = embed.type === 'youtube' ? 'https://www.youtube-nocookie.com' : 'https://player.vimeo.com'
      win.postMessage(JSON.stringify(message), origin)
    },
    [embed],
  )

  const seek = useCallback(
    (sec: number) => {
      if (!embed) return
      if (embed.type === 'file' && media.current) {
        media.current.currentTime = sec
        void media.current.play()
      } else if (embed.type === 'youtube') {
        post({ event: 'command', func: 'seekTo', args: [sec, true] })
        post({ event: 'command', func: 'playVideo', args: [] })
      } else if (embed.type === 'vimeo') {
        post({ method: 'setCurrentTime', value: sec })
        post({ method: 'play' })
      }
    },
    [embed, post],
  )

  const toggle = useCallback(() => {
    if (embed && !loaded) {
      setLoaded(true)
      setPlaying(true)
      return
    }
    setPlaying((p) => !p)
  }, [embed, loaded])

  const selectChapter = useCallback(
    (i: number) => {
      setChapter(i)
      setPlaying(true)
      const sec = chapters[i]?.seconds
      if (!embed || sec == null) return
      if (!loaded) {
        setStart(sec)
        setLoaded(true)
      } else seek(sec)
    },
    [chapters, embed, loaded, seek],
  )

  const active = playing ? chapter : -1
  const clock = `${playing && chapters[chapter] ? chapters[chapter].time : '00:00'} / ${video.duration}`
  const progress = playing && chapters.length ? Math.round(((chapter + 0.35) / chapters.length) * 100) : 0

  /** The embed itself, absolutely filling its 16:9 parent once the visitor presses play. */
  const player =
    embed && loaded ? (
      embed.type === 'file' ? (
        <video
          ref={media}
          src={start ? `${embed.src}#t=${start}` : embed.src}
          controls
          autoPlay
          playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#000' }}
        />
      ) : (
        <iframe
          ref={frame}
          title="Video player"
          src={
            embed.type === 'youtube'
              ? `https://www.youtube-nocookie.com/embed/${embed.id}?autoplay=1&enablejsapi=1&rel=0&playsinline=1&start=${start}`
              : `https://player.vimeo.com/video/${embed.id}?autoplay=1&dnt=1#t=${start}s`
          }
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      )
    ) : null

  return { playing, chapter, active, loaded, hasEmbed: !!embed, toggle, selectChapter, clock, progress, player }
}
