import { cn } from "@/lib/utils"
import { getAssetPath } from "@/lib/image-utils"
import Image from "next/image"

interface BlogPostContentProps {
  content?: string
  className?: string
}

export function BlogPostContent({ content, className }: BlogPostContentProps) {
  if (!content) {
    return (
      <div className={cn("text-muted-foreground italic", className)}>
        No content available
      </div>
    )
  }

  // Split content into paragraphs and render with proper styling
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)

  return (
    <div className={cn(
      "blog-content prose prose-neutral dark:prose-invert max-w-none",
      "[&>h1]:text-3xl [&>h1]:font-light [&>h1]:mt-16 [&>h1]:mb-8 [&>h1]:text-foreground",
      "[&>h2]:text-2xl [&>h2]:font-light [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:text-foreground",
      "[&>h3]:text-xl [&>h3]:font-medium [&>h3]:mt-8 [&>h3]:mb-4 [&>h3]:text-foreground",
      "[&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:mb-6",
      "[&>p:first-of-type]:text-lg [&>p:first-of-type]:text-foreground",
      "[&>ul]:text-muted-foreground [&>ol]:text-muted-foreground",
      "[&>blockquote]:border-l-accent [&>blockquote]:text-foreground",
      "[&>code]:bg-muted [&>code]:text-foreground [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded",
      "[&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto",
      className
    )}>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-6 text-muted-foreground leading-relaxed">
          {paragraph.trim()}
        </p>
      ))}
    </div>
  )
}

interface BlogPostMetaProps {
  post: {
    category?: string
    readTime?: string
    date?: string
  }
  className?: string
}

export function BlogPostMeta({ post, className }: BlogPostMetaProps) {
  return (
    <div className={cn("flex items-center gap-4 text-sm text-muted-foreground", className)}>
      {post.category && (
        <span className="px-2 py-1 bg-muted rounded-sm text-xs font-medium">
          {post.category}
        </span>
      )}
      {post.readTime && <span>{post.readTime}</span>}
    </div>
  )
}

interface BlogPostAuthorProps {
  author?: string
  date?: string | null
  authorTitle?: string
  className?: string
}

export function BlogPostAuthor({ author, date, authorTitle, className }: BlogPostAuthorProps) {
  const authorImage = getAssetPath("/placeholder-user.jpg") // Default author image
  
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border/20">
        <Image
          src={authorImage}
          alt={author || "Author"}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{author || "Anonymous"}</p>
        {authorTitle && (
          <p className="text-sm text-muted-foreground">{authorTitle}</p>
        )}
        {date && (
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long", 
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  )
}
