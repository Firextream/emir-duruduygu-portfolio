import type { MetadataRoute } from 'next'
import { getPhotos, getPosts, getProjects } from '@/lib/content'
import { SITE_URL } from '@/lib/routes/meta'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [photos, posts, projects] = await Promise.all([getPhotos(), getPosts(), getProjects()])

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/gallery`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/lab`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.7 },
  ]

  return [
    ...pages,
    ...photos.map((p) => ({ url: `${SITE_URL}/gallery/${p.id}`, changeFrequency: 'yearly' as const, priority: 0.5 })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.published ?? undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...projects.map((p) => ({ url: `${SITE_URL}/lab/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ]
}
