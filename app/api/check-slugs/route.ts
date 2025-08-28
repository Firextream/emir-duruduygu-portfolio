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

    const posts = response.results.map((page: any) => {
      const properties = page.properties;
      
      // Get the slug - check multiple possible property names
      let slug = '';
      if (properties.Slug?.rich_text?.[0]?.plain_text) {
        slug = properties.Slug.rich_text[0].plain_text;
      } else if (properties.slug?.rich_text?.[0]?.plain_text) {
        slug = properties.slug.rich_text[0].plain_text;
      } else if (properties.URL?.rich_text?.[0]?.plain_text) {
        slug = properties.URL.rich_text[0].plain_text;
      }
      
      return {
        id: page.id,
        title: properties.Title?.title?.[0]?.plain_text || properties.title?.title?.[0]?.plain_text || 'No title',
        slug: slug,
        hasSlugProperty: !!properties.Slug,
        hasLowercaseSlugProperty: !!properties.slug,
        hasURLProperty: !!properties.URL,
        allProperties: Object.keys(properties).join(', ')
      };
    });

    return NextResponse.json({
      totalPosts: response.results.length,
      posts: posts
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
