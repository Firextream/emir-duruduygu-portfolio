/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' for Vercel - it uses its own server
  // trailingSlash and basePath not needed for Vercel deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  // Compress output
  compress: true,
  // Power header optimization
  poweredByHeader: false,
  images: {
    // Enable Vercel image optimization for better performance
    formats: ['image/avif', 'image/webp'],
    // Optimized device sizes - smaller for mobile
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Higher quality for better image display
    qualities: [85],
    // Long cache for better performance
    minimumCacheTTL: 60 * 60 * 24 * 60, // 60 days cache
    // Limit concurrent image optimization
    dangerouslyAllowSVG: false,
    // Unoptimized false to ensure Next.js optimizes all images
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3-us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'public.notion-static.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.notion.so',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'notion.so',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
