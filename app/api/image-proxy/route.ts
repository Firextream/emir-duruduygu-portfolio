import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return new NextResponse("Missing url", { status: 400 })
  }

  if (!/^https?:\/\//i.test(url)) {
    return new NextResponse("Invalid url", { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "image/avif,image/webp,image/*,*/*;q=0.8",
      },
      redirect: "follow",
      cache: "no-store",
    })

    if (!response.ok) {
      return new NextResponse(`Upstream error: ${response.status}`, { status: response.status })
    }

    const contentType = response.headers.get("content-type") || "image/jpeg"
    const cacheControl = response.headers.get("cache-control") || "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"

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
