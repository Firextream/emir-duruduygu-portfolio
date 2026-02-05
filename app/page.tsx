import nextDynamic from "next/dynamic"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { getAllPosts, getGalleryImages } from "@/lib/notion"

// Lazy load below-the-fold sections
const LatestPostsSection = nextDynamic(() => import("@/components/home/latest-posts-section").then(mod => ({ default: mod.LatestPostsSection })))
const SelectedProjectsSection = nextDynamic(() => import("@/components/home/selected-projects-section").then(mod => ({ default: mod.SelectedProjectsSection })))
const ManifestoSection = nextDynamic(() => import("@/components/home/manifesto-section").then(mod => ({ default: mod.ManifestoSection })))
const NewsletterSection = nextDynamic(() => import("@/components/home/newsletter-section").then(mod => ({ default: mod.NewsletterSection })))

// Always render fresh to avoid expired Notion image URLs
export const dynamic = "force-dynamic"

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
  
  const selectedPool = galleryImages.filter(img => img?.selected)
  const selectedProjects = (selectedPool.length > 0 ? selectedPool : galleryImages)
    .slice(0, 8)
    .map(img => ({
      id: img?.id || "",
      title: img?.name || img?.title || "",
      imageUrl: img?.src || "/placeholder.svg",
      fallbackUrl: img?.srcOriginal || img?.srcFull || undefined,
      width: img?.width || undefined,
      height: img?.height || undefined,
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
