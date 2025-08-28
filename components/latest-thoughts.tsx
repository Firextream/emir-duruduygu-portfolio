"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  slug: string
  category: string
  image?: string
  content?: string
}

export function LatestThoughts() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // For static export, use empty array (no blog posts)
        setBlogPosts([])
        setError(null)
        setLoading(false)
      } catch (error) {
        console.error("Error loading blogs:", error)
        setError(error instanceof Error ? error.message : "Failed to load blog posts")
        setBlogPosts([])
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-light tracking-tight mb-4"
            >
              Latest Thoughts
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              whileInView={{ opacity: 1, width: "80px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-foreground mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground max-w-2xl text-lg leading-relaxed"
            >
              Reflections on architecture, photography, and the spaces that shape human experience
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted rounded-lg mb-6" />
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-muted rounded w-16" />
                    <div className="h-4 bg-muted rounded w-20" />
                  </div>
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error && blogPosts.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Latest Thoughts
          </h2>
          <div className="h-px bg-foreground w-20 mx-auto mb-6" />
          <p className="text-muted-foreground">
            No thoughts available at the moment. Check back soon!
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-light tracking-tight mb-4"
          >
            Latest Thoughts
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-px bg-foreground mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground max-w-2xl text-lg leading-relaxed"
          >
            Reflections on architecture, photography, and the spaces that shape human experience
          </motion.p>
        </div>

        {/* Blog Posts Grid - 3 columns layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                {/* Image */}
                <div className="aspect-[4/3] mb-6 overflow-hidden rounded-lg bg-muted">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted-foreground/10 to-muted-foreground/5 flex items-center justify-center">
                      <span className="text-muted-foreground/40 text-sm uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {/* Meta Information */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground uppercase tracking-wider">
                    <span className="text-blue-600 font-medium">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        month: 'short',
                        day: 'numeric'
                      }).replace(' ', ' ').toUpperCase()}
                    </span>
                    <span className="text-blue-600 font-medium">
                      {post.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-medium leading-tight group-hover:text-blue-600 transition-colors duration-300">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <div className="pt-2">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                      READ MORE
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* All Articles Link */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/blog">
              <Button 
                variant="outline" 
                size="lg"
                className="group border-muted-foreground/20 hover:border-foreground transition-all duration-300"
              >
                ALL ARTICLES
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
