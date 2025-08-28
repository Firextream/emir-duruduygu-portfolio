"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { getAssetPath } from "@/lib/image-utils"
import { getAllPosts } from "@/lib/notion"

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
	featured?: boolean
}

export function BlogPreview() {
	const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const posts = await getAllPosts()
				// Get the first 3 posts for the homepage
				setBlogPosts(posts.slice(0, 3))
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
			<section className="py-20 px-6 max-w-7xl mx-auto">
				<div className="mb-16">
					<h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
						Latest Thoughts
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl">
						Loading latest posts...
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="bg-card border-light overflow-hidden animate-pulse"
						>
							<div className="bg-muted h-64 w-full"></div>
							<div className="p-6">
								<div className="bg-muted h-4 mb-2"></div>
								<div className="bg-muted h-4 w-3/4 mb-4"></div>
								<div className="bg-muted h-3 w-1/2"></div>
							</div>
						</div>
					))}
				</div>
			</section>
		)
	}

	return (
		<section className="py-32 px-6 max-w-7xl mx-auto">
			<div className="mb-16">
				<h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
					Latest Thoughts
				</h2>
				<p className="text-muted-foreground text-lg max-w-2xl">
					Reflections on architecture, photography, and the spaces that shape human experience.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
				{blogPosts.map((post, index) => (
					<article
						key={post.id}
						className="group bg-card border-light overflow-hidden hover:architectural-shadow transition-all duration-300"
					>
						<Link href={`/blog/${post.slug}`}>
							<div className="aspect-[4/3] relative overflow-hidden">
								{post.image && post.image !== '/placeholder.svg' ? (
									post.image.startsWith('http') ? (
										<img
											src={post.image}
											alt={post.title}
											className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
										/>
									) : (
										<Image
											src={getAssetPath(post.image)}
											alt={post.title}
											fill
											className="object-cover transition-transform duration-300 group-hover:scale-105"
										/>
									)
								) : (
									<div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
										<div className="text-2xl text-muted-foreground/40">📄</div>
									</div>
								)}
							</div>

							<div className="p-6">
								<div className="flex items-center gap-2 mb-3">
									<time className="text-sm text-muted-foreground uppercase tracking-wider">
										{new Date(post.date).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										})}
									</time>
									<span className="text-muted-foreground">•</span>
									<span className="text-sm text-primary uppercase tracking-wider font-medium">
										{post.category}
									</span>
								</div>

								<h3 className="text-xl font-normal text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
									{post.title}
								</h3>

								<p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
									{post.excerpt}
								</p>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-1 text-xs text-muted-foreground">
										<Clock className="w-3 h-3" />
										<span>{post.readTime}</span>
									</div>
									<div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
										READ MORE
										<ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
									</div>
								</div>
							</div>
						</Link>
					</article>
				))}
			</div>

			<div className="text-center">
				<Link
					href="/blog"
					className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium uppercase tracking-wider text-sm border-b border-transparent hover:border-primary pb-1"
				>
					ALL ARTICLES
					<ArrowRight className="w-4 h-4" />
				</Link>
			</div>
		</section>
	)
}
