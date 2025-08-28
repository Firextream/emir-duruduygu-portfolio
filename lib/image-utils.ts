// Utility function to handle image paths for GitHub Pages deployment
export function getImagePath(imagePath: string): string {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  
  // In production (GitHub Pages), add the repo basePath
  const basePath = process.env.NODE_ENV === 'production' ? '/emir-duruduygu-portfolio' : ''
  
  return `${basePath}/${cleanPath}`
}

// Alternative function that works with Next.js asset prefix
export function getAssetPath(imagePath: string): string {
  // For static export with assetPrefix, Next.js handles this automatically
  // But we can provide this helper for manual paths
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
}
