import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/notion';

export async function GET(request: NextRequest) {
  try {
    const post = await getPostBySlug('lorem-ipsum-dolor');
    
    return NextResponse.json({
      success: true,
      post: {
        title: post?.title,
        content: post?.content,
        contentLength: post?.content?.length,
        excerpt: post?.excerpt,
        // Raw data for debugging
        rawData: {
          title: post?.title,
          contentPreview: post?.content?.substring(0, 200),
          fullContentLength: post?.content?.length
        }
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
