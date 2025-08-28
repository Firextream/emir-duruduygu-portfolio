import { getAllPosts } from "@/lib/notion";

export async function GET() {
  try {
    console.log("Debug: getAllPosts API called");
    const posts = await getAllPosts();
    console.log("Debug: getAllPosts returned", posts.length, "posts");
    
    return Response.json({
      success: true,
      postsCount: posts.length,
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt?.substring(0, 100) + "...",
        date: post.date,
        category: post.category
      }))
    });
  } catch (error: any) {
    console.error("Debug: getAllPosts error:", error);
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
