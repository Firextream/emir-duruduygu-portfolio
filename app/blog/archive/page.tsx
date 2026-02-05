import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getAllPosts } from "@/lib/notion"
import { Calendar, ChevronRight, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog Archive",
  description: "Browse all blog posts organized by year.",
}

export const dynamic = 'force-dynamic'

interface PostsByYear {
  [year: string]: {
    id: string
    title: string
    slug: string
    date: string | null
    category?: string
  }[]
}

export default async function ArchivePage() {
  const posts = await getAllPosts()
  
  // Group posts by year
  const postsByYear: PostsByYear = {}
  
  posts
    .filter((post): post is NonNullable<typeof post> => post !== null && post.date !== null)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .forEach(post => {
      const year = new Date(post.date!).getFullYear().toString()
      if (!postsByYear[year]) {
        postsByYear[year] = []
      }
      postsByYear[year].push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        date: post.date,
        category: post.category
      })
    })

  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a))
  const totalPosts = posts.filter(p => p !== null).length

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Page Header */}
          <div className="mb-12 sm:mb-16">
            <div className="flex items-center gap-2 mb-4">
              <Link 
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">Archive</span>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-accent" />
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground">
                Archive
              </h1>
            </div>
            
            <p className="text-muted-foreground">
              All {totalPosts} posts, organized by year.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 sm:left-8 top-0 bottom-0 w-px bg-border" />
            
            {years.map((year, yearIndex) => (
              <div key={year} className="relative mb-12 last:mb-0">
                {/* Year marker */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative z-10 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-accent flex items-center justify-center sm:ml-5">
                    <div className="w-2 h-2 rounded-full bg-background" />
                  </div>
                  <h2 className="font-mono text-xl sm:text-2xl font-bold text-foreground">
                    {year}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    ({postsByYear[year].length} posts)
                  </span>
                </div>
                
                {/* Posts for this year */}
                <div className="ml-8 sm:ml-20 space-y-4">
                  {postsByYear[year].map((post, postIndex) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group block p-4 -mx-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-20 sm:w-24">
                          <span className="font-mono text-sm text-muted-foreground">
                            {post.date && new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          {post.category && (
                            <span className="inline-block mt-1 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                              {post.category}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {years.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No posts yet.</p>
              <Link 
                href="/blog"
                className="inline-block mt-4 text-accent hover:underline"
              >
                Back to Blog
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
