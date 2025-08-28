/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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
    ],
  },
  
  env: {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    NOTION_POSTS_DATABASE_ID: process.env.NOTION_POSTS_DATABASE_ID,
  },
  
  // Handle environment variable validation
  async rewrites() {
    return []
  },
  
  // Ensure graceful handling of missing environment variables
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      // Validate environment variables in development
      if (!process.env.NOTION_POSTS_DATABASE_ID) {
        console.warn('⚠️  NOTION_POSTS_DATABASE_ID not configured - using mock blog data')
      }
    }
    return config
  }
}

module.exports = nextConfig
