import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
  aspectRatio?: "square" | "video" | "portrait"
}

export function SkeletonCard({ className, aspectRatio = "video" }: SkeletonCardProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]"
  }

  return (
    <div className={cn("animate-pulse", className)}>
      <div className={cn("bg-secondary/80 rounded-none", aspectClasses[aspectRatio])} />
      <div className="space-y-3 pt-4">
        <div className="h-2 w-16 bg-secondary/60 rounded" />
        <div className="h-4 w-3/4 bg-secondary/80 rounded" />
        <div className="h-3 w-full bg-secondary/60 rounded" />
        <div className="h-3 w-2/3 bg-secondary/60 rounded" />
      </div>
    </div>
  )
}

export function SkeletonText({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("animate-pulse space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-secondary/60 rounded" 
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  )
}

export function SkeletonImage({ className, aspectRatio = "video" }: SkeletonCardProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]"
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-secondary/50",
        aspectClasses[aspectRatio],
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/30 to-transparent skeleton-shimmer" />
    </div>
  )
}
