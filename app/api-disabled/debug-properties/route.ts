import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

export async function GET() {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });

    const response = await notion.databases.query({
      database_id: process.env.NOTION_POSTS_DATABASE_ID!,
    });

    if (response.results.length > 0) {
      const posts = response.results.map((post: any) => {
        const properties = post.properties;
        
        // Extract full content from all rich text segments
        let fullContent = "";
        let contentDebug = {};
        
        if (properties.Content?.rich_text && properties.Content.rich_text.length > 0) {
          fullContent = properties.Content.rich_text
            .map((segment: any) => segment.plain_text)
            .join('')
            .trim();
          
          contentDebug = {
            segments: properties.Content.rich_text.length,
            segmentTexts: properties.Content.rich_text.map((segment: any) => ({
              text: segment.plain_text,
              length: segment.plain_text?.length || 0
            })),
            rawStructure: properties.Content.rich_text
          };
        } else {
          contentDebug = {
            error: "No rich_text array found",
            rawContent: properties.Content
          };
        }
        
        return {
          id: post.id,
          title: properties.Title?.title?.[0]?.plain_text || 'No title',
          slug: properties.Slug?.rich_text?.[0]?.plain_text || 'No slug',
          excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || 'No excerpt',
          content: fullContent || 'No content',
          contentLength: fullContent?.length || 0,
          contentDebug: contentDebug,
          allProperties: Object.keys(properties)
        };
      });
      
      return NextResponse.json({
        totalPosts: response.results.length,
        posts: posts
      });
    } else {
      return NextResponse.json({ error: "No posts found" });
    }
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
