import { NextResponse } from 'next/server'
import { getGalleryImages } from '@/lib/notion'

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Debug endpoint available only in development' }, { status: 403 })
  }

  try {
    const images = await getGalleryImages()
    // Return a small, safe slice
    const safe = images.slice(0, 20).map(i => ({ id: i.id, src: i.src, srcSet: i.srcSet, srcFull: i.srcFull, srcOriginal: i.srcOriginal }))
    return NextResponse.json({ count: safe.length, images: safe })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}