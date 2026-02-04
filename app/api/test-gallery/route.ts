import { NextResponse } from 'next/server'
import { getGalleryImages } from '@/lib/notion'

// Test endpoint to check gallery images
export async function GET() {
  try {
    const images = await getGalleryImages()
    
    return NextResponse.json({
      success: true,
      count: images.length,
      images: images.slice(0, 3).map(img => ({
        id: img.id,
        name: img.name || img.alt,
        hasImage: !!img.src,
        srcPreview: img.src ? img.src.substring(0, 100) + '...' : null,
        category: img.category
      }))
    })
  } catch (error) {
    console.error('Gallery test error:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}
