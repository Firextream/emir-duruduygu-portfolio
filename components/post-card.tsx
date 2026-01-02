"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Post {
  id: string
  slug: string
  title: string
  excerpt?: string
  cover?: string
  date?: string
  tags: string[]
  readTime?: number
}

interface PostCardProps {
  post: Post
  variant?: "default" | "featured"
}

// Optimized blog image component
function BlogImage({ src, alt, priority = false, sizes }: { src: string; alt: string; priority?: boolean; sizes: string }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const isExternal = src.startsWith('http')
  
  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-secondary animate-pulse" />
      )}
      {isExternal ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-all duration-700 group-hover:scale-105",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          sizes={sizes}
          priority={priority}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </>
  )
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : ""

  if (variant === "featured") {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
            {post.cover && (
              <BlogImage
                src={post.cover}
                alt={post.title}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
          </div>
          
          {/* Content */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-4">
              {post.tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag} 
                  className="font-mono text-xs tracking-wider text-muted-foreground uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <time className="font-mono text-sm text-muted-foreground">{formattedDate}</time>
              {post.readTime && (
                <span className="font-mono text-sm text-muted-foreground">{post.readTime} min read</span>
              )}
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          {post.cover && (
            <BlogImage
              src={post.cover}
              alt={post.title}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
          
          {/* Arrow on Hover */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-background flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-foreground" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col p-5 bg-card border border-t-0 border-border">
          {/* Tags */}
          <div className="flex items-center gap-3 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Title */}
          <h3 className="font-serif text-xl text-foreground group-hover:text-accent transition-colors duration-300 leading-tight mb-3">
            {post.title}
          </h3>
          
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
              {post.excerpt}
            </p>
          )}
          
          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
            <time className="font-mono text-xs text-muted-foreground">{formattedDate}</time>
            {post.readTime && (
              <span className="font-mono text-xs text-muted-foreground">{post.readTime} min</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
