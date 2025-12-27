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

  // Simple paragraph splitting - treat double newlines as paragraph breaks
  // Single newlines within text are treated as soft breaks (same paragraph)
  const normalizedText = content.replace(/\r\n/g, '\n')
  
  // Split only on double+ newlines to create paragraphs
  const paragraphs = normalizedText
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(p => p.length > 0)

  return (
    <article className={cn(
      "blog-content max-w-none",
      className
    )}>
      {paragraphs.map((paragraph, index) => {
        // Check if this paragraph contains bullet points
        if (paragraph.includes('•')) {
          const parts = paragraph.split('•').filter(p => p.trim())
          // If first part doesn't start with bullet, it's intro text
          const hasIntro = !paragraph.trim().startsWith('•')
          
          return (
            <div key={index} className="my-6">
              {hasIntro && parts[0] && (
                <p className="text-muted-foreground leading-relaxed text-lg mb-4">
                  {parts[0].trim()}
                </p>
              )}
              <ul className="space-y-2 ml-4">
                {parts.slice(hasIntro ? 1 : 0).map((item, i) => (
                  <li key={i} className="text-muted-foreground leading-relaxed flex gap-3">
                    <span className="text-accent flex-shrink-0">•</span>
                    <span>{item.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        }
        
        // Regular paragraph - replace single newlines with spaces for flow
        const cleanedParagraph = paragraph.replace(/\n/g, ' ').replace(/\s+/g, ' ')
        
        return (
          <p key={index} className="text-muted-foreground leading-relaxed text-lg mb-6">
            {cleanedParagraph}
          </p>
        )
      })}
    </article>
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
