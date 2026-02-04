import dynamic from "next/dynamic"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { getAllPosts, getGalleryImages } from "@/lib/notion"

// Lazy load below-the-fold sections
const LatestPostsSection = dynamic(() => import("@/components/home/latest-posts-section").then(mod => ({ default: mod.LatestPostsSection })))
const SelectedProjectsSection = dynamic(() => import("@/components/home/selected-projects-section").then(mod => ({ default: mod.SelectedProjectsSection })))
const ManifestoSection = dynamic(() => import("@/components/home/manifesto-section").then(mod => ({ default: mod.ManifestoSection })))
const NewsletterSection = dynamic(() => import("@/components/home/newsletter-section").then(mod => ({ default: mod.NewsletterSection })))

// ISR with 5 minute revalidation for better TTFB
export const revalidate = 300

export default async function HomePage() {
  // Fetch posts and gallery images on the server side
  const [postsData, galleryImagesData] = await Promise.all([
    getAllPosts(),
    getGalleryImages()
  ])
  
  // Ensure we have arrays to work with
  const posts = Array.isArray(postsData) ? postsData.filter(Boolean) : []
  const galleryImages = Array.isArray(galleryImagesData) ? galleryImagesData.filter(Boolean) : []
  
  const latestPosts = posts.slice(0, 3).map(post => ({
    id: post?.id || "",
    slug: post?.slug || "",
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    cover: post?.image || undefined,
    date: post?.date || undefined,
    tags: post?.category ? [post.category] : [],
    readTime: post?.readTime ? parseInt(post.readTime) : undefined
  }))
  
  const selectedProjects = galleryImages.slice(0, 8).map(img => ({
    id: img?.id || "",
    title: img?.name || img?.title || "",
    imageUrl: img?.src || "/placeholder.svg",
    category: img?.category || undefined
  }))
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <LatestPostsSection posts={latestPosts} />
        <SelectedProjectsSection projects={selectedProjects} />
        <ManifestoSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
