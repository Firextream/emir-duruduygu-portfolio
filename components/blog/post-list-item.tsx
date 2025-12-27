import Link from "next/link"
import Image from "next/image"

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  date?: string | null
  category?: string
  image?: string | null
  readTime?: string
}

interface PostListItemProps {
  post: Post
  index?: number
}

export function PostListItem({ post, index = 0 }: PostListItemProps) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : ""

  return (
    <Link href={`/blog/${post.slug}`} className="group block py-8 md:py-10">
      <article className="grid grid-cols-12 gap-4 md:gap-8 items-start">
        {/* Index Number */}
        <div className="col-span-2 md:col-span-1">
          <span className="font-mono text-2xl md:text-3xl text-muted-foreground/30 group-hover:text-accent transition-colors duration-300">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        
        {/* Content */}
        <div className="col-span-10 md:col-span-7 lg:col-span-8 space-y-3">
          {/* Category */}
          {post.category && (
            <span className="font-mono text-xs tracking-wider text-accent uppercase">
              {post.category}
            </span>
          )}
          
          {/* Title */}
          <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
            {post.title}
          </h3>
          
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-muted-foreground text-base line-clamp-2 max-w-2xl">
              {post.excerpt}
            </p>
          )}
        </div>
        
        {/* Image (hidden on mobile) */}
        {post.image && (
          <div className="hidden md:block col-span-2 lg:col-span-2">
            <div className="relative aspect-square overflow-hidden bg-secondary">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="120px"
              />
            </div>
          </div>
        )}
        
        {/* Meta */}
        <div className="col-span-12 md:col-span-2 lg:col-span-1 flex md:flex-col md:items-end gap-4 md:gap-2 mt-2 md:mt-0">
          <span className="font-mono text-sm text-muted-foreground">
            {formattedDate}
          </span>
          {post.readTime && (
            <span className="font-mono text-sm text-muted-foreground">
              {post.readTime}
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}
