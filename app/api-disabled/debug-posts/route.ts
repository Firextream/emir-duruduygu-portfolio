import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/notion";

export async function GET() {
  try {
    const posts = await getAllPosts();
    
    return NextResponse.json({
      success: true,
      postsCount: posts.length,
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        hasSlug: !!post.slug,
        slugLength: post.slug ? post.slug.length : 0
      }))
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
