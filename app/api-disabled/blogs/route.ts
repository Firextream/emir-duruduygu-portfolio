import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/notion";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    
    // Validate limit parameter
    let limit: number | undefined;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json(
          {
            posts: [],
            total: 0,
            success: false,
            error: "Invalid limit parameter. Must be a positive integer."
          },
          { status: 400 }
        );
      }
      limit = parsedLimit;
    }
    
    // Get all posts from Notion
    const allPosts = await getAllPosts();
    
    // Apply limit if specified
    const posts = limit ? allPosts.slice(0, limit) : allPosts;
    
    return NextResponse.json({
      posts,
      total: allPosts.length,
      success: true,
      ...(limit && { limited: true, showing: posts.length })
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    
    // Handle specific Notion API errors
    let errorMessage = "Failed to fetch blog posts";
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
        posts: [],
        total: 0,
        success: false,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
