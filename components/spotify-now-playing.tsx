"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Music, Pause, ExternalLink } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface SpotifyTrack {
  isPlaying: boolean
  title: string
  artist: string
  album: string
  albumImageUrl: string
  songUrl: string
}

interface SpotifyNowPlayingProps {
  className?: string
  variant?: "default" | "minimal" | "card"
}

// Note: This requires setting up Spotify API credentials
// Follow: https://leerob.io/blog/spotify-api-nextjs

export function SpotifyNowPlaying({ className, variant = "default" }: SpotifyNowPlayingProps) {
  const [track, setTrack] = useState<SpotifyTrack | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/spotify/now-playing')
        if (res.ok) {
          const data = await res.json()
          setTrack(data)
        }
      } catch (error) {
        console.log('Spotify not connected')
      } finally {
        setLoading(false)
      }
    }

    fetchNowPlaying()
    // Refresh every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-muted rounded" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
        </div>
      </div>
    )
  }

  // Not playing anything
  if (!track || !track.isPlaying) {
    return (
      <div className={cn("flex items-center gap-3 text-muted-foreground", className)}>
        <Music className="w-5 h-5" />
        <span className="text-sm">Not playing</span>
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group",
          className
        )}
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
        </span>
        <span className="truncate max-w-[200px]">{track.title}</span>
        <span className="text-muted-foreground/50">—</span>
        <span className="truncate max-w-[150px] text-muted-foreground/70">{track.artist}</span>
      </a>
    )
  }

  if (variant === "card") {
    return (
      <motion.a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "block p-4 bg-secondary/50 border border-border rounded-xl hover:bg-secondary transition-colors group",
          className
        )}
      >
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={track.albumImageUrl}
              alt={track.album}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Pause className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs text-green-500 font-medium uppercase tracking-wider">Now Playing</span>
            </div>
            <h4 className="font-medium text-foreground truncate">{track.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
          </div>
          
          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.a>
    )
  }

  // Default variant
  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-4 group",
        className
      )}
    >
      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
        <Image
          src={track.albumImageUrl}
          alt={track.album}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <h4 className="font-medium text-foreground truncate group-hover:text-accent transition-colors">
            {track.title}
          </h4>
        </div>
        <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
      </div>
    </a>
  )
}

// Placeholder component when Spotify is not configured
export function SpotifyPlaceholder({ className }: { className?: string }) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 bg-secondary/50 border border-border rounded-xl",
      className
    )}>
      <div className="w-12 h-12 bg-[#1DB954] rounded-lg flex items-center justify-center">
        <Music className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Spotify</p>
        <p className="text-xs text-muted-foreground">Connect to show what I'm listening to</p>
      </div>
    </div>
  )
}
