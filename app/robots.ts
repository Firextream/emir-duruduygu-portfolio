import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/routes/meta'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // the content editor (Keystatic) also sends noindex and needs a GitHub login in production
        disallow: ['/api/', '/keystatic'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
