import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

export async function GET() {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });

    console.log('Testing Notion connection...');
    console.log('NOTION_TOKEN exists:', !!process.env.NOTION_TOKEN);
    console.log('NOTION_POSTS_DATABASE_ID:', process.env.NOTION_POSTS_DATABASE_ID);

    const response = await notion.databases.query({
      database_id: process.env.NOTION_POSTS_DATABASE_ID!,
    });

    console.log('Raw Notion response:', {
      results_count: response.results.length,
      has_next_cursor: !!response.next_cursor
    });

    const posts = response.results.map((page: any) => {
      const properties = page.properties;
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || 'No title',
        slug: properties.Slug?.rich_text?.[0]?.plain_text || 'No slug',
        status: properties.Status?.select?.name || 'No status',
        published: properties.Published?.checkbox || false,
        all_properties: Object.keys(properties)
      };
    });

    return NextResponse.json({
      success: true,
      totalPosts: response.results.length,
      posts: posts,
      message: posts.length === 0 ? 'Database is empty - you need to add blog posts to your Notion database' : 'Posts found'
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: 'Failed to connect to Notion database'
    });
  }
}
