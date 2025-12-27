import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const notionToken = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY
  const postsDb = process.env.NOTION_POSTS_DATABASE_ID || process.env.NOTION_DATABASE_ID
  const galleryDb = process.env.NOTION_GALLERY_DATABASE_ID
  const portfolioDb = process.env.NOTION_PORTFOLIO_DATABASE_ID

  return NextResponse.json({
    hasToken: !!notionToken,
    tokenPreview: notionToken ? notionToken.substring(0, 10) + '...' : 'MISSING',
    hasPostsDb: !!postsDb,
    postsDbPreview: postsDb ? postsDb.substring(0, 10) + '...' : 'MISSING',
    hasGalleryDb: !!galleryDb,
    galleryDbPreview: galleryDb ? galleryDb.substring(0, 10) + '...' : 'MISSING',
    hasPortfolioDb: !!portfolioDb,
    portfolioDbPreview: portfolioDb ? portfolioDb.substring(0, 10) + '...' : 'MISSING',
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('NOTION')),
  })
}
