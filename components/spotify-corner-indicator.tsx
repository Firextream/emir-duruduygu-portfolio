"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SpotifyNowPlayingState {
  isPlaying: boolean
  title?: string
  artist?: string
  songUrl?: string
}

export function SpotifyCornerIndicator({ className }: { className?: string }) {
  const [track, setTrack] = useState<SpotifyNowPlayingState>({ isPlaying: false })

  useEffect(() => {
    let isMounted = true

    const fetchNowPlaying = async () => {
      try {
        const response = await fetch("/api/spotify/now-playing", { cache: "no-store" })
        if (!response.ok) return

        const data = (await response.json()) as SpotifyNowPlayingState
        if (isMounted) {
          setTrack(data)
        }
      } catch {
        if (isMounted) {
          setTrack({ isPlaying: false })
        }
      }
    }

    void fetchNowPlaying()
    const intervalId = window.setInterval(() => {
      void fetchNowPlaying()
    }, 30000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  const isActive = Boolean(track.isPlaying && track.songUrl)
  const nowPlayingText =
    track.title && track.artist ? `${track.title} - ${track.artist}` : track.title || "Listening on Spotify"
  const shouldScroll = nowPlayingText.length > 28

  return (
    <a
      href={isActive ? track.songUrl : undefined}
      target={isActive ? "_blank" : undefined}
      rel={isActive ? "noopener noreferrer" : undefined}
      tabIndex={isActive ? 0 : -1}
      aria-label={isActive ? `Now playing: ${nowPlayingText}` : "Spotify not active"}
      title={nowPlayingText}
      className={cn(
        "fixed bottom-6 right-6 md:bottom-44 z-40 flex h-9 w-[220px] items-center gap-2 rounded-full border border-border bg-background/85 px-3 text-[11px] font-mono tracking-wide text-foreground/85 backdrop-blur-sm transition-all duration-300 md:w-[280px]",
        isActive ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="relative block flex-1 overflow-hidden text-foreground/80">
        {shouldScroll ? (
          <span
            className="flex min-w-max items-center gap-4 animate-marquee"
            style={{ animationDuration: "12s" }}
            aria-hidden="true"
          >
            <span className="whitespace-nowrap">{nowPlayingText}</span>
            <span className="opacity-40">·</span>
            <span className="whitespace-nowrap">{nowPlayingText}</span>
          </span>
        ) : (
          <span className="whitespace-nowrap">{nowPlayingText}</span>
        )}
      </span>
    </a>
  )
}
