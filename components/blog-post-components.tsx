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

  // Parse content into structured elements
  const parseContent = (text: string) => {
    // Normalize line breaks
    const normalizedText = text.replace(/\r\n/g, '\n')
    
    // Split by double newlines for paragraphs, or single newlines
    const blocks = normalizedText.split(/\n\n+/).filter(block => block.trim().length > 0)
    
    return blocks.map((block, index) => {
      const trimmedBlock = block.trim()
      
      // Check for headers (lines ending with :)
      if (trimmedBlock.match(/^[A-Z][^.!?]*:$/)) {
        return { type: 'heading', content: trimmedBlock.replace(/:$/, ''), key: index }
      }
      
      // Check for bullet points
      if (trimmedBlock.includes('•') || trimmedBlock.includes('- ')) {
        const items = trimmedBlock
          .split(/[•\-]/)
          .map(item => item.trim())
          .filter(item => item.length > 0)
        return { type: 'list', items, key: index }
      }
      
      // Check for sub-sections (text followed by content on same block)
      const colonMatch = trimmedBlock.match(/^([A-Z][^:]+):\s*(.+)$/s)
      if (colonMatch && colonMatch[2].length > 50) {
        return { 
          type: 'section', 
          heading: colonMatch[1], 
          content: colonMatch[2],
          key: index 
        }
      }
      
      // Regular paragraph
      return { type: 'paragraph', content: trimmedBlock, key: index }
    })
  }

  const elements = parseContent(content)

  return (
    <article className={cn(
      "blog-content max-w-none space-y-6",
      className
    )}>
      {elements.map((element) => {
        switch (element.type) {
          case 'heading':
            return (
              <h2 key={element.key} className="text-2xl font-serif text-foreground mt-12 mb-4 first:mt-0">
                {element.content}
              </h2>
            )
          
          case 'section':
            return (
              <div key={element.key} className="space-y-4">
                <h3 className="text-xl font-serif text-foreground mt-8">
                  {element.heading}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {element.content}
                </p>
              </div>
            )
          
          case 'list':
            return (
              <ul key={element.key} className="space-y-2 my-6 ml-4">
                {element.items?.map((item, i) => (
                  <li key={i} className="text-muted-foreground leading-relaxed flex gap-3">
                    <span className="text-accent mt-1.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )
          
          case 'paragraph':
          default:
            // Check if it's a short line (potential subheading or emphasis)
            const isShort = element.content && element.content.length < 100 && !element.content.includes('.')
            
            if (isShort) {
              return (
                <p key={element.key} className="text-foreground font-medium leading-relaxed text-lg mt-8">
                  {element.content}
                </p>
              )
            }
            
            return (
              <p key={element.key} className="text-muted-foreground leading-relaxed text-lg">
                {element.content}
              </p>
            )
        }
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
