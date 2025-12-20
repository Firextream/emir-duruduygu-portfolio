"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getAssetPath } from "@/lib/image-utils"

interface BlogPost {
	id: string
	title: string
	excerpt?: string
	date?: string | null
	readTime?: string
	slug: string
	category?: string
	image?: string | null
	content?: string
	featured?: boolean
}

interface BlogPreviewProps {
	posts: BlogPost[]
}

export function BlogPreview({ posts }: BlogPreviewProps) {
	const blogPosts = posts || []

	if (blogPosts.length === 0) {
		return (
			<section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
				<div className="mb-16">
					<span className="text-[10px] font-light tracking-[0.3em] text-muted-foreground uppercase block mb-4">
						Journal
					</span>
					<h2 className="text-4xl md:text-5xl font-extralight text-foreground">
						Thoughts
					</h2>
				</div>
				<p className="text-muted-foreground">No posts available yet.</p>
			</section>
		)
	}

	return (
		<section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
			{/* Section Header - Minimal */}
			<div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
				<div>
					<span className="text-[10px] font-light tracking-[0.3em] text-muted-foreground uppercase block mb-4">
						Journal
					</span>
					<h2 className="text-4xl md:text-5xl font-extralight text-foreground">
						Thoughts
					</h2>
				</div>
				<Link 
					href="/blog"
					className="group inline-flex items-center gap-3 text-sm tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors mt-6 md:mt-0"
				>
					<span>All Articles</span>
					<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
				</Link>
			</div>

			{/* Blog Posts Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{blogPosts.map((post, index) => (
					<article key={post.id} className="group">
						<Link href={`/blog/${post.slug}`} className="block">
							{/* Image */}
							<div className="aspect-[4/3] relative overflow-hidden bg-muted mb-6">
								{post.image && post.image !== '/placeholder.svg' ? (
									post.image.startsWith('http') ? (
										<img
											src={post.image}
											alt={post.title}
											className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
										/>
									) : (
										<Image
											src={getAssetPath(post.image)}
											alt={post.title}
											fill
											className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
										/>
									)
								) : (
									<div className="w-full h-full bg-muted flex items-center justify-center">
										<span className="text-muted-foreground/30 text-xs tracking-widest uppercase">
											{post.category || "Article"}
										</span>
									</div>
								)}
								{/* Corner Accent */}
								<div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/0 group-hover:border-white/50 transition-all duration-500" />
							</div>

							{/* Content */}
							<div>
								{/* Meta */}
								<div className="flex items-center gap-3 mb-3 text-xs tracking-widest uppercase text-muted-foreground">
									{post.date && (
										<time>
											{new Date(post.date).toLocaleDateString("en-US", {
												month: "short",
												year: "numeric",
											})}
										</time>
									)}
									{post.date && post.category && <span>—</span>}
									{post.category && <span>{post.category}</span>}
								</div>

								{/* Title */}
								<h3 className="text-xl font-light text-foreground mb-3 group-hover:text-muted-foreground transition-colors line-clamp-2">
									{post.title}
								</h3>

								{/* Excerpt */}
								{post.excerpt && (
									<p className="text-sm text-muted-foreground/70 line-clamp-2 leading-relaxed">
										{post.excerpt}
									</p>
								)}
							</div>
						</Link>
					</article>
				))}
			</div>
		</section>
	)
}
