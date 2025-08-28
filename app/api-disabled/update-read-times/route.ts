import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_POSTS_DATABASE_ID;
const WORDS_PER_MINUTE = 200;

// Function to count words in text
function countWords(text: string | null | undefined): number {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Function to calculate read time
function calculateReadTime(wordCount: number): number {
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return Math.max(1, minutes); // Minimum 1 minute
}

// Function to extract text content from Notion rich text
function extractTextFromRichText(richTextArray: any): string {
  if (!richTextArray || !Array.isArray(richTextArray)) return '';
  return richTextArray.map(block => block.plain_text || '').join(' ');
}

// Function to update read time for a specific page
async function updateReadTime(pageId: string, readTime: number): Promise<boolean> {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        ReadTime: {
          rich_text: [
            {
              text: {
                content: `${readTime} min read`
              }
            }
          ]
        }
      }
    });
    return true;
  } catch (error) {
    console.error(`Error updating read time for page ${pageId}:`, error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if required environment variables are set
    if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
      return NextResponse.json(
        { success: false, error: "Missing required environment variables" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { pageId, updateAll } = body;

    if (updateAll) {
      // Update all blog posts
      const response = await notion.databases.query({
        database_id: DATABASE_ID,
      });

      const results = [];
      let successCount = 0;
      let errorCount = 0;

      for (const post of response.results) {
        const postPageId = post.id;
        const postData = post as any;
        const title = postData.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
        
        // Extract content
        let content = '';
        if (postData.properties?.Content?.rich_text) {
          content = extractTextFromRichText(postData.properties.Content.rich_text);
        } else if (postData.properties?.Excerpt?.rich_text) {
          content = extractTextFromRichText(postData.properties.Excerpt.rich_text);
        }
        
        const wordCount = countWords(content);
        const readTime = calculateReadTime(wordCount);
        
        const success = await updateReadTime(postPageId, readTime);
        
        results.push({
          pageId: postPageId,
          title,
          wordCount,
          readTime,
          success
        });

        if (success) {
          successCount++;
        } else {
          errorCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return NextResponse.json({
        success: true,
        message: `Updated ${successCount} posts successfully, ${errorCount} failed`,
        results,
        summary: { successCount, errorCount, total: response.results.length }
      });

    } else if (pageId) {
      // Update single page
      const post = await notion.pages.retrieve({ page_id: pageId });
      const postData = post as any;
      const title = postData.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
      
      let content = '';
      if (postData.properties?.Content?.rich_text) {
        content = extractTextFromRichText(postData.properties.Content.rich_text);
      } else if (postData.properties?.Excerpt?.rich_text) {
        content = extractTextFromRichText(postData.properties.Excerpt.rich_text);
      }
      
      const wordCount = countWords(content);
      const readTime = calculateReadTime(wordCount);
      
      const success = await updateReadTime(pageId, readTime);
      
      return NextResponse.json({
        success,
        message: success 
          ? `Updated "${title}" read time successfully`
          : `Failed to update "${title}" read time`,
        data: {
          pageId,
          title,
          wordCount,
          readTime,
          success
        }
      });

    } else {
      return NextResponse.json(
        { success: false, error: "Either 'pageId' or 'updateAll: true' is required" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Error in read time update API:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update read times",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
      return NextResponse.json(
        { success: false, error: "pageId parameter is required" },
        { status: 400 }
      );
    }

    // Get current read time for a page (for testing)
    const post = await notion.pages.retrieve({ page_id: pageId });
    const postData = post as any;
    const title = postData.properties?.Title?.title?.[0]?.plain_text || 'Untitled';
    
    let content = '';
    if (postData.properties?.Content?.rich_text) {
      content = extractTextFromRichText(postData.properties.Content.rich_text);
    } else if (postData.properties?.Excerpt?.rich_text) {
      content = extractTextFromRichText(postData.properties.Excerpt.rich_text);
    }
    
    const wordCount = countWords(content);
    const calculatedReadTime = calculateReadTime(wordCount);
    const currentReadTime = postData.properties?.ReadTime?.rich_text?.[0]?.plain_text || 'Not set';

    return NextResponse.json({
      success: true,
      data: {
        pageId,
        title,
        wordCount,
        calculatedReadTime: `${calculatedReadTime} min read`,
        currentReadTime,
        needsUpdate: currentReadTime !== `${calculatedReadTime} min read`
      }
    });

  } catch (error) {
    console.error("Error checking read time:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to check read time",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
