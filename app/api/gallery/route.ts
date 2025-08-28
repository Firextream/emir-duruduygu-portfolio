import { NextRequest, NextResponse } from "next/server";
import { getGalleryImages } from "@/lib/notion";

export async function GET(request: NextRequest) {
  try {
    // Check if required environment variables are set
    if (!process.env.NOTION_TOKEN || !process.env.NOTION_GALLERY_DATABASE_ID) {
      console.error("Missing required environment variables: NOTION_TOKEN or NOTION_GALLERY_DATABASE_ID");
      return NextResponse.json(
        {
          images: [],
          total: 0,
          success: false,
          error: "Server configuration error. Please check environment variables."
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    
    // Validate limit parameter
    let limit: number | undefined;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json(
          {
            images: [],
            total: 0,
            success: false,
            error: "Invalid limit parameter. Must be a positive integer."
          },
          { status: 400 }
        );
      }
      limit = parsedLimit;
    }
    
    // Get all images from Notion
    const allImages = await getGalleryImages();
    
    // Apply limit if specified
    const images = limit ? allImages.slice(0, limit) : allImages;
    
    return NextResponse.json({
      images,
      total: allImages.length,
      success: true,
      ...(limit && { limited: true, showing: images.length })
    });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    
    // Handle specific Notion API errors
    let errorMessage = "Failed to fetch gallery images";
    if (error instanceof Error) {
      if (error.message.includes("NOTION_GALLERY_DATABASE_ID")) {
        errorMessage = "Gallery database configuration error";
      } else if (error.message.includes("Unauthorized")) {
        errorMessage = "Invalid Notion token or insufficient permissions";
      } else if (error.message.includes("not found")) {
        errorMessage = "Gallery database not found or not accessible";
      }
    }
    
    return NextResponse.json(
      {
        images: [],
        total: 0,
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
