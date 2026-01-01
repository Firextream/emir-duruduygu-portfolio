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
            <div key={index} className="my-4 sm:my-6">
              {hasIntro && parts[0] && (
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-3 sm:mb-4">
                  {parts[0].trim()}
                </p>
              )}
              <ul className="space-y-2 ml-2 sm:ml-4">
                {parts.slice(hasIntro ? 1 : 0).map((item, i) => (
                  <li key={i} className="text-muted-foreground leading-relaxed text-sm sm:text-base flex gap-2 sm:gap-3">
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
          <p key={index} className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-4 sm:mb-6">
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
    <div className={cn("flex items-center gap-4 py-6 px-6 bg-muted/30 rounded-lg border border-border/50", className)}>
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-background flex-shrink-0 border-2 border-accent/20 shadow-lg">
        <Image
          src={authorImage}
          alt={author || "Author"}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="flex-1">
        <p className="font-serif text-lg sm:text-xl font-medium text-foreground mb-1">{author || "Anonymous"}</p>
        {authorTitle && (
          <p className="text-sm sm:text-base text-muted-foreground mb-1">{authorTitle}</p>
        )}
        {date && (
          <p className="text-xs sm:text-sm text-muted-foreground font-mono">
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
