import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/lib/notion"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlogList } from "@/components/blog/blog-list"
import { PostCard } from "@/components/post-card"
import { Archive, Rss } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on photography, process, gear, and the spaces between frames.",
}

// Force dynamic rendering to ensure env vars are available at runtime
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BlogPage() {
  const posts = await getAllPosts()
  
  // Filter out null posts and transform to expected format
  const validPosts = posts
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      date: post.date || null,
      category: post.category || "Uncategorized",
      image: post.image || null,
      readTime: post.readTime || "5 min read",
      featured: post.featured || false,
      tags: post.category ? [post.category] : [],
      cover: post.image || undefined
    }))

  // Get featured post
  const featuredPost = validPosts.find(p => p.featured)
  
  // Get unique categories
  const categories = [...new Set(validPosts.map(p => p.category).filter(Boolean))]
  
  // Exclude featured post from regular list
  const regularPosts = featuredPost 
    ? validPosts.filter((p) => p.id !== featuredPost.id)
    : validPosts

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Page Header */}
          <div className="mb-10 sm:mb-16 lg:mb-24">
            <span className="font-mono text-xs sm:text-sm tracking-wider text-accent uppercase block mb-3 sm:mb-4">
              Journal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 sm:mb-6">
              Thoughts & Stories
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mb-6">
              New discoveries, projects, photography, and thoughts on various topics along the way.
            </p>
            
            {/* Quick Links */}
            <div className="flex items-center gap-4 text-sm">
              <Link 
                href="/blog/archive"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
              >
                <Archive className="w-4 h-4" />
                Archive
              </Link>
              <span className="text-border">|</span>
              <a 
                href="/feed.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
              >
                <Rss className="w-4 h-4" />
                RSS Feed
              </a>
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-10 sm:mb-16 lg:mb-24 pb-10 sm:pb-16 lg:pb-24 border-b border-border">
              <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase mb-4 sm:mb-6 block">
                Featured
              </span>
              <PostCard post={featuredPost} variant="featured" />
            </div>
          )}

          {/* Posts List with Filters */}
          <BlogList posts={regularPosts} categories={categories} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
