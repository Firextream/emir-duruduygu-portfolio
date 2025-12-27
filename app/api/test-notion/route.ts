import { NextResponse } from 'next/server'
import { Client } from "@notionhq/client"

export const dynamic = 'force-dynamic'

export async function GET() {
  const notionToken = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY
  const postsDb = process.env.NOTION_POSTS_DATABASE_ID || process.env.NOTION_DATABASE_ID
  const galleryDb = process.env.NOTION_GALLERY_DATABASE_ID
  const portfolioDb = process.env.NOTION_PORTFOLIO_DATABASE_ID

  const result: Record<string, unknown> = {
    envCheck: {
      hasToken: !!notionToken,
      tokenPreview: notionToken ? notionToken.substring(0, 10) + '...' : 'MISSING',
      hasPostsDb: !!postsDb,
      hasGalleryDb: !!galleryDb,
      hasPortfolioDb: !!portfolioDb,
    },
    apiTests: {} as Record<string, unknown>
  }

  // Test actual Notion API calls
  if (notionToken) {
    const notion = new Client({ auth: notionToken })

    // Test posts database
    if (postsDb) {
      try {
        const resp = await notion.databases.query({ database_id: postsDb, page_size: 1 })
        (result.apiTests as Record<string, unknown>).posts = { success: true, count: resp.results.length }
      } catch (e: unknown) {
        const err = e as Error & { code?: string }
        (result.apiTests as Record<string, unknown>).posts = { success: false, error: err.message, code: err.code }
      }
    }

    // Test gallery database
    if (galleryDb) {
      try {
        const resp = await notion.databases.query({ database_id: galleryDb, page_size: 1 })
        (result.apiTests as Record<string, unknown>).gallery = { success: true, count: resp.results.length }
      } catch (e: unknown) {
        const err = e as Error & { code?: string }
        (result.apiTests as Record<string, unknown>).gallery = { success: false, error: err.message, code: err.code }
      }
    }

    // Test portfolio database
    if (portfolioDb) {
      try {
        const resp = await notion.databases.query({ database_id: portfolioDb, page_size: 1 })
        (result.apiTests as Record<string, unknown>).portfolio = { success: true, count: resp.results.length }
      } catch (e: unknown) {
        const err = e as Error & { code?: string }
        (result.apiTests as Record<string, unknown>).portfolio = { success: false, error: err.message, code: err.code }
      }
    }
  }

  return NextResponse.json(result)
}
