import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal-enhanced"
import { getPostBySlug, getAllPosts } from "@/lib/notion"
import { formatDate } from "@/lib/date-utils"
import { getAssetPath } from "@/lib/image-utils"
import { 
  BlogPostMeta, 
  BlogPostAuthor, 
  BlogPostContent 
} from "@/components/blog-post-components"
import { ReadingProgress } from "@/components/reading-progress"
import { RelatedPosts } from "@/components/blog/related-posts"
import { Navigation } from "@/components/navigation"
import { ShareButton } from "@/components/share-button"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { StructuredData, BreadcrumbStructuredData } from "@/lib/structured-data"

// ISR with 60 second revalidation for better performance
export const revalidate = 60

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

interface Post {
  id: string
  title: string
  slug: string
  date?: string | null
  excerpt?: string
  readTime?: string
  content?: string
  category?: string
  author?: string
  authorTitle?: string
  authorImage?: string | null
  image?: string | null
  featured?: boolean
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts()
  ])

  if (!post) {
    notFound()
  }

  // Get related posts from the same category
  const relatedPosts = allPosts
    .filter(p => p && p.id !== post.id && (p.category === post.category || !post.category))
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      image: p.image,
      category: p.category
    }))

  return (
    <>
      <StructuredData 
        type="article" 
        data={{
          title: post.title,
          description: post.excerpt,
          image: post.image,
          datePublished: post.date,
          author: post.author,
          url: `/blog/${post.slug}`
        }} 
      />
      <BreadcrumbStructuredData 
        items={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` }
        ]} 
      />
      <Navigation />
      <ReadingProgress />
      <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
        <Suspense fallback={<div className="h-6 w-24 animate-pulse bg-muted rounded" />}>
          <ScrollReveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8 group"
              aria-label="Return to blog listing"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </ScrollReveal>
        </Suspense>

        <ScrollReveal delay={0.1}>
          <header className="mb-6 sm:mb-8">
            <BlogPostMeta post={post} className="mb-3 sm:mb-4" />
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-balance mb-4 sm:mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>
        </ScrollReveal>

        {post.image && (
          <div className="relative aspect-[16/9] mb-12 overflow-hidden rounded-lg bg-muted">
            {post.image.startsWith('http') ? (
              <img
                src={post.image}
                alt={`Featured image for ${post.title}`}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <Image
                src={getAssetPath(post.image)}
                alt={`Featured image for ${post.title}`}
                fill
                className="object-cover"
                priority
                fetchPriority="high"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
              />
            )}
          </div>
        )}

        {/* Table of Contents */}
        <ScrollReveal delay={0.25}>
          <TableOfContents content={post.content} className="mb-8" />
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <BlogPostContent content={post.content} />
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <footer className="mt-8 pt-8 border-t border-border">
            <BlogPostAuthor 
              author={post.author} 
              date={post.date}
              authorTitle={post.authorTitle}
              authorImage={post.authorImage}
              className="mb-8" 
            />

            <div className="flex items-center justify-between">
              {post.date && (
                <p className="text-sm text-muted-foreground">
                  Published on {formatDate(post.date)}
                </p>
              )}
              <div className="flex items-center gap-6">
                <ShareButton title={post.title} />
                <Link 
                  href="/blog" 
                  className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                  aria-label="Read more articles"
                >
                  Read more articles →
                </Link>
              </div>
            </div>
          </footer>
        </ScrollReveal>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <ScrollReveal delay={0.5}>
            <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
          </ScrollReveal>
        )}
      </div>
    </main>
    </>
  )
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if (!post) {
      return {
        title: "Article Not Found",
        description: "The requested article could not be found.",
      }
    }

    const title = `${post.title} | Architecture Blog`
    const description = post.excerpt || "Read this article on our architecture blog"

    return {
      title,
      description,
      authors: post.author ? [{ name: post.author }] : undefined,
      openGraph: {
        title,
        description,
        type: "article",
        images: post.image ? [{ url: post.image, alt: post.title }] : [],
        publishedTime: post.date || undefined,
        authors: post.author ? [post.author] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: post.image ? [post.image] : undefined,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Blog Article",
      description: "Architecture blog article",
    }
  }
}

export async function generateStaticParams() {
  try {
    // Get all posts from Notion (or mock data) to generate all possible slugs
    const posts = await getAllPosts()
    
    // Extract slugs from all posts
    const slugs = posts
      .filter((post): post is NonNullable<typeof post> => post !== null && post.slug !== undefined)
      .map((post) => ({
        slug: post.slug,
      }))
    
    return slugs
  } catch (error) {
    console.error("Error generating static params for blog posts:", error)
    // Fallback to mock slugs if there's an error
    return [
      { slug: "future-sustainable-architecture" },
      { slug: "light-shadow-architecture" },
      { slug: "minimalist-design-principles" },
      { slug: "urban-planning-trends-2024" }
    ]
  }
}
