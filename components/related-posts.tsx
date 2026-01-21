"use client"

import Link from "next/link"
import Image from "next/image"

interface RelatedPost {
  slug: string
  title: string
  excerpt?: string
  coverImage?: string
  publishedAt?: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
  className?: string
}

export function RelatedPosts({ posts, className = "" }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className={`border-t border-border pt-12 ${className}`}>
      <h2 className="font-serif text-2xl mb-8">Related Posts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="bg-muted/30 rounded-lg overflow-hidden border border-border hover:border-accent transition-colors">
              {post.coverImage && (
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium line-clamp-2 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
