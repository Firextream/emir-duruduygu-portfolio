export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation placeholder */}
      <div className="h-16 border-b border-border" />
      
      <div className="flex-1 pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Page Header Skeleton */}
          <div className="mb-10 sm:mb-16 lg:mb-24">
            <div className="h-4 w-16 bg-muted animate-pulse rounded mb-3" />
            <div className="h-12 w-64 bg-muted animate-pulse rounded mb-4" />
            <div className="h-6 w-96 max-w-full bg-muted animate-pulse rounded" />
          </div>

          {/* Featured Post Skeleton */}
          <div className="mb-10 sm:mb-16 lg:mb-24 pb-10 sm:pb-16 lg:pb-24 border-b border-border">
            <div className="h-3 w-20 bg-muted animate-pulse rounded mb-6" />
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="aspect-[4/3] bg-muted animate-pulse rounded" />
              <div className="flex flex-col justify-center space-y-4">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded" />
                <div className="h-20 w-full bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>

          {/* Posts List Skeleton */}
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-6 pb-8 border-b border-border">
                <div className="w-32 h-24 bg-muted animate-pulse rounded flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

