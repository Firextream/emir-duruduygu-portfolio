import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Directus serves images straight to browsers (asset transforms, see components/site/ContentImage).
// Its host is listed here as well so next/image accepts it if a loader is ever bypassed.
const directusHosts = [process.env.DIRECTUS_ASSETS_URL, process.env.DIRECTUS_URL]
  .filter(Boolean)
  .map((value) => {
    try {
      const url = new URL(value)
      return { protocol: url.protocol.replace(':', ''), hostname: url.hostname, port: url.port, pathname: '/assets/**' }
    } catch {
      return null
    }
  })
  .filter(Boolean)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone server output: runs on Vercel and in Docker (see Dockerfile). No static export —
  // the contact/newsletter API routes need a server.
  output: 'standalone',
  // Pin the tracing root to this repo (a stray lockfile higher up would otherwise be picked as the root).
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  // Pages are static, but anything rendered on demand (an unknown address → 404) still reads content/
  // through the files adapter — ship it with the server (Vercel and standalone). public/ is served as
  // static files and must never be copied into server bundles (the adapter's image-size lookups
  // would otherwise pull every photo into every function).
  outputFileTracingIncludes: { '/**': ['./content/**/*'] },
  outputFileTracingExcludes: { '/**': ['./public/**/*'] },
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [96, 128, 256, 384, 512],
    qualities: [75, 85],
    minimumCacheTTL: 60 * 60 * 24 * 60,
    dangerouslyAllowSVG: false,
    remotePatterns: directusHosts,
  },
  async redirects() {
    return [
      // Routes from the old site that the redesign folds into other pages.
      { source: '/portfolio', destination: '/gallery', permanent: true },
      { source: '/portfolio/:id', destination: '/gallery', permanent: true },
      { source: '/moodboard', destination: '/gallery#moodboard', permanent: true },
      { source: '/blog/archive', destination: '/blog', permanent: true },
      { source: '/resume', destination: '/about', permanent: false },
      { source: '/contact', destination: '/about', permanent: false },
    ]
  },
}

export default nextConfig
