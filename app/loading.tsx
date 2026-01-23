export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation placeholder */}
      <div className="h-16 border-b border-border" />
      
      <main className="flex-1">
        {/* Hero Section Skeleton */}
        <section className="relative min-h-screen flex flex-col">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 pt-20 lg:pt-0">
            {/* Left Column */}
            <div className="flex flex-col justify-center px-5 sm:px-6 lg:px-12 py-8 lg:py-24">
              <div className="max-w-xl space-y-8">
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                <div className="space-y-2">
                  <div className="h-16 w-64 bg-muted animate-pulse rounded" />
                  <div className="h-16 w-80 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-20 w-full max-w-md bg-muted animate-pulse rounded" />
                <div className="flex gap-6 pt-4">
                  <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
            
            {/* Right Column - Image placeholder */}
            <div className="relative h-[50vh] lg:h-auto bg-muted animate-pulse" />
          </div>
          
          {/* Marquee placeholder */}
          <div className="border-y border-border py-4 bg-secondary/30">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
          </div>
        </section>

        {/* Latest Posts Section Skeleton */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-12" />
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/3] bg-muted animate-pulse rounded" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-full bg-muted animate-pulse rounded" />
                  <div className="h-16 w-full bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
