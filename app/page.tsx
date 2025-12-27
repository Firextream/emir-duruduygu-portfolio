import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { LatestPostsSection } from "@/components/home/latest-posts-section"
import { SelectedProjectsSection } from "@/components/home/selected-projects-section"
import { ManifestoSection } from "@/components/home/manifesto-section"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { Footer } from "@/components/footer"
import { getAllPosts, getGalleryImages } from "@/lib/notion"

// Enable ISR with 1 hour revalidation
export const revalidate = 3600

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
