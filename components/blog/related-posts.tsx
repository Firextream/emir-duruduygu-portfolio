import Link from "next/link"
import Image from "next/image"

interface RelatedPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  image?: string | null
  category?: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
  currentPostId: string
}

export function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
  // Filter out current post and take up to 3
  const relatedPosts = posts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3)

  if (relatedPosts.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
        Related Articles
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link 
            key={post.id} 
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="space-y-3">
              {/* Image */}
              {post.image && (
                <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-lg">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              
              {/* Category */}
              {post.category && (
                <span className="text-xs font-mono tracking-wider text-accent uppercase">
                  {post.category}
                </span>
              )}
              
              {/* Title */}
              <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors line-clamp-2">
                {post.title}
              </h3>
              
              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              )}
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
