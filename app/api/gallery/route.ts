import { NextResponse } from "next/server"
import { getGalleryImagesFresh } from "@/lib/notion"

export const dynamic = "force-dynamic"
export const revalidate = 0

function parseBoolean(value: string | null) {
  if (!value) return false
  return ["1", "true", "yes", "on"].includes(value.toLowerCase())
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get("limit")
    const selectedOnly = parseBoolean(searchParams.get("selected"))

    const limit = limitParam ? Math.max(0, Number.parseInt(limitParam, 10)) : null

    let images = await getGalleryImagesFresh()

    if (selectedOnly) {
      const selected = images.filter((img) => img.selected)
      images = selected.length > 0 ? selected : images
    }

    if (limit && Number.isFinite(limit)) {
      images = images.slice(0, limit)
    }

    const payload = images.map((img) => ({
      id: img.id,
      name: img.name || img.alt,
      alt: img.alt,
      src: img.src,
      srcFull: img.srcFull,
      srcOriginal: img.srcOriginal,
      width: img.width,
      height: img.height,
      category: img.category,
      selected: img.selected || false,
    }))

    return NextResponse.json(
      {
        success: true,
        total: payload.length,
        images: payload,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
