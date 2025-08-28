import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/notion";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || slug.trim() === "") {
      return NextResponse.json(
        {
          post: null,
          success: false,
          error: "Slug parameter is required"
        },
        { status: 400 }
      );
    }

    // Get post by slug from Notion
    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        {
          post: null,
          success: false,
          error: "Post not found"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      post,
      success: true
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);

    // Handle specific Notion API errors
    let errorMessage = "Failed to fetch blog post";
    if (error instanceof Error) {
      if (error.message.includes("NOTION_DATABASE_ID")) {
        errorMessage = "Database configuration error";
      } else if (error.message.includes("Unauthorized")) {
        errorMessage = "Invalid Notion token or insufficient permissions";
      } else if (error.message.includes("not found")) {
        errorMessage = "Database not found or not accessible";
      }
    }

    return NextResponse.json(
      {
        post: null,
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
