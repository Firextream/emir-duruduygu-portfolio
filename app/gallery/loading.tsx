import { Skeleton } from "@/components/ui/skeleton"

export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-24 pb-16">
        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-2" />
          <Skeleton className="h-6 w-80 mx-auto" />
        </div>

        {/* Filter Skeleton */}
        <div className="flex justify-center gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>

        {/* Gallery Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => {
            const heights = ["aspect-[4/3]", "aspect-[3/4]", "aspect-square", "aspect-[5/4]"]
            const height = heights[i % heights.length]
            
            return (
              <Skeleton
                key={i}
                className={`${height} w-full rounded-lg animate-pulse`}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
