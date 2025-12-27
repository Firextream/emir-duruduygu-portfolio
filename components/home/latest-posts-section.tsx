import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface Post {
  id: string
  slug: string
  title: string
  excerpt?: string
  cover?: string
  date?: string
  tags: string[]
  readTime?: number
}

interface LatestPostsSectionProps {
  posts: Post[]
}

export function LatestPostsSection({ posts }: LatestPostsSectionProps) {
  if (posts.length === 0) return null

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-16">
          <div className="space-y-4">
            <span className="font-mono text-sm tracking-wider text-accent uppercase">
              Journal
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
              Latest Thoughts
            </h2>
          </div>
          
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-3 text-foreground font-medium group"
          >
            <span className="relative">
              View all
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
            </span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Editorial Post List */}
        <div className="space-y-0 divide-y divide-border">
          {posts.map((post, index) => (
            <Link 
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block py-8 md:py-12"
            >
              <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                {/* Index Number */}
                <div className="col-span-2 md:col-span-1">
                  <span className="font-mono text-3xl md:text-4xl text-muted-foreground/30 group-hover:text-accent transition-colors duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                
                {/* Content */}
                <div className="col-span-10 md:col-span-8 space-y-3">
                  <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-muted-foreground text-base md:text-lg line-clamp-2 max-w-2xl">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                
                {/* Meta */}
                <div className="col-span-12 md:col-span-3 flex md:flex-col md:items-end gap-4 md:gap-2 mt-2 md:mt-0">
                  {post.date && (
                    <span className="font-mono text-sm text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  )}
                  {post.readTime && (
                    <span className="font-mono text-sm text-muted-foreground">
                      {post.readTime} min read
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <Link
          href="/blog"
          className="flex md:hidden items-center justify-center gap-2 text-foreground font-medium mt-12 group"
        >
          <span className="relative">
            View all posts
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
          </span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </section>
  )
}
