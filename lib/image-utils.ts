// Utility function to handle image paths across deployments
export function getAssetPath(imagePath: string): string {
  if (!imagePath) return ''

  // Leave absolute URLs untouched (e.g. Notion, Cloudinary)
  if (/^https?:\/\//i.test(imagePath)) return imagePath

  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath

  // Base path only when explicitly provided (e.g. GitHub Pages project pages)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  return `${basePath}/${cleanPath}`
}
