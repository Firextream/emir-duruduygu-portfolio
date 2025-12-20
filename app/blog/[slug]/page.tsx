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
  image?: string | null
  featured?: boolean
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Suspense fallback={<div className="h-6 w-24 animate-pulse bg-muted rounded" />}>
          <ScrollReveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
              aria-label="Return to blog listing"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </ScrollReveal>
        </Suspense>

        <ScrollReveal delay={0.1}>
          <header className="mb-8">
            <BlogPostMeta post={post} className="mb-4" />
            
            <h1 className="text-4xl md:text-5xl font-light text-balance mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
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
              />
            ) : (
              <Image
                src={getAssetPath(post.image)}
                alt={`Featured image for ${post.title}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
              />
            )}
          </div>
        )}

        <ScrollReveal delay={0.3}>
          <BlogPostContent content={post.content} />
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <footer className="mt-16 pt-8 border-t border-border">
            <BlogPostAuthor 
              author={post.author} 
              date={post.date}
              authorTitle={post.authorTitle}
              className="mb-8" 
            />

            <div className="flex items-center justify-between">
              {post.date && (
                <p className="text-sm text-muted-foreground">
                  Published on {formatDate(post.date)}
                </p>
              )}
              <Link 
                href="/blog" 
                className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                aria-label="Read more articles"
              >
                Read more articles →
              </Link>
            </div>
          </footer>
        </ScrollReveal>
      </div>
    </main>
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
    
    console.log("Generated static params for slugs:", slugs.map(s => s.slug))
    
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
