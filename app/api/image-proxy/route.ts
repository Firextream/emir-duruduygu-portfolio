import { NextResponse } from "next/server"

// Use Edge runtime for zero cold-start latency
export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return new NextResponse("Missing url", { status: 400 })
  }

  if (!/^https?:\/\//i.test(url)) {
    return new NextResponse("Invalid url", { status: 400 })
  }

  const directusUrl = String(process.env.DIRECTUS_URL || "").trim().replace(/\/$/, "")
  const directusToken = String(process.env.DIRECTUS_STATIC_TOKEN || process.env.DIRECTUS_TOKEN || "").trim()
  const isDirectusAsset = Boolean(directusUrl) && url.startsWith(`${directusUrl}/assets/`)

  try {
    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0",
      "Accept": "image/avif,image/webp,image/*,*/*;q=0.8",
    }

    if (isDirectusAsset && directusToken) {
      headers.Authorization = `Bearer ${directusToken}`
    }

    const response = await fetch(url, {
      headers,
      redirect: "follow",
      // Always cache the fetched image at the edge to prevent re-downloading from S3
      cache: "force-cache",
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      return new NextResponse(`Upstream error: ${response.status}`, { status: response.status })
    }

    const contentType = response.headers.get("content-type") || "image/jpeg"
    // Aggressive CDN caching for 1 year since the URL contains a unique signature/ID
    const cacheControl = "public, max-age=31536000, s-maxage=31536000, immutable"

    return new NextResponse(response.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": cacheControl,
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    return new NextResponse("Proxy error", { status: 502 })
  }
}
