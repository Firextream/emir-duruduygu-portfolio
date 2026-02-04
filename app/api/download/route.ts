import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const imageUrl = searchParams.get("url")
  const filename = searchParams.get("filename") || "duruduygu-photo"

  if (!imageUrl) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 })
  }

  try {
    // Fetch the image from Notion CDN
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      throw new Error("Failed to fetch image")
    }

    const blob = await response.blob()
    
    // Return the image with download headers
    return new NextResponse(blob, {
      headers: {
        "Content-Type": blob.type || "image/jpeg",
        "Content-Disposition": `attachment; filename="${filename}.jpg"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to download image" }, { status: 500 })
  }
}
